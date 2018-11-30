#!/bin/bash

CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACK_DIR="$CURRENT_DIR"/package

"$CURRENT_DIR"/pack.sh

echo 'Publishing to npm...'
cd $PACK_DIR
npm publish *.tgz
