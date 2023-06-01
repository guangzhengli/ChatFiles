import type {NextApiRequest, NextApiResponse} from 'next'
import {getDocumentLoader} from "@/utils/langchain/documentLoader";
import {EmbeddingCreateRequest} from "@/types/embedding";
import {getSplitterDocument} from "@/utils/langchain/splitter";
import {saveEmbeddings} from "@/utils/vector";

// export const config = {
//     api: {
//         bodyParser: false,
//     }
// };

const folderPath = 'public/uploads';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning embedding handler");
    const { fileName, fileType } = req.body;
    const loader = getDocumentLoader(fileType, `${folderPath}/${fileName}.${fileType}`);
    const document = await loader.load();
    const splitDocuments = await getSplitterDocument(document);
    splitDocuments.map((doc) => {
        doc.metadata = { fileName: fileName };
    });
    await saveEmbeddings(splitDocuments);
    return fileName;
}

export default handler;