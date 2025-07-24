import { NextRequest, NextResponse } from "next/server";
import { createUrlMapping, getUrlByShortCode } from "@/lib/db";
import {
  generateShortCode,
  isValidUrl,
  normalizeUrl,
} from "@/lib/urlShortener";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate and normalize URL
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);

    // Generate a unique short code
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      attempts++;

      if (attempts > maxAttempts) {
        return NextResponse.json(
          { error: "Unable to generate unique short code" },
          { status: 500 }
        );
      }
    } while (await getUrlByShortCode(shortCode));

    // Save to database
    const urlMapping = await createUrlMapping(normalizedUrl, shortCode);

    // Get the base URL for the shortened URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const shortUrl = `${baseUrl}/${shortCode}`;

    return NextResponse.json({
      shortCode: urlMapping.short_code,
      originalUrl: urlMapping.original_url,
      shortUrl,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
