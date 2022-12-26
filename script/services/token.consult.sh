#!/bin/bash

rm -rf deployment/Token/Consult
rm -f tokenConsult.zip

mkdir deployment/Token
mkdir deployment/Token/Consult
mkdir deployment/Token/Consult/context
mkdir deployment/Token/Consult/context/token
mkdir deployment/Token/Consult/context/token/consult

cp ./package.json ./deployment/Token/Consult/package.json
cp ./.env ./deployment/Token/Consult/.env
cp ./build/tokenConsult.js ./deployment/Token/Consult/index.js

cp -a ./build/context/token/consult ./deployment/Token/Consult/context/token
cp -a ./build/context/shared ./deployment/Token/Consult/context

cd ./deployment/Token/Consult
npm install --production
cd ..
cd ..
cd ..

7z a -tzip tokenConsult.zip ./deployment/Token/Consult/* ./deployment/Token/Consult/.env

#tar -a -cvf "tokenConsult.zip" -C "deployment/Token/Consult" "."
