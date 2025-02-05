import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import tw from 'twrnc';

interface EditorProps {
    // Your existing editor props
}

export const SavedFilesManager = (props: EditorProps) => {
    const [editor] = useLexicalComposerContext();
    const navigation = useNavigation();
    const route = useRoute();
    const [currentFileId, setCurrentFileId] = useState<string | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string>('');

    const STORAGE_KEY_PREFIX = '@editor_file_';
    const FILES_INDEX_KEY = '@editor_files_index';

    useEffect(() => {
        // Handle file data from navigation params
        if (route.params?.fileId && route.params?.content) {
            setCurrentFileId(route.params.fileId);
            setCurrentFileName(route.params.fileName);
            editor.setEditorState(editor.parseEditorState(route.params.content));
        }
    }, [route.params]);

    const saveFile = async () => {
        try {
            const content = JSON.stringify(editor.getEditorState().toJSON());
            
            if (currentFileId) {
                // Update existing file
                await AsyncStorage.setItem(STORAGE_KEY_PREFIX + currentFileId, content);
                
                const filesIndex = await AsyncStorage.getItem(FILES_INDEX_KEY);
                if (filesIndex) {
                    const files = JSON.parse(filesIndex);
                    const updated = files.map(file => 
                        file.id === currentFileId 
                            ? { ...file, lastModified: new Date().toISOString(), content }
                            : file
                    );
                    await AsyncStorage.setItem(FILES_INDEX_KEY, JSON.stringify(updated));
                }
            } else {
                // Create new file
                const newFileId = Date.now().toString();
                const newFileName = 'New Document';
                const newFile = {
                    id: newFileId,
                    name: newFileName,
                    date: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    content
                };

                await AsyncStorage.setItem(STORAGE_KEY_PREFIX + newFileId, content);
                
                const filesIndex = await AsyncStorage.getItem(FILES_INDEX_KEY);
                const files = filesIndex ? JSON.parse(filesIndex) : [];
                files.push(newFile);
                await AsyncStorage.setItem(FILES_INDEX_KEY, JSON.stringify(files));

                setCurrentFileId(newFileId);
                setCurrentFileName(newFileName);
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    return (
        <View style={tw`flex-1`}>
            {/* Your existing editor components */}
            
            <View style={tw`flex-row justify-between items-center p-4 bg-gray-100`}>
                <Text style={tw`text-lg`}>
                    {currentFileName || 'Untitled'}
                </Text>
                <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity 
                        style={tw`bg-blue-500 px-4 py-2 rounded`}
                        onPress={saveFile}
                    >
                        <Text style={tw`text-white`}>
                            {currentFileId ? 'Save' : 'Save As New'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={tw`bg-gray-500 px-4 py-2 rounded`}
                        onPress={() => navigation.navigate('File')}
                    >
                        <Text style={tw`text-white`}>Open Files</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};