import schedule from "node-schedule";

import { githubIssuesService, githubCommitsService } from "@/services";
import { GITHUB_JOB_CRON_EXPRESSION } from "@/constants";

export const scheduler = async () => {
  schedule.scheduleJob(GITHUB_JOB_CRON_EXPRESSION, githubIssuesService);
  schedule.scheduleJob(GITHUB_JOB_CRON_EXPRESSION, githubCommitsService);
};
