export interface FileTypes {
    id: string;
    name: string;
    date: string;
    content: string;
    lastModified: string;
}

export interface FileManagerProps {
    currentFileId: string | null;
    setCurrentFileId: React.Dispatch<React.SetStateAction<string | null>>;
    currentFileName: string;
    setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
    goBack: () => void;
    content: string;
}
