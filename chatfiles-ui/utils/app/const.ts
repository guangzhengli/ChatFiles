export const DEFAULT_SYSTEM_PROMPT =
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const CHAT_FILES_SERVER_HOST =
    process.env.CHAT_FILES_SERVER_HOST || 'http://127.0.0.1:5000';

export const CHAT_FILES_MAX_SIZE =
  getIntFromEnv('CHAT_FILES_MAX_SIZE', 0);

function getIntFromEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new Error(`Invalid value for environment variable ${name}: ${value}`);
  }
  return parsedValue;
}
  