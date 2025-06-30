# 💎 degen_wall Program (Solana + Anchor)

A Solana smart contract built with [Anchor](https://www.anchor-lang.com/) to manage canvas drawings on-chain.

> **Note:** All paths mentioned below are assumed to be relative to your working directory:  
> `~/Wherever_You_Saved`

---

## 🔧 Setup

1. Follow the official Solana Hello World guide to ensure your environment is ready:  
   [Solana Rust Hello World](https://solana.com/developers/guides/getstarted/local-rust-hello-world)

2. Update the `<PROGRAM_ID>` in the following files:

   - `programs/degen_wall/src/lib.rs`
   - `Anchor.toml`

3. In `Anchor.toml`, verify the following:
   - The correct cluster is specified:
     ```toml
     [provider]
     cluster = "https://api.devnet.solana.com"  # or testnet/mainnet
     wallet = "~/.config/solana/id-degen_wall.json"
     ```
   - The wallet/keypair is the authority used for deploying and upgrading the program.

---

## 🧱 Build

Compile the smart contract to BPF format:

```bash
cd programs/degen_wall
./build.sh
```

## 🚀 Deploy

Deploy the program to the selected cluster and initialize the IDL:

```bash
solana program deploy target/deploy/degen_wall.so
anchor idl init --filepath target/idl/degen_wall.json <PROGRAM_ID>
```

Alternatively, you can do ⬇️. Make sure you've updated the paths first in deploy.sh

```bash
./deploy.sh deploy
./deploy.sh idl_init
```

## 🔁 Upgrade

When making updates to the program:

```bash
solana program deploy target/deploy/degen_wall.so
anchor idl upgrade --filepath target/idl/degen_wall.json <PROGRAM_ID>
```

Alternatively, you can do ⬇️. Make sure you've updated the paths first in deploy.sh

```bash
./deploy.sh upgrade
./deploy.sh idl_upgrade
```

## 🧪 Testing

Run the 1st command for testing. Run the 2nd command if you cancel the test script mid way so you don't commit breaking changes.

```bash
npm run test
npm unpatch:npm
```
