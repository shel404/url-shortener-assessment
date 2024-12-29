import { generateShortUrl, getOriginalUrl } from "../helpers/shortener";

describe("URL Shortener Utils", () => {
  const urlMap = new Map<string, string>();

  beforeEach(() => {
    urlMap.clear();
  });

  describe("generateShortUrl", () => {
    it("should generate a short URL for valid URL", () => {
      const longUrl = "https://www.google.com";
      const shortUrl = generateShortUrl(longUrl, urlMap);

      expect(typeof shortUrl).toBe("string");
      expect(shortUrl).toHaveLength(6);
      expect(urlMap.get(shortUrl)).toBe(longUrl);
    });

    it("should throw error for invalid URL", () => {
      expect(() => {
        generateShortUrl("not-a-valid-url", urlMap);
      }).toThrow("Invalid URL");
    });

    it("should generate unique short URLs", () => {
      const url1 = generateShortUrl("https://www.google1.com", urlMap);
      const url2 = generateShortUrl("https://www.google2.com", urlMap);

      expect(url1).not.toBe(url2);
    });
  });

  describe("getOriginalUrl", () => {
    it("should return original URL for valid short URL", () => {
      const longUrl = "https://www.google.com";
      const shortUrl = generateShortUrl(longUrl, urlMap);

      const result = getOriginalUrl(shortUrl, urlMap);
      expect(result).toBe(longUrl);
    });

    it("should return null for non-existent short URL", () => {
      const result = getOriginalUrl("nonexistent", urlMap);
      expect(result).toBeNull();
    });
  });
});
