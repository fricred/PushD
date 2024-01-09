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
      `I want you to act as a code documentation assistant who directly incorporates inline comments into the provided code snippets. You will not provide any additional explanations or external commentary. Focus solely on updating the given code with clear, concise, and informative comments that explain the functionality and logic within the code itself. Ensure that your comments enhance the readability and understanding of the code, especially for those who may be new to the programming language in use.`
    );
  } catch (error) {
    console.error(`Error in initialization: ${error}`);
  }
}
