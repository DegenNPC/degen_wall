import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// File path for package.json
const packageJsonPath = "./package.json";

// Step 0: Parse command-line argument
const args = process.argv.slice(2);
const scriptArg = args[0]; // e.g. cleanup.ts

// Step 1: Read and modify package.json to remove "type": "module"
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

let modified = false;

if (packageJson.type === "module") {
  delete packageJson.type;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
  console.log('"type": "module" removed from package.json');
  modified = true;
} else {
  console.log('"type": "module" not found in package.json');
}

// Step 2: Run the script or test suite
try {
  if (scriptArg) {
    if (!scriptArg.endsWith(".ts")) {
      console.error("Provided argument must be a .ts file");
      process.exit(1);
    }
    const resolvedScriptPath = resolve("tests", scriptArg);
    console.log(`Running ${scriptArg}...`);
    execSync(`ts-node --project tsconfig.test.json ${resolvedScriptPath}`, {
      stdio: "inherit",
    });
  } else {
    console.log("Running test suite...");
    execSync(
      "npx ts-mocha --project tsconfig.test.json tests/test.ts --timeout 10000",
      { stdio: "inherit" },
    );
  }
} catch (error) {
  console.error("Error during execution:", error);
}

// Step 3: Restore "type": "module" if we removed it
if (modified) {
  packageJson.type = "module";
  writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
    "utf8",
  );
  console.log('"type": "module" re-added to package.json');
}
