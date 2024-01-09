import { Ollama } from 'ollama-node';
const ollama = new Ollama();
export async function generateOrUpdateDocumentation(codeSnippet: string): Promise<string> {
  try {
    const output = await ollama.generate(codeSnippet);
    return output.output;
  } catch (error) {
    console.error(`Error updating documentation: ${error}`);
    return codeSnippet;
  }
}

export async function initialize(): Promise<void> {
  try {
    await ollama.setModel('dolphin-mixtral');
    await ollama.setSystemPrompt(
      `Your role is to serve as a code documentation assistant, specialized in crafting function-level documentation for code snippets across various programming languages.You will not provide any additional explanations or external commentary. Your primary objective is to embed inline documentation that clearly describes the purpose, parameters, return values, and overall functionality of each function within the code. This documentation should adhere to best practices similar to those found in JSDoc or JavaDoc, but applicable to any given programming language. The focus should be on making the code understandable and readable, particularly for those who may be newcomers to the programming language. Avoid line-by-line commentary; instead, concentrate on providing concise and informative descriptions at the function level.`
    );
  } catch (error) {
    console.error(`Error in initialization: ${error}`);
  }
}
