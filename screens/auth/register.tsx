import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
    const navigation = useNavigation();

    const { control, handleSubmit } = useForm({
        defaultValues: {
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
            <HeaderText>Register</HeaderText>
            <BodyText>Create an account to get started</BodyText>

            <FormField
                control={control}
                name="email"
                label="Email"
                placeholder="Enter your email"
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
                    name="password"
                    label="Password"
                    isPassword
                    secureTextEntry
                    placeholder="Enter your password"
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
                    secureTextEntry
                    placeholder="Enter your password"
                    rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                    }}
            />

            <CustomButton
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
