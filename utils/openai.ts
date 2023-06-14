import { KeyConfiguration, ModelType } from "@/types";
import { OpenAIChat } from "langchain/llms/openai";
import {CallbackManager} from "langchain/callbacks";

export const getModel = async (keyConfiguration: KeyConfiguration) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            openAIApiKey: keyConfiguration.apiKey,
        });
    }
}

export const getChatModel = async (keyConfiguration: KeyConfiguration, encoder: TextEncoder, writer: WritableStreamDefaultWriter) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
            callbacks: CallbackManager.fromHandlers({
                handleLLMNewToken: async (token: string, runId: string, parentRunId?: string) =>{
                    await writer.ready;
                    await writer.write(encoder.encode(token));
                },
                handleLLMEnd: async () => {
                    await writer.ready;
                    await writer.close();
                },
                handleLLMError: async (e) => {
                    await writer.ready;
                    await writer.abort(e);
                },
            })
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            openAIApiKey: keyConfiguration.apiKey,
            callbacks: CallbackManager.fromHandlers({
                handleLLMNewToken: async (token: string, runId: string, parentRunId?: string) =>{
                    await writer.ready;
                    await writer.write(encoder.encode(token));
                },
                handleLLMEnd: async () => {
                    await writer.ready;
                    await writer.close();
                },
                handleLLMError: async (e) => {
                    await writer.ready;
                    await writer.abort(e);
                },
            })
        });
    }
}