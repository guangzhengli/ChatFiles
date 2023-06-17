export const DEFAULT_SYSTEM_PROMPT =
    "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.";

export const CHAT_FILES_MAX_SIZE =
    parseInt(process.env.NEXT_PUBLIC_CHAT_FILES_MAX_SIZE || '') || 0;

export const NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH = process.env.NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH;

export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// if (!SUPABASE_KEY) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)

export const SUPABASE_URL = process.env.SUPABASE_URL
// if (!SUPABASE_URL) throw new Error(`Expected env var SUPABASE_URL`)

export const OPENAI_TYPE = process.env.OPENAI_TYPE; // Or OPENAI || AZURE_OPENAI

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;

export const AZURE_OPENAI_API_INSTANCE_NAME = process.env.AZURE_OPENAI_API_INSTANCE_NAME;

export const AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
export const AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME;

export const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;