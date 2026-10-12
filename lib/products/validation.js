/**
  Validate and normalize a product URL.
*/

export function normalizeProductUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return {
      success: false,
      error: "Product URL is required",
    };
  }

  let url;

  try {
    url = new URL(value.trim());
  } catch {
    return {
      success: false,
      error: "Please enter a valid product URL",
    };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return {
      success: false,
      error: "Only HTTP and HTTPS URLs are supported",
    };
  }

  url.hash = "";

  return {
    success: true,
    url: url.toString(),
  };
}

/**
  Validate and normalize scraped product data.
*/
export function validateScrapedProduct(
  productData,
  {
    requireOriginalPrice = false,
    requireStoreName = true,
    requireWebsite = true,
  } = {},
) {
  if (!productData || typeof productData !== "object") {
    return {
      success: false,
      error: "Could not extract product information from this URL",
    };
  }

  const productName =
    typeof productData.productName === "string"
      ? productData.productName.trim()
      : "";
  if (!productName) {
    return {
      success: false,
      error: "Could not extract product name from this URL",
    };
  }

  const rawCurrentPrice = productData.currentPrice;

  if (
    rawCurrentPrice === null ||
    rawCurrentPrice === undefined ||
    rawCurrentPrice === ""
  ) {
    return {
      success: false,
      error: "Current price is required",
    };
  }

  const currentPrice = Number(rawCurrentPrice);

  if (!Number.isFinite(currentPrice) || currentPrice < 0) {
    return {
      success: false,
      error: "Invalid current price",
    };
  }

  const currency = String(productData.currencyCode || "INR")
    .trim()
    .toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    return {
      success: false,
      error: "Invalid currency",
    };
  }

  let originalPrice = null;

  if (
    productData.originalPrice !== null &&
    productData.originalPrice !== undefined &&
    productData.originalPrice !== ""
  ) {
    originalPrice = Number(productData.originalPrice);

    if (!Number.isFinite(originalPrice) || originalPrice < 0) {
      return {
        success: false,
        error: "Invalid original price",
      };
    }
  } else if (requireOriginalPrice) {
    return {
      success: false,
      error: "Original price is required",
    };
  }

  const availability =
    typeof productData.availability === "string"
      ? productData.availability.trim() || null
      : null;

  const imageUrl =
    typeof productData.productImageUrl === "string"
      ? productData.productImageUrl.trim() || null
      : null;

  const storeName =
    typeof productData.storeName === "string"
      ? productData.storeName.trim()
      : null;
  if (requireStoreName && !storeName) {
    return {
      success: false,
      error: "Store name is required",
    };
  }

  const website =
    typeof productData.website === "string" ? productData.website.trim() : null;
  if (requireWebsite && !website) {
    return {
      success: false,
      error: "Website is required",
    };
  }

  const category =
    typeof productData.category === "string"
      ? productData.category.trim() || null
      : null;

  return {
    success: true,
    data: {
      productName,
      currentPrice,
      currency,
      originalPrice,
      availability,
      imageUrl,
      storeName,
      website,
      category,
    },
  };
}
