import { KeyConfiguration, ModelType } from "@/types";
import { OpenAIChat } from "langchain/llms/openai";

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