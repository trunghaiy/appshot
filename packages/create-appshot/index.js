#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2];

if (!projectName) {
  console.log("Usage: npx create-appshot <project-name>");
  console.log("");
  console.log("Example:");
  console.log("  npx create-appshot my-video");
  process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
  console.error(
    "Invalid project name. Use only letters, numbers, hyphens, and underscores."
  );
  process.exit(1);
}

const projectPath = path.resolve(projectName);

if (fs.existsSync(projectPath)) {
  console.error(`Directory "${projectName}" already exists.`);
  process.exit(1);
}

const templateDir = path.join(__dirname, "templates", "default");

console.log(`Creating ${projectName}...`);
console.log("");

fs.cpSync(templateDir, projectPath, { recursive: true });

const gitignorePath = path.join(projectPath, "_gitignore");
const gitignoreDest = path.join(projectPath, ".gitignore");
if (fs.existsSync(gitignorePath)) {
  fs.renameSync(gitignorePath, gitignoreDest);
}

const pkgPath = path.join(projectPath, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = projectName;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log("Installing dependencies...");
console.log("");

try {
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });
} catch {
  console.error("");
  console.error("npm install failed. You can retry manually:");
  console.error(`  cd ${projectName} && npm install`);
  process.exit(1);
}

console.log("");
console.log(`Done! Created ${projectName} at ${projectPath}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${projectName}`);
console.log("  npm run dev        # Preview in browser");
console.log("  npm run build      # Render to MP4");
console.log("");
console.log("Edit src/app-config.ts to customize your video.");
