import { ArrowRight, CalendarDays, PackageIcon, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function RecentProducts({ products }) {
  return (
    <section className="max-w-5xl mx-auto px-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-gray-900 font-bold">Recently Tracked</h3>

        <Link href="/products">
          <Badge
            variant="secondary"
            className="text-sm font-medium rounded-full transition-colors cursor-pointer gap-2 p-4 hover:bg-orange-100 hover:text-orange-600"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Badge>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="h-full block group"
          >
            <Card className="h-full bg-white border-gray-200 rounded-2xl transition-all overflow-hidden duration-200 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="h-full p-2 sm:p-4">
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[115px_1fr] items-center h-full gap-4 sm:gap-5">
                  {product.image_url ? (
                    <div className="relative w-full h-24 sm:h-28 flex justify-center items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.name || "Product Image"}
                        className="p-2.5 object-contain transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="115px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 sm:h-28 flex justify-center items-center bg-gray-50 border border-gray-100 rounded-xl">
                      <PackageIcon className="w-9 h-9 text-gray-300" />
                    </div>
                  )}

                  <div className="min-w-0 flex flex-col">
                    {product.store_name && (
                      <div className="min-w-0 text-gray-400 text-xs flex items-center gap-1.5 mb-2">
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{product.store_name}</span>
                      </div>
                    )}

                    <h3 className="text-gray-900 text-sm font-semibold transition-colors line-clamp-2 leading-5 group-hover:text-orange-500 sm:text-md">
                      {product.name}
                    </h3>

                    <div className="mt-2">
                      <span className="text-md sm:text-xl text-orange-500 font-bold">
                        {product.currency === "INR"
                          ? "₹"
                          : product.currency || "₹"}
                        {formatPrice(product.current_price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      {product.created_at ? (
                        <div className="min-w-0 text-gray-400 text-[11px] flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            Tracked {formatDate(product.created_at)}
                          </span>
                        </div>
                      ) : (
                        <span />
                      )}

                      <div className="w-7 h-7 bg-orange-50 text-orange-500 flex justify-center items-center rounded-full transition-colors shrink-0 group-hover:bg-orange-500 group-hover:text-white">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
