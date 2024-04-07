# github-actions-playground

My personal playground for testing various GitHub Actions capabilities and workflows.

## Workflow Examples

Workflow experiments and examples are available on repo branches. See below for a summary of examples or browse the branch list directly and checkout a branch that looks interesting.

### Branch - `new-commits-run-check`

Cron style CI setup that only runs the main job if a new commit has been pushed since the last run. Utilizes an unsophisticated approach that results in some limitations due to reliance on GitHub actions caching behavior (see below for more).

For context, the inspiration for this demo was to run iOS unit tests for an older simulator version periodically, but only if a new commit was available. This helps to prevent wasting expensive macOS minutes running tests over and over on an already passing commit.

**Workflow file** - `.github/workflows/ci.yml`:

* Writes the current commit SHA to a text file. The only purpose of this file is to give the `cache` action something to cache.
* Utilizes [cache action](https://github.com/actions/cache) to restore the text file for the previous commit. Since GitHub currently actions removes caches [not accessed in the last 7 days](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy), the overall usefulness of this workflow depends on the workflow running at least once every 7 days.
* Sets the `should-run` job output based on whether or not the `cache` step received a hit. If no cache hit occurred, then `should-run` is set to `true`, otherwise `should-run` is set to `false`.
* Defines a new job that only runs if the `should-run` output from the previous job is `true`, effectively only running that job if new commits are available (or the actions cache was cleared due to the 7 day limit).

### Branch - `basic-ios-ci`

A basic unit testing CI setup for an iOS project:

* `.ruby-version` file for Ruby versioning of the execution environment.
* `Gemfile` + `Gemfile.lock` for Ruby build dependency versioning (e.g. Cocoapods, Fastlane, etc.).
* `Fastfile` for main build workflow logic using Fastlane.

**Project file** - `SimpleGHADemo.xcodeproj`:

* Stock app template (i.e. no functionality beyond "Hello, world!").
* Deployment target set to iOS 12.4, with necessary `@available(iOS 13.0, *)` attributes applied.

**Workflow file** - `.github/workflows/test.yml`:

* Runs on a self-hosted `macos-12` runner to allow for executing tests using the iOS 12 simulator. In this case, `macos-12` must be used because the Xcode version that works with the iOS 12 simulator is [not available on `macos-13`](https://stackoverflow.com/q/75142619/4343618).
* Sets up Ruby and then executes fastlane.
* Fastlane lane runs tests only, using `scan`.

### Branch - `generate-changelog` + `generate-changelog_develop`

CI setup with custom local GitHub actions that generate a changelog based on the commit messages between the current commit and the commit of the last successful workflow run.

**Workflow file** - `.github/workflows/generate-changelog.yml`:

* Triggered on push to the `generate-changelog_develop` branch.
* Gets the commit hash for the last successful run of the `generate-changelog_develop` branch. Utilizes my custom [last-successful-commit-hash](https://github.com/tylermilner/last-successful-commit-hash-action) action (written in JavaScript) to access workflow run data via the GitHub API using [Oktokit](https://www.npmjs.com/package/@actions/github).
* Generates release notes based on the commit messages between the last successful run and the current commit. Utilizes a [local custom composite action](.github/actions/generate-release-notes-action/README.md) to accomplish this using a bash script.
* Displays the generated release notes.

For a version of the `generate-changelog` workflow that use local actions rather relying on actions in the GitHub Actions marketplace (i.e. my initial POC), see the `generate-changelog-local-actions` branch.
