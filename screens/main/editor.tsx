import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { SafeAreaView } from '@/components/common/view';
import tw from 'twrnc';
import { EditorHeader } from '@/components/common/header';
import { Drawer } from 'react-native-drawer-layout';
import { BodyText } from '@/components/common/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import { FileStorage } from '@/lib/storage';
import { StackScreenProps } from '@react-navigation/stack';
import { Params, RootStackParamList } from '@/types/navigation';
type Props = StackScreenProps<RootStackParamList, 'Editor'>;

export const TextEditorScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigation = useNavigation<Props['navigation']>();
  const route = useRoute<Props['route']>();

  const [currentFile, setCurrentFile] = useState<Params | null>(null);

  useEffect(() => {
    if (route.params?.fileId && route.params?.content) {
      setCurrentFile(route.params);
    } else if (route.params?.content) {
      setCurrentFile(route.params)
    }
  }, [route.params]);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: currentFile?.content || initialContent,
  });

  const content = useEditorContent(editor, {type: 'html'});

  const saveFile = async (fileId: string | undefined) => {
    if (!content) return;
    const file = await FileStorage.saveFile(fileId, content);
    setCurrentFile({
      fileId: file?.id,
      fileName: file?.name,
      content: file.content
    })
    return;
  }

  const DrawerContent = () => {
    return (
      <View style={tw`flex-1 p-5`}>
        <TouchableOpacity
          onPressIn={() => saveFile(currentFile?.fileId)}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
          <Ionicons name="save-outline" size={24} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Save</BodyText>
        </TouchableOpacity>

        <Text style={tw`text-2xl my-2 font-semibold`}>File export options</Text>

        <TouchableOpacity style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
        <Feather name="file-text" size={24} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Export to txt</BodyText>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
        <Foundation name="page-doc" size={28} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Export to docx</BodyText>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
          <FontAwesome name="file-pdf-o" size={24} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Export to pdf</BodyText>
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() => navigation.goBack()}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
          <Ionicons name="exit-outline" size={24} color="black" />
          <BodyText style={tw`text-lg text-black`}>Close File</BodyText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView padding='none' variant='screen'>
      <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        renderDrawerContent={() => {
            return <DrawerContent />;
        }}
      >
        <EditorHeader filename={currentFile?.fileName} isDrawerOpen={isDrawerOpen} goBack={() => navigation.goBack()} setIsDrawerOpen={setIsDrawerOpen} />
        <RichText editor={editor} style={tw`bg-transparent px-2 mx-3`} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`absolute bottom-0 w-full`}
        >
          <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </Drawer>
    </SafeAreaView>
  );
};

const initialContent = `<p>This is a basic example!</p>`;
