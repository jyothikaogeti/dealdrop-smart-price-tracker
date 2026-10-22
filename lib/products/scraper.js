import { scrapeProduct as scrape } from "@/lib/firecrawl";

export async function scrapeProduct(url) {
  try {
    const scrapedData = await scrape(url);

    return {
      success: true,
      data: scrapedData,
    };
  } catch (error) {
    console.error("Product scraping failed:", error);
    return {
      success: false,
      error: "Could not scrape product information",
      code: "SCRAPING_ERROR",
    };
  }
}
