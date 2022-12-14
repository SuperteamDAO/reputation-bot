import { Octokit } from "octokit";
import moment from "moment";

import { sendToDiscord } from "@/utils";

export const fetchGithubIssues = async () => {
  const octokit = new Octokit();

  const issues = await octokit.rest.issues.listForRepo({
    repo: "testing",
    owner: "0xMukesh",
  });
  const filteredIssues = issues.data.filter((issue) => {
    const start = new Date(Date.now() - 86400000);
    const end = new Date(Date.now());
    return moment(issue.created_at).isBetween(start, end);
  });

  // TODO: Replace '0xMukesh/testing' w/ the project's name
  const message =
    "gm! these are the latest issues for 0xMukesh/testing repo" +
    filteredIssues.reverse().map((issue, index) => {
      return `\n${index + 1}. ${issue.title} - ${issue.html_url}`;
    });

  await sendToDiscord("0xMukesh/testing", message);
};
