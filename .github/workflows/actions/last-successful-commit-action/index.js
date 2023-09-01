//
// Based on https://stackoverflow.com/a/62378683
//
// Don't forget to recompile after making code changes!
// ncc build index.js --license licenses.txt
//

const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput("github_token");
    const octokit = github.getOctokit(token);
    const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
    const workflowId = core.getInput("workflow_id");
    const branch = core.getInput("branch");

    octokit.rest.actions.listWorkflowRuns({
        owner: owner,
        repo: repo,
        workflow_id: workflowId,
        status: "success",
        branch: branch
    })
    .then(res => {
        const headCommits = res.data.workflow_runs.map(run => { return run.head_commit });

        const sortedHeadCommits = headCommits.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });

        const lastSuccessCommitHash = sortedHeadCommits[sortedHeadCommits.length - 1].id;

        core.setOutput("commit_hash", lastSuccessCommitHash);
    });
} catch (error) {
    core.setFailed(error.message);
}
