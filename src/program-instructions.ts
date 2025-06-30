import type { Wallet } from "@coral-xyz/anchor";
import type { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";

import type { DegenWall } from "../target/types/degen_wall";
import type { InstructionAccounts, InstructionParams } from "./anchor-types";
import IDL from "../target/idl/degen_wall.json";
import { ProgramStatic } from "./program-static";

type ReplaceUndefinedWithNull<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? Exclude<T[K], undefined> | null
    : T[K];
};

export class DegenWallProgram {
  private program: Program<DegenWall>;
  public signer: PublicKey;
  public treasury: PublicKey;
  private solTreasuryAccount: PublicKey;
  private programStatic: ReturnType<typeof ProgramStatic>;
  private commitment: Commitment;
  private showErrors: boolean;
  private defaultMint: PublicKey;

  constructor(
    connection: Connection,
    wallet: Wallet | AnchorProvider,
    optionalArgs?: {
      commitment?: Commitment;
      showErrors?: boolean;
    },
  ) {
    if (wallet instanceof AnchorProvider) {
      this.program = new Program<DegenWall>(IDL as DegenWall, wallet);
    } else
      this.program = new Program<DegenWall>(
        IDL as DegenWall,
        new AnchorProvider(connection, wallet),
      );
    this.programStatic = ProgramStatic(connection);
    const VERSION = this.programStatic.getConstantValue("version");
    const VERSION_BUFFER = Buffer.alloc(1);
    VERSION_BUFFER.writeUInt8(VERSION);
    this.signer = wallet.publicKey;
    this.treasury = this.programStatic.getConstantValue("treasuryPubkey");
    [this.solTreasuryAccount] = web3.PublicKey.findProgramAddressSync(
      [this.programStatic.getConstantValue("seedPrefix"), VERSION_BUFFER],
      this.program.programId,
    );
    this.showErrors = optionalArgs?.showErrors ?? false;
    this.commitment = optionalArgs?.commitment ?? "confirmed";
    this.defaultMint = this.programStatic.getConstantValue("wsolPubkey");
  }

  async createMetadataAccount(
    params: InstructionParams<"createMetadataAccount">,
    partialAccounts: Omit<
      InstructionAccounts<"createMetadataAccount">,
      "signer"
    >,
  ) {
    const accounts: InstructionAccounts<"createMetadataAccount"> = {
      signer: this.signer,

      ...partialAccounts,
    };
    try {
      await this.program.methods
        .createMetadataAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("createMetadataAccount", error);
    }
  }

  async createPixelsAccount(
    params: InstructionParams<"createPixelsAccount">,
    partialAccounts: Omit<
      InstructionAccounts<"createPixelsAccount">,
      "signer" | "treasury" | "solTreasuryAccount"
    >,
  ) {
    const optionalAccounts = partialAccounts.mint.equals(this.defaultMint)
      ? {
          treasury: this.treasury,
          solTreasuryAccount: this.solTreasuryAccount,
          payerTokenAccount: null,
          poolAccount: null,
          treasuryMint: null,
          vaultMint: null,
          vaultWsol: null,
        }
      : {
          treasury: null,
          solTreasuryAccount: null,
          payerTokenAccount: partialAccounts.payerTokenAccount ?? null,
          poolAccount: partialAccounts.poolAccount ?? null,
          treasuryMint: partialAccounts.treasuryMint ?? null,
          vaultMint: partialAccounts.vaultMint ?? null,
          vaultWsol: partialAccounts.vaultWsol ?? null,
        };
    const accounts: ReplaceUndefinedWithNull<
      InstructionAccounts<"createPixelsAccount">
    > = {
      signer: this.signer,
      ...partialAccounts,
      ...optionalAccounts,
    };
    try {
      await this.program.methods
        .createPixelsAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("createPixelsAccount", error);
    }
  }

  async createPoolAccount(
    params: InstructionParams<"createPoolAccount">,
    partialAccounts: Omit<InstructionAccounts<"createPoolAccount">, "signer">,
  ) {
    const accounts: InstructionAccounts<"createPoolAccount"> = {
      signer: this.signer,
      ...partialAccounts,
    };
    try {
      await this.program.methods
        .createPoolAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("createPoolAccount", error);
    }
  }

  async createSolTreasuryAccount(
    params: InstructionParams<"createSolTreasuryAccount">,
  ) {
    const accounts: InstructionAccounts<"createSolTreasuryAccount"> = {
      signer: this.signer,
      solTreasuryAccount: this.solTreasuryAccount,
    };
    try {
      await this.program.methods
        .createSolTreasuryAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("createSolTreasuryAccount", error);
    }
  }

  async updatePoolAccount(
    params: InstructionParams<"updatePoolAccount">,
    partialAccounts: Omit<InstructionAccounts<"updatePoolAccount">, "signer">,
  ) {
    const accounts: InstructionAccounts<"updatePoolAccount"> = {
      signer: this.signer,
      ...partialAccounts,
    };
    try {
      await this.program.methods
        .updatePoolAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("updatePoolAccount", error);
    }
  }

  async updateSolTreasuryAccount(
    params: InstructionParams<"updateSolTreasuryAccount">,
  ) {
    const accounts: InstructionAccounts<"updateSolTreasuryAccount"> = {
      signer: this.signer,
      solTreasuryAccount: this.solTreasuryAccount,
    };
    try {
      await this.program.methods
        .updateSolTreasuryAccount(params)
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("updateSolTreasuryAccount", error);
    }
  }

  async deletePoolAccount(
    partialAccounts: Omit<InstructionAccounts<"deletePoolAccount">, "signer">,
  ) {
    const accounts: InstructionAccounts<"deletePoolAccount"> = {
      signer: this.signer,
      ...partialAccounts,
    };
    try {
      await this.program.methods
        .deletePoolAccount()
        .accounts(accounts)
        .rpc({ commitment: this.commitment });
      return false;
    } catch (error) {
      return this.handleError("deletePoolAccount", error);
    }
  }

  private handleError(instructionName: string, error: unknown) {
    if (this.showErrors) {
      console.error(`Error for instruction ${instructionName}:`);
      console.error(error);
    }
    return error;
  }
}
