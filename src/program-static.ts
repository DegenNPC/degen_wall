import type { Wallet } from "@coral-xyz/anchor";
import type { Connection } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

import type { DegenWall } from "../target/types/degen_wall";
import type {
  AccountFilters,
  AccountName,
  AccountStruct,
  AnchorArray,
  AnchorEnum,
  ConstantName,
  ConstantValue,
  EnumName,
  EnumVariant,
  Field,
} from "./anchor-types";
import IDL from "../target/idl/degen_wall.json";

const VECTOR_OFFSET = 4;
const STRING_PADDING = "|";

export const ProgramStatic = (connection?: Connection) => {
  const provider = new AnchorProvider(
    connection as unknown as Connection,
    null as unknown as Wallet,
  );
  const program = new Program<DegenWall>(IDL as DegenWall, provider);

  const getRandomId = () => {
    return Keypair.generate().publicKey;
  };

  const getSeedBuffer = (seed: string) => {
    return Buffer.from(
      String.fromCharCode(
        ...seed
          .replace(/[[\]\s]/g, "")
          .split(",")
          .map(Number),
      ),
    );
  };

  const getConstantValue = <N extends ConstantName>(
    constantName: N,
  ): ConstantValue<N> => {
    const constantStruct = program.idl.constants.find(
      (constStruct) => constStruct.name === constantName,
    );
    if (!constantStruct) {
      throw new Error(`Constant with name ${constantName} not found`);
    }
    const { value, type } = constantStruct;
    switch (type) {
      case "bytes":
        return getSeedBuffer(value) as ConstantValue<N>;
      case "pubkey":
        return new PublicKey(value) as ConstantValue<N>;
      case "u8":
      case "u16":
        return Number(value) as ConstantValue<N>;
      case "string":
        return value.toString() as ConstantValue<N>;
      default:
        throw new Error(`Unsupported type: ${JSON.stringify(type)}`);
    }
  };

  const getEncodedValue = (input: unknown) => {
    switch (typeof input) {
      case "number":
        return bs58.encode([input]);
      case "string":
        return bs58.encode(Buffer.from(input));
      case "boolean":
        return bs58.encode(Buffer.from([input ? 1 : 0]));
      case "object":
        if (input instanceof PublicKey) return bs58.encode(input.toBuffer());
        else if (input instanceof BN) return bs58.encode([Number(input)]);
    }

    throw new Error(`Invalid input ${JSON.stringify(input)} for encoding`);
  };

  const getAccountStruct = (accountName: AccountName) => {
    const accountStruct = program.idl.types.find(
      (acc) => acc.name === accountName,
    )?.type;
    if (!accountStruct) throw new Error(`Account ${accountName} doesn't exist`);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (accountStruct.kind !== "struct")
      // It can be of other kinds for other interfaces hence why we're doing this seemingly "redundant" check
      throw new Error(
        `Field ${accountName} with body:${JSON.stringify(
          accountStruct,
        )} is not of type struct`,
      );
    return accountStruct;
  };

  const getEnumVariants = (enumName: EnumName): EnumVariant[] => {
    const enumStruct = program.idl.types.find(
      (acc) => acc.name === enumName,
    )?.type;
    if (!enumStruct)
      throw new Error(`Enum ${JSON.stringify(enumName)} doesn't exist`);
    //@ts-expect-error in case we do not have enums in idl
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (enumStruct.kind !== "enum")
      // It can be of other kinds for other interfaces hence why we're doing this seemingly "redundant" check
      throw new Error(
        `Field ${JSON.stringify(enumName)} with body:${JSON.stringify(
          enumStruct,
        )} is not of type enum`,
      ); //@ts-expect-error in case we do not have enums in idl
    return enumStruct.variants as EnumVariant[];
  };

  const getArraySize = (arrayType: AnchorArray, accountName: AccountName) => {
    const { array } = arrayType;
    const anchorPrimitive = array[0];
    const arrayLength = array[1];
    const primitiveSize = getFieldSize(
      {
        type: anchorPrimitive,
        name: "DefinitelyNotAString",
      },
      accountName,
    );
    return primitiveSize * arrayLength;
  };

  const getDataSize = (dataName: string, accountName: AccountName): number => {
    try {
      return getConstantValue(
        //@ts-expect-error String sizes are exposed via constants with standardized naming
        dataName
          .replace(/_./g, (match) => match.charAt(1).toUpperCase())
          .replace(/_/g, "") + "MaxLen",
      ) as number;
    } catch (error) {
      console.warn(
        `Error getting string size:  ${
          error instanceof Error
            ? (error.stack ?? error.message)
            : String(error)
        }. Resorting to fallback...`,
      );
      return getConstantValue(
        //@ts-expect-error String sizes are exposed via constants with standardized naming
        (accountName.replace(/Account$/, "") + "_" + dataName)
          .replace(/_./g, (match) => match.charAt(1).toUpperCase())
          .replace(/_/g, "") + "MaxLen",
      ) as number;
    }
  };

  const padStrings = <T extends Record<string, unknown>>(
    object: T,
    accountName: AccountName,
  ) => {
    for (const [field, value] of Object.entries(object)) {
      if (typeof value === "string") {
        const stringSize = getDataSize(field, accountName);
        object[field as keyof T] = value.padEnd(
          stringSize,
          STRING_PADDING,
        ) as T[keyof T];
      }
    }
  };

  const unpadStrings = <T extends Record<string, unknown>>(object: T) => {
    Object.entries(object).forEach(([field, value]) => {
      if (typeof value === "string") {
        let trimmed = value;
        while (trimmed.endsWith(STRING_PADDING)) {
          trimmed = trimmed.slice(0, -STRING_PADDING.length);
        }
        // Type assertion ensures we are allowed to mutate the object
        (object as Record<string, unknown>)[field] = trimmed;
      }
    });
  };

  const getEnumSize = (enumType: AnchorEnum, accountName: AccountName) => {
    const enumName = enumType.defined.name;
    const enumVariants = getEnumVariants(enumName);
    let maxSize = 1; // discriminant
    enumVariants.forEach((variant) => {
      const { fields } = variant;
      if (fields?.length) {
        let fieldsSize = 1; // discriminant
        fields.forEach(
          (field) => (fieldsSize += getFieldSize(field, accountName)),
        );
        if (maxSize < fieldsSize) maxSize = fieldsSize;
      }
    });
    return maxSize;
  };

  const getFieldSize = (field: Field, accountName: AccountName): number => {
    const { type, name } = field;
    if (typeof type === "string") {
      // AnchorPrimitive
      switch (type) {
        case "u8":
        case "i8":
        case "bool":
          return 1;
        case "u16":
        case "i16":
          return 2;
        case "u32":
        case "i32":
          return 4;
        case "u64":
        case "i64":
          return 8;
        case "u128":
        case "i128":
          return 16;
        case "pubkey":
          return 32;
        case "string":
        case "bytes":
          // 99.9% Of cases vectors are placed at the end of struct, so no need to determine the offset
          // But just in case, we're leaving this here as a reminder it needs to be implemented for that 0.1%
          return VECTOR_OFFSET + getDataSize(name, accountName);
        default:
          throw new Error(`Unknown type ${JSON.stringify(type)}`);
      }
    } else if ("array" in type) return getArraySize(type, accountName);
    else if ("defined" in type) return getEnumSize(type, accountName);
    else
      throw new Error(`Wtf are you doing mate for ${JSON.stringify(field)}?`);
  };

  const getOffset = (accountName: AccountName, fieldName: string) => {
    const accountStruct = getAccountStruct(accountName);
    let offset = 8; // discriminator offset
    const { fields } = accountStruct;
    let fieldPosition = 0;
    for (const field of fields) {
      if (field.name === fieldName) {
        if (field.type === "string" || field.type === "bytes")
          offset += VECTOR_OFFSET;
        break;
      }
      offset += getFieldSize(field, accountName);
      fieldPosition++;
    }
    if (fieldPosition === fields.length)
      throw new Error(
        `Fieldname ${fieldName} doesnt exist for account ${accountName} return getOffset`,
      );
    return offset;
  };

  const getAccounts = async <N extends AccountName>(
    accountName: N,
    accountFilters?: AccountFilters<N>,
  ): Promise<AccountStruct<N>[]> => {
    const filters: { memcmp: { bytes: string; offset: number } }[] = [];
    if (accountFilters) {
      Object.entries(accountFilters).forEach(([fieldName, value]) => {
        filters.push({
          memcmp: {
            bytes: getEncodedValue(value),
            offset: getOffset(accountName, fieldName),
          },
        });
      });
    }
    const accounts = await program.account[accountName].all(filters);
    accounts.forEach((accountItem) => {
      const { account } = accountItem;
      unpadStrings(account);
    });
    return accounts;
  };

  const getLastTxCostLamports = async () => {
    if (!connection) throw new Error("Connection is required");

    const programId = program.programId;

    // 1. Get recent confirmed signatures
    const signatures = await connection.getSignaturesForAddress(programId, {
      limit: 1,
    });

    if (signatures.length === 0) {
      console.warn("No recent transactions found for this program");
      return null;
    }

    const latestSignature = signatures[0]?.signature;
    if (latestSignature) {
      // 2. Fetch parsed transaction details
      const parsedTx = await connection.getParsedTransaction(latestSignature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!parsedTx) {
        throw new Error("Could not fetch parsed transaction details");
      }

      const meta = parsedTx.meta;
      if (!meta) {
        throw new Error("Transaction has no metadata");
      }

      // 3. Compare pre- and post-balances
      const accountKeys = parsedTx.transaction.message.accountKeys;
      const preBalances = meta.preBalances;
      const postBalances = meta.postBalances;

      const balanceChanges = accountKeys.map((accountMeta, index) => ({
        account: accountMeta.pubkey.toString(),
        diff: (postBalances[index] ?? 0) - (preBalances[index] ?? 0),
      }));

      // Filter out positive diffs for the hardcoded pubkey
      const filteredPositiveDiffs = balanceChanges.filter(
        (b) =>
          b.account.toString() !==
            getConstantValue("treasuryPubkey").toString() && b.diff > 0,
      );

      // Get the highest positive diff remaining
      const highestPositiveDiff = filteredPositiveDiffs.reduce(
        (max, curr) => (curr.diff > max ? curr.diff : max),
        0,
      );

      return highestPositiveDiff;
    }
    return 0;
  };

  return {
    getAccounts,
    getConstantValue,
    getRandomId,
    padStrings,
    getLastTxCostLamports,
    program,
  };
};
