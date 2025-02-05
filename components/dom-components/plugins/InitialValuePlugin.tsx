import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createParagraphNode, $getRoot, $createTextNode } from 'lexical';

// Component to set initial editor state
export const InitialValuePlugin = ({ initialValue }: {initialValue: string}) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        const text = $createTextNode(initialValue);
        paragraph.append(text);
        root.append(paragraph);
        });
    }, [editor, initialValue]);

    return null;
};
