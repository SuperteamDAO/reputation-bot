// Runs every minute in development and at 00:00 IST in production
export const GITHUB_JOB_CRON_EXPRESSION =
  process.env.NODE_ENV === "development" ? "* * * * *" : "30 18 * * *";
