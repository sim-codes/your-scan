import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { SafeAreaView } from '@/components/common/view';
import tw from 'twrnc';
import { EditorHeader } from '@/components/common/header';
import { Drawer } from 'react-native-drawer-layout';
import { BodyText } from '@/components/common/text';
import { useNavigation } from '@react-navigation/native';

export const TextEditorScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigation = useNavigation();

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  const content = useEditorContent(editor);

  return (
    <SafeAreaView padding='none' variant='screen'>
      <Drawer
        open={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => setIsDrawerOpen(false)}
        renderDrawerContent={() => {
            return <BodyText>Drawer content</BodyText>;
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
