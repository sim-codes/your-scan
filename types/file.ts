export interface FileTypes {
    id: string;
    name: string;
    date: string;
    content: string;
    lastModified: string;
}

export const FILES_INDEX_KEY = 'files_index';
export const STORAGE_KEY_PREFIX = 'file_';

export interface FileManagerProps {
    currentFileId: string | null;
    setCurrentFileId: React.Dispatch<React.SetStateAction<string | null>>;
    currentFileName: string;
    setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
    goBack: () => void;
    content: string;
}
