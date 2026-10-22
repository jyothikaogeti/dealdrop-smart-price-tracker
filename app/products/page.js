import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, PackageSearch } from "lucide-react";
import Link from "next/link";

import { PRODUCTS_PER_PAGE } from "@/lib/utils";
import { getProductFilterOptions } from "@/lib/products/service";
import { getProducts } from "@/app/actions/product";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductSort } from "@/components/ProductSort";
import { Pagination } from "@/components/Pagination";

export default async function ProductsPage({ searchParams }) {
  await auth.protect();

  const params = await searchParams;

  const page = Math.max(1, Number(params?.page) || 1);
  const website = params?.website || "";
  const category = params?.category || "";
  const priceRange = params?.priceRange || "";
  const priceDrop = params?.priceDrop || "";
  const availability = params?.availability || "";
  const sort = params?.sort || "recent";

  const [result, filterOptions] = await Promise.all([
    getProducts({
      page,
      limit: PRODUCTS_PER_PAGE,
      website,
      category,
      priceRange,
      priceDrop,
      availability,
      sort,
    }),
    getProductFilterOptions(),
  ]);

  const products = result.data?.products || [];
  const totalProducts = result.data.total || 0;

  const websiteOptions = filterOptions?.websites || [];
  const categoryOptions = filterOptions?.categories || [];
  const availabilityOptions = filterOptions?.availability || [];

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  function createPageUrl(page) {
    const query = new URLSearchParams();

    query.set("page", String(page));

    if (website) {
      query.set("website", website);
    }
    if (category) {
      query.set("category", category);
    }
    if (priceRange) {
      query.set("priceRange", priceRange);
    }
    if (priceDrop) {
      query.set("priceDrop", priceDrop);
    }
    if (availability) {
      query.set("availability", availability);
    }
    if (sort && sort !== "recent") {
      query.set("sort", sort);
    }

    return `/products?${query.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="mb-7">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-orange-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              My products
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Track prices and keep an eye on your favorite products.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
            <span className="text-sm font-medium text-orange-600">
              {totalProducts}{" "}
              <span className="text-sm text-orange-500">
                {totalProducts === 1 ? "product" : "products"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-7 flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="min-w-0">
          <ProductFilters
            websites={websiteOptions}
            categories={categoryOptions}
            availability={availabilityOptions}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ProductSort value={sort} />
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm ring-1 ring-gray-200">
            <PackageSearch className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No products found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {website || category || priceRange || priceDrop || availability
              ? "Try adjusting your filters to find the products you're tracking."
              : "Start tracking a product to monitor its price and get notified of price drops."}
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Reset filters
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            page={page}
            totalPages={totalPages}
            createPageUrl={createPageUrl}
          />
        </div>
      )}
    </div>
  );
}
