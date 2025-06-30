import { BN } from "bn.js";

import {
  community,
  data,
  delay,
  description,
  id,
  image,
  lamportsPerPixel,
  metadata,
  metadataAccount,
  name,
  pixelsAccount,
  PROGRAM_STATIC,
  PROGRAM_SUPREME_BEING,
  ticker,
  token,
  twitter,
  website,
  WSOL_PUBKEY,
} from "./util";

const run = async () => {
  let error: unknown;

  console.log("Fetching sol treasury account...");
  const accounts = await PROGRAM_STATIC.getAccounts("solTreasuryAccount", {
    version: PROGRAM_STATIC.getConstantValue("version"),
  });

  await delay();

  if (!accounts.length) {
    error = await PROGRAM_SUPREME_BEING.createSolTreasuryAccount({
      lamportsPerPixel: new BN(lamportsPerPixel),
    });
    if (error) console.error(error);
    else console.log("Sucessfully created solTreasury account!");
    await delay();
  } else console.log("Sol treasury account exists, skipping...");

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
  if (error) console.error(error);
  else console.log("Sucessfully created metadataAccount!");

  await delay();

  error = await PROGRAM_SUPREME_BEING.createPixelsAccount(
    {
      data,
      tweet: false,
      nonce: 0,
    },
    {
      id,
      metadata,
      metadataAccount,
      pixelsAccount,
      mint: WSOL_PUBKEY,
    },
  );
  if (error) console.error(error);
  else console.log("Sucessfully created pixelsAccount!");
};

run();
