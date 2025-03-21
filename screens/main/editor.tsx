import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { SafeAreaView } from '@/components/common/view';
import tw from 'twrnc';
import { EditorHeader } from '@/components/common/header';
import { Drawer } from 'react-native-drawer-layout';
import { BodyText } from '@/components/common/text';
import { useNavigation } from '@react-navigation/native';
import { CustomButton } from '@/components/common/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';

export const TextEditorScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigation = useNavigation();

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  const content = useEditorContent(editor);

  const DrawerContent = () => {
    return (
      <View style={tw`flex-1 p-5`}>
        <TouchableOpacity style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
          <Feather name="edit" size={24} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Rename</BodyText>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`} onPress={() => setIsDrawerOpen(false)}>
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
        <EditorHeader isDrawerOpen={isDrawerOpen} goBack={() => navigation.goBack()} setIsDrawerOpen={setIsDrawerOpen} />
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
