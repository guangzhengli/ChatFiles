import {
    AZURE_OPENAI_API_DEPLOYMENT_NAME,
    AZURE_OPENAI_API_INSTANCE_NAME,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    OPENAI_API_KEY,
    OPENAI_TYPE
} from "@/utils/app/const";
import {OpenAIChat} from "langchain/llms/openai";

const azureOpenAIModel = new OpenAIChat({
    temperature: 0.9,
    azureOpenAIApiKey: AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});

const openAIModel = new OpenAIChat({
    temperature: 0.9,
    openAIApiKey: OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
});


export const getModel = async () => {
    if (OPENAI_TYPE === 'Azure') {
        return azureOpenAIModel;
    } else {
        return openAIModel;
    }
}