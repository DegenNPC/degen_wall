#!/bin/bash

set -e

PROGRAM_SO="target/deploy/degen_wall.so"
IDL_JSON="target/idl/degen_wall.json"
PROGRAM_KEYPAIR="target/deploy/degen_wall-keypair.json"
PROGRAM_ID="DEGENvq96VhCR8jawM9ZkBuQtGtFNTsER4ohGPkFBLUt"

case "$1" in
  deploy)
    echo "📦 Deploying program..."
    solana program deploy target/deploy/degen_wall.so --keypair ./degen_wall-deployer.json
    ;;
  idl_init)
    echo "📝 Initializing IDL..."
    anchor idl init --filepath target/idl/degen_wall.json $PROGRAM_ID
    ;;
  upgrade)
    echo "🚀 Upgrading program..."
    solana program deploy target/deploy/degen_wall.so --keypair ./degen_wall-deployer.json
    ;;
  idl_upgrade)
    echo "🔄 Upgrading IDL..."
    anchor idl upgrade --filepath target/idl/degen_wall.json $PROGRAM_ID
    ;;
  *)
    echo "❌ Unknown command: $1"
    echo "Usage: $0 [deploy | idl_init | upgrade | idl_upgrade]"
    exit 1
    ;;
esac
