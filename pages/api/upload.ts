import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { IncomingForm } from 'formidable';
import { CHAT_FILES_SERVER_HOST, OPENAI_API_HOST } from '@/utils/app/const';
import { LlamaIndex } from '@/types';
import PDFParser from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosResponse } from 'axios';
import { PineconeClient } from "@pinecone-database/pinecone";

let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT as string,
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  try {
    const form = new IncomingForm({
      multiples: false,
      uploadDir: 'pdf'
    });

    // Form.parse will automatically save the file to the temporary directory.
    const fData = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      },
    );

    if (fData?.files.file) {
      const uploadedFile = fData.files.file;

      const fileBuffer = fs.readFileSync(uploadedFile.filepath);
      const pdfText = await PDFParser(fileBuffer);

      const paragraphs = pdfText.text.split(/\n\s*\n/);
      const splitedText = paragraphs.filter(paragraph => paragraph.trim().length > 0);
      
      let embeddings = [];

      for (const snippet of splitedText) {
        try {
          const response: AxiosResponse = await axios.post(
            `${OPENAI_API_HOST}/v1/embeddings`,
            {
              model:'text-embedding-ada-002',
              input: snippet,
            },
            {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              }
            },
          );

          embeddings.push(response.data)
        } catch (err) {
          console.error(`Embedding Error: ${err}`)
        }
      }

      const uniqueNameSpace = uuidv4();
      const upsertRequest = {
        vectors: embeddings.map((item) => ({
          id: uuidv4(),
          values: item.data[0].embedding,
          metadata: {
            genre: "pdf"
          }
        })),
        namespace: uniqueNameSpace
      };

      const index = pinecone.Index(process.env.PINECONE_INDEX as string);
      const upsertResponse = await index.upsert({ upsertRequest });

      console.log(upsertResponse)
      // Delete the temporary file after processing
      fs.unlink(uploadedFile.filepath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    } else {
      res.status(400).send('No file was found in the request.');
    }
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).send('An error occurred while processing the file upload.');
  }
};

export default handler;
