import { useEffect, useState } from "react";
import { SafeAreaView } from "@/components/common/view";
import { Pressable, Text, View, Image } from "react-native";
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import { ImagePickerButton } from "@/components/image-picker";
// import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Props } from "@/types/navigation";
import { CustomButton } from "@/components/common/button";
import { BodyText } from "@/components/common/text";
import { LinearGradient } from "expo-linear-gradient";

interface ImageDetailsType {
    name: string;
    size: number;
    type: string;
    uri: string;
}

export const UploadScreen = () => {
    const navigation = useNavigation<Props['navigation']>();
    const [image, setImage] = useState<string | null>(null);
    const [imageData, setImageData] = useState<ImageDetailsType | null>(null);

    useEffect(() => {
        getImageDetails();
    }, [image])

    // get image details
    const getImageDetails = async () => {
        if (image) {
            try {
                const response = await fetch(image);
                const blob = await response.blob();

                let fileName = "image.jpg"; // Default fallback name
                if (image.startsWith('file://')) {
                    // For images from device storage
                    const uriParts = image.split('/');
                    fileName = uriParts[uriParts.length - 1];
                }

                const size = blob.size;
                const type = blob.type || 'image/jpeg';

                setImageData({
                    name: fileName,
                    size,
                    type,
                    uri: image
                });
            } catch (error) {
                console.error("Error getting image details:", error);
            }
        }
    }

    // get truncated name + extension
    const getTruncatedName = (name: string) => {
        if (!name) return 'Unknown';
        const splitName = name.split('.');
        const extension = splitName.length > 1 ? splitName[splitName.length - 1] : '';
        const baseName = splitName.length > 1 ? splitName.slice(0, -1).join('.') : name;
        const truncatedName = baseName.length > 10 ?
            baseName.slice(0, 10) + '...' + (extension ? '.' + extension : '') :
            name;
        return truncatedName;
    }

    // Format file size in MB with one decimal place
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0.0MB';
        const sizeInMB = bytes / (1024 * 1024);
        return `${sizeInMB.toFixed(1)}MB`;
    }

    return (
        <SafeAreaView style={tw`flex-1 items-center justify-center bg-white gap-y-4`}>
            <Text style={tw`self-start mb-10 mt-2 font-semibold text-2xl text-[#0055D4]`}>Upload Image</Text>

            <View style={tw`w-full h-60 border-2 p-4 gap-2 border-dashed border-[#1849D6] rounded-xl items-center justify-center`}>
                {!image ? (
                    <>
                        <View style={tw`rounded-full bg-[#1849D6] h-12 w-12 p-2 items-center justify-center`}>
                            <Feather name="upload" size={24} color="white" />
                        </View>

                        <Text style={tw`text-center my-4`}>You can upload by importing or by scanning with your camera</Text>
                    </>
                ) : (
                        <View style={tw`flex-row gap-x-2 items-center justify-center`}>
                            <View style={tw`h-45 w-35 rounded-lg bg-black`}>
                                <Image
                                    source={{ uri: image }}
                                    style={tw`h-full w-full rounded-lg`}
                                />
                            </View>

                            <View style={tw`flex-col gap-y-5`}>
                                <View style={tw`flex-row gap-x-2 items-center`}>
                                    <BodyText>{imageData ? getTruncatedName(imageData.name) : 'Loading...'}</BodyText>
                                    <Text style={tw`text-[#555555] font-bold`}>
                                        {imageData ? formatFileSize(imageData.size) : ''}
                                    </Text>
                                </View>

                                <View style={tw`flex-row gap-x-2 items-center`}>
                                    <Pressable
                                        onPress={() => setImage(null)}
                                        style={tw`rounded-full bg-[#FFD1D4] h-14 w-14 p-1 items-center justify-center`}>
                                        <Feather name="trash-2" size={24} color="#FF3944" />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setImage(null)}
                                        style={tw`bg-[#F6F6F6] rounded-full py-3 px-5 flex-row gap-x-2 items-center`}>
                                        <Feather name="upload" size={24} color="black" />
                                        <Text>Upload new image</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                )}
            </View>

            {!image ? (
            <View style={tw`flex-row gap-x-4 items-center justify-center`}>
                <ImagePickerButton setSelectedImage={setImage} />

                <Pressable
                    onPress={() => {
                        navigation.navigate("Camera")
                    }}
                    style={tw`flex-row items-center gap-x-2 px-4 py-2 border border-[#AACCFF] rounded-md`}>
                    <Feather name="camera" size={24} color="#0066FF" />
                    <Text style={tw`text-[#0066FF]`}>Camera</Text>
                </Pressable>
            </View>
            ): (
                    <Pressable style={tw`w-full`}>
                        <LinearGradient colors={['#067ED3', '#0055B7']} style={tw`px-4 py-3 rounded-md items-center justify-center h-14`}>
                            <Text style={tw`text-white text-lg text-center font-bold`}>Scan for Text</Text>
                        </LinearGradient>
                </Pressable>
            )}
        </SafeAreaView>
    );
}