#!/bin/sh
rm -rf dist/ && rm -f package-lock.json && rm -rf node_modules/ && npm i && npm run electron-build
