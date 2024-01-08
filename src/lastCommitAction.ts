// lastCommitAction.ts
import shell from 'shelljs';
import { writeFileSync } from 'fs';

export function generateLastCommitDocs() {
  console.log('Generating documentation for the last commit...');

  // Get the hash of the last commit
  const lastCommitHash = shell.exec('git rev-parse HEAD', { silent: true }).trim();

  // List all files in the project (modify the path as needed)
  const files = shell.ls('-A'); // List all files in the current directory

  // Add the header to each file
  files.forEach((file) => {
    // Read the file content
    const content = shell.cat(file);

    // Add the header text
    const updatedContent = `#test\n${content}`;

    // Write the updated content back to the file
    writeFileSync(file, updatedContent);
  });

  console.log('Documentation generated for the last commit.');
}
