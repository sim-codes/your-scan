import { View } from "react-native";
import { BodyText } from "@/components/common/text";
import tw from "twrnc";

export const CameraScreen = () => {
    return (
        <View style={tw`flex-1`}>
            <BodyText>This is Camera Screen</BodyText>
        </View>
    );
}
