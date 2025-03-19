import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useFileEditor } from '@/context';

export function FileManagerPlugin({ initialEditorState = null }) {
    const [editor] = useLexicalComposerContext();
    const { currentFileId } = useFileEditor();

    useEffect(() => {
        if (initialEditorState) {
        editor.setEditorState(editor.parseEditorState(initialEditorState));
        }
    }, [initialEditorState, editor]);

    return null;
}
