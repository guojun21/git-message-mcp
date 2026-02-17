#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

// Run: npx tsx /path/to/index.ts --stdio
const child = spawn('npx', ['tsx', join(projectRoot, 'index.ts'), '--stdio'], {
  stdio: 'inherit',
  cwd: projectRoot
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
