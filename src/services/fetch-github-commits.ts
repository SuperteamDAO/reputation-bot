import { Octokit } from "octokit";
import moment from "moment";

import { airtable, sendToDiscord } from "@/helpers";
import { findTopOccurrences, getTopCommittersMessage } from "@/utils";

export const fetchGithubCommitSummary = async () => {
  const octokit = new Octokit();
  const projects = airtable("Projects").select({
    view: "All Projects",
  });

  projects.firstPage((_error, records) => {
    records?.map(async (record) => {
      const repository = record.get("github_repositories") as string;
      const project = record.get("project_name") as string;
      const webhook = record.get("discord_url") as string;

      const commits = await octokit.rest.repos.listCommits({
        owner: repository.split("/")[0]!,
        repo: repository.split("/")[1]!,
      });
      const filteredCommits = commits.data.filter((commit) => {
        const start = new Date(Date.now() - 86400000);
        const end = new Date(Date.now());
        return moment(commit.commit.author?.date).isBetween(start, end);
      });
      const topComitters = getTopCommittersMessage(
        findTopOccurrences(filteredCommits)
      );

      const message = `**Total commits today**: ${commits.data.length}

      **Top comitters today**: ${topComitters}
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
