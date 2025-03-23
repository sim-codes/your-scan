import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { HomeHeader } from '@/components/common/header';
import { FilterSortView } from '@/components/filtering';
import { SafeAreaView } from '@/components/common/view';
import { Display, SortOption } from '@/types/home';
import Feather from '@expo/vector-icons/Feather';
import { Props } from '@/types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { FileStorage } from '@/lib/storage';
import { FileTypes } from '@/types/file';

type SortOrder = 'name' | 'date' | 'most-recent';

export const HomeScreen = () => {
    const [displayType, setDisplayType] = useState<Display>("grid");
    const navigation = useNavigation<Props['navigation']>();
    const [savedFiles, setSavedFiles] = useState<FileTypes[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('most-recent');
    const [isRenaming, setIsRenaming] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [fileToRename, setFileToRename] = useState<FileTypes | null>(null);

    // Load saved files index
    const loadSavedFiles = async () => {
        try {
            const data = await FileStorage.getAllFiles();
            if (data) {
                setSavedFiles(data);
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
    const openFile = async (file: FileTypes) => {
        try {
            const data = await FileStorage.getFile(file.id);
            if (data) {
                // Navigate back to editor with file data
                navigation.navigate('Editor', {
                    fileId: file.id,
                    fileName: file.name,
                    content: data.content
                });
            }
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    // Delete file
    const deleteFile = async (fileId: string) => {
        try {
            await FileStorage.deleteFile(fileId);
            loadSavedFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // Rename file
    const startRenaming = (file: FileTypes) => {
        setFileToRename(file);
        setNewFileName(file.name);
        setIsRenaming(true);
    };

    const completeRenaming = async () => {
        if (!fileToRename || !newFileName.trim()) return;

        await FileStorage.renameFile(fileToRename.id, newFileName.trim());
        loadSavedFiles();
        setIsRenaming(false);
        setFileToRename(null);
        setNewFileName('');
    };

    const mapSortOrderToSortOption = (order: SortOrder): SortOption => {
        switch (order) {
            case 'name': return 'name';
            case 'date': return 'date';
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
                break;
            case 'most-recent':
                setSortOrder('most-recent');
            break;
        }
    };

    const handleAddNewFile = () => {
        navigation.navigate('Editor', {
            fileId: "",
            fileName: "",
            content: ""
        });
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
                case 'most-recent':
                    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
                default:
                    return 0;
            }
        });
    }, [savedFiles, searchQuery, sortOrder]);

    const renderItem = ({ item }: { item: FileTypes }) => {
        if (displayType === 'grid') {
            return (
                <TouchableOpacity
                style={tw`w-full self-center mb-4 h-60 `}
                onPress={() => openFile(item)}
                >
                    <LinearGradient
                        colors={["#0066FF", "#0845AA", "#053795"]}
                        style={tw`w-full h-full p-2 bg-[#0066FF] rounded-3xl`}
                    >
                    <View style={tw`p-4 flex-col justify-between`}>
                        <View style={tw`mt-2 mb-10 flex-row items-center justify-between`}>
                        <Feather name="file-text" size={34} color="#AACCFF" />

                        <View style={tw`flex-row gap-1`}>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => startRenaming(item)}
                                >
                                    <Feather name="edit" size={24} color="#AACCFF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw`p-2`}
                                onPress={() => deleteFile(item.id)}
                            >
                                <Feather name="trash-2" size={24} color="#AACCFF" />
                            </TouchableOpacity>
                        </View>
                        </View>
                        <View style={tw`flex-col`}>
                            <Text style={tw`text-4xl text-white font-medium mb-2`} numberOfLines={1}>{item.name}</Text>
                            <Text style={tw`text-[#AACCFF]`}>
                                {new Date(item.lastModified).toLocaleDateString()}
                            </Text>
                        </View>
                        </View>
                        </LinearGradient>
                </TouchableOpacity>
            );
        }

        // Original list view item
        return (
            <View style={tw`flex-row items-center p-4 border-b border-[#80B2FF] relative`}>
                <TouchableOpacity
                    style={tw`flex-1 flex-row items-center`}
                    onPress={() => openFile(item)}
                >
                    <Feather style={tw`p-2`} name="file-text" size={34} color="#0066FF" />

                    <View style={tw`w-3/4`}>
                        <Text style={tw`text-lg text-[#0055D4] font-medium`}>{item.name}</Text>
                        <Text style={tw`text-xs text-[#5599FF]`}>
                            Last Modified: {new Date(item.lastModified).toLocaleDateString()}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                    style={tw`p-2`}
                    onPress={() => startRenaming(item)}
                    >
                        <Feather name="edit" size={24} color="#0066FF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`p-2`}
                    onPress={() => deleteFile(item.id)}
                >
                    <Feather name="trash-2" size={24} color="#EF4444" />
                </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white gap-y-4`}>
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
                    { id: "date", label: "Date" }
                ]}
                />

            {isLoading ? (
                <Text style={tw`p-4`}>Loading...</Text>
            ) : (
                    <>
                        <Text style={tw`my-2 font-semibold text-2xl text-[#0055D4]`}>My Files</Text>
                        <FlatList
                            data={getSortedAndFilteredFiles()}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            key={displayType}
                            style={tw`flex-1`}
                        />
                    </>
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
                            style={tw`border border-[#0066FF] rounded p-2 mb-4`}
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
                                style={tw`bg-[#0066FF] px-4 py-2 rounded`}
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
