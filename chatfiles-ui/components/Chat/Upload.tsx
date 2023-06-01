import { LlamaIndex } from '@/types';
import { CHAT_FILES_MAX_SIZE } from '@/utils/app/const';
import { humanFileSize } from '@/utils/app/files';
import { useTranslation } from 'next-i18next';

interface Props {
  onIndexChange: (index: LlamaIndex) => void;
  handleIsUploading: (isUploading: boolean) => void;
  handleIsUploadSuccess: (isUploadSuccess: boolean) => void;
  handleUploadError: (error: string) => void;
}

export const Upload = ({
  onIndexChange,
  handleIsUploading,
  handleIsUploadSuccess,
  handleUploadError,
}: Props) => {
  const { t } = useTranslation('sidebar');

  const handleFiles = async (files: FileList) => {
    let allFilesValid = true;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validateFile(file)) {
        allFilesValid = false;
        continue;
      }
      formData.append('file', file);
    }

    if (!allFilesValid) {
      handleIsUploadSuccess(false);
      return;
    }

    handleIsUploading(true);

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data: LlamaIndex | LlamaIndex[]) => {
          const dataArray = Array.isArray(data) ? data : [data];
          dataArray.forEach((item, index) => {
            onIndexChange({
              indexName: item.indexName,
              indexType: item.indexType,
              fileNames: item.fileNames,
            });
            console.log('import file index json name:', item);
          });
        });

      handleIsUploading(false);
      handleIsUploadSuccess(true);
    } catch (e) {
      console.error(e);
      handleUploadError((e as Error).message);
      handleIsUploading(false);
      handleIsUploadSuccess(false);
    }
  };

  const validateFile = (file: File) => {
    console.log(`select a file size: ${humanFileSize(file.size)}`);
    console.log(`file max size: ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
    if (CHAT_FILES_MAX_SIZE != 0 && file.size > CHAT_FILES_MAX_SIZE) {
      handleUploadError(
        `Please select a file smaller than ${humanFileSize(
          CHAT_FILES_MAX_SIZE,
        )}`,
      );
      return false;
    }
    return true;
  };

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="mb-3 h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{t('Click to upload')}</span>{' '}
            {t('or drag and drop.')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('File supported types: TXT, PDF, EPUB, Markdown, Zip...')}
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length) {
              handleFiles(e.target.files);
            }
          }}
        />
      </label>
    </div>
  );
};
