import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";

import { checkProductPrice } from "@/lib/products/priceChecker";
import { sendPriceDropAlert } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET is not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Cron secret is not configured.",
        },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase environment variables are missing.");
      return NextResponse.json(
        {
          success: false,
          error: "Supabase configuration is missing.",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        `
        id,
        user_id,
        url,
        name,
        current_price,
        original_price,
        currency,
        availability,
        store_name,
        website,
        category,
        image_url
        `,
      )
      .order("updated_at", {
        ascending: true,
      });

    if (productsError) {
      throw productsError;
    }

    const results = {
      total: products?.length ?? 0,
      checked: 0,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      priceDrops: 0,
      alertsSent: 0,
      alertsFailed: 0,
    };

    const clerk = await clerkClient();

    for (const product of products ?? []) {
      try {
        const result = await checkProductPrice(product);

        results.checked++;

        if (!result.success) {
          console.error(
            `Price check failed for product ${product.id}:`,
            result.error,
          );
          results.failed++;
          continue;
        }

        const data = result.data;

        const currency = data.currency ?? product.currency;
        const productName = data.productName ?? product.name;
        const imageUrl = data.imageUrl ?? product.image_url;
        const availability = data.availability ?? product.availability;

        if (data.priceChanged) {
          const { data: updatedProduct, error: rpcError } = await supabase.rpc(
            "update_product_price_with_history",
            {
              p_user_id: product.user_id,
              p_product_id: product.id,
              p_current_price: data.newPrice,
              p_currency: currency,
              p_product_name: productName,
              p_image_url: imageUrl,
              p_availability: availability,
            },
          );

          if (rpcError) {
            throw rpcError;
          }

          if (!updatedProduct) {
            throw new Error(`RPC returned no product for ${product.id}`);
          }

          results.priceChanges++;
        } else {
          const { data: updatedProducts, error: updateError } = await supabase
            .from("products")
            .update({
              current_price: data.newPrice,
              currency,
              name: productName,
              image_url: imageUrl,
              availability,
              updated_at: new Date().toISOString(),
            })
            .eq("id", product.id)
            .eq("user_id", product.user_id)
            .select("id");

          if (updateError) {
            throw updateError;
          }

          if (!updatedProducts?.length) {
            throw new Error(`No product row updated for ${product.id}`);
          }
        }

        results.updated++;

        if (data.priceDropped) {
          results.priceDrops++;

          try {
            const user = await clerk.users.getUser(product.user_id);
            const emailAddress = user.emailAddresses.find(
              (email) => email.id === user.primaryEmailAddressId,
            )?.emailAddress;

            if (!emailAddress) {
              console.warn(`No email found for clerk user ${product.user_id}`);

              results.alertsFailed++;
              continue;
            }

            const emailResult = await sendPriceDropAlert(
              emailAddress,
              product,
              data.oldPrice,
              data.newPrice,
            );

            if (emailResult?.success) {
              results.alertsSent++;
            } else {
              results.alertsFailed++;
            }
          } catch (emailError) {
            console.error(
              `Failed to send price-drop email for ${product.id}:`,
              emailError,
            );
            results.alertsFailed++;
          }
        }
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);

        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed.",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Price check failed.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Price check endpoint is working. Use POST to trigger.",
  });
}
