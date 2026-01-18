import { NextRequest, NextResponse } from "next/server";
import { scrapeFoodURL } from "@/scraping/scrape-food";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const result = await scrapeFoodURL(url);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to scrape recipe" },
      { status: 500 }
    );
  }
}
