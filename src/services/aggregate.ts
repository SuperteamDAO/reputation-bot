import { airtable, sendToDiscord } from "@/helpers";
import { generateMessageForLatestIssues } from "@/utils";
import { fetchLatestIssues } from "@/lib";
import dotenv from "dotenv";

dotenv.config();

export const aggregateIssues = async () => {
  const projects = airtable("Projects").select({
    view: "All Projects",
  });

  projects.firstPage(async (_error, records) => {
    let message;
    let issues: Array<Object> = [];

    for (const record of records!) {
      const repository = record.get("github_repositories") as string;

      for (const repo of repository.split(",")) {
        const repositoryLatestIssues = await fetchLatestIssues(repo);
        issues.push(...repositoryLatestIssues.latestIssues);
      }

      message = `gm buildoors, here are a few glass chewing tasks for y'all

        **${generateMessageForLatestIssues(issues)}
        `;
    }

    if (issues.length > 0) {
      await sendToDiscord(process.env.DISCORD_WEBHOOK_URL!, {
        embeds: [
          {
            title: "Glass",
            description: message,
            color: parseInt("#5865F2".replace("#", ""), 16),
          },
        ],
      });
    }
  });
};
