import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props } from "@/types/navigation";

export default function LoginScreen() {
    const navigation = useNavigation<Props['navigation']>();

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
        <SafeAreaView variant="screen" style={{ justifyContent: 'center' }}>
            <View style={tw`my-8 ios:my-2`}>
                <HeaderText>Hello</HeaderText>
                <HeaderText>Welcome Back!</HeaderText>
            </View>

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
                    placeholder="********"
                    rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                    }}
            />

            <BodyText style={tw`text-right mb-2`} size="base">Forgot password?</BodyText>

            <CustomButton
                style={tw`mt-5 ios:mt-2`}
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
