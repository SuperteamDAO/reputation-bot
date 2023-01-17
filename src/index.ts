import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

import { scheduler } from "@/jobs";
import { router } from "@/router";

dotenv.config();

const app: Application = express();

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "The server is up and running",
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(
    `The server is up and running at ${port} in ${process.env.NODE_ENV} mode`
  );
  dotenv.config();
  console.log("Configured environment variables");
  scheduler();
  console.log("Started the scheduler job");
});
