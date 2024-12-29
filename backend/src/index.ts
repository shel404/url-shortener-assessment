import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/health", (req: Request, res: Response) => {
  res.send("Server is up and running");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
