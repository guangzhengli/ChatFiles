import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {
    AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    AZURE_OPENAI_API_INSTANCE_NAME,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    OPENAI_API_KEY,
    OPENAI_TYPE
} from "@/utils/app/const";

const azureOpenAIEmbeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
});

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
});

export const getEmbeddings = async () => {
    if (OPENAI_TYPE === 'Azure') {
        return azureOpenAIEmbeddings;
    } else {
        return embeddings;
    }
}