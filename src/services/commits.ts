import { airtable, sendToDiscord } from "@/helpers";
import { fetchCommitSummary } from "@/lib";
import { generateMessageForTopCommitters } from "@/utils";

export const githubCommitsService = async () => {
  const projects = airtable("All Projects").select({
    view: "Grid view",
  });

  projects.firstPage((_error, records) => {
    records?.map(async (record) => {
      const repository = record.get("github_repositories") as string;
      const project = record.get("project_name") as string;
      const webhook = record.get("discord_url") as string;
      const oss = record.get("oss");

      if (!webhook || !oss || !repository) {
        return;
      }

      const topComitters: Array<{
        element: any;
        count: number;
      }> = [];
      let totalCommits: number = 0;

      for (const repo of repository.split(",")) {
        const repositoryCommitSummary = await fetchCommitSummary(repo);
        topComitters.push(...repositoryCommitSummary.topComitters);
        totalCommits = totalCommits + repositoryCommitSummary.commits.length;
      }

      const message = `**Total commits today**: ${totalCommits}

        **Top comitters today**: ${generateMessageForTopCommitters(
          topComitters
        )}
        `;

      if (totalCommits > 0) {
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
