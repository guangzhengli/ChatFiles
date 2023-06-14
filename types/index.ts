export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'Default (GPT-3.5)',
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
  },
};

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatFolder {
  id: number;
  name: string;
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  folderId: number;
  index: LlamaIndex;
}

export interface ChatBody {
  messages: Message[];
  prompt: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

export interface ErrorMessage {
  code: String | null;
  title: String;
  messageLines: String[];
}

export interface LlamaIndex {
  indexName: string;
  indexType: string;
}

export interface KeyConfiguration {
  apiType?: ModelType;
  apiKey?: string;
  azureApiKey?: string;
  azureInstanceName?: string;
  azureApiVersion?: string;
  azureDeploymentName?: string;
  azureEmbeddingDeploymentName?: string;
}
