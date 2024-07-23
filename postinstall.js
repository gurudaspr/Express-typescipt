#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const packageJsonPath = path.join(projectDir, 'package.json');

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
    start: 'nodemon ./dist/server.js',
    server: 'nodemon ./src/server.ts'
  };

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with required dependencies and scripts.');
} else {
  console.error('package.json not found.');
}
