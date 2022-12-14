import { Octokit } from "octokit";
import moment from "moment";

import { sendToDiscord } from "@/utils";

export const fetchGithubCommitSummary = async () => {
  const octokit = new Octokit();

  const commits = await octokit.rest.repos.listCommits({
    owner: "0xMukesh",
    repo: "testing",
  });
  const filteredCommits = commits.data.filter((commit) => {
    const start = new Date(Date.now() - 86400000);
    const end = new Date(Date.now());
    return moment(commit.commit.author?.date).isBetween(start, end);
  });

  // TODO: Replace it w/ a better-formatted message
  const message = `gm! these here is the daily commit summary for 0xMukesh/testing repo\n
  
  - Total no. of commits: ${filteredCommits.length}
  `;

  await sendToDiscord("0xMukesh/testing", message);
};
