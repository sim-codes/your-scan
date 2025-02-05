import { useState } from "react";
import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import Editor from "@/components/dom-components/editor-dom";
import { View } from "react-native";

export default function MainScreen() {
    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const wordCount = editorState?.split(" ").length ?? 0;

    // console.log(plainText);
    // console.table(editorState);

    return (
        <SafeAreaView variant="screen" padding="sm">
            <Editor setPlainText={setPlainText} setEditorState={setEditorState} initialValue="Some initial text" />
        </SafeAreaView>
    );
}
