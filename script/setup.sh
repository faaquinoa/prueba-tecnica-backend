#!/bin/bash

rm -rf deployment
rm -rf build
tsc --project ./

mkdir deployment

for file in ./script/services/* ; do
  if [ -f "$file" ] ; then
    . "$file"
  fi
done

rm -rf deployment
rm -rf build

npm i