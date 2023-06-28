import {KeyConfiguration, LlamaIndex} from "@/types";
import {CHAT_FILES_MAX_SIZE} from "@/utils/app/const";
import {humanFileSize} from "@/utils/app/files";
import {useTranslation} from 'next-i18next';
import {v4 as uuidv4} from 'uuid';

interface Props {
    onIndexChange: (index: LlamaIndex) => void;
    keyConfiguration: KeyConfiguration;
    handleIsUploading: (isUploading: boolean) => void;
    handleIsUploadSuccess: (isUploadSuccess: boolean) => void;
    handleUploadError: (error: string) => void;
    handleKeyConfigurationValidation: () => boolean;
}

export const Upload = ({
    onIndexChange,
    keyConfiguration,
    handleIsUploading,
    handleIsUploadSuccess,
    handleUploadError,
    handleKeyConfigurationValidation,
}: Props) => {

    const { t } = useTranslation('sidebar');

    const handleFile = async (file: File) => {
        if (!handleKeyConfigurationValidation()) {
            return;
        }
        if (!validateFile(file)) {
            handleIsUploadSuccess(false);
            return;
        }

        handleIsUploading(true);

        try {
            await uploadFile(file);

            handleIsUploading(false);
            handleIsUploadSuccess(true)
        } catch (e) {
            console.error(e);
            handleUploadError((e as Error).message);
            handleIsUploading(false);
            handleIsUploadSuccess(false)
        }
    };

    const validateFile = (file: File) => {
        console.log(`upload file size: ${humanFileSize(file.size)}`);
        console.log(`file max size: ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
        if (CHAT_FILES_MAX_SIZE != 0 && file.size > CHAT_FILES_MAX_SIZE) {
            handleUploadError(`Please select a file smaller than ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
            return false;
        }

        console.log(`upload file type: ${file.name.split('.').pop()!}`);
        if (!validateFileType(file.name.split('.').pop()!)) {
            handleUploadError(`Please upload file of these types: ${supportFileType}`);
            return false;
        }

        return true;
    };

    const supportFileType = "pdf, epub, docx, txt, md, csv, json, zip";

    function validateFileType(fileType: string): boolean {
        switch (fileType) {
            case "pdf":
            case "epub":
            case "docx":
            case "txt":
            case "md":
            case "csv":
            case "zip":
            case "json":
                return true;
            default:
                return false;
        }
    }

    const uploadFile = async (file: File) => {
        const fileName = uuidv4();
        const fileType = file.name.split('.').pop()!;

        const formData = new FormData();
        formData.append("file", file);

        await fetch(`/api/files?fileName=${fileName}.${fileType}`, {
            method: 'POST',
            body: formData
        }).then(res => {
            if (!res.ok) {
                console.log("save file failed:", fileName);
                throw new Error(`save file failed:, ${fileName}`);
            }
        }).then(async (data: any) => {
            console.log("save file success:", fileName);
            await saveEmbeddings(fileName, fileType);
            onIndexChange({indexName: fileName, indexType: fileType.split('.').pop()!});
        });
    }

    const saveEmbeddings = async (fileName: string, fileType: string) => {
        await fetch('/api/embedding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-type': keyConfiguration.apiType ?? '',
                'x-api-key': keyConfiguration.apiKey ?? '',
                'x-api-model': keyConfiguration.apiModel ?? '',
                'x-azure-api-key': keyConfiguration.azureApiKey ?? '',
                'x-azure-instance-name': keyConfiguration.azureInstanceName ?? '',
                'x-azure-api-version': keyConfiguration.azureApiVersion ?? '',
                'x-azure-deployment-name': keyConfiguration.azureDeploymentName ?? '',
                'x-azure-embedding-deployment-name': keyConfiguration.azureEmbeddingDeploymentName ?? '',
            },
            body: JSON.stringify({
                fileName: fileName,
                fileType: fileType,
            })
        }).then(async (res) => {
            if (!res.ok) {
                const message = await res.text();
                console.log('save embedding failed: ', message);
                throw new Error(`save embedding failed: ' ${message}`);
            }
        });
    }

    const deleteFile = async (fileTempName: string) => {

        await fetch(`/api/files?fileName=${fileTempName}`, {
            method: 'DELETE'
        }).then(res => res.json())
            .then((data: any) => {
                // onIndexChange({indexName: data.indexName, indexType: data.indexType});
                console.log("import file index json name:", data);
            });
    }

    return (
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file"
                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{t('Click to upload')}</span> {t('or drag and drop.')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('File supported types: TXT, PDF, EPUB, Markdown, Zip...')}</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]).then(r => console.log("upload file success and save embedding success"));
                    }
                }}/>
            </label>
        </div>
    );
}