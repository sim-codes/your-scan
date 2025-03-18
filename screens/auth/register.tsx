import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props } from "@/types/navigation";

export default function RegisterScreen() {
    const navigation = useNavigation<Props['navigation']>();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            fullname: '',
            email: '',
            password1: '',
            password2: ''
        }
    });

    const onSubmit = () => {
    // Handle form submission
    };
    return (
        <SafeAreaView variant="screen" style={{ justifyContent: 'center'}}>
            <View style={tw`my-8 ios:my-2`}>
                <HeaderText>Register</HeaderText>
                <BodyText size="base">Register to secure your work </BodyText>
            </View>

            <FormField
                control={control}
                name="fullname"
                label="Full Name"
                placeholder="John Olivia"
                rules={{
                required: 'Full name is required'
                }}
            />

            <FormField
                control={control}
                name="email"
                label="Email"
                placeholder="oliva@gmail.com"
                rules={{
                required: 'Email is required',
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address'
                }
                }}
            />

            <FormField
                    control={control}
                    name="password1"
                    label="Password"
                    isPassword
                    placeholder="********"
                    rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                    }}
            />

            <FormField
                    control={control}
                    name="password2"
                    label="Confirm Password"
                    isPassword
                    placeholder="********"
                    rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                    }}
            />

            <CustomButton
                style={tw`mt-5 ios:mt-2`}
                onPress={() => {

                }}
            >Register</CustomButton>

            <View style={tw`flex-row justify-center mt-4 gap-x-1`}>
                <BodyText style={tw`text-black`}>Have an account?</BodyText>
                <CustomButton variant="link"
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                >Login</CustomButton>
            </View>
        </SafeAreaView>
    );
}
