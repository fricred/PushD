// codeDocumentationAssistant.ts

import { Ollama } from 'ollama-node';

// Initialize the Ollama client
const ollama = new Ollama();
// Define the code snippet to be included in the system prompt
const predefinedCodeSnippet = `
\`\`\`typescript
import { helloWorld } from './index';

test('helloWorld returns "Hello World"', () => {
  expect(helloWorld()).toBe('Hello World edited');
});

\`\`\`
`;
/**
 * Generate or update documentation for the provided code snippet.
 * @param {string} codeSnippet - The code snippet to document.
 * @returns {string} - The updated documentation.
 */
export async function generateOrUpdateDocumentation(codeSnippet: string): Promise<string> {
  try {
    const output = await ollama.generate(codeSnippet);
    console.log('🚀 ~ generateOrUpdateDocumentation ~ output:', output);
    if (containsCodeBlock(output.output)) {
      return extractCodeSnippet(output.output);
    } else {
      return output.output;
    }
  } catch (error) {
    console.error(`Error updating documentation: ${error}`);
    return codeSnippet; // Return the original content in case of an error
  }
}

export async function initialize(): Promise<void> {
  try {
    // Set the Ollama model and parameters as needed
    await ollama.setModel('codellama');
    await ollama.setSystemPrompt(
      `I want you to act as a code documentation assistant who directly incorporates inline comments into the provided code snippets. You will not provide any additional explanations or external commentary. Focus solely on updating the given code with clear, concise, and informative comments that explain the functionality and logic within the code itself. Ensure that your comments enhance the readability and understanding of the code, especially for those who may be new to the programming language in use.

Here is an example code snippet:
${predefinedCodeSnippet}`
    );
  } catch (error) {
    console.error(`Error in initialization: ${error}`);
  }
}
/**
 * Extracts the code snippet from the Ollama-generated documentation.
 * @param {string} documentation - The Ollama-generated documentation.
 * @returns {string} - The extracted code snippet or an empty string if no code block is found.
 */
function extractCodeSnippet(documentation: string): string {
  const codeSnippetRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/; // Enhanced regular expression to match code blocks with optional language identifiers
  const match = codeSnippetRegex.exec(documentation);

  if (match && match[1]) {
    return match[1]; // Return the code snippet inside the code block
  }

  return ''; // Return an empty string if no code snippet is found
}

/**
 * Checks if the provided documentation contains a code block.
 * @param {string} documentation - The Ollama-generated documentation.
 * @returns {boolean} - True if a code block is found, false otherwise.
 */
function containsCodeBlock(documentation: string): boolean {
  const codeSnippetRegex = /```(?:\w+)?\s*[\s\S]*?\s*```/; // Enhanced regular expression to match code blocks with optional language identifiers
  return codeSnippetRegex.test(documentation);
}
