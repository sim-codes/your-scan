import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
    const navigation = useNavigation();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = () => {
    // Handle form submission
    };
    return (
        <SafeAreaView variant="screen" style={{ justifyContent: 'center'}}>
            <HeaderText>Hello</HeaderText>
            <HeaderText>Welcome Back!</HeaderText>

            <FormField
                control={control}
                name="email"
                label="Email"
                placeholder="olivia@gmail.com"
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
                    placeholder="********"
                    rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                    }}
            />

            <BodyText style={tw`text-right mb-2 font-bold`} size="lg">Forgot password?</BodyText>

            <CustomButton
                onPress={() => {

                }}
            >Login</CustomButton>

            <View style={tw`flex-row justify-center mt-4 gap-x-1`}>
                <BodyText style={tw`text-black`}>Don't have an account?</BodyText>
                <CustomButton variant="link"
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >Register</CustomButton>
            </View>
        </SafeAreaView>
    );
}
