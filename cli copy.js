#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const packageJsonPath = path.join(projectDir, 'package.json');

console.log('Setting up your Express TypeScript project...');

// Define directories and files to create
const directories = [
  'src',
  'src/controllers',
  'src/middlewares',
  'src/models',
  'src/routes',
  'src/utils',
  'dist'
];

const files = {
  '.env': `
# Environment variables
PORT=3000
  `,
  '.gitignore': `
node_modules
dist
.env
  `,
  'README.md': `
# Express TypeScript Template

This is a template for creating an Express application with TypeScript.
  `,
  'src/server.ts': `
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
  'tsconfig.json': `{
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
  }`
};

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(projectDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
  }
});

// Create files
Object.keys(files).forEach(filePath => {
  const fullPath = path.join(projectDir, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, files[filePath].trim());
  }
});

// Run tsc --init to generate tsconfig.json if it doesn't exist
if (!fs.existsSync(path.join(projectDir, 'tsconfig.json'))) {
  execSync('npx tsc --init', { stdio: 'inherit' });
}

// Modify the generated tsconfig.json file
const tsconfigPath = path.join(projectDir, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  let tsconfig = fs.readFileSync(tsconfigPath, 'utf8');
  tsconfig = tsconfig.replace(/"strict": true,/, `"strict": true,
  "skipLibCheck": true,
  "esModuleInterop": true,
  "forceConsistentCasingInFileNames": true,
  "rootDir": "./",
  "outDir": "./dist",`);
  fs.writeFileSync(tsconfigPath, tsconfig);
}

// Update package.json with dependencies, devDependencies, and scripts
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add dependencies and devDependencies
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.dependencies = {
    ...packageJson.dependencies,
    express: 'latest',
    nodemon: 'latest',
    dotenv: 'latest'
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    '@types/express': 'latest',
    '@types/node': 'latest',
    'ts-node': 'latest',
    typescript: 'latest'
  };

  // Add scripts
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts = {
    ...packageJson.scripts,
    build: 'tsc --build',
    start: 'nodemon ./dist/src/server.js',
    server: 'nodemon ./src/server.ts'
  };

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with required dependencies and scripts.');
} else {
  console.error('package.json not found.');
}

console.log('Project structure created successfully.');
