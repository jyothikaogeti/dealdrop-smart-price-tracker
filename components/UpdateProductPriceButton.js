"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { updateProductPrice } from "@/app/actions/product";
import { Button } from "@/components/ui/button";

export function UpdateProductPriceButton({ productId }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdateProduct() {
    try {
      setIsUpdating(true);

      const result = await updateProductPrice(productId);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.data.priceChanged) {
        toast.success("Price updated!", {
          description: `Price changed from ${result.data.oldPrice} to ${result.data.newPrice}`,
        });
      } else {
        toast.success("Price is already up to date");
      }

      router.refresh();
    } catch (error) {
      console.error("Update price error:", error);
      toast.error("Something went wrong", {
        description: "We couldn't update the product price",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Button
      type="button"
      className="w-full h-9 gap-1.5 bg-orange-500 text-xs font-medium rounded-lg cursor-pointer px-3 hover:bg-orange-600"
      onClick={handleUpdateProduct}
      disabled={isUpdating}
    >
      <RefreshCw
        className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`}
      />
      {isUpdating ? "Checking..." : "Update price"}
    </Button>
  );
}
