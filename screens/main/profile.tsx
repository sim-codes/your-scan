import { BodyText } from '@/components/common/text';
import { SafeAreaView } from '@/components/common/view';
import tw from 'twrnc';
export const ProfileScreen = () => {
    return (
        <SafeAreaView variant='screen' style={tw`items-center justify-center`}>
            <BodyText>Welcome your profile</BodyText>
        </SafeAreaView>
    );
}