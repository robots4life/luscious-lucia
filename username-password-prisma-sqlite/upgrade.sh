#! /usr/bin/env bash

# run this inside the Devilbox container
# ./shell.sh

# run this script
# chmod +x upgrade.sh
# ./upgrade.sh

# https://www.npmjs.com/package/npm-check-updates

# don't forget to run npx npm-check-updates before running this script

clear

# https://docs.npmjs.com/cli/v7/commands/npx
# A prompt is printed (which can be suppressed by providing either --yes or --no).

# https://stackoverflow.com/a/70742969

npx --yes npm-check-updates

currentDateTime=$(date +"%Y-%m-%d-%H-%M-%S")
upgrades_filename="upgrades-$currentDateTime.log"

npx npm-check-updates -u > $upgrades_filename

# npm install --verbose

# pnpm install