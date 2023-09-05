#!/bin/bash -l

# Validate environment variable inputs
if [[ -z "$INPUT_END_SHA" ]]; then
    # In theory, this should never happen since `action.yml` sets the default value of `end-sha` to the current commit
    echo 'Error: Unable to generate release notes. Missing `end-sha` input.'
    exit 1
fi

# Generate release notes from commits
if [[ -z "$INPUT_BEGIN_SHA" ]]; then
    # Missing beginning commit SHA, default to full commit history
    echo 'Missing `begin-sha` input. Generating release notes for full commit history...'
    RELEASE_NOTES=$(git log --oneline --no-decorate)
else
    # Get the commit history between begin and end SHAs
    echo "Generating release notes between $INPUT_BEGIN_SHA and $INPUT_END_SHA..."
    RELEASE_NOTES=$(git log --oneline --no-decorate $INPUT_BEGIN_SHA..$INPUT_END_SHA)
fi

# Remove the commit hash at the beginning of each line
RELEASE_NOTES=$(echo "$RELEASE_NOTES" | cut -d ' ' -f2-)  

# Add a dash at the beginning of each line
RELEASE_NOTES=$(echo "$RELEASE_NOTES" | sed 's/^/- /')

echo "Generated release notes:"
echo "$RELEASE_NOTES"

# Output multiline string. See https://github.com/orgs/community/discussions/26288#discussioncomment-3876281
echo "Saving output..."
delimiter="$(openssl rand -hex 8)"
echo "release-notes<<${delimiter}" >> "${GITHUB_OUTPUT}"
echo "$RELEASE_NOTES" >> "${GITHUB_OUTPUT}"
echo "${delimiter}" >> "${GITHUB_OUTPUT}"
