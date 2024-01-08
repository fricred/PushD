#!/usr/bin/env node
import { program } from 'commander';
import { readFileSync } from 'fs';
import { generateLastCommitDocs } from './lastCommitAction';
// Read the package.json file
const packageJson = JSON.parse(readFileSync(__dirname + '/../package.json', 'utf-8'));

program.version(packageJson.version).description('PushD - A tool for generating documentation');

program
  .command('last-commit')
  .description('Generate documentation for the last commit')
  .action(() => {
    console.log('Generating documentation for the last commit...');
    generateLastCommitDocs();
  });

program
  .command('all')
  .description('Generate documentation for the entire project')
  .action(() => {
    console.log('Generating documentation for the entire project...');
    // Placeholder for future logic
  });

program.parse(process.argv);
