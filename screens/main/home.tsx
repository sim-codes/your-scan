import { useState } from "react";
import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import Editor from "@/components/dom-components/editor-dom";
import { View } from "react-native";

export default function MainScreen() {
    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const wordCount = editorState?.split(" ").length ?? 0;

    console.log(plainText);
    console.log(editorState);

    return (
        <SafeAreaView variant="screen" padding="sm">
            <View style={{ padding: 16 }}>
                <BodyText style={{ fontSize: 20, fontWeight: "bold" }}>📱 Native Side</BodyText>
                <BodyText style={{ fontSize: 16, marginVertical: 10 }}>{plainText}</BodyText>
                <BodyText style={{ fontSize: 16 }}>Words: {wordCount}</BodyText>
            </View>

            <Editor setPlainText={setPlainText} setEditorState={setEditorState} />
        </SafeAreaView>
    );
}
