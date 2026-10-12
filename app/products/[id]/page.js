import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarDays,
  ExternalLink,
  Globe,
  IndianRupee,
  Package,
  RefreshCw,
  Store,
  Tag,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import { getProductById } from "@/app/actions/product";
import { UpdateProductPriceButton } from "@/components/UpdateProductPriceButton";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { ProductDetailItem } from "@/components/ProductDetailItemtem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ProductPage({ params }) {
  await auth.protect();

  const { id } = await params;

  const result = await getProductById(id);

  if (!result.success || !result.data?.product) {
    return (
      <main className="min-h-screen flex justify-center items-center pb-22">
        <div className="max-w-xl mx-auto bg-orange-50/40 border border-dashed border-orange-200 text-center rounded-2xl px-6 py-12 sm:px-10">
          <div className="w-14 h-14 bg-orange-100 text-orange-500 flex justify-center items-center mx-auto rounded-xl mb-5">
            <Package className="w-7 h-7" />
          </div>

          <h1 className="text-xl text-gray-900 font-semibold tracking-tight">
            Product not found
          </h1>

          <p className="max-w-md mx-auto text-gray-500 text-sm leading-6 mt-2">
            We couldn&apos;t find this product. It may have been deleted or you
            may not have access to it.
          </p>

          <Link
            href="/products"
            className="bg-orange-500 text-white text-sm font-medium inline-flex items-center gap-2 rounded-md shadow-sm transition-colors h-9 px-4 mt-6 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const product = result.data.product;
  const priceHistory = result.data.priceHistory ?? [];

  const currency = product.currency || "INR";
  const currentPrice = Number(product.current_price);
  const originalPrice =
    product.original_price !== null && product.original_price !== undefined
      ? Number(product.original_price)
      : null;

  const hasDiscount =
    originalPrice !== null &&
    Number.isFinite(originalPrice) &&
    originalPrice > currentPrice;
  const savings = hasDiscount ? originalPrice - currentPrice : 0;
  const discountPercentage = hasDiscount
    ? Math.round((savings / originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto w-full px-4 py-7 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="text-gray-500 text-sm font-medium inline-flex items-center gap-2 rounded-full transition-colors px-2 py-1 mb-6 hover:text-orange-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[360px_1fr]">
            <div className="relative h-80 bg-linear-to-br from-gray-50 via-white to-orange-50/40 sm:h-95 lg:h-105 lg:border-r lg:border-gray-100">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-100/40 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-50 blur-3xl" />

              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name || "Product Image"}
                  className="relative z-10 object-contain p-14 sm:p-16 lg:p-18"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  priority
                />
              ) : (
                <div className="relative z-10 flex h-full flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Package className="h-8 w-8 text-gray-200" />
                  </div>

                  <p className="mt-3 text-sm text-gray-400">
                    No image available
                  </p>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute left-4 top-4 z-20">
                  <Badge className="gap-1 rounded-full bg-green-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-green-500">
                    <TrendingDown className="h-3 w-3" />
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
              {product.store_name && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <Store className="h-3.5 w-3.5 text-orange-500" />
                  </div>

                  <span className="truncate text-xs font-semibold text-gray-500">
                    {product.store_name}
                  </span>
                </div>
              )}

              <h1 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-2xl">
                {product.name}
              </h1>

              {product.category && (
                <div className="mt-2.5">
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500"
                  >
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </Badge>
                </div>
              )}

              <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                    Current price
                  </p>

                  {hasDiscount && (
                    <span className="text-[10px] font-semibold text-green-600">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-2xl font-bold tracking-tight text-orange-500 sm:text-3xl">
                    {currency === "INR" ? "₹" : currency}
                    {formatPrice(currentPrice)}
                  </span>

                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {currency === "INR" ? "₹" : currency}
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <TrendingDown className="h-3.5 w-3.5" />

                    <span>
                      Save {currency === "INR" ? "₹" : currency}
                      {formatPrice(savings)}
                    </span>
                  </div>
                )}
              </div>

              {product.availability && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
                  <span className="text-xs font-medium text-gray-500">
                    Availability
                  </span>

                  <Badge
                    variant="secondary"
                    className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700 uppercase"
                  >
                    {product.availability}
                  </Badge>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <UpdateProductPriceButton productId={product.id} />

                {product.url && (
                  <Link
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="h-9 w-full cursor-pointer gap-1.5 rounded-lg border-gray-200 px-3 text-xs font-medium hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Visit Store
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Last checked {formatDateTime(product.updated_at)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5 mt-6 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <h2 className="text-gray-900 text-lg font-bold sm:text-xl">
                  Price History
                </h2>
              </div>

              <p className="text-gray-500 text-xs mt-1 sm:text-sm">
                Keep an eye on how the price changes over time.
              </p>
            </div>

            <div className="text-gray-400 text-xs flex items-center gap-2 mt-2 sm:mt-0">
              <span className="bg-gray-100 rounded-full px-2.5 py-1">
                {priceHistory.length}{" "}
                {priceHistory.length === 1 ? "check" : "checks"}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <PriceHistoryChart
              priceHistory={priceHistory}
              currency={currency === "INR" ? "₹" : currency}
            />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5 mt-6 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 flex justify-center items-center rounded-xl">
              <Package className="w-4 h-4 text-orange-500" />
            </div>

            <div>
              <h2 className="text-lg text-gray-900 font-bold sm:text-xl">
                Product Details
              </h2>
              <p className="text-gray-500 text-xs mt-0.5 sm:text-sm">
                Information about the product you&apos;re tracking
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {product.store_name && (
              <ProductDetailItem
                icon={<Store className="w-4 h-4" />}
                label="Store"
                value={product.store_name}
              />
            )}

            {product.website && (
              <ProductDetailItem
                icon={<Globe className="w-4 h-4" />}
                label="Website"
                value={product.website}
              />
            )}

            {product.category && (
              <ProductDetailItem
                icon={<Tag className="w-4 h-4" />}
                label="Category"
                value={product.category}
              />
            )}

            {product.availability && (
              <ProductDetailItem
                icon={<Package className="w-4 h-4" />}
                label="Availability"
                value={product.availability}
                valueClassName="text-green-600 text-[11.5px] uppercase"
              />
            )}

            <ProductDetailItem
              icon={<IndianRupee className="w-4 h-4" />}
              label="Current price"
              value={`${currency === "INR" ? "₹" : currency} ${formatPrice(currentPrice)}`}
              valueClassName="text-orange-500"
            />

            {originalPrice !== null && (
              <ProductDetailItem
                icon={<BadgeDollarSign className="w-4 h-4" />}
                label="Original price"
                value={`${currency === "INR" ? "₹" : currency} ${formatPrice(originalPrice)}`}
              />
            )}

            <ProductDetailItem
              icon={<CalendarDays className="w-4 h-4" />}
              label="Tracking since"
              value={formatDate(product.created_at)}
            />

            <ProductDetailItem
              icon={<RefreshCw className="w-4 h-4" />}
              label="Last checked"
              value={formatDate(product.updated_at)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
