import type { Program } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { BN } from "bn.js";

import type { DegenWall } from "../target/types/degen_wall";

// Use a type alias to extract the types
type StaticProgram = Program<DegenWall>;

// Use `typeof` on the type alias directly via `InstanceType`
type StaticProgramTypes = StaticProgram["idl"]["types"];
type StaticProgramInstructions = StaticProgram["idl"]["instructions"];
type StaticProgramAccount = StaticProgram["account"];
type StaticProgramConstants = StaticProgram["idl"]["constants"];
type StaticProgramMethods = StaticProgram["methods"];
type StaticProgramEvents = StaticProgram["idl"]["events"];

// Type mappings for different types
interface TypeMapping {
  pubkey: PublicKey;
  bytes: Buffer<ArrayBuffer>;
  u8: number;
  u16: number;
  u64: number;
  string: string;
}

// Anchor Data Types
type AnchorNumber = "u8" | "u16" | "u32" | "i8" | "i16" | "i32";
type AnchorBN = "u64" | "u128" | "i64" | "i128";
type AnchorPrimitive = AnchorNumber | AnchorBN | "bool" | "bytes";
export interface AnchorArray {
  array: [AnchorType, number];
}
export interface AnchorEnum {
  defined: { name: EnumName };
}

// Helper Types
type AnchorType =
  | AnchorPrimitive
  | "string"
  | "pubkey"
  | AnchorArray
  | AnchorEnum;

export interface Field {
  name: string;
  type: AnchorType;
}

// Enum Extraction
export type EnumName = ExtractEnumNames<StaticProgramTypes[number]>;
export interface EnumVariant {
  name: string;
  fields?: Field[];
}

// Enum name extraction logic
type ExtractEnumNames<T> = T extends { name: string; type: { kind: string } }
  ? T["type"]["kind"] extends "enum"
    ? T["name"]
    : never
  : never;

// Account-Related Types
export type AccountName = keyof StaticProgramAccount; // vendorAccount | productAccount | listingAccount

export type AccountStruct<T extends AccountName> = Awaited<
  ReturnType<StaticProgramAccount[T]["all"]>
>[number];

export type AccountFilters<T extends AccountName> = Partial<
  AccountStruct<T>["account"]
>;

// Constant-Related Types
export type ConstantName = StaticProgramConstants[number]["name"];

export type ConstantValue<Name extends ConstantName> = Extract<
  StaticProgramConstants[number],
  { name: Name }
>["type"] extends keyof TypeMapping
  ? TypeMapping[Extract<StaticProgramConstants[number], { name: Name }>["type"]]
  : never;

// Instruction-Related Types
type ExtractInstructionNames<T> = T extends { name: string }
  ? T["name"] extends string
    ? T["name"]
    : never
  : never;

type InstructionName = ExtractInstructionNames<
  StaticProgramInstructions[number]
>;

type ExtractAccounts<Name extends InstructionName> = {
  [K in Extract<
    StaticProgramInstructions[number],
    { name: Name }
  >["accounts"][number] as K extends
    | { name: string; optional: false }
    | { name: string; optional?: never }
    ? K["name"]
    : never]: PublicKey;
} & {
  [K in Extract<
    StaticProgramInstructions[number],
    { name: Name }
  >["accounts"][number] as K extends { name: string; optional: true }
    ? K["name"]
    : never]?: PublicKey | undefined;
};

export type InstructionAccounts<T extends InstructionName> = Omit<
  ExtractAccounts<T>,
  "systemProgram" | "tokenProgram"
>;

export type InstructionParams<T extends keyof StaticProgramMethods> =
  Parameters<StaticProgramMethods[T]>[0];

export type NullifyOptional<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? Exclude<T[K], undefined> | null
    : T[K];
};

type ExtractEventNames<T> = T extends { name: string }
  ? T["name"] extends string
    ? T["name"]
    : never
  : never;

export type EventName = ExtractEventNames<StaticProgramEvents[number]>;

export type ParsedEvent<T> = {
  [K in keyof T]: T[K] extends PublicKey
    ? string
    : T[K] extends typeof BN
      ? number
      : T[K];
};
