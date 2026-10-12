"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IndianRupee,
  Layers3,
  PackageCheck,
  SlidersHorizontal,
  Store,
  TrendingDown,
  X,
} from "lucide-react";

import { formatPriceDrop, formatPriceRange } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

export function ProductFilters({
  websites = [],
  categories = [],
  availability = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    website: searchParams.get("website")?.split(",").filter(Boolean) || [],
    category: searchParams.get("category") || "",
    availability: searchParams.get("availability") || "",
    priceRange: searchParams.get("priceRange") || "",
    priceDrop: searchParams.get("priceDrop") || "",
  });

  useEffect(() => {
    setFilters({
      website: searchParams.get("website")?.split(",").filter(Boolean) || [],
      category: searchParams.get("category") || "",
      availability: searchParams.get("availability") || "",
      priceRange: searchParams.get("priceRange") || "",
      priceDrop: searchParams.get("priceDrop") || "",
    });
  }, [searchParams]);

  function toggleWebsite(website) {
    setFilters((current) => {
      const exists = current.website.includes(website);

      return {
        ...current,
        website: exists
          ? current.website.filter((item) => item !== website)
          : [...current.website, website],
      };
    });
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (filters.website.length > 0) {
      params.set("website", filters.website.join(","));
    } else {
      params.delete("website");
    }

    if (filters.category) {
      params.set("category", filters.category);
    } else {
      params.delete("category");
    }

    if (filters.availability) {
      params.set("availability", filters.availability);
    } else {
      params.delete("availability");
    }

    if (filters.priceRange) {
      params.set("priceRange", filters.priceRange);
    } else {
      params.delete("priceRange");
    }

    if (filters.priceDrop) {
      params.set("priceDrop", filters.priceDrop);
    } else {
      params.delete("priceDrop");
    }

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    setFilters({
      website: [],
      category: "",
      availability: "",
      priceRange: "",
      priceDrop: "",
    });

    const params = new URLSearchParams();

    const currentSort = searchParams.get("sort");

    if (currentSort) {
      params.set("sort", currentSort);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  function updateFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));
  }

  function removeFilter(key, value = null) {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "website" && value) {
      const websites =
        searchParams.get("website")?.split(",").filter(Boolean) || [];

      const remaining = websites.filter((item) => item !== value);

      if (remaining.length > 0) {
        params.set("website", remaining.join(","));
      } else {
        params.delete("website");
      }
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);

    setFilters((current) => {
      if (key === "website" && value) {
        return {
          ...current,
          website: current.website.filter((item) => item !== value),
        };
      }

      return {
        ...current,
        [key]: "",
      };
    });
  }

  const activeFilterCount =
    filters.website.length +
    (filters.category ? 1 : 0) +
    (filters.availability ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.priceDrop ? 1 : 0);

  const activeWebsites =
    searchParams.get("website")?.split(",").filter(Boolean) || [];
  const activeCategory = searchParams.get("category");
  const activeAvailability = searchParams.get("availability");
  const activePriceRange = searchParams.get("priceRange");
  const activePriceDrop = searchParams.get("priceDrop");

  return (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`group inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors ${
            activeFilterCount > 0
              ? "text-gray-900 hover:bg-orange-50 hover:text-orange-600"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          <SlidersHorizontal
            className={`h-4 w-4 transition-colors ${
              activeFilterCount > 0
                ? "text-orange-500"
                : "text-gray-400 group-hover:text-orange-500"
            }`}
          />

          <span>Filters</span>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-semibold leading-none text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px shrink-0 bg-gray-200" />

        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-none">
          {activeWebsites.map((website) => (
            <FilterBadge
              key={`website-${website}`}
              label={website}
              onRemove={() => removeFilter("website", website)}
            />
          ))}

          {activeCategory && (
            <FilterBadge
              label={activeCategory}
              onRemove={() => removeFilter("category")}
            />
          )}

          {activeAvailability && (
            <FilterBadge
              label={activeAvailability}
              onRemove={() => removeFilter("availability")}
              className="text-[11px] uppercase"
            />
          )}

          {activePriceRange && (
            <FilterBadge
              label={formatPriceRange(activePriceRange)}
              onRemove={() => removeFilter("priceRange")}
            />
          )}

          {activePriceDrop && (
            <FilterBadge
              label={formatPriceDrop(activePriceDrop)}
              onRemove={() => removeFilter("priceDrop")}
            />
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 shrink-0 px-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-orange-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="z-200 flex w-full flex-col gap-0 overflow-hidden border-r border-gray-200 bg-white p-0 shadow-[8px_0_30px_rgba(0,0,0,0.08)] sm:max-w-[380px]"
        >
          <div className="shrink-0 border-b border-gray-100 bg-white px-5 py-4 pr-14">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Filters
                </SheetTitle>

                <SheetDescription className="mt-0.5 text-xs text-gray-400">
                  Refine your tracked products
                </SheetDescription>
              </div>

              {activeFilterCount > 0 && (
                <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-600">
                  {activeFilterCount} active
                </span>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-5">
              {websites.length > 0 && (
                <FilterSection title="Store" icon={Store}>
                  <div className="space-y-0.5">
                    {websites.map((website) => (
                      <CheckboxOption
                        key={website}
                        label={website}
                        selected={filters.website.includes(website)}
                        onClick={() => toggleWebsite(website)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {categories.length > 0 && (
                <FilterSection title="Category" icon={Layers3}>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => (
                      <SelectionPill
                        key={category}
                        label={category}
                        selected={filters.category === category}
                        onClick={() => updateFilter("category", category)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {availability.length > 0 && (
                <FilterSection title="Availability" icon={PackageCheck}>
                  <div className="space-y-0.5">
                    {availability.map((item) => (
                      <RadioOption
                        key={item}
                        label={item}
                        selected={filters.availability === item}
                        onClick={() => updateFilter("availability", item)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              <FilterSection title="Price range" icon={IndianRupee}>
                <div className="grid grid-cols-2 gap-1.5">
                  <SelectionPill
                    label="Any price"
                    selected={!filters.priceRange}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        priceRange: "",
                      }))
                    }
                  />

                  <SelectionPill
                    label="Under ₹1,000"
                    selected={filters.priceRange === "under-1000"}
                    onClick={() => updateFilter("priceRange", "under-1000")}
                  />

                  <SelectionPill
                    label="₹1k – ₹5k"
                    selected={filters.priceRange === "1000-5000"}
                    onClick={() => updateFilter("priceRange", "1000-5000")}
                  />

                  <SelectionPill
                    label="₹5k – ₹10k"
                    selected={filters.priceRange === "5000-10000"}
                    onClick={() => updateFilter("priceRange", "5000-10000")}
                  />

                  <SelectionPill
                    label="₹10k – ₹50k"
                    selected={filters.priceRange === "10000-50000"}
                    onClick={() => updateFilter("priceRange", "10000-50000")}
                  />

                  <SelectionPill
                    label="Above ₹50k"
                    selected={filters.priceRange === "50000-plus"}
                    onClick={() => updateFilter("priceRange", "50000-plus")}
                  />
                </div>
              </FilterSection>

              <FilterSection title="Price drop" icon={TrendingDown} last>
                <div className="grid grid-cols-2 gap-1.5">
                  <SelectionPill
                    label="Any"
                    selected={!filters.priceDrop}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        priceDrop: "",
                      }))
                    }
                  />

                  <SelectionPill
                    label="Price dropped"
                    selected={filters.priceDrop === "dropped"}
                    onClick={() => updateFilter("priceDrop", "dropped")}
                  />

                  <SelectionPill
                    label="Drop ≥ 5%"
                    selected={filters.priceDrop === "5-plus"}
                    onClick={() => updateFilter("priceDrop", "5-plus")}
                  />

                  <SelectionPill
                    label="Drop ≥ 10%"
                    selected={filters.priceDrop === "10-plus"}
                    onClick={() => updateFilter("priceDrop", "10-plus")}
                  />

                  <SelectionPill
                    label="Drop ≥ 20%"
                    selected={filters.priceDrop === "20-plus"}
                    onClick={() => updateFilter("priceDrop", "20-plus")}
                  />
                </div>
              </FilterSection>
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                className="h-9 flex-1 rounded-lg px-3 text-xs font-medium text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-40"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={applyFilters}
                className="h-9 flex-[1.5] rounded-lg bg-orange-500 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98]"
              >
                Apply filters
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FilterBadge({ label, onRemove, className = "" }) {
  return (
    <div className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-orange-100 bg-orange-50 px-2.5 text-xs font-medium text-orange-600">
      <span className={`max-w-32 truncate ${className}`}>{label}</span>

      <button
        type="button"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
        className="rounded-full p-0.5 text-orange-400 transition-colors hover:bg-orange-100 hover:text-orange-600"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function FilterSection({ title, icon: Icon, last = false, children }) {
  return (
    <section className={`${!last ? "border-b border-gray-100" : ""} py-5`}>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-400" />

        <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function CheckboxOption({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
        selected ? "bg-orange-50/70" : "hover:bg-orange-50/60"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
          selected
            ? "border-orange-500 bg-orange-500"
            : "border-gray-300 bg-white group-hover:border-orange-400"
        }`}
      >
        {selected && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3 w-3 text-white"
          >
            <path
              d="M2 6l2.5 2.5L10 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span
        className={`truncate text-xs transition-colors ${
          selected
            ? "text-xs text-orange-600"
            : "text-xs text-gray-600 group-hover:text-orange-600"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function RadioOption({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
        selected ? "bg-orange-50/70" : "hover:bg-orange-50/60"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected
            ? "border-orange-500"
            : "border-gray-300 group-hover:border-orange-400"
        }`}
      >
        {selected && (
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        )}
      </span>

      <span
        className={`text-[11.5px] uppercase transition-colors ${
          selected
            ? "font-medium text-orange-600"
            : "text-gray-600 group-hover:text-orange-600"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SelectionPill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-all ${
        selected
          ? "border-orange-200 bg-orange-50 text-orange-600"
          : "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      {label}
    </button>
  );
}
