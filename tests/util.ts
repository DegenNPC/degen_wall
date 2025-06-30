import { readFileSync } from "fs";
import { homedir } from "os";
import type { Idl } from "@coral-xyz/anchor";
import { Wallet, web3 } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

import { DegenWallProgram, ProgramStatic } from "../src";

dotenv.config();

export const loadKeypair = (file: KeyPairFile): Keypair => {
  const data = readFileSync(homedir() + `/.config/solana/${file}`, "utf-8");

  return Keypair.fromSecretKey(Buffer.from(JSON.parse(data)));
};

export const loadProgramIdl = (name: string): Idl => {
  return JSON.parse(
    readFileSync(process.cwd() + `/target/idl/${name}.json`, "utf8"),
  ) as Idl;
};

export enum KeyPairFile {
  main = "id-degen_wall.json",
  alt = "id-degen_wall-alt.json",
}

export const toCamelCase = (str: string): string => {
  return str
    .replace(/_([a-z])/g, (_match: string, letter: string): string =>
      letter.toUpperCase(),
    ) // Convert _word to word
    .replace(/^[A-Z]/, (match: string): string => match.toLowerCase()); // Ensure the first letter is lowercase
};

const CONNECTION = new Connection(process.env.RPC_URL || "");
export const PROGRAM_STATIC = ProgramStatic(CONNECTION);
export const PROGRAM_SUPREME_BEING = new DegenWallProgram(
  CONNECTION,
  new Wallet(loadKeypair(KeyPairFile.main)),
  { showErrors: true },
);

export const VERSION = PROGRAM_STATIC.getConstantValue("version");
const VERSION_BUFFER = Buffer.alloc(1);
VERSION_BUFFER.writeUInt8(VERSION);
export { VERSION_BUFFER };
export const burn = false;
export const token = new PublicKey(
  "A4SvyMLMGXrHR8ahP7qotUrKvGD8KgbdAcLNs3nbVftE",
); // usually we should provide different token address for advertisement
export const website = "a";
export const twitter = "b";
export const community = "c";
export const image = "d";
export const name = "e";
export const ticker = "f";
export const description =
  "ZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMPtWkky12ZyKaSki345678901234ZyKaSkiv6iBfI8eak3HONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLek3HONvMtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMPtWkky12ZyKaSki345678901234ZyKaSkiv6iBfIS8eT8j1xLeKAElLRHoawytQak3HONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMPtWkky12ZyKaSki345678901234ZyKaSkiv6iBfIS8eT8j1xLeKAElLRHoawytQak3HONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMPtWkky12ZyKaSki345678901234ZyKaSkiv6iBfIS8eT8j1xLeKAElLRHoawytQak3HONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMPtWkky12ZyKaSki345678901234ZyKaSkiv6iBfIS8eT8j1xLeKAElLRHoawytQak3HONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMtWkkyHONvMPtWkkyZyKaSkiv6iBfIS8eT8j1xLeKAElLRHowytQak3HONvMtWkkyH";
export const data = Buffer.from(
  Array.from(
    { length: Math.ceil(ProgramStatic().getConstantValue("dataMaxLen") / 5) },
    (_, n) => [n, n, 255, 255, 255],
  )
    .flat()
    .slice(0, ProgramStatic().getConstantValue("dataMaxLen")),
);
export const id = Keypair.generate().publicKey;
export const id2 = Keypair.generate().publicKey;
export const metadata = Keypair.generate().publicKey;
export const SEED_PREFIX = PROGRAM_STATIC.getConstantValue("seedPrefix");
export const mint = new PublicKey(
  "A4SvyMLMGXrHR8ahP7qotUrKvGD8KgbdAcLNs3nbVftE",
);
export const tweet = false;
export const nonce = 0;
export const lamportsPerPixel = 56_451;
export const WSOL_PUBKEY = PROGRAM_STATIC.getConstantValue("wsolPubkey");
const MINT_SEED = mint.toBuffer();
const ID_SEED = id.toBuffer();
const ID2_SEED = id2.toBuffer();
const METADATA_SEED = metadata.toBuffer();
export const treasury = PROGRAM_STATIC.getConstantValue("treasuryPubkey");
export const payer = PROGRAM_SUPREME_BEING.signer;
const PAYER_SEED = payer.toBuffer();
export const [poolAccount] = web3.PublicKey.findProgramAddressSync(
  [SEED_PREFIX, VERSION_BUFFER, MINT_SEED],
  PROGRAM_STATIC.program.programId,
);
export const [metadataAccount] = web3.PublicKey.findProgramAddressSync(
  [SEED_PREFIX, VERSION_BUFFER, PAYER_SEED, METADATA_SEED],
  PROGRAM_STATIC.program.programId,
);
export const [pixelsAccount] = web3.PublicKey.findProgramAddressSync(
  [SEED_PREFIX, VERSION_BUFFER, PAYER_SEED, METADATA_SEED, ID_SEED],
  PROGRAM_STATIC.program.programId,
);
export const [pixelsAccount2] = web3.PublicKey.findProgramAddressSync(
  [SEED_PREFIX, VERSION_BUFFER, PAYER_SEED, METADATA_SEED, ID2_SEED],
  PROGRAM_STATIC.program.programId,
);

export const treasuryMint = new PublicKey(
  "CeqkbDdECYJZ86K4qJndBxNQD85tFj498XYY5UyxPuQp",
);
export const vaultWsol = new PublicKey(
  "58DmxrkK8KTJkDhcG4oDVQ7Li7yfbpNikhtsiLD53KTD",
);
export const vaultMint = new PublicKey(
  "6jBwx67VgAFPBTrGKnTmE2SVKzXgWJ2sAP25ks2YZUE1",
);
export const payerTokenAccount = new PublicKey(
  "5h8v7RfhTeEqTmhrxx462dudjkCThmZqywNaXNj2oxwH",
);
const DELAY_MS = 50;
export const delay = (delay_ms?: number) =>
  new Promise((res) => setTimeout(res, delay_ms ?? DELAY_MS));
