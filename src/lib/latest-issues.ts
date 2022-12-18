import { Octokit } from "octokit";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

export const fetchLatestIssues = async (repository: string) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const issues = await octokit.rest.issues.listForRepo({
    owner: repository.split("/")[0]!,
    repo: repository.split("/")[1]!,
    sort: "created",
    per_page: 50000,
  });
  const filteredIssues = issues.data.filter(
    (issue) =>
      issue.state === "open" && issue.pull_request?.html_url === undefined
  );
  const latestIssues = filteredIssues
    .filter((issue) => {
      const start = new Date(Date.now() - 86400000);
      const end = new Date(Date.now());
      return moment(issue.created_at).isBetween(start, end);
    })
    .slice(0, 3);

  return {
    issues: filteredIssues,
    latestIssues,
  };
};
