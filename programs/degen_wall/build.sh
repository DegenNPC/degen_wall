#!/bin/bash

# Run anchor build
echo "Running anchor build..."
anchor build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful. Running post-build steps..."
  ../../generate_artifacts.sh
else
  echo "Build failed. No files copied."
  exit 1
fi