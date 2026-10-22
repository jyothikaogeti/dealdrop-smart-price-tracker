"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Globe, Package, Trash2, TrendingDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { deleteProduct } from "@/app/actions/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const hasDiscount =
    product.original_price && product.current_price < product.original_price;
  const savings = hasDiscount
    ? product.original_price - product.current_price
    : 0;
  const discountPercentage = hasDiscount
    ? Math.round((savings / product.original_price) * 100)
    : 0;

  async function handleDeleteProduct() {
    try {
      setIsDeleting(true);

      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Product deleted successfully");

      router.refresh();
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Something went wrong.", {
        description: "We couldn't delete the product.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[#fafafa]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name || "Product image"}
                width={220}
                height={176}
                className="h-full w-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            ) : (
              <Package className="h-9 w-9 text-gray-300" />
            )}

            {hasDiscount && (
              <div className="absolute left-3 top-3 z-20">
                <Badge className="gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 shadow-sm">
                  <TrendingDown className="h-3 w-3" />
                  {discountPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>
          <div className="p-5">
            <h2 className="min-h-12 text-gray-800/90 text-base font-semibold line-clamp-2 group-hover:text-orange-500">
              {product.name}
            </h2>

            {product.website && (
              <div className="text-gray-500 text-xs flex items-center gap-1.5 mt-2">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span className="bg-gray-100 text-gray-600 font-medium rounded-full truncate px-2 py-0.5">
                  {product.website}
                </span>
              </div>
            )}

            <div className="flex justify-between items-end mt-5">
              <div>
                <p className="text-gray-500 text-xs">Current price</p>

                <p className="text-xl text-orange-500 font-bold mt-1">
                  {product.currency || "₹"} {formatPrice(product.current_price)}
                </p>

                {hasDiscount && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-sm line-through">
                      {product.currency || "₹"}{" "}
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-green-600 font-semibold text-xs">
                      Save {product.currency || "₹"} {savings}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-9 h-9 bg-orange-50 text-orange-500 flex justify-center items-center rounded-full transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger
          type="button"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 text-gray-500 flex justify-center items-center rounded-md shadow-sm backdrop-blur transition-colors cursor-pointer hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete {product.name}</span>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop tracking this product ?</AlertDialogTitle>

            <AlertDialogDescription>
              This will remove{" "}
              <span className="text-gray-900 font-medium">{product.name}</span>{" "}
              from your tracked products and delete its price history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
