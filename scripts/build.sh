#!/bin/sh
set -e
yarn bootstrap
yarn clean
yarn run build-fcl-types
yarn run build-scripts
yarn run build-test
yarn run build-sdk
