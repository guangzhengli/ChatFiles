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
    try {
        await saveEmbeddings(splitDocuments);
        res.status(200).json({ message: 'save supabase embedding successes' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: (e as Error).message });
    }
}

export default handler;