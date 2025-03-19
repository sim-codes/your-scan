"use dom";
import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ExportPlugin } from "./plugins/ExportPlugin";
import { InitialValuePlugin } from "./plugins/InitialValuePlugin";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { SavedFilesManager } from "./plugins/SaveFilePlugin";
import { FileManagerProps } from "@/types/file";

const placeholder = "Enter some rich text...";

const editorConfig = {
    namespace: "RichTextEditor",
    nodes: [],
    // Handling of errors during update
    onError(error: Error) {
        throw error;
    },
    // The editor theme
    theme: ExampleTheme,
};
export default function Editor({
    setPlainText,
    setEditorState,
    currentFileId,
    setCurrentFileId,
    currentFileName,
    setCurrentFileName,
}: {
    setPlainText: React.Dispatch<React.SetStateAction<string>>;
        setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
        currentFileId: string | null;
        setCurrentFileId: React.Dispatch<React.SetStateAction<string | null>>;
        currentFileName: string;
        setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <>
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
                <RichTextPlugin
                contentEditable={
                    <ContentEditable
                    className="editor-input"
                    aria-placeholder={placeholder}
                    placeholder={
                        <div className="editor-placeholder">{placeholder}</div>
                    }
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin
                onChange={(editorState, editor, tags) => {
                    editorState.read(() => {
                    const root = $getRoot();
                    const textContent = root.getTextContent();
                    setPlainText(textContent);
                    });
                    setEditorState(JSON.stringify(editorState.toJSON()));
                }}
                ignoreHistoryMergeTagChange
                ignoreSelectionChange
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                {/* <TreeViewPlugin /> */}
            </div>
                </div>
                <ExportPlugin />
                <SavedFilesManager
                    currentFileId={currentFileId}
                    setCurrentFileId={setCurrentFileId}
                    currentFileName={currentFileName}
                    setCurrentFileName={setCurrentFileName}
                />
        </LexicalComposer>
        </>
    );
}
