import { airtable, sendToDiscord } from "@/helpers";
import { generateMessageForLatestIssues } from "@/utils";
import { fetchLatestIssues } from "@/lib";

export const githubIssuesService = async () => {
  const projects = airtable("Projects").select({
    view: "All Projects",
  });

  projects.firstPage((_error, records) => {
    records?.map(async (record) => {
      const repository = record.get("github_repositories") as string;
      const project = record.get("project_name") as string;
      const webhook = record.get("discord_url") as string;
      const oss = record.get("oss");

      if (!webhook || !oss) {
        return;
      }

      let totalIssues: number = 0;
      let latestIssues: Array<Object> = [];

      for (const repo of repository.split(",")) {
        const repositoryLatestIssues = await fetchLatestIssues(repo);
        totalIssues += repositoryLatestIssues.issues.length;
        latestIssues.push(...repositoryLatestIssues.latestIssues);
      }

      const message = `**Total open issues**: ${totalIssues}
      
      **Issues opened today**: ${generateMessageForLatestIssues(latestIssues)}
      `;

      if (totalIssues > 0) {
        await sendToDiscord(webhook, {
          embeds: [
            {
              title: project,
              description: message,
              color: parseInt("#5865F2".replace("#", ""), 16),
            },
          ],
        });
      }
    });
  });
};
