import { useState, useEffect } from "react";
import { SafeAreaView } from "@/components/common/view";
import Editor from "@/components/dom-components/editor-dom";
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
type Props = StackScreenProps<RootStackParamList, 'File'>;
export const EditorScreen = () => {
    const [editorState, setEditorState] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [plainText, setPlainText] = useState("");
    const navigation = useNavigation<Props['navigation']>();
    const route = useRoute<Props['route']>();

    const [currentFileId, setCurrentFileId] = useState<string | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string>('');

    useEffect(() => {
        if (route.params?.fileId && route.params?.content) {
            setCurrentFileId(route.params.fileId);
            setCurrentFileName(route.params.fileName);
            setEditorState(JSON.parse(route.params.content));
            setContent(route.params.content);
        }
    }, [route.params]);

    const goBack = () => {
        navigation.navigate('Main');
    };

    return (
        <SafeAreaView variant="screen" padding="sm">
            <Editor
                setPlainText={setPlainText}
                setEditorState={setEditorState}
                currentFileId={currentFileId}
                setCurrentFileId={setCurrentFileId}
                currentFileName={currentFileName}
                setCurrentFileName={setCurrentFileName}
                goBack={goBack}
                content={content}
            />
        </SafeAreaView>
    );
}
