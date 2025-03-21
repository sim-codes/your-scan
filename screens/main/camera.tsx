import { View, Dimensions, TouchableOpacity, Button, Image, Alert, ActivityIndicator } from "react-native";
import { BodyText } from "@/components/common/text";
import tw from "twrnc";
import { useRef, useState } from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, useCameraPermissions, CameraPictureOptions, CameraType } from "expo-camera";
import { SafeAreaView } from "@/components/common/view";
import { useNavigation } from "@react-navigation/native";
import cloudinaryService from "@/lib/cloudinary";
import { API_KEY } from "@/constants";
import { ImageToTextResponse } from "@/types/image";
import { toLexicalFormat } from "@/lexical-format";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "@/types/navigation";
import { getTextFromImage } from "@/lib/imageToText";

export type Props = StackScreenProps<RootStackParamList, 'File'>;


export const CameraScreen = () => {
    const navigation = useNavigation<Props['navigation']>();
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | undefined>(undefined);
    const [facing, setFacing] = useState<CameraType>('back');
    const cameraHeight = Dimensions.get('window').height;
    const cameraWidth = Dimensions.get('window').width;

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
            <View>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const scanForText = async () => {
        if (!uri) return;

        setIsScanning(true);
        try {
            const data = await getTextFromImage(uri);

            if (data?.all_text) {
                navigation.navigate('Editor', {
                        fileId: Date.now().toString(),
                        fileName: "Scan Result",
                        content: `<p>${data?.all_text}</p>`,
                    });

                setUri(undefined);
            }
        } catch (error) {
            console.error("Error scanning image:", error);
            Alert.alert("Error", "Failed to scan image. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };

    const renderCamera = () => {
        return (
            <CameraView
                ref={ref}
                style={{ width: cameraWidth, height: cameraHeight }}
                flash="off"
                facing={facing}
                animateShutter={false}
            >
                <View style={tw`flex-1 relative`}>
                    {/* Semi-transparent overlay */}
                    <View style={tw`absolute inset-0`}>
                        {/* Transparent center frame - this is where the user will focus their shot */}
                        <View style={tw`absolute top-1/4 left-1/6 right-1/6 bottom-1/4 bg-transparent`}>
                            {/* Optional corner markers for better visual guidance */}
                            <View style={tw`absolute top-0 left-0 h-6 w-6 border-t-4 border-l-4 border-white`} />
                            <View style={tw`absolute top-0 right-0 h-6 w-6 border-t-4 border-r-4 border-white`} />
                            <View style={tw`absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-white`} />
                            <View style={tw`absolute bottom-0 right-0 h-6 w-6 border-b-4 border-r-4 border-white`} />
                        </View>
                    </View>

                    {/* Exit button */}
                    <Pressable
                        onPress={exitCamera}
                        style={tw`absolute top-10 left-4 border border-white rounded-md p-2 bg-[#2B80FF] opacity-50`}>
                        <Feather name="x" size={20} color="white" />
                    </Pressable>

                    {/* Camera controls */}
                    <View style={tw`absolute bottom-10 w-full`}>
                        <Text style={tw`text-center text-2xl font-medium text-white my-2`}>Center the image</Text>
                        <View style={tw`flex-row gap-x-4 justify-center items-center px-4 py-2`}>
                            <TouchableOpacity onPress={takePicture} style={tw`bg-[#2B80FF] rounded-full h-20 w-20 border-2 border-[#CCCCCC]`} />
                            <TouchableOpacity onPress={toggleCameraFacing} style={tw`rounded-full h-14 w-14 bg-[#2B2B2B] items-center justify-center`} >
                                <Ionicons name="camera-reverse" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </CameraView>
        );
    }

    const renderImage = () => {
        return (
            <View style={tw`flex-1  bg-black`}>
                <Image source={{ uri }} style={tw`flex-1`} />
                {/* Exit button */}
                <Pressable
                    onPress={exitCamera}
                    style={tw`absolute top-10 left-4 border border-white rounded-md p-2 bg-[#2B80FF] opacity-50`}>
                    <Feather name="x" size={20} color="white" />
                </Pressable>

                {/* Transparent center frame - this is where the user will focus their shot */}
                <View style={tw`absolute top-1/4 left-1/6 right-1/6 bottom-1/4 bg-transparent`}>
                    {/* Optional corner markers for better visual guidance */}
                    <View style={tw`absolute top-0 left-0 h-6 w-6 border-t-4 border-l-4 border-white`} />
                    <View style={tw`absolute top-0 right-0 h-6 w-6 border-t-4 border-r-4 border-white`} />
                    <View style={tw`absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-white`} />
                    <View style={tw`absolute bottom-0 right-0 h-6 w-6 border-b-4 border-r-4 border-white`} />
                </View>

                {/* Camera controls */}
                <View style={tw`absolute bottom-10 w-full`}>
                    <View style={tw`flex-row gap-x-4 justify-center items-center px-4 py-2`}>
                        <TouchableOpacity onPress={() => setUri(undefined)} style={tw`rounded-full h-16 w-16 bg-[#2B2B2B] border-2 border-[#CCCCCC] items-center justify-center`} >
                            <Feather name="rotate-cw" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={scanForText} style={tw`bg-[#2B80FF] items-center justify-center rounded-full h-16 w-16 border-2 border-[#CCCCCC]`}>
                            {isScanning ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Feather name="check" size={24} color="white" />
                            )}
                        </TouchableOpacity>
                        </View>
                    </View>
            </View>
        );
    }

    const takePicture = async () => {
        if (ref.current) {
            const options: CameraPictureOptions = {
                shutterSound: false,
            };
            const photo = await ref.current?.takePictureAsync(options);
            setUri(photo?.uri);
        };
    }

    const exitCamera = () => {
        navigation.goBack();
    }

    return (
        <View style={tw`flex-1 h-full`}>
            {uri ? renderImage() : renderCamera()}
        </View>
    );
}
