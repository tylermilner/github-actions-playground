# Generate Release Notes Action

This action generates release notes from the commit messages between two commits.

## Inputs

## `begin-sha`

**Optional** SHA hash for the commit that should be used as the beginning of the release notes history. Defaults to the initial commit of the repository.

## `end-sha`

**Optional** SHA hash for the commit that should be used as the ending of the release notes history. Defaults to the current commit (i.e. `${{ github.sha }}`).

## Outputs

## `release-notes`

The release notes generated from the commit messages between `begin-sha` and `end-sha`.

## Example usage

```yaml
uses: ./.github/actions/generate-release-notes-action
with:
  begin-sha: 'begin-sha-here'
```

## Source Code Overview

The following files make up this action:

* `action.yaml` - action metadata
* `generate-release-notes.sh` - main action logic. Changes to the action's functionality should be made here.
