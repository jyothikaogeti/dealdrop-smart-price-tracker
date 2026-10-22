export { cn } from "cn";

export const PRODUCTS_PER_PAGE = 9;

export function formatPrice(price) {
  return Number(price).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPriceRange(value) {
  const labels = {
    "under-1000": "Under ₹1,000",
    "1000-5000": "₹1,000 - ₹5,000",
    "5000-10000": "₹5,000 - ₹10,000",
    "10000-50000": "₹10,000 - ₹50,000",
    "50000-plus": "Above ₹50,000",
  };
  return labels[value] || value;
}

export function formatPriceDrop(value) {
  const labels = {
    dropped: "Price dropped",
    "5-plus": "Drop ≥ 5%",
    "10-plus": "Drop ≥ 10%",
    "20-plus": "Drop ≥ 20%",
  };
  return labels[value] || value;
}

export function normalizeString(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}

export function normalizeNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}
