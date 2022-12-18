import { Octokit } from "octokit";
import moment from "moment";
import dotenv from "dotenv";

import { findMostOccurrences } from "@/utils";

dotenv.config();

export const fetchCommitSummary = async (repository: string) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const commits = await octokit.rest.repos.listCommits({
    owner: repository.split("/")[0]!,
    repo: repository.split("/")[1]!,
  });
  const filteredCommits = commits.data
    .filter((commit) => {
      const start = new Date(Date.now() - 86400000);
      const end = new Date(Date.now());
      return moment(commit.commit.author?.date).isBetween(start, end);
    })
    .slice(0, 3);
  const topComitters = findMostOccurrences(filteredCommits);

  return {
    commits: filteredCommits,
    topComitters,
  };
};
