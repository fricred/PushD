import { Ollama } from 'ollama-node';

const ollama = new Ollama('192.168.1.3');

export async function generateOrUpdateDocumentation(codeSnippet: string): Promise<string> {
  let temporaryCodeSnippet = codeSnippet;
  try {
    if (containsCodeBlock(codeSnippet)) {
      temporaryCodeSnippet = codeSnippet.replaceAll('```', '{tripleBacktick}');
    }
    const output = await ollama.generate(temporaryCodeSnippet);
    const response = output.output.replaceAll('{tripleBacktick}', '```');
    if (containsCodeBlock(response)) {
      return extractCodeSnippet(response);
    } else {
      return response;
    }
  } catch (error) {
    console.error(`Error updating documentation: ${error}`);
    return codeSnippet;
  }
}

export async function initialize(): Promise<void> {
  try {
    await ollama.setModel('openchat');
    const prompt = `As a code documentation assistant, your task is to add block-level JSDoc-style documentation to JavaScript and TypeScript files, with specific constraints. Firstly, do not modify or comment on the shebang line #!/usr/bin/env node - this line must remain untouched. Secondly, avoid adding comments to import statements. Focus your documentation on the core functional parts of the code, such as key functions, class definitions, and significant logic blocks. Your documentation should succinctly describe the purpose, parameters, and functionality of these elements. Remember, the aim is to enhance understanding and readability for those unfamiliar with the codebase, without altering the original code structure or adding line-by-line commentary.`;

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
