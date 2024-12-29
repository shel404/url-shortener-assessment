import express, { Request, Response, Router } from "express";
import { generateShortUrl, getOriginalUrl } from "../helpers/shortener";

const urlRouter: Router = express.Router();

const urlMap: Map<string, string> = new Map();

// Generate short URL
urlRouter.post("/shorten", (req: Request, res: Response) => {
  console.log(req.body);
  const { url } = req.body;

  try {
    const shortUrl = generateShortUrl(url, urlMap);
    res.status(200).json({ shortUrl });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Redirect to original URL
urlRouter.get("/:shortUrl", (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  const originalUrl = getOriginalUrl(shortUrl, urlMap);
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: "Short URL not found" });
  }
});

export default urlRouter;
