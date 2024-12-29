import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/urlRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.send("Server is up and running");
});

app.use("/u", urlRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
