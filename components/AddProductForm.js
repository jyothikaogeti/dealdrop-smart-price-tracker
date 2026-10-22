"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddProductForm() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [productUrl, setProductUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    let url = productUrl.trim();

    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("url", url);

      const result = await addProduct(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Product tracked successfully");

      setProductUrl("");
    } catch (error) {
      console.error("Add product error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the product",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="max-w-2xl mx-auto w-full" onSubmit={handleAddProduct}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          placeholder="Paste Product URL (Amazon, Myntra, etc.)"
          className="h-12 text-base"
          disabled={isSubmitting}
          required
        />

        <Button
          type="submit"
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 px-8 sm:h-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            "Track Price"
          )}
        </Button>
      </div>
    </form>
  );
}
