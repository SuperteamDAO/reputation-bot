import express, { Request, Response } from "express";
import * as crypto from "node:crypto";

const router = express.Router();

router.post("/webhook", async (req: Request, res: Response) => {
  const body = req.body;
  const signature = req.header("X-Hub-Signature");
  const event = req.header("X-GitHub-Event");

  const hmac = crypto.createHmac("sha1", process.env.WEBHOOK_SECRET!);
  const calculatedSignature =
    "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  if (calculatedSignature !== signature) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (event === "pull_request" && body.action === "closed") {
    if (body.merged) {
      console.log(
        `Ay! ${body.sender.login}'s PR just got merged by ${body.pull_request.merged_by}`
      );
    } else {
      return;
    }
  } else {
    return;
  }

  return res.status(200).json({
    message: "Ok",
  });
});

export { router };
