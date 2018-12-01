#!/bin/bash

CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$CURRENT_DIR/.."

if [[ $# -eq 0 || ! $1 =~ ^major|minor|patch$ ]]; then
  echo "Invalid argument. Failing..."
  exit 1
fi

if [ ! -z "$(git status --porcelain)" ]; then
  echo "Uncommited changes. Failing..."
  exit 1;
fi

echo 'Bumping version...'
cd "$CURRENT_DIR/../src"
VERSION=$(npm --no-git-tag-version version "$1")
git add "package.json"
git add "package-lock.json"
git commit -m "Bump version to $VERSION"
git push origin

echo 'Updating CHANGELOG...'
cd "$CURRENT_DIR/.."
github_changelog_generator --future-release "$VERSION"
git add CHANGELOG.md
git commit -m "Update CHANGELOG.md"
git push origin

echo 'Tagging...'
git tag "$VERSION"
git push origin --tags
