const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(__dirname, "../package.json");
const eslintConfigPath = path.resolve(__dirname, "../eslint.config.js");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

// ❌ Remove @degen_wall configs
delete pkg.devDependencies["@degen_wall/eslint-config"];
delete pkg.devDependencies["@degen_wall/prettier-config"];
delete pkg.devDependencies["@degen_wall/tsconfig"];
delete pkg.prettier;

// ✅ Add fallback versions
pkg.devDependencies["eslint"] = "^8.55.0";
pkg.devDependencies["prettier"] = "^3.2.5";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(
  "✅ Patched package.json for npm (removed @degen_wall configs, added fallback Prettier).",
);

// 🔧 Disable ESLint config
if (fs.existsSync(eslintConfigPath)) {
  const original = fs.readFileSync(eslintConfigPath, "utf-8");
  const modified = original
    .replace(
      /^import .*@degen_wall\/eslint-config.*$/m,
      "// [npm-patch] import removed",
    )
    .replace(
      /^export default \[([\s\S]*?)\];/m,
      "// [npm-patch] export disabled",
    );

  fs.writeFileSync(eslintConfigPath, modified);
  console.log("✅ ESLint config import/export commented out.");
}
