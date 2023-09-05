//
// Based on https://stackoverflow.com/a/62378683
//
// Since `node_modules` are not checked in to source control, don't forget to recompile after making code changes!
// ncc build index.js --license licenses.txt
//

const core = require('@actions/core');
const github = require('@actions/github');

try {
    // Get inputs
    const token = core.getInput("github-token");
    const workflowId = core.getInput("workflow-id");
    const branch = core.getInput("branch");    
    const debug = core.getInput("debug") === 'true'; // Convert input to boolean

    // Validate inputs
    if (!token) {
        core.setFailed("Input 'github-token' is required.");
        return;
    }
    if (!workflowId) {
        core.setFailed("Input 'workflow-id' is required.");
        return;
    }
    if (!branch) {
        core.setFailed("Input 'branch' is required.");
        return;
    }
    if (debug) {
        console.log(`Debug mode is enabled. Inputs: github-token=***, workflow-id=${workflowId}, branch=${branch}`);
    }

    const octokit = github.getOctokit(token);
    const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

    octokit.rest.actions.listWorkflowRuns({
        owner: owner,
        repo: repo,
        workflow_id: workflowId,
        status: "success",
        branch: branch
    })
    .then(res => {
        const workflowRuns = res.data.workflow_runs;
        if (debug) {
            console.log("workflowRuns:", JSON.stringify(workflowRuns, null, 2));
        }

        if (workflowRuns.length < 1) {
            core.setFailed("No workflow runs found. Make sure the workflow has completed successfully at least once.");
            return;
        }

        const headCommits = workflowRuns.map(run => { return run.head_commit });
        if (debug) {
            console.log("headCommits:", JSON.stringify(headCommits, null, 2));
        }

        const sortedHeadCommits = headCommits.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });
        if (debug) {
            console.log("sortedHeadCommits:", JSON.stringify(sortedHeadCommits, null, 2));
        }

        const lastSuccessCommitHash = sortedHeadCommits[sortedHeadCommits.length - 1].id;
        if (debug) {
            console.log("lastSuccessCommitHash:", JSON.stringify(lastSuccessCommitHash, null, 2));
        }

        core.setOutput("commit-hash", lastSuccessCommitHash);
    });
} catch (error) {
    core.setFailed(error.message);
}
