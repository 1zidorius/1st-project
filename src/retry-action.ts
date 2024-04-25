// const { Octokit } = require("@octokit/rest");
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function retryAction() {
  try {
    const { data: pulls } = await octokit.pulls.list({
      owner: process.env.GITHUB_REPOSITORY.split("/")[0],
      repo: process.env.GITHUB_REPOSITORY.split("/")[1],
      state: "open",
    });

    for (const pull of pulls) {
      const { data: statuses } = await octokit.checks.listForRef({
        owner: process.env.GITHUB_REPOSITORY.split("/")[0],
        repo: process.env.GITHUB_REPOSITORY.split("/")[1],
        ref: pull.head.sha,
      });



      console.log('statuses', JSON.stringify(statuses, null, 2))

      const actionRun = statuses.check_runs.find((status) => status.name === "lock-branch");

      // if (actionRun && actionRun.state === "failure") {
      if (actionRun) {
        // Retry your action by creating a new status with the same context and the 'pending' state
        await octokit.repos.createCommitStatus({
          owner: process.env.GITHUB_REPOSITORY.split("/")[0],
          repo: process.env.GITHUB_REPOSITORY.split("/")[1],
          sha: pull.head.sha,
          state: "failure",
          context: "lock-branch",
          description: "Retrying GitHub Action...",
        });
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    process.exit(1);
  }
}

retryAction();
