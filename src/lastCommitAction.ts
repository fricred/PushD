// lastCommitAction.ts

import shell from 'shelljs';
import { writeFileSync, readFileSync } from 'fs';
import { generateOrUpdateDocumentation, initialize } from './codeDocumentationAssistant'; // Import the function
// Load the configuration from the config.json file
const config = JSON.parse(readFileSync('config.json', 'utf-8'));

// Define default includedDirectories and allowedExtensions arrays
const includedDirectories: string[] = config.includedDirectories || [];
const allowedExtensions: string[] = config.allowedExtensions || [];

const RED = '\x1b[31m'; // Red color
const RESET = '\x1b[0m'; // Reset to default color

export function generateDocumentationForLastCommit() {
  console.log('Checking for uncommitted changes...');

  // Check if there are uncommitted changes
  const uncommittedChanges = shell.exec('git status --porcelain', { silent: true }).trim();
  if (uncommittedChanges) {
    console.error(
      `${RED}Error: Uncommitted changes detected. Please commit your changes before generating documentation.${RESET}`
    );
    process.exit(1);
  }
  console.log('Generating documentation for files involved in the upcoming push...');
  // Get the list of all local commits that will be pushed
  const commitsToPush = shell
    .exec('git log --oneline @{upstream}..HEAD', { silent: true })
    .trim()
    .split('\n')
    .map((line) => line.split(' ')[0]);

  const changedFilesSet = new Set<string>(); // Use a Set to store unique file names

  // Collect the list of changed files for each commit
  commitsToPush.forEach((commitHash) => {
    const filesInCommit = shell
      .exec(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, {
        silent: true,
      })
      .trim()
      .split('\n');

    filesInCommit.forEach((file) => {
      // Add the file to the Set to ensure uniqueness
      changedFilesSet.add(file);
    });
  });

  // Convert the Set back to an array
  const changedFiles: string[] = Array.from(changedFilesSet);

  // Filter files based on includedDirectories and allowedExtensions
  const filteredFiles = changedFiles.filter((file) => {
    // Check if the file is in one of the included directories
    const isIncludedDirectory = includedDirectories.some((dir: string) => file.startsWith(dir));

    // Check if the file has an allowed extension
    const hasAllowedExtension = allowedExtensions.some((ext: string) => file.endsWith(ext));

    return isIncludedDirectory && hasAllowedExtension;
  });

  initialize().then(() => {
    console.log('Ollama initialized');

    filteredFiles.forEach((file) => {
      console.log('🚀 ~ filteredFiles.forEach ~ file:', file);
      // Read the file content
      const content = readFileSync(file, 'utf-8');

      // Call the function from codeDocumentationAssistant.ts to update documentation
      generateOrUpdateDocumentation(content).then((updatedContent) => {
        // Write the updated content back to the file
        writeFileSync(file, updatedContent);
      });
    });

    console.log('Documentation generated for files involved in the upcoming push.');
  });
}
