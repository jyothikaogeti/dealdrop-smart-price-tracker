import { VALID_PRICE_DROPS, VALID_PRICE_RANGES, VALID_SORTS } from "@/lib/data";

export function normalizeProductFilters({
  page = 1,
  limit = 9,
  website = [],
  category = "",
  priceRange = "",
  priceDrop = "",
  availability = "",
  sort = "recent",
} = {}) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage = Number.isFinite(parsedPage)
    ? Math.max(1, Math.floor(parsedPage))
    : 1;

  const pageSize = Number.isFinite(parsedLimit)
    ? Math.min(50, Math.max(1, Math.floor(parsedLimit)))
    : 9;

  let websites = [];

  if (Array.isArray(website)) {
    websites = website.map((item) => String(item).trim()).filter(Boolean);
  } else if (typeof website === "string") {
    websites = website
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const normalizedCategory =
    typeof category === "string" ? category.trim() : "";

  const normalizedAvailability =
    typeof availability === "string" ? availability.trim() : "";

  const normalizedPriceRange =
    typeof priceRange === "string" && VALID_PRICE_RANGES.has(priceRange)
      ? priceRange
      : "";

  const normalizedPriceDrop =
    typeof priceDrop === "string" && VALID_PRICE_DROPS.has(priceDrop)
      ? priceDrop
      : "";

  const normalizedSort =
    typeof sort === "string" && VALID_SORTS.has(sort) ? sort : "recent";

  return {
    page: currentPage,
    limit: pageSize,
    website: websites,
    category: normalizedCategory,
    priceRange: normalizedPriceRange,
    priceDrop: normalizedPriceDrop,
    availability: normalizedAvailability,
    sort: normalizedSort,
  };
}
