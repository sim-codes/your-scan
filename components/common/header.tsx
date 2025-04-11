import tw from 'twrnc';
import { View, TextInput, Pressable, TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { BodyText } from './text';
import Ionicons from '@expo/vector-icons/Ionicons';

type HomeHeaderProps = {
    goToLogin: () => void;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const HomeHeader = ({ searchQuery, setSearchQuery, goToLogin }: HomeHeaderProps) => {
    return (
        <View style={tw`my-4 flex-row gap-x-2 items-center justify-between`}>
            <View style={tw`p-2 w-70 flex-row border-[#AACCFF] border rounded-md`}>
            <TextInput
                    style={[
                        tw`w-[90%] p-1`,
                        { borderWidth: 0, outlineStyle: 'none', outlineWidth: 0 }
                    ]}
                    placeholder="Search for files"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Feather name="search" size={24} color="#0066FF" />
            </View>
            <Feather name="settings" size={24} color="#0066FF" />

            <TouchableOpacity
                onPress={goToLogin}
                style={tw`bg-[#CCE0FF] rounded-full w-8 h-8 p-1 items-center justify-center`}>
                <Feather name="user" size={20} color="#0066FF" />
            </TouchableOpacity>

        </View>
    );
}

interface EditorHeaderProps {
    filename?: string;
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    goBack: () => void;
}


export const EditorHeader = ({
    isDrawerOpen,
    setIsDrawerOpen,
    goBack,
    filename
} : EditorHeaderProps) => {

    return (
        <View style={tw`mt-2`}>
            <View style={tw`mb-1 px-4 flex-row gap-x-2 items-center justify-between`}>
                <View style={tw`flex-row gap-x-4 items-center`}>
                    <Pressable
                        onPress={goBack}
                    >
                        <Ionicons name="arrow-back-outline" size={28} color="#0066FF" />
                    </Pressable>
                    <BodyText size='3xl' style={tw`font-bold`}>{ filename ?? 'New Document'}</BodyText>
                </View>

                <Pressable
                    onPress={() => setIsDrawerOpen(!isDrawerOpen)}
                    style={tw`bg-[#CCE0FF] rounded-full w-12 h-12 p-2 items-center justify-center`}>
                    <Ionicons name="folder-open-outline" size={24} color="#0066FF" />
                </Pressable>
            </View>

            <View style={tw`my-1 border w-full border-[#CCE0FF]`} />
        </View>
    );
}
