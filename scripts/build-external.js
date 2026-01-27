const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
//const externalPath = path.resolve("path1"); // <-- change this
const externalPath = path.resolve("./../../FullStackOpen_Palautusrepositorio/osa3/PhonebookFrontend"); // <-- change this
const localDist = path.join(rootDir, "dist");
const externalDist = path.join(externalPath, "dist");

function run(cmd, cwd = rootDir) {
  execSync(cmd, { stdio: "inherit", cwd });
}

// 1. Delete local dist
if (fs.existsSync(localDist)) {
  fs.rmSync(localDist, { recursive: true, force: true });
}

// 2. Build in external folder
run("npm run build --prod", externalPath);

// 3. Copy dist back
fs.cpSync(externalDist, localDist, { recursive: true });

console.log("✅ Build completed and dist copied successfully");
