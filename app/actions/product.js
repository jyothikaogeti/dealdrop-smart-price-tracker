"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { scrapeProduct } from "@/lib/products/scraper";
import { checkProductPrice } from "@/lib/products/priceChecker";
import { normalizeProductFilters } from "@/lib/products/filters";
import {
  normalizeProductUrl,
  validateScrapedProduct,
} from "@/lib/products/validation";
import {
  createProductWithHistory,
  deleteProductById,
  findExistingProduct,
  findProductById,
  getProductDetails,
  getProductsForUser,
  updateProductPriceInDatabase,
} from "@/lib/products/service";

export async function addProduct(formData) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to add a product",
      };
    }

    // Get and validate URL
    const rawUrl = formData.get("url");

    const urlResult = normalizeProductUrl(rawUrl);

    if (!urlResult.success) {
      return {
        success: false,
        error: urlResult.error,
      };
    }

    const normalizedUrl = urlResult.url;

    // Check if product is already tracked
    const existingProductResult = await findExistingProduct(
      userId,
      normalizedUrl,
    );

    if (!existingProductResult.success) {
      return {
        success: false,
        error: existingProductResult.error,
      };
    }

    if (existingProductResult.data) {
      return {
        success: false,
        error: "The product is already being tracked",
      };
    }

    // Scrape product
    const scrapedProduct = await scrapeProduct(normalizedUrl);

    if (!scrapedProduct.success) {
      return {
        success: false,
        error: "Could not extract product information from this URL",
      };
    }

    // Validate scraped product data
    const validationResult = validateScrapedProduct(scrapedProduct.data);

    if (!validationResult.success) {
      console.error("Invalid scraped product data:", scrapedProduct.data);
      return {
        success: false,
        error: validationResult.error,
      };
    }

    // Create product + price history
    const result = await createProductWithHistory({
      userId,
      url: normalizedUrl,
      productData: validationResult.data,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Revalidate UI
    revalidatePath("/");
    revalidatePath("/products");

    return {
      success: true,
      product: result.data,
      message: "Product added successfully!",
    };
  } catch (error) {
    console.error("addProduct error:", error);
    return {
      success: false,
      error: "Something went wrong while adding the product",
    };
  }
}

export async function deleteProduct(productId) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to delete a product.",
      };
    }

    // Validate product ID
    if (typeof productId !== "string" || !productId.trim()) {
      return {
        success: false,
        error: "Invalid product.",
      };
    }

    const normalizedProductId = productId.trim();

    // Delete product
    const result = await deleteProductById(userId, normalizedProductId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${normalizedProductId}`);

    return {
      success: true,
      message: "Product deleted successfully!",
    };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return {
      success: false,
      error: "Something went wrong while deleting the product.",
    };
  }
}

export async function updateProductPrice(productId) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    // Validate product ID
    if (typeof productId !== "string" || !productId.trim()) {
      return {
        success: false,
        error: "Invalid product.",
      };
    }

    const normalizedProductId = productId.trim();

    // Get product
    const productResult = await findProductById(userId, normalizedProductId);

    if (!productResult.success) {
      return {
        success: false,
        error: productResult.error,
      };
    }

    const productData = productResult.data;

    // Check latest price
    const priceResult = await checkProductPrice(productData);

    if (!priceResult.success) {
      return {
        success: false,
        error: priceResult.error,
      };
    }

    const priceData = priceResult.data;

    if (!priceData.priceChanged) {
      return {
        success: true,
        message: "Product price has not changed.",
        data: {
          productId: productData.id,
          oldPrice: priceData.oldPrice,
          newPrice: priceData.newPrice,
          currency: priceData.currency,
          priceChanged: false,
          priceDropped: false,
          historyRecorded: false,
        },
      };
    }

    // Update database
    const updateResult = await updateProductPriceInDatabase({
      userId,
      productId: productData.id,
      currentPrice: priceData.newPrice,
      currency: priceData.currency,
      productName: priceData.productName,
      imageUrl: priceData.imageUrl,
      availability: priceData.availability,
    });

    if (!updateResult.success) {
      return {
        success: false,
        error: updateResult.error,
      };
    }

    // Revalidate UI
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${normalizedProductId}`);

    return {
      success: true,
      data: {
        product: updateResult.data,
        productId: productData.id,
        priceChanged: priceData.priceChanged,
        priceDropped: priceData.priceDropped,
        oldPrice: priceData.oldPrice,
        newPrice: priceData.newPrice,
        currency: priceData.currency,
        historyRecorded: priceData.priceChanged,
        message: priceData.priceChanged
          ? priceData.priceDropped
            ? "Price dropped!"
            : "Price updated successfully!"
          : "Price is already up to date!",
      },
    };
  } catch (error) {
    console.error("updateProductPrice error:", error);
    return {
      success: false,
      error: "Something went wrong while updating the price.",
    };
  }
}

export async function getProducts(options = {}) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    // Normalize / Validate Filters
    const filters = normalizeProductFilters(options);

    // Get products
    const result = await getProductsForUser(userId, filters);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("getProducts error:", error);
    return {
      success: false,
      error: "Something went wrong while fetching your products.",
    };
  }
}

export async function getProductById(id) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    // Validate product ID
    if (typeof id !== "string" || !id.trim()) {
      return {
        success: false,
        error: "Product ID is required.",
      };
    }

    const productId = id.trim();

    // Get product details
    const result = await getProductDetails(userId, productId);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("getProductById error:", error);
    return {
      success: false,
      error: "Something went wrong while fetching the product.",
    };
  }
}
