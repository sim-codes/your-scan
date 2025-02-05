import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

interface SavedFile {
    id: string;
    name: string;
    date: string;
    content: string;
    lastModified: string;
}

type SortOrder = 'name' | 'date' | 'lastModified';

export const SavedFilesScreen = () => {
    const navigation = useNavigation();
    const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('lastModified');
    const [isRenaming, setIsRenaming] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [fileToRename, setFileToRename] = useState<SavedFile | null>(null);

    const STORAGE_KEY_PREFIX = '@editor_file_';
    const FILES_INDEX_KEY = '@editor_files_index';

    // Load saved files index
    const loadSavedFiles = async () => {
        try {
            const filesIndex = await AsyncStorage.getItem(FILES_INDEX_KEY);
            if (filesIndex) {
                setSavedFiles(JSON.parse(filesIndex));
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading files:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadSavedFiles();
        });

        return unsubscribe;
    }, [navigation]);

    // Open selected file
    const openFile = async (file: SavedFile) => {
        try {
            const content = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + file.id);
            if (content) {
                // Navigate back to editor with file data
                navigation.navigate('Main', {
                    fileId: file.id,
                    fileName: file.name,
                    content: content
                });
            }
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    // Delete file
    const deleteFile = async (fileId: string) => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY_PREFIX + fileId);
            setSavedFiles(prev => {
                const updated = prev.filter(file => file.id !== fileId);
                AsyncStorage.setItem(FILES_INDEX_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // Rename file
    const startRenaming = (file: SavedFile) => {
        setFileToRename(file);
        setNewFileName(file.name);
        setIsRenaming(true);
    };

    const completeRenaming = async () => {
        if (!fileToRename || !newFileName.trim()) return;

        setSavedFiles(prev => {
            const updated = prev.map(file =>
                file.id === fileToRename.id
                    ? { ...file, name: newFileName.trim() }
                    : file
            );
            AsyncStorage.setItem(FILES_INDEX_KEY, JSON.stringify(updated));
            return updated;
        });

        setIsRenaming(false);
        setFileToRename(null);
        setNewFileName('');
    };

    // Sort and filter files
    const getSortedAndFilteredFiles = useCallback(() => {
        let filtered = savedFiles;
        
        if (searchQuery) {
            filtered = savedFiles.filter(file => 
                file.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'lastModified':
                    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
                default:
                    return 0;
            }
        });
    }, [savedFiles, searchQuery, sortOrder]);

    const renderItem = ({ item }: { item: SavedFile }) => (
        <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
            <TouchableOpacity 
                style={tw`flex-1`}
                onPress={() => openFile(item)}
            >
                <Text style={tw`text-lg font-medium`}>{item.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>
                    Modified: {new Date(item.lastModified).toLocaleString()}
                </Text>
            </TouchableOpacity>
            <View style={tw`flex-row gap-2`}>
                <TouchableOpacity 
                    style={tw`bg-green-500 px-3 py-2 rounded`}
                    onPress={() => startRenaming(item)}
                >
                    <Text style={tw`text-white`}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={tw`bg-red-500 px-3 py-2 rounded`}
                    onPress={() => deleteFile(item.id)}
                >
                    <Text style={tw`text-white`}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={tw`p-4`}>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
                    placeholder="Search files..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={tw`flex-row items-center gap-2 mb-4`}>
                    <Text>Sort by: </Text>
                    {(['name', 'date', 'lastModified'] as SortOrder[]).map((order) => (
                        <TouchableOpacity
                            key={order}
                            style={tw`px-3 py-1 rounded ${sortOrder === order ? 'bg-blue-500' : 'bg-gray-200'}`}
                            onPress={() => setSortOrder(order)}
                        >
                            <Text style={tw`${sortOrder === order ? 'text-white' : 'text-gray-800'}`}>
                                {order.charAt(0).toUpperCase() + order.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            {isLoading ? (
                <Text style={tw`p-4`}>Loading...</Text>
            ) : (
                <FlatList
                    data={getSortedAndFilteredFiles()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    style={tw`flex-1`}
                />
            )}

            <Modal
                visible={isRenaming}
                transparent
                animationType="fade"
                onRequestClose={() => setIsRenaming(false)}
            >
                <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>
                    <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
                        <Text style={tw`text-xl font-bold mb-4`}>Rename File</Text>
                        <TextInput
                            style={tw`border border-gray-300 rounded p-2 mb-4`}
                            value={newFileName}
                            onChangeText={setNewFileName}
                            autoFocus
                        />
                        <View style={tw`flex-row justify-end gap-2`}>
                            <TouchableOpacity 
                                style={tw`px-4 py-2 rounded`}
                                onPress={() => setIsRenaming(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={tw`bg-blue-500 px-4 py-2 rounded`}
                                onPress={completeRenaming}
                            >
                                <Text style={tw`text-white`}>Rename</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
