import { nanoid } from "nanoid";

export function generateShortCode(length: number = 7): string {
  return nanoid(length);
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    throw new Error("Invalid URL format");
  }
}
