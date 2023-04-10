export const DEFAULT_SYSTEM_PROMPT =
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const CHAT_FILES_SERVER_HOST =
    process.env.CHAT_FILES_SERVER_HOST || 'http://127.0.0.1:5000';

export const CHAT_FILES_MAX_SIZE =
    parseInt(process.env.NEXT_PUBLIC_CHAT_FILES_MAX_SIZE || '') || 0;
  