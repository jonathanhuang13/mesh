#!/bin/bash

SRC_PATTERN=$1
if git diff --cached --name-only | grep --quiet "$SRC_PATTERN"
then
  echo "change detected in $1"
  cd $1 && npm test
  exit $?
fi

echo "no change detected in $1"
exit 0