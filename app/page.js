import { auth } from "@clerk/nextjs/server";
import { TrendingDown } from "lucide-react";

import { FEATURES } from "@/lib/data";
import { getProducts } from "@/app/actions/product";
import { AddProductForm } from "@/components/AddProductForm";
import { RecentProducts } from "@/components/RecentProducts";

export default async function Home() {
  const { userId } = await auth();

  const result = userId ? await getProducts({ limit: 2 }) : null;
  const recentProducts = result?.success ? (result.data.products ?? []) : [];

  return (
    <>
      <section className="px-4 py-14 pt-12 sm:pt-22">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl text-gray-900 font-bold tracking-tight mb-4">
            Never Miss a Price Drop
          </h2>

          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
            Track prices from any e-commerce site. Get instant alerts when
            prices drop. Save money effortlessly.
          </p>

          <AddProductForm />

          {/* Features */}
          {!userId && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-orange-100 flex justify-center items-center mx-auto rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>

                  <h3 className="text-gray-900 font-semibold mb-2">{title}</h3>

                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Tracked Products */}
      {userId && recentProducts.length > 0 && (
        <RecentProducts products={recentProducts} />
      )}

      {/* Empty State */}
      {userId && recentProducts.length === 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <div className="relative bg-white text-center border border-orange-100 rounded-2xl shadow-sm overflow-hidden p-10">
            <div className="relative">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex justify-center items-center mx-auto mb-6">
                <TrendingDown className="w-8 h-8 text-orange-500" />
              </div>

              <h3 className="text-2xl text-gray-900 font-bold tracking-tight mb-2">
                Start Tracking Your Deals
              </h3>

              <p className="max-w-md text-gray-600 text-sm mx-auto leading-6">
                You&apos;re not tracking any products yet. Add a product above
                and we&apos;ll keep an eye on its price for you.
              </p>

              <div className="bg-orange-50 text-orange-600 text-sm font-medium inline-flex items-center gap-2 rounded-full px-4 py-2 mt-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                Waiting for your first deal
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
