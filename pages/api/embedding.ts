import type {NextApiRequest, NextApiResponse} from 'next'
import {getDocumentLoader} from "@/utils/langchain/documentLoader";
import {getSplitterDocument} from "@/utils/langchain/splitter";
import {saveEmbeddings} from "@/utils/vector";
import {NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH} from "@/utils/app/const";
import { getKeyConfiguration } from '@/utils/app/configuration';

const folderPath = NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning embedding handler");
    const keyConfiguration = getKeyConfiguration(req);

    const { fileName, fileType } = req.body;
    const loader = getDocumentLoader(fileType, `${folderPath}/${fileName}.${fileType}`);
    const document = await loader.load();
    const splitDocuments = await getSplitterDocument(keyConfiguration, document);
    splitDocuments.map((doc) => {
        doc.metadata = { file_name : fileName };
    });
    try {
        await saveEmbeddings(keyConfiguration, splitDocuments);
        res.status(200).json({ message: 'save supabase embedding successes' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: (e as Error).message });
    }
}

export default handler;