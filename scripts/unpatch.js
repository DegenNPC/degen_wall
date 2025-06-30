const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(__dirname, "../package.json");
const eslintConfigPath = path.resolve(__dirname, "../eslint.config.js");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

// 🔁 Restore @degen_wall monorepo configs
pkg.devDependencies ||= {};
pkg.devDependencies["@degen_wall/eslint-config"] = "workspace:*";
pkg.devDependencies["@degen_wall/prettier-config"] = "workspace:*";
pkg.devDependencies["@degen_wall/tsconfig"] = "workspace:*";
pkg.devDependencies["eslint"] = "catalog:";
pkg.devDependencies["prettier"] = "catalog:";

// 🔁 Sort devDependencies alphabetically
pkg.devDependencies = Object.fromEntries(
  Object.entries(pkg.devDependencies).sort(([a], [b]) => a.localeCompare(b)),
);

// 🔁 Restore top-level prettier config field
pkg.prettier = "@degen_wall/prettier-config";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("🔁 Restored and sorted package.json for pnpm.");

// 🔁 Restore ESLint config
if (fs.existsSync(eslintConfigPath)) {
  const restored = `
import baseConfig from "@degen_wall/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", "idl/**"],
  },
  ...baseConfig,
];
`.trimStart();

  fs.writeFileSync(eslintConfigPath, restored);
  console.log("🔁 Restored ESLint config.");
}
