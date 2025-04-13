import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from "react-native-toast-message";
import { htmlToPdf } from '@/lib/htmlToPdf';
import { htmlToDocx } from '@/lib/htmlToDocx';

type Props = StackScreenProps<RootStackParamList, 'Editor'>;

export const TextEditorScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  const content = useEditorContent(editor, { type: 'html' });
  // Get plain text content when needed
  const plainTextContent = useEditorContent(editor, { type: 'text' });

  const saveFile = async (fileId: string | undefined) => {
    if (!content) return;
    try {
      const file = await FileStorage.saveFile(fileId, content);
      setCurrentFile({
        fileId: file?.id,
        fileName: file?.name,
        content: file.content
      });
      Toast.show({
        type: 'success',
        text1: 'File Saved',
        text2: 'Document saved successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not save the document',
      });
    }
    return;
  };

  // Helper function to generate a filename
  const generateFileName = (extension: string) => {
    const fileName = currentFile?.fileName || 'document';
    // Remove any existing extension and add the new one
    const baseFileName = fileName.replace(/\.\w+$/, '');
    return `${baseFileName}.${extension}`;
  };

  // Export to text file
  const exportToText = async () => {
    try {
      setIsExporting(true);
      if (!plainTextContent) {
        Toast.show({
          type: 'error',
          text1: 'Export Failed',
          text2: 'No content to export',
        });
        return;
      }

      const fileName = generateFileName('txt');
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, plainTextContent);

      await Sharing.shareAsync(fileUri);

      Toast.show({
        type: 'success',
        text1: 'Export Successful',
        text2: 'Text file exported',
      });
    } catch (error) {
      console.error("Failed to export text:", error);
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: 'Could not export text file',
      });
    } finally {
      setIsExporting(false);
      setIsDrawerOpen(false);
    }
  };

  // Export to PDF
  const exportToPdf = async () => {
    try {
      setIsExporting(true);
      if (!content) {
        Toast.show({
          type: 'error',
          text1: 'Export Failed',
          text2: 'No content to export',
        });
        return;
      }

      const fileName = generateFileName('pdf');
      const fileUri = await htmlToPdf(content, fileName);

      if (fileUri) {
        await Sharing.shareAsync(fileUri);
        Toast.show({
          type: 'success',
          text1: 'Export Successful',
          text2: 'PDF exported',
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Failed to export PDF:", error);
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: 'Could not create PDF file',
      });
    } finally {
      setIsExporting(false);
      setIsDrawerOpen(false);
    }
  };

  // Export to DOCX
  const exportToDocx = async () => {
    try {
      setIsExporting(true);
      if (!content) {
        Toast.show({
          type: 'error',
          text1: 'Export Failed',
          text2: 'No content to export',
        });
        return;
      }

      const fileName = generateFileName('docx');
      const fileUri = await htmlToDocx(content, fileName);

      if (fileUri) {
        await Sharing.shareAsync(fileUri);
        Toast.show({
          type: 'success',
          text1: 'Export Successful',
          text2: 'DOCX exported',
        });
      } else {
        throw new Error("DOCX generation failed");
      }
    } catch (error) {
      console.error("Failed to export DOCX:", error);
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: 'Could not create DOCX file',
      });
    } finally {
      setIsExporting(false);
      setIsDrawerOpen(false);
    }
  };

  const DrawerContent = () => {
    return (
      <View style={tw`flex-1 p-5`}>
        <TouchableOpacity
          disabled={isExporting}
          onPressIn={() => saveFile(currentFile?.fileId)}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`}
          onPress={() => setIsDrawerOpen(false)}>
          <Ionicons name="save-outline" size={24} color="#0066FF" />
          <BodyText style={tw`text-lg`}>Save</BodyText>
        </TouchableOpacity>

        <Text style={tw`text-2xl my-2 font-semibold`}>File export options</Text>

        <TouchableOpacity
          disabled={isExporting}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`}
          onPress={exportToText}>
          <Feather name="file-text" size={24} color="#0066FF" />
          <View style={tw`flex-row items-center`}>
            <BodyText style={tw`text-lg mr-2`}>Export to txt</BodyText>
            {isExporting && <ActivityIndicator size="small" color="#0066FF" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isExporting}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`}
          onPress={exportToDocx}>
          <Foundation name="page-doc" size={28} color="#0066FF" />
          <View style={tw`flex-row items-center`}>
            <BodyText style={tw`text-lg mr-2`}>Export to docx</BodyText>
            {isExporting && <ActivityIndicator size="small" color="#0066FF" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isExporting}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`}
          onPress={exportToPdf}>
          <FontAwesome name="file-pdf-o" size={24} color="#0066FF" />
          <View style={tw`flex-row items-center`}>
            <BodyText style={tw`text-lg mr-2`}>Export to pdf</BodyText>
            {isExporting && <ActivityIndicator size="small" color="#0066FF" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isExporting}
          onPressIn={() => navigation.goBack()}
          style={tw`flex-row gap-x-2 items-center border-b border-[#CCE0FF] pb-2 mt-2`}
          onPress={() => setIsDrawerOpen(false)}>
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
        <Toast />
      </Drawer>
    </SafeAreaView>
  );
};

const initialContent = `<p>This is a basic example!</p>`;
