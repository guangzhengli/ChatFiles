import { useState } from 'react';

export default function ChatFilesImport() {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedFiles(e.target.files);
    }


    return (
        <div className="flex flex-col">
            <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
                Import File
            </label>
            <input type="file" className="block w-full text-sm text-slate-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-violet-50 file:text-violet-700
                                          hover:file:bg-violet-100"
                   onChange={handleFileChange} multiple />
        </div>
    );
}