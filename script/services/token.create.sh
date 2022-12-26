#!/bin/bash

rm -rf deployment/Token/Create
rm -f tokenCreate.zip

mkdir deployment/Token
mkdir deployment/Token/Create
mkdir deployment/Token/Create/context
mkdir deployment/Token/Create/context/token
mkdir deployment/Token/Create/context/token/create

cp ./package.json ./deployment/Token/Create/package.json
cp ./.env ./deployment/Token/Create/.env
cp ./build/tokenCreate.js ./deployment/Token/Create/index.js

cp -a ./build/context/token/create ./deployment/Token/Create/context/token
cp -a ./build/context/shared ./deployment/Token/Create/context

cd ./deployment/Token/Create
npm install --production
cd ..
cd ..
cd ..

7z a -tzip tokenCreate.zip ./deployment/Token/Create/* ./deployment/Token/Create/.env

#tar -a -cvf "tokenCreate.zip" -C "deployment/Token/Create" "."