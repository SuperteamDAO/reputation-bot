import { Octokit } from "octokit";
import moment from "moment";

import { airtable, sendToDiscord } from "@/helpers";
import { getLatestIssuesMessage } from "@/utils";

export const fetchGithubIssues = async () => {
  const octokit = new Octokit();
  const projects = airtable("Projects").select({
    view: "All Projects",
  });

  projects.firstPage((_error, records) => {
    records?.map(async (record) => {
      const repository = record.get("github_repositories") as string;
      const project = record.get("project_name") as string;
      const webhook = record.get("discord_url") as string;
      const githubUrl = `https://github.com/${repository}`;

      const issues = await octokit.rest.issues.listForRepo({
        owner: repository.split("/")[0]!,
        repo: repository.split("/")[1]!,
      });
      const filteredIssues = issues.data.filter((issue) => {
        const start = new Date(Date.now() - 86400000);
        const end = new Date(Date.now());
        return moment(issue.created_at).isBetween(start, end);
      });
      const latestIssues = getLatestIssuesMessage(filteredIssues);

      const message = `**Total Open Issues**: ${issues.data.length}
      
      **Issues opened today**: ${latestIssues}

      Checkout all the issues at **${githubUrl}/issues**
      `;

      await sendToDiscord(webhook, {
        embeds: [
          {
            title: project,
            description: message,
            color: parseInt("#5865F2".replace("#", ""), 16),
          },
        ],
      });
    });
  });
};
