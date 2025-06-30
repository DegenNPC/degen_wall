#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define source files (relative to the script's location)
IDL_SRC="$SCRIPT_DIR/target/idl/degen_wall.json"
TYPES_SRC="$SCRIPT_DIR/target/types/degen_wall.ts"
SRC_DIR="$SCRIPT_DIR/src"

# Define base destination (relative to the script's location)
DEST_BASE="$SCRIPT_DIR/../../apps/event_subscriber/src"

# Define destination directories
DEST_IDL="$DEST_BASE/target/idl"
DEST_TYPES="$DEST_BASE/target/types"
DEST_SRC="$DEST_BASE/anchor"

# Ensure destination directories exist
mkdir -p "$DEST_IDL" "$DEST_TYPES" "$DEST_SRC"

# Copy IDL and types with logging
echo "Copying IDL file:"
cp -v "$IDL_SRC" "$DEST_IDL/"

echo "Copying TypeScript types:"
cp -v "$TYPES_SRC" "$DEST_TYPES/"

# Copy source files, excluding env.ts
echo "Copying source files (excluding env.ts):"
for item in "$SRC_DIR"/*; do
    name=$(basename "$item")

    if [[ "$name" == "env.ts" ]]; then
        echo "Skipping $name"
        continue
    fi

    echo "Copying $name..."
    cp -rv "$item" "$DEST_SRC/"
done

echo "End of script."
