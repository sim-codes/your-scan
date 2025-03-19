import React, { createContext, useContext, useState } from 'react';

interface FileEditorContextType {
  currentFileId: string | null;
  currentFileName: string;
  saveFile: () => Promise<void>;
}

const FileEditorContext = createContext<FileEditorContextType | undefined>(undefined);

interface FileEditorContextProviderProps {
  children: React.ReactNode;
  value: FileEditorContextType;
}

export const FileEditorContextProvider = ({ children, value }: FileEditorContextProviderProps) => {
  return (
    <FileEditorContext.Provider value={value}>
      {children}
    </FileEditorContext.Provider>
  );
};

export const useFileEditor = () => {
  const context = useContext(FileEditorContext);
  if (context === undefined) {
    throw new Error('useFileEditor must be used within a FileEditorContextProvider');
  }
  return context;
};
