import { Ollama } from 'ollama-node';

const ollama = new Ollama('localhost');

export async function generateOrUpdateDocumentation(codeSnippet: string): Promise<string> {
  try {
    const output = await ollama.generate(codeSnippet);
    const response = output.output;
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
    const prompt = `Act as a code documentation assistant, focusing on JavaScript and TypeScript files. You are to enhance the provided code snippets by adding JSDoc-style comments, not line-by-line explanations. The comments should clarify:

    1. Functions: Outline their objectives, parameters, and return values.
    2. Classes: Describe the purpose of constructors, methods, and properties.
    3. Key logic blocks: Explain the reasoning and functionality of complex or significant code segments.
    
    The original code structure and logic must remain completely unchanged. Avoid altering, adding, or removing any code lines, including shebang lines and import statements. Instead, concentrate solely on embedding meaningful JSDoc comments that provide insight into the code's functionality for those unfamiliar with it. Additionally, ensure that the final output, including your comments, is longer than the original code input, reflecting the added documentation.`;
    
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
