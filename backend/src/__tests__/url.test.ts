import request from "supertest";
import express from "express";
import urlRouter from "../routes/urlRouter";

const app = express();
app.use(express.json());
app.use("/u", urlRouter);

describe("URL Shortener API", () => {
  describe("POST /u/shorten", () => {
    it("should create a short URL for valid URL", async () => {
      const response = await request(app)
        .post("/u/shorten")
        .send({ url: "https://www.google.com" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("shortUrl");
      expect(typeof response.body.shortUrl).toBe("string");
    });

    it("should return 400 for invalid URL", async () => {
      const response = await request(app)
        .post("/u/shorten")
        .send({ url: "not-a-valid-url" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /u/:shortUrl", () => {
    let shortUrl: string;

    beforeAll(async () => {
      const response = await request(app)
        .post("/u/shorten")
        .send({ url: "https://www.google.com" });
      shortUrl = response.body.shortUrl;
    });

    it("should redirect to original URL for valid short URL", async () => {
      const response = await request(app).get(`/u/${shortUrl}`);
      expect(response.status).toBe(302); // check if redirects
    });

    it("should return 404 for non-existent short URL", async () => {
      const response = await request(app).get("/u/nonexistent");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});
