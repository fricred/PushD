import { Ollama } from 'ollama-node';

const ollama = new Ollama();

export async function generateOrUpdateDocumentation(codeSnippet: string): Promise<string> {
  try {
    const output = await ollama.generate(codeSnippet);
    if (containsCodeBlock(output.output)) {
      return extractCodeSnippet(output.output);
    } else {
      return output.output;
    }
  } catch (error) {
    console.error(`Error updating documentation: ${error}`);
    return codeSnippet;
  }
}

export async function initialize(): Promise<void> {
  try {
    await ollama.setModel('openchat');
    const prompt = `Your task is to act as a code documentation assistant, focusing on adding function-level documentation to various programming language code snippets. Emphasize creating inline documentation that succinctly explains the function's purpose, its parameters, return values, and overall behavior. Adhere to a universal documentation style akin to JSDoc or JavaDoc, suitable for multiple programming languages. The key goal is to enhance code readability and comprehension, particularly for newcomers to the programming language. It is crucial to leave shebang lines (e.g., #!/usr/bin/env node) unaltered and without any added comments. Concentrate your documentation efforts on the functional aspects of the code, providing clear and informative descriptions that elucidate the code's functionality and structure.`;

    await ollama.setSystemPrompt(prompt);
  } catch (error) {
    console.error(`Error in initialization: ${error}`);
  }
}

function extractCodeSnippet(documentation: string): string {
  const codeSnippetRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/;
  const match = codeSnippetRegex.exec(documentation);

  if (match && match[1]) {
    return match[1];
  }

  return '';
}

function containsCodeBlock(documentation: string): boolean {
  const codeSnippetRegex = /```(?:\w+)?\s*[\s\S]*?\s*```/;
  return codeSnippetRegex.test(documentation);
}
