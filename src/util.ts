import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

import type { ParsedEvent } from "./anchor-types";
import type { Pixel } from "./interface-types";
import { ProgramStatic } from "./program-static";

const PROGRAM_STATIC = ProgramStatic();
const DATA_MAX_LEN = PROGRAM_STATIC.getConstantValue("dataMaxLen");
const PX_SIZE = PROGRAM_STATIC.getConstantValue("pxSize");
const PX_WIDTH = PROGRAM_STATIC.getConstantValue("pxWidth");
const PX_HEIGHT = PROGRAM_STATIC.getConstantValue("pxHeight");

export const getPixelMapUpdated = (
  previousData: Pixel[],
  update: Pixel[],
): Pixel[] => {
  const previousDataCopy = [...previousData];
  for (const newPixel of update) {
    const { position } = newPixel;
    previousDataCopy[position] = previousDataCopy[position]
      ? newPixel.slot.gte(previousDataCopy[position].slot)
        ? newPixel
        : previousDataCopy[position]
      : newPixel;
  }
  return previousDataCopy;
};

export const getPixelMapExpanded = (data: number[]) => {
  const pixelMap: { position: number; colorHex: string }[] = [];
  const positionsTracked = new Set<number>();
  let prevDrawFrom = false;
  let prevPosition = 0;
  let prevColorHex = "#FFFFFF";
  for (let i = 0; i < DATA_MAX_LEN; i += PX_SIZE) {
    const x = data[i];
    const yRAW = data[i + 1];
    const R = data[i + 2];
    const G = data[i + 3];
    const B = data[i + 4];
    if (
      x === undefined ||
      yRAW === undefined ||
      R === undefined ||
      G === undefined ||
      B === undefined
    )
      break;
    const drawFrom = !!((yRAW >> 7) & 0x01);
    const y = yRAW & 0x7f;
    if (x >= PX_WIDTH || x < 0) throw new Error(`Invalid x ${x} at index ${i}`);
    if (y >= PX_HEIGHT || y < 0) {
      throw new Error(`Invalid y ${y} at index ${i}`);
    }
    if (R < 0 || R > 255)
      throw new Error(`Invalid R ${R} at index ${i} for x ${x} and y ${y}`);
    if (G < 0 || G > 255)
      throw new Error(`Invalid G ${G} at index ${i} for x ${x} and y ${y}`);
    if (B < 0 || B > 255)
      throw new Error(`Invalid B ${B} at index ${i} for x ${x} and y ${y}`);
    const position = x + y * PX_WIDTH;
    if (positionsTracked.has(position)) {
      throw new Error(
        `Duplicate coordinate at x ${x}, y ${y} (position ${position})`,
      );
    }
    const colorHex = `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;

    if (prevDrawFrom)
      for (let i = prevPosition + 1; i < position; i++) {
        pixelMap.push({ position: i, colorHex: prevColorHex });
        positionsTracked.add(i);
      }
    pixelMap.push({ position, colorHex });
    prevDrawFrom = drawFrom;
    positionsTracked.add(position);
    pixelMap.push({ position, colorHex });
    prevPosition = position;
    prevColorHex = colorHex;
    prevDrawFrom = drawFrom;
  }
  return pixelMap;
};

interface TypeHints<T> {
  publicKeys?: (keyof T)[];
  bns?: (keyof T)[];
}

export const getOriginalEventObject = <T extends object>(
  parsed: ParsedEvent<T>,
  typeHints: TypeHints<T>,
): T => {
  const originalObj = {} as T;
  for (const [key, value] of Object.entries(parsed)) {
    if (typeHints.publicKeys?.includes(key as keyof T)) {
      originalObj[key as keyof T] = new PublicKey(
        value as string,
      ) as T[keyof T];
    } else if (typeHints.bns?.includes(key as keyof T)) {
      originalObj[key as keyof T] = new BN(value as number) as T[keyof T];
    } else {
      originalObj[key as keyof T] = value as T[keyof T];
    }
  }
  return originalObj;
};

export const getParsedEventObject = <T extends object>(
  obj: T,
): ParsedEvent<T> => {
  const parsedObj = {} as ParsedEvent<T>;
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof PublicKey) {
      parsedObj[key as keyof T] = value.toString() as ParsedEvent<T>[keyof T];
    } else if (BN.isBN(value)) {
      parsedObj[key as keyof T] = value.toNumber() as ParsedEvent<T>[keyof T];
    } else {
      parsedObj[key as keyof T] = value as ParsedEvent<T>[keyof T];
    }
  }
  return parsedObj;
};

export const getParsedSocials = (socials: string) => {
  const [
    name = "",
    ticker = "",
    website = "",
    twitter = "",
    community = "",
    image = "",
    description = "",
  ] = socials.split("|");
  return { website, twitter, community, image, name, ticker, description };
};
