import { createServerSupabaseClient } from "@/supabase/server";

const PRODUCT_SELECT = `
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
  image_url,
  created_at,
  updated_at
`;

const PRICE_HISTORY_SELECT = `
  id,
  product_id,
  price,
  currency,
  checked_at
`;

/**
  Check whether a user is already tracking a product URL.
*/
export async function findExistingProduct(userId, url) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("user_id", userId)
    .eq("url", url)
    .maybeSingle();

  if (error) {
    console.error("Failed to check existing product:", error);
    return {
      success: false,
      error: "Could not check if this product already exists",
      code: "DATABASE_ERROR",
    };
  }

  return {
    success: true,
    data,
  };
}

/**
  Find a product by ID for the authenticated user. 
*/
export async function findProductById(userId, productId) {
  const supabase = createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to find product:", error);
    return {
      success: false,
      error: "Could not find the product.",
      code: "DATABASE_ERROR",
    };
  }

  if (!product) {
    return {
      success: false,
      error: "Product not found.",
      code: "NOT_FOUND",
    };
  }

  return {
    success: true,
    data: product,
  };
}

/**
  Create a product and its initial price history. 
*/
export async function createProductWithHistory({ userId, url, productData }) {
  const supabase = createServerSupabaseClient();

  const {
    productName,
    currentPrice,
    currency,
    originalPrice,
    availability,
    imageUrl,
    storeName,
    website,
    category,
  } = productData;

  const { data: product, error: productError } = await supabase.rpc(
    "create_product_with_history",
    {
      p_user_id: userId,
      p_url: url,
      p_name: productName,
      p_current_price: currentPrice,
      p_currency: currency,
      p_original_price: originalPrice,
      p_availability: availability,
      p_image_url: imageUrl,
      p_store_name: storeName,
      p_website: website,
      p_category: category,
    },
  );

  if (productError) {
    console.error("Failed to create product with history:", productError);
    if (productError.code === "23505") {
      return {
        success: false,
        error: "The product is already being tracked.",
        code: "DUPLICATE_PRODUCT",
      };
    }
    return {
      success: false,
      error: "Failed to save the product.",
      code: "DATABASE_ERROR",
    };
  }

  return {
    success: true,
    data: product,
  };
}

/**
  Delete a product by ID for the authenticated user. 
*/
export async function deleteProductById(userId, productId) {
  const supabase = createServerSupabaseClient();

  const { data: deletedProduct, error: deletedProductError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (deletedProductError) {
    console.error("Failed to delete product:", deletedProductError);
    return {
      success: false,
      error: "Could not delete the product.",
      code: "DATABASE_ERROR",
    };
  }

  if (!deletedProduct) {
    return {
      success: false,
      error: "Product not found.",
      code: "NOT_FOUND",
    };
  }

  return {
    success: true,
    productId: deletedProduct.id,
  };
}

/** 
  Update a product and record its latest price history.
*/
export async function updateProductPriceInDatabase({
  userId,
  productId,
  currentPrice,
  currency,
  productName,
  imageUrl,
  availability,
}) {
  const supabase = createServerSupabaseClient();

  const { data: product, error: productError } = await supabase.rpc(
    "update_product_price_with_history",
    {
      p_user_id: userId,
      p_product_id: productId,
      p_current_price: currentPrice,
      p_currency: currency,
      p_product_name: productName,
      p_image_url: imageUrl,
      p_availability: availability,
    },
  );

  if (productError) {
    console.error(`Failed to update product ${productId}:`, productError);

    if (productError.code === "P0002") {
      return {
        success: false,
        error: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: false,
      error: "Could not update the product.",
      code: "DATABASE_ERROR",
    };
  }

  return {
    success: true,
    data: product,
  };
}

/**
  Builds the base products query.
*/
function buildProductsQuery(supabase, userId, filters) {
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("user_id", userId);

  if (filters.website.length === 1) {
    query = query.eq("website", filters.website[0]);
  } else if (filters.website?.length > 1) {
    query = query.in("website", filters.website);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.availability) {
    query = query.eq("availability", filters.availability);
  }

  switch (filters.priceRange) {
    case "under-1000":
      query = query.lt("current_price", 1000);
      break;

    case "1000-5000":
      query = query.gte("current_price", 1000).lt("current_price", 5000);
      break;

    case "5000-10000":
      query = query.gte("current_price", 5000).lt("current_price", 10000);
      break;

    case "10000-50000":
      query = query.gte("current_price", 10000).lt("current_price", 50000);
      break;

    case "50000-plus":
      query = query.gte("current_price", 50000);
      break;

    default:
      break;
  }

  switch (filters.sort) {
    case "price-low":
      query = query.order("current_price", {
        ascending: true,
        nullsFirst: false,
      });
      break;

    case "price-high":
      query = query.order("current_price", {
        ascending: false,
        nullsFirst: false,
      });
      break;

    case "updated":
      query = query.order("updated_at", {
        ascending: false,
        nullsFirst: false,
      });
      break;

    case "oldest":
      query = query.order("created_at", {
        ascending: true,
        nullsFirst: false,
      });
      break;

    case "recent":
    default:
      query = query.order("created_at", {
        ascending: false,
        nullsFirst: false,
      });
      break;
  }

  return query;
}

/**
  Gets products without price-drop filtering.
*/
async function getNormalProducts(supabase, userId, filters) {
  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;

  const query = buildProductsQuery(supabase, userId, filters);

  const { data: products, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch products:", error);
    return {
      success: false,
      error: "Failed to fetch your products.",
      code: "DATABASE_ERROR",
      data: {
        products: [],
        total: 0,
      },
    };
  }

  return {
    success: true,
    data: {
      products: products ?? [],
      total: count ?? 0,
    },
  };
}

/**
  Gets products with price-drop filtering.
*/
async function getPriceDropProducts(supabase, userId, filters) {
  const query = buildProductsQuery(supabase, userId, filters);

  const { data: allProducts, error } = await query;

  if (error) {
    console.error("Failed to fetch products for price-drop filter:", error);

    return {
      success: false,
      error: "Failed to fetch your products.",
      code: "DATABASE_ERROR",
      data: {
        products: [],
        total: 0,
      },
    };
  }

  const filteredProducts = (allProducts ?? []).filter((product) => {
    const current = Number(product.current_price);
    const original = Number(product.original_price);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(original) ||
      original <= 0
    ) {
      return false;
    }

    const dropPercentage = ((original - current) / original) * 100;

    switch (filters.priceDrop) {
      case "dropped":
        return current < original;

      case "5-plus":
        return dropPercentage >= 5;

      case "10-plus":
        return dropPercentage >= 10;

      case "20-plus":
        return dropPercentage >= 20;

      default:
        return true;
    }
  });

  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;

  const paginatedProducts = filteredProducts.slice(from, to);

  return {
    success: true,
    data: {
      products: paginatedProducts,
      total: filteredProducts.length,
    },
  };
}

/**
  Main product query function.
*/
export async function getProductsForUser(userId, filters) {
  const supabase = createServerSupabaseClient();

  if (filters.priceDrop) {
    return getPriceDropProducts(supabase, userId, filters);
  }

  return getNormalProducts(supabase, userId, filters);
}

/**
  Fetches a product belonging to the authenticated user.
*/
async function findProduct(supabase, userId, productId) {
  const { data: product, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch product ${productId}:`, error);

    return {
      success: false,
      error: "Failed to fetch the product.",
      code: "DATABASE_ERROR",
    };
  }

  if (!product) {
    return {
      success: false,
      error: "Product not found.",
      code: "NOT_FOUND",
    };
  }

  return {
    success: true,
    data: product,
  };
}

/**
  Fetches price history for a product.
*/
async function findPriceHistory(supabase, productId) {
  const { data: priceHistory, error } = await supabase
    .from("price_history")
    .select(PRICE_HISTORY_SELECT)
    .eq("product_id", productId)
    .order("checked_at", {
      ascending: true,
    });

  if (error) {
    console.error(`Failed to fetch price history for ${productId}:`, error);

    return {
      success: false,
      error: "Failed to fetch price history.",
      code: "DATABASE_ERROR",
    };
  }

  return {
    success: true,
    data: priceHistory ?? [],
  };
}

/**
  Fetches a product and its price history.
*/
export async function getProductDetails(userId, productId) {
  const supabase = createServerSupabaseClient();

  // Fetch product
  const productResult = await findProduct(supabase, userId, productId);

  if (!productResult.success) {
    return {
      success: false,
      error: productResult.error,
      code: productResult.code,
    };
  }

  const historyResult = await findPriceHistory(supabase, productId);

  if (!historyResult.success) {
    return {
      success: false,
      error: historyResult.error,
      code: historyResult.code,
    };
  }

  return {
    success: true,
    data: {
      product: productResult.data,
      priceHistory: historyResult.data,
    },
  };
}

/**
  Fetches the product filter options.
*/
export async function getProductFilterOptions() {
  const supabase = createServerSupabaseClient();

  const [websitesResult, categoriesResult, availabilityResult] =
    await Promise.all([
      supabase.from("products").select("website").not("website", "is", null),

      supabase.from("products").select("category").not("category", "is", null),

      supabase
        .from("products")
        .select("availability")
        .not("availability", "is", null),
    ]);

  if (websitesResult.error) {
    console.error("Error fetching websites:", websitesResult.error);
  }

  if (categoriesResult.error) {
    console.error("Error fetching categories:", categoriesResult.error);
  }

  if (availabilityResult.error) {
    console.error("Error fetching availability:", availabilityResult.error);
  }

  const websites = [
    ...new Set(
      (websitesResult.data || []).map((item) => item.website).filter(Boolean),
    ),
  ].sort();

  const categories = [
    ...new Set(
      (categoriesResult.data || [])
        .map((item) => item.category)
        .filter(Boolean),
    ),
  ].sort();

  const availability = [
    ...new Set(
      (availabilityResult.data || [])
        .map((item) => item.availability)
        .filter(Boolean),
    ),
  ].sort();

  return {
    websites,
    categories,
    availability,
  };
}
