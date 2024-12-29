import crypto from "crypto";

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateShortUrl(
  longUrl: string,
  urlMap: Map<string, string>
): string {
  if (!isValidUrl(longUrl)) throw new Error("Invalid URL");

  let shortUrl: string;
  do {
    shortUrl = crypto.randomBytes(4).toString("base64url"); // length of 6
  } while (urlMap.has(shortUrl)); // do-while loop to ensure uniqueness

  urlMap.set(shortUrl, longUrl);
  return shortUrl;
}

export function getOriginalUrl(
  shortUrl: string,
  urlMap: Map<string, string>
): string | null {
  return urlMap.get(shortUrl) || null;
}
