import { scrapeProduct } from "@/lib/products/scraper";
import { validateScrapedProduct } from "@/lib/products/validation";

export async function checkProductPrice(product) {
  if (!product?.id || !product?.url) {
    return {
      success: false,
      error: "Invalid product.",
      code: "INVALID_PRODUCT",
    };
  }

  const scrapedProduct = await scrapeProduct(product.url);

  if (!scrapedProduct.success) {
    return {
      success: false,
      error:
        scrapedProduct.error || "Could not get the latest product information.",
      code: scrapedProduct.code || "SCRAPING_ERROR",
    };
  }

  const validationResult = validateScrapedProduct(scrapedProduct.data, {
    requireOriginalPrice: false,
    requireStoreName: false,
    requireWebsite: false,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error,
      code: "VALIDATION_ERROR",
    };
  }

  const productData = validationResult.data;

  const newPrice = productData.currentPrice;
  const newCurrency = productData.currency;
  const newProductName = productData.productName;
  const newImageUrl = productData.imageUrl;
  const newAvailability = productData.availability;
  const oldPrice = Number(product.current_price);

  if (!Number.isFinite(newPrice) || newPrice < 0) {
    return {
      success: false,
      error: "The latest product price is invalid.",
      code: "INVALID_SCRAPED_PRICE",
    };
  }

  if (!Number.isFinite(oldPrice)) {
    return {
      success: false,
      error: "Stored product price is invalid",
      code: "INVALID_STORED_PRICE",
    };
  }

  const priceChanged = oldPrice !== newPrice;
  const priceDropped = newPrice < oldPrice;
  console.log("PRICE CHECK:", {
    productId: product.id,
    oldPrice,
    newPrice,
    priceChanged,
    priceDropped,
  });

  const productNameChanged =
    newProductName !== undefined &&
    newProductName !== null &&
    newProductName !== product.name;

  const imageChanged =
    newImageUrl !== undefined &&
    newImageUrl !== null &&
    newImageUrl !== product.image_url;

  const availabilityChanged =
    newAvailability !== undefined &&
    newAvailability !== null &&
    newAvailability !== product.availability;

  const currencyChanged =
    newCurrency !== undefined &&
    newCurrency !== null &&
    newCurrency !== product.currency;

  const productChanged =
    priceChanged ||
    productNameChanged ||
    imageChanged ||
    availabilityChanged ||
    currencyChanged;

  return {
    success: true,
    data: {
      productId: product.id,
      oldPrice,
      newPrice,
      currency: newCurrency,
      priceChanged,
      priceDropped,
      productChanged,
      productNameChanged,
      imageChanged,
      availabilityChanged,
      currencyChanged,
      productName: newProductName,
      imageUrl: newImageUrl,
      availability: newAvailability,
    },
  };
}
