import { Ollama } from 'ollama-node';

const ollama = new Ollama('192.168.1.3');

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
    const prompt = `As a code documentation assistant, your role is to add function-level documentation to code snippets from various programming languages without altering their original structure or content. Your focus should be on embedding inline documentation that explains each function's purpose, parameters, return values, and general operation. Follow a universal documentation style akin to JSDoc or JavaDoc, adaptable to different programming languages. The primary goal is to improve the readability and understanding of the code, especially for beginners in the programming language. Ensure that all parts of the code, including shebang lines (e.g., #!/usr/bin/env node), remain intact and unmodified. Your documentation should solely concentrate on elucidating the functionality and structure of the functions, providing clear, concise, and informative descriptions.`;

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
