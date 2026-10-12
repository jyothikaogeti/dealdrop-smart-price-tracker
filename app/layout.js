import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "DealDrop - Never Miss a Price Drop",
  description:
    "Track product prices across e-commerce sites and get alerts on price drops.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#ea580c",
            },
          }}
        >
          <Header />
          <main>{children}</main>
          <Toaster position="top-center" duration={5000} />
        </ClerkProvider>
      </body>
    </html>
  );
}
