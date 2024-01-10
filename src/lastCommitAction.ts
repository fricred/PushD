import shell from 'shelljs';
import { writeFileSync, readFileSync } from 'fs';
import { generateOrUpdateDocumentation, initialize } from './codeDocumentationAssistant'; // Import the function

const config = JSON.parse(readFileSync('config.json', 'utf-8'));
const includedDirectories: string[] = config.includedDirectories || [];
const allowedExtensions: string[] = config.allowedExtensions || [];
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

export function generateDocumentationForLastCommit() {
  console.log('Checking for uncommitted changes...');
  const uncommittedChanges = shell.exec('git status --porcelain', { silent: true }).trim();
  if (uncommittedChanges) {
    console.error(
      `${RED}Error: Uncommitted changes detected. Please commit your changes before generating documentation.${RESET}`
    );
    process.exit(1);
  }

  console.log('Generating documentation for files involved in the upcoming push...');

  const commitsToPush = shell
    .exec('git log --oneline @{upstream}..HEAD', { silent: true })
    .trim()
    .split('\n')
    .map((line) => line.split(' ')[0]);

  const changedFilesSet = new Set<string>();

  commitsToPush.forEach((commitHash) => {
    const filesInCommit = shell
      .exec(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, {
        silent: true,
      })
      .trim()
      .split('\n');

    filesInCommit.forEach((file) => {
      changedFilesSet.add(file);
    });
  });

  const changedFiles: string[] = Array.from(changedFilesSet);
  const filteredFiles = changedFiles.filter((file) => {
    const isIncludedDirectory = includedDirectories.some((dir: string) => file.startsWith(dir));
    const hasAllowedExtension = allowedExtensions.some((ext: string) => file.endsWith(ext));
    return isIncludedDirectory && hasAllowedExtension;
  });
  console.log('🚀 ~ filteredFiles.forEach ~ filteredFiles:', filteredFiles);
  initialize().then(async () => {
    console.log('Ollama initialized');
    const pLimit = (await import('p-limit')).default;
    const limit = pLimit(1);
    const promises = filteredFiles.map((file) =>
      limit(async () => {
        const content = readFileSync(file, 'utf-8');
        const updatedContent = await generateOrUpdateDocumentation(content);
        if (content.length < updatedContent.length) {
          writeFileSync(file, updatedContent.trim());
          console.log(`Documentation updated for ${file}`);
        } else {
          console.log(`No documentation updated for ${file}`);
        }
      })
    );
    Promise.all(promises).then(() => {
      console.log('All documentation generated.');
    });
  });
}
