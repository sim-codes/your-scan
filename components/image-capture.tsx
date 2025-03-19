import { useRef, useState } from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import tw from "twrnc";
import { CameraView, useCameraPermissions, CameraPictureOptions } from "expo-camera";

export const ImageCaptureButton = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | undefined>(undefined);

    if (!permission) {
        return <Text>We need your permission to use the camera</Text>;
    }

    const renderCamera = () => {
        return (
            <CameraView
                ref={ref}
                style={{ width: "100%", aspectRatio: 1 }}
                flash="off"
                facing="front"
                animateShutter={false}
            />
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

    return (
        <Pressable style={tw`flex-row items-center gap-x-2 px-4 py-2 border border-[#AACCFF] rounded-md`}>
            {renderCamera()}
            <Feather name="camera" size={24} color="#0066FF" />
            <Text style={tw`text-[#0066FF]`}>Camera</Text>
        </Pressable>
    );
}
