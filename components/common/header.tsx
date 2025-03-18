import tw from 'twrnc';
import { View, Text, TextInput } from "react-native";
import Feather from '@expo/vector-icons/Feather';

type HomeHeaderProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const HomeHeader = ({searchQuery, setSearchQuery}: HomeHeaderProps) => {
    return (
        <View style={tw`w-full p-4 flex-row gap-x-2 items-center justify-between`}>
            <View style={tw`p-2 w-74 flex-row border-[#AACCFF] border rounded-md`}>
            <TextInput
                    style={[
                        tw`w-full p-1`,
                        { borderWidth: 0, outlineStyle: 'none', outlineWidth: 0 }
                    ]}
                    placeholder="Search for files"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Feather name="search" size={24} color="#0066FF" />
            </View>
            <Feather name="settings" size={24} color="#0066FF" />

            <View style={tw`bg-[#CCE0FF] rounded-full w-8 h-8`}></View>
        </View>
    );
}