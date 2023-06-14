import { KeyConfiguration, ModelType } from "@/types";
import { OpenAIChat } from "langchain/llms/openai";
import {CallbackManager} from "langchain/callbacks";
import {NextApiResponse} from "next";

export const getModel = async (keyConfiguration: KeyConfiguration, res: NextApiResponse) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
            callbacks: getCallbackManager(res),
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            openAIApiKey: keyConfiguration.apiKey,
            callbacks: getCallbackManager(res),
        });
    }
}

export const getChatModel = async (keyConfiguration: KeyConfiguration, res: NextApiResponse) => {
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            azureOpenAIApiKey: keyConfiguration.azureApiKey,
            azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
            azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
            azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
            callbacks: getCallbackManager(res),
        });
    } else {
        return new OpenAIChat({
            temperature: 0.9,
            streaming: true,
            openAIApiKey: keyConfiguration.apiKey,
            callbacks: getCallbackManager(res),
        });
    }
}

export const getCallbackManager = (res: NextApiResponse) => {
    return CallbackManager.fromHandlers({
        handleLLMNewToken: async (token: string, runId: string, parentRunId?: string) =>{
            res.write(token);
        },
        handleLLMEnd: async () => {
            res.end();
        },
    })
}