import React from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
// import { captureRef } from 'react-native-view-shot';

export const ImagePickerButton = ({
    selectedImage,
    setSelectedImage,
}: {
        selectedImage: string | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const [status, requestPermission] = MediaLibrary.usePermissions();

    const pickImageAsync = async () => {
        if (status === null ) {
            requestPermission();
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        } else {
            alert('You did not select an image.');
        }
    }

    return (
        <>
            {!selectedImage ? (
            <Pressable onPress={pickImageAsync} style={tw`flex-row items-center gap-x-2 px-4 py-2 border border-[#AACCFF] rounded-md`}>
                <Feather name="folder" size={24} color="#0066FF" />
                <Text style={tw`text-[#0066FF]`}>Files</Text>
            </Pressable>
            ): (
            <Pressable
                onPress={pickImageAsync}
                style={tw`bg-[#F6F6F6] rounded-full py-1 px-2 android:py-3 android:px-5 flex-row gap-x-2 items-center`}>
                <Feather name="upload" size={24} color="black" style={tw`hidden android:flex`} />
                <Text>Upload new image</Text>
            </Pressable>
            )}
        </>
    );
}
