#!/usr/bin/env node
import { program } from 'commander';

program.version('1.0.0').description('PushD - A tool for generating documentation');

program
  .command('last-commit')
  .description('Generate documentation for the last commit')
  .action(() => {
    console.log('Generating documentation for the last commit...');
    // Placeholder for future logic
  });

program
  .command('all')
  .description('Generate documentation for the entire project')
  .action(() => {
    console.log('Generating documentation for the entire project...');
    // Placeholder for future logic
  });

program.parse(process.argv);
