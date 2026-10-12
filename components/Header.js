import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { LogIn, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white/80 border-b border-gray-200 backdrop-blur-sm sticky top-0 z-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dealdrop-logo.png"
            alt="DealDrop Logo"
            width={600}
            height={200}
            className="w-auto h-10 shrink-0"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-gray-600 text-sm font-medium flex items-center gap-2 group rounded-full transition-colors px-3 py-2 hover:bg-orange-50 hover:text-orange-600"
          >
            <Package className="w-4 h-4 text-gray-400 transition-colors group-hover:text-orange-500" />
            <span>My Products</span>
          </Link>

          <Show when="signed-out">
            <SignInButton>
              <Button
                size="sm"
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
