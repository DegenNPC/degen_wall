const { execSync } = require("child_process");

// Step 1: Patch
console.log("🔧 Running patch...");
execSync("node scripts/patch.js", { stdio: "inherit" });

// Step 2: Install deps
console.log("📦 Running npm install...");
execSync("npm install --no-audit --no-fund", { stdio: "inherit" });

// Step 3: Unpatch
console.log("🔁 Running unpatch...");
execSync("node scripts/unpatch.js", { stdio: "inherit" });
