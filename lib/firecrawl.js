import { Firecrawl } from "firecrawl";
import { normalizeNumber, normalizeString } from "@/lib/utils";

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt: `Extract product information from this webpage.
            Extract these fields:
            - productName: The actual product name/title.
            - currentPrice: The current selling price as a number only.
            - currencyCode: The ISO 4217 currency code, such as INR, USD, EUR, GBP.
            - originalPrice: The original/list/MRP price before discount, if available. Return a number or null.
            - availability: The current product availability, such as "in stock", "out of stock", "preorder", etc.
            - productImageUrl: The main product image URL if available.
            - storeName: The store/brand name associated with the product. Treat store name and brand as the same field.
            - website: The name of the website/marketplace where this product page is hosted, such as "Amazon", "Flipkart", "Myntra", "Walmart", "eBay", etc.
            - category: The product category if available.

            Rules:
            1. Never invent information.
            2. Return null when a field cannot be reliably found.
            3. currentPrice must be a number only.
            4. originalPrice must be a number or null.
            5. currencyCode must be a valid ISO 4217 currency code.
            6. storeName should contain the product's brand/store, not the marketplace website.
            7. productImageUrl should be the main product image.
            8. Do not confuse the marketplace with the brand.
            9. Do not calculate or guess prices.
            10. If a discount is displayed, currentPrice should be the actual price the customer currently pays.
            11. originalPrice should be the pre-discount/list/MRP price when explicitly available.
            12. Return only the requested JSON object.
          `,
          schema: {
            type: "object",
            properties: {
              productName: {
                type: ["string", "null"],
              },
              currentPrice: {
                type: ["number", "null"],
              },
              currencyCode: {
                type: ["string", "null"],
              },
              originalPrice: {
                type: ["number", "null"],
              },
              availability: {
                type: ["string", "null"],
              },
              productImageUrl: {
                type: ["string", "null"],
              },
              storeName: {
                type: ["string", "null"],
              },
              website: {
                type: ["string", "null"],
              },
              category: {
                type: ["string", "null"],
              },
            },
            required: [
              "productName",
              "currentPrice",
              "currencyCode",
              "originalPrice",
              "availability",
              "productImageUrl",
              "storeName",
              "website",
              "category",
            ],
          },
        },
      ],
    });

    const extractedData = result.json;

    if (!extractedData || typeof extractedData !== "object") {
      throw new Error("No data extracted from URL");
    }

    // Normalize the extracted fields
    const productName = normalizeString(extractedData.productName);
    const currentPrice = normalizeNumber(extractedData.currentPrice);
    const currencyCode = normalizeString(
      extractedData.currencyCode,
    )?.toUpperCase();
    const originalPrice = normalizeNumber(extractedData.originalPrice);
    const availability = normalizeString(extractedData.availability);
    const productImageUrl = normalizeString(extractedData.productImageUrl);
    const storeName = normalizeString(extractedData.storeName);
    const website = normalizeString(extractedData.website);
    const category = normalizeString(extractedData.category);

    // Validate required fields
    if (!productName) {
      throw new Error("Product name could not be extracted");
    }

    if (currentPrice === null) {
      throw new Error("Product price could not be extracted");
    }

    return {
      productName,
      currentPrice,
      currencyCode,
      originalPrice,
      availability,
      productImageUrl,
      storeName,
      website,
      category,
    };
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(
      `Failed to scrape product: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
