import { SafeAreaView } from "@/components/common/view";
import { Pressable, Text, View } from "react-native";
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import { ImagePickerButton } from "@/components/image-picker";
// import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Props } from "@/types/navigation";
export const UploadScreen = () => {
    const navigation = useNavigation<Props['navigation']>();

    return (
        <SafeAreaView style={tw`flex-1 items-center justify-center bg-white gap-y-4`}>
            <Text style={tw`self-start mb-10 mt-2 font-semibold text-2xl text-[#0055D4]`}>Upload Image</Text>

            <View style={tw`h-60 border-2 px-10 py-4 gap-2 border-dashed border-[#1849D6] rounded-xl items-center justify-center`}>
                <View style={tw`rounded-full bg-[#1849D6] h-12 w-12 p-2 items-center justify-center`}>
                    <Feather name="upload" size={24} color="white" />
                </View>

                <Text style={tw`text-center my-4`}>You can upload by importing or by scanning with your camera</Text>
            </View>

            <View style={tw`flex-row gap-x-4 items-center justify-center`}>
                <ImagePickerButton />

                <Pressable
                    onPress={() => {
                        navigation.navigate("Camera")
                    }}
                    style={tw`flex-row items-center gap-x-2 px-4 py-2 border border-[#AACCFF] rounded-md`}>
                    <Feather name="camera" size={24} color="#0066FF" />
                    <Text style={tw`text-[#0066FF]`}>Camera</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
