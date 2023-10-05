# Last Successful Commit Action

This action returns the commit hash of the last successful run for the given workflow and branch.

## Inputs

### `github-token`

**Required** The GitHub token (e.g. `${{ github.token }}` or `${{ secrets.GITHUB_TOKEN }}`).

### `workflow-id`

**Required** The workflow id or workflow file name (e.g `test.yml`) to determine the last sucessful run from.

### `branch`

**Required** The branch to use for determining the last sucessful run.

## Outputs

### `commit-hash`

The commit hash of the last successful run for the given workflow and branch.

## Example usage

```yaml
uses: ./.github/actions/last-successful-commit-action
with:
  github-token: ${{ github.token }}
  workflow-id: deploy-qa.yml
  branch: develop
```

## Source Code Overview

The following files make up this action:

* `action.yaml` - action metadata
* `index.js` - main action logic. Changes to the action's functionality should be made here.
* `package.json` / `package-lock.json` - JavaScript dependencies that the action needs to run
* `dist/index.js` - compiled version of the action with all of its dependencies. This file is generated and should **NOT** be modified directly.
* `dist/licenses.txt` - compiled list of all licenses in use.

## Making Code Changes

First, `cd` into the action folder and install the project dependencies via [npm](https://www.npmjs.com):

```Shell
npm install
```

In order to avoid the need to check in the `node_modules` folder, this action utilizes [@vercel/ncc](https://github.com/vercel/ncc) to compile the action code and its dependencies into a single file that can be used for distribution.

⚠️ **Important!** - After making code changes to this action, you will need to recompile the action before committing your changes:

```Shell
npm run build
```

This will compile the action into the `dist` folder. Make sure to include any updated files in your commit.
