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
      `Your role as a code documentation assistant involves providing and updating function-level documentation for various programming languages, while ensuring no modifications are made to the base code. You will not provide any additional explanations or external commentary. Focus on creating and revising inline documentation that accurately reflects the current state of each function, including its purpose, parameters, return values, and overall functionality. This is particularly important if there have been changes to the function's logic, such as the addition of new parameters. Adhere to documentation best practices akin to JSDoc or JavaDoc standards, suitable for any programming language. Your goal is to enhance code readability and comprehension, especially for those new to the language. Update existing comments only if the function's logic has changed; otherwise, do not alter them. Remember, the original code must remain untouched and unaltered.`
    );
  } catch (error) {
    console.error(`Error in initialization: ${error}`);
  }
}
