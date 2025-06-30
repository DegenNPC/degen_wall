import { BN } from "bn.js";
import { expect } from "chai";

import {
  burn,
  community,
  data,
  delay,
  description,
  id,
  id2,
  image,
  lamportsPerPixel,
  metadata,
  metadataAccount,
  mint,
  name,
  nonce,
  payerTokenAccount,
  pixelsAccount,
  pixelsAccount2,
  poolAccount,
  PROGRAM_SUPREME_BEING,
  ticker,
  token,
  treasuryMint,
  tweet,
  twitter,
  vaultMint,
  vaultWsol,
  website,
  WSOL_PUBKEY,
} from "./util";

describe("Running tests", () => {
  let error: unknown;

  beforeEach(async () => {
    await delay();
  });

  it("createSolTreasuryAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.createSolTreasuryAccount({
      lamportsPerPixel: new BN(lamportsPerPixel),
    });
    expect(error).to.be.false;
    await delay();
  });

  it("updateSolTreasuryAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.updateSolTreasuryAccount({
      lamportsPerPixel: new BN(lamportsPerPixel + 1),
    });
    expect(error).to.be.false;
    await delay();
  });

  it("createPoolAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.createPoolAccount(
      { lamportsPerPixel: new BN(lamportsPerPixel), burn },
      { poolAccount, treasuryMint, mint, vaultMint, vaultWsol },
    );
    expect(error).to.be.false;
    await delay();
  });

  it("updatePoolAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.updatePoolAccount(
      { lamportsPerPixel: new BN(lamportsPerPixel + 1), burn },
      { poolAccount, mint },
    );
    expect(error).to.be.false;
    await delay();
  });

  it("createMetadataAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.createMetadataAccount(
      {
        website,
        twitter,
        community,
        image,
        name,
        ticker,
        description,
      },
      {
        id: metadata,
        metadataAccount,
        token,
      },
    );
    expect(error).to.be.false;
    await delay();
  });

  it("createPixelsAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.createPixelsAccount(
      {
        data,
        tweet,
        nonce,
      },
      {
        id,
        metadata,
        metadataAccount,
        pixelsAccount,
        mint: WSOL_PUBKEY,
      },
    );
    expect(error).to.be.false;
    await delay();
  });

  it("createPixelsAccount - mint", async () => {
    error = await PROGRAM_SUPREME_BEING.createPixelsAccount(
      {
        data,
        tweet,
        nonce: nonce + 1,
      },
      {
        id: id2,
        metadata,
        metadataAccount,
        pixelsAccount: pixelsAccount2,
        mint,
        poolAccount,
        treasuryMint,
        payerTokenAccount,
        vaultWsol,
        vaultMint,
      },
    );
    expect(error).to.be.false;
    await delay();
  });

  it("deletePoolAccount", async () => {
    error = await PROGRAM_SUPREME_BEING.deletePoolAccount({
      mint,
      poolAccount,
    });
    expect(error).to.be.false;
    await delay();
  });
});
