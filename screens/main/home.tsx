import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { navigationProps } from '@/types/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { HomeHeader } from '@/components/common/header';
import { FilterSortView } from '@/components/filtering';
import { SafeAreaView } from '@/components/common/view';
import { Display, SortOption } from '@/types/home';
import Feather from '@expo/vector-icons/Feather';

interface SavedFile {
    id: string;
    name: string;
    date: string;
    content: string;
    lastModified: string;
}

type SortOrder = 'name' | 'date' | 'lastModified';
type Props = StackScreenProps<RootStackParamList, 'File'>;

export const HomeScreen = () => {
    const [displayType, setDisplayType] = useState<Display>("list");
    const navigation = useNavigation<Props['navigation']>();
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
                navigation.navigate('Home', {
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

    const mapSortOrderToSortOption = (order: SortOrder): SortOption => {
        switch (order) {
            case 'name': return 'name';
            case 'date': return 'date';
            case 'lastModified': return 'lastModified';
            default: return 'most-recent';
        }
    };

    const handleSortChange = (sortOption: SortOption) => {
        switch (sortOption) {
            case 'name':
                setSortOrder('name');
                break;
            case 'date':
                setSortOrder('date');
                break;
            case 'lastModified':
                setSortOrder('lastModified');
                break;
            case 'most-recent':
                setSortOrder('lastModified'); // Default to lastModified for most-recent
            break;
        }
    };

    const handleAddNewFile = () => {
        // Navigate to create new file or show a dialog
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

    const renderItem = ({ item }: { item: SavedFile }) => {
        if (displayType === 'grid') {
          return (
            <TouchableOpacity 
              style={tw`w-1/2 p-2`}
              onPress={() => openFile(item)}
            >
              <View style={tw`border border-gray-200 rounded-lg p-4 h-32 justify-between`}>
                <Text style={tw`text-lg font-medium mb-2`} numberOfLines={1}>{item.name}</Text>
                <View style={tw`flex-row justify-between items-end`}>
                  <Text style={tw`text-xs text-gray-500`}>
                    {new Date(item.lastModified).toLocaleDateString()}
                  </Text>
                  <View style={tw`flex-row`}>
                    <TouchableOpacity 
                      style={tw`p-2 mr-1`}
                      onPress={() => startRenaming(item)}
                    >
                      <Feather name="edit-2" size={16} color="#22C55E" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={tw`p-2`}
                      onPress={() => deleteFile(item.id)}
                    >
                      <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }
        
        // Original list view item
        return (
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
      };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <HomeHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterSortView
                initialDisplay={displayType}
                initialSortOption={mapSortOrderToSortOption(sortOrder)}
                onDisplayChange={setDisplayType}
                onSortChange={handleSortChange}
                onAddPress={handleAddNewFile}
                sortOptions={[
                    { id: "most-recent", label: "Most Recent" },
                    { id: "name", label: "Name" },
                    { id: "date", label: "Date" },
                    { id: "lastModified", label: "Last Modified" }
                ]}
                />

            {isLoading ? (
                <Text style={tw`p-4`}>Loading...</Text>
            ) : (
                <FlatList
                    data={getSortedAndFilteredFiles()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={displayType === 'grid' ? 2 : 1}
                    key={displayType} // Important to re-render when switching layouts
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
        </SafeAreaView>
    );
};
