import schedule from "node-schedule";

import { fetchGithubIssues } from "@/services";
import { GITHUB_JOB_CRON_EXPRESSION } from "@/constants";
import { fetchGithubCommitSummary } from "@/services/fetch-github-commits";

export const scheduler = async () => {
  schedule.scheduleJob(GITHUB_JOB_CRON_EXPRESSION, fetchGithubIssues);
  schedule.scheduleJob(GITHUB_JOB_CRON_EXPRESSION, fetchGithubCommitSummary);
};
