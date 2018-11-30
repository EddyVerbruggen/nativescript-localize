#!/bin/bash

CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$CURRENT_DIR"/../src
TO_SOURCE_DIR="$CURRENT_DIR"/src
PACK_DIR="$CURRENT_DIR"/package
ROOT_DIR="$CURRENT_DIR"/..

echo 'Installing npm dependencies...'
npm i

echo 'Clearing /src and /package...'
node_modules/.bin/rimraf "$TO_SOURCE_DIR"
node_modules/.bin/rimraf "$PACK_DIR"

echo 'Copying src...'
node_modules/.bin/ncp "$SOURCE_DIR" "$TO_SOURCE_DIR"

echo 'Copying README and LICENSE to /src...'
node_modules/.bin/ncp "$ROOT_DIR"/LICENSE "$TO_SOURCE_DIR"/LICENSE
node_modules/.bin/ncp "$ROOT_DIR"/README.md "$TO_SOURCE_DIR"/README.md

echo 'Building /src...'
cd "$TO_SOURCE_DIR"
npm run compile
cd ..

echo 'Creating package...'
mkdir "$PACK_DIR"
cd "$PACK_DIR"
npm pack ../"$TO_SOURCE_DIR"

echo 'Cleaning...'
cd ..
node_modules/.bin/rimraf "$TO_SOURCE_DIR"
