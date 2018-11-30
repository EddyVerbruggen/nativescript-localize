#!/bin/bash

CURRENT_DIR=$(dirname "$(realpath $0)")
PACK_DIR="$CURRENT_DIR"/package

"$CURRENT_DIR"/pack.sh

echo 'Publishing to npm...'
cd $PACK_DIR
npm publish *.tgz
