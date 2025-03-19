import { useState } from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from 'expo-media-library';
// import { captureRef } from 'react-native-view-shot';

export const ImagePickerButton = () => {
    // const [status, requestPermission] = MediaLibrary.usePermissions();
    // const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          // mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        <Pressable onPress={pickImageAsync} style={tw`flex-row items-center gap-x-2 px-4 py-2 border border-[#AACCFF] rounded-md`}>
            <Feather name="folder" size={24} color="#0066FF" />
            <Text style={tw`text-[#0066FF]`}>Files</Text>
        </Pressable>
    );
}