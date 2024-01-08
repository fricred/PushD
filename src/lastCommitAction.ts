// lastCommitAction.ts

import shell from 'shelljs';
import { readFileSync } from 'fs';

// Load the configuration from the config.json file
const config = JSON.parse(readFileSync('config.json', 'utf-8'));

// Define default includedDirectories and allowedExtensions arrays
const includedDirectories: string[] = config.includedDirectories || [];
const allowedExtensions: string[] = config.allowedExtensions || [];

export function generateDocumentationForLastCommit() {
  console.log('Generating documentation for files involved in the last commit...');

  // Get the list of changed files in the last commit using git log
  const lastCommitHash = shell.exec('git rev-parse HEAD', { silent: true }).trim();

  const changedFiles = shell
    .exec(`git diff-tree --no-commit-id --name-only -r ${lastCommitHash}`, {
      silent: true,
    })
    .trim()
    .split('\n');

  // Filter files based on includedDirectories and allowedExtensions
  const filteredFiles = changedFiles.filter((file) => {
    // Check if the file is in one of the included directories
    const isIncludedDirectory = includedDirectories.some((dir: string) => file.startsWith(dir));

    // Check if the file has an allowed extension
    const hasAllowedExtension = allowedExtensions.some((ext: string) => file.endsWith(ext));

    return isIncludedDirectory && hasAllowedExtension;
  });
  console.log(
    '🚀 ~ file: lastCommitAction.ts:53 ~ filteredFiles.forEach ~ filteredFiles:',
    filteredFiles
  );
  /*filteredFiles.forEach((file) => {
    // Read the file content
    const content = readFileSync(file, 'utf-8');

    // Add the header text
    const updatedContent = `#test\n${content}`;

    // Write the updated content back to the file
    writeFileSync(file, updatedContent);
  });*/

  console.log('Documentation generated for files involved in the last commit.');
}
