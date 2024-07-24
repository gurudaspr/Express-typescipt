const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectDir = process.cwd();
const packageJsonPath = path.join(projectDir, "package.json");

console.log("Running postinstall script...");

// Ensure TypeScript is installed
try {
  execSync("npx tsc --version", { stdio: "inherit" });
} catch (error) {
  console.log("TypeScript is not installed. Installing TypeScript...");
  execSync("npm install typescript --save-dev", { stdio: "inherit" });
}

// Ensure TypeScript is initialized
if (!fs.existsSync(path.join(projectDir, "tsconfig.json"))) {
  execSync("npx tsc --init", { stdio: "inherit" });
}

// Ensure necessary directories exist
const directories = [
  "src",
  "src/controllers",
  "src/middlewares",
  "src/models",
  "src/routes",
  "src/utils",
  "dist",
];

directories.forEach((dir) => {
  const dirPath = path.join(projectDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, ".gitkeep"), "");
  }
});

// Ensure necessary files exist
const files = {
  ".env": `
# Environment variables
PORT=3000
  `,
  ".gitignore": `
node_modules
dist
.env
  `,
  "README.md": `
# Express TypeScript Template

This is a template for creating an Express application with TypeScript.
  `,
  "src/server.ts": `
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
  `,
  "tsconfig.json": `{
    "compilerOptions": {
      "target": "es2016",
      "module": "commonjs",
      "outDir": "./dist",
      "rootDir": "./",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "skipLibCheck": true,
      "strict": true
    }
  }`,
};

Object.keys(files).forEach((filePath) => {
  const fullPath = path.join(projectDir, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, files[filePath].trim());
  }
});

console.log("Postinstall script completed.");
