import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import fetch from "node-fetch";
import FormData from 'form-data';
import { IncomingForm } from 'formidable';
import { CHAT_FILES_SERVER_HOST } from "@/utils/app/const";
// import { UploadedFile } from '@/types';

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning POST handler");

    const fData = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        const form = new IncomingForm({
            multiples: true,
        });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

    if (fData?.files.files) {
        const uploadedFiles = Array.isArray(fData.files.files) ? fData.files.files : [fData.files.files];
        const formData = new FormData();

        uploadedFiles.forEach((uploadFile: any) => {
            formData.append('files', fs.createReadStream(uploadFile.filepath), uploadFile.originalFilename);
        });
        try {
            const response = await fetch(`${CHAT_FILES_SERVER_HOST}/upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            res.status(200).json(result);
        } catch (e) {
            console.log('ERRRRR_____==', e)
        }

    }
    else {
        res.status(400).json({ message: 'No files were uploaded' });
    }
};
export default handler;
