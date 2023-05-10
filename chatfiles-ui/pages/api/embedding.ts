import type {NextApiRequest, NextApiResponse} from 'next'
import {getDocumentLoader} from "@/utils/langchain/DocumentLoader";
import {EmbeddingCreateRequest} from "@/types/embedding";

export const config = {
    api: {
        bodyParser: false,
    }
};

const folderPath = 'public/uploads';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning embedding handler");
    const { fileName, fileType } = (await req.body.json()) as EmbeddingCreateRequest
    const loader = getDocumentLoader(fileType, `${folderPath}/${fileName}.${fileType}`);


}

export default handler;