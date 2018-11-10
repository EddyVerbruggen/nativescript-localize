#!/bin/bash

SOURCE_DIR=../src;
TO_SOURCE_DIR=src;
PACK_DIR=package;
ROOT_DIR=..;
PUBLISH=--publish

install(){
  npm i
}

pack() {
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

  cd ..
  node_modules/.bin/rimraf "$TO_SOURCE_DIR"
}

install && pack
