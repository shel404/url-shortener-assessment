import { useState, useEffect } from "react";

interface ShortenResponse {
  shortUrl: string;
}

export function URLShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && clipboardText.startsWith("http")) {
          setUrl(clipboardText);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.log("Clipboard access denied or empty");
      }
    };

    checkClipboard();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      // Validate URL format
      try {
        new URL(url);
      } catch {
        setError(
          "Invalid URL. Please enter a valid URL starting with http:// or https://"
        );
        return;
      }

      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/u/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data: ShortenResponse = await response.json();
      setShortUrl(`${import.meta.env.VITE_API_URL}/u/${data.shortUrl}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="url-shortener">
      <div className="card">
        <div className="card-header">
          <h1>✨ URL Shortener</h1>
          <p className="subtitle">Make your long URLs short and sweet!</p>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              required
              className="url-input"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? <span className="loading-spinner" /> : "🔗 Shorten"}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {shortUrl && (
          <div className="result-container">
            <h2>Your shortened URL is ready! 🎉</h2>
            <div className="url-display">
              <a href={shortUrl} className="short-url" target="_blank">
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className={`copy-button ${copied ? "copied" : ""}`}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
