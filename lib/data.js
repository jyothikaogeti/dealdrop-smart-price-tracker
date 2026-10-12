import { Bell, ChartNoAxesCombined, Search } from "lucide-react";

export const FEATURES = [
  {
    icon: Search,
    title: "Track Any Product",
    description:
      "Track prices across Amazon, Zara, Walmart, and other popular stores in one place.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Price History",
    description:
      "See interactive price charts and understand how prices change over time.",
  },
  {
    icon: Bell,
    title: "Smart Price Alerts",
    description:
      "Set your target price and get notified automatically when a product drops.",
  },
];

export const SORT_OPTIONS = [
  {
    value: "recent",
    label: "Recently added",
  },
  {
    value: "updated",
    label: "Recently updated",
  },
  {
    value: "oldest",
    label: "Oldest added",
  },
  {
    value: "price-low",
    label: "Price: Low to high",
  },
  {
    value: "price-high",
    label: "Price: High to low",
  },
];

export const VALID_PRICE_RANGES = new Set([
  "under-1000",
  "1000-5000",
  "5000-10000",
  "10000-50000",
  "50000-plus",
]);

export const VALID_PRICE_DROPS = new Set([
  "dropped",
  "5-plus",
  "10-plus",
  "20-plus",
]);

export const VALID_SORTS = new Set([
  "recent",
  "updated",
  "oldest",
  "price-low",
  "price-high",
]);
