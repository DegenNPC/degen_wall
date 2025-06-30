import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";

export interface Pixel {
  metadata: PublicKey;
  position: number;
  colorHex: string;
  slot: BN;
}

export interface PixelsUpdate {
  bump: number;
  version: number;
  nonce: number;
  lamportsPerPixel: number;
  burn: boolean;
  tweet: boolean;
  epoch: number;
  slot: number;
  id: string;
  metadata: string;
  mint: string;
  data: Omit<Pixel, "id" | "metadata" | "slot">[];
}

export interface MetadataUpdate {
  bump: number;
  version: number;
  epoch: number;
  slot: number;
  id: string;
  payer: string;
  token: string;
  name: string;
  ticker: string;
  website: string;
  twitter: string;
  community: string;
  image: string;
  description: string;
}

export interface BroadcastPixelsObject {
  data: PixelsUpdate;
  type: "pixelsUpdate";
}

export interface BroadcastMetadataObject {
  data: MetadataUpdate;
  type: "metadataUpdate";
}
