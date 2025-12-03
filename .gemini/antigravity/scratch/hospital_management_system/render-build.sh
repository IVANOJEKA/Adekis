#!/bin/bash
# Render build script for frontend
set -e

echo "Current directory:"
pwd
echo "Contents:"
ls -la

# Find package.json
if [ -f "package.json" ]; then
    echo "Found package.json in current directory"
    npm install
    npm run build
elif [ -f "../package.json" ]; then
    echo "Found package.json in parent directory"
    cd ..
    npm install
    npm run build
else
    echo "ERROR: Cannot find package.json"
    find . -name "package.json" -type f
    exit 1
fi
