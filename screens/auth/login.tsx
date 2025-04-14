import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useUserStore } from "@/lib/authContext";
import { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

export type Props = StackScreenProps<RootStackParamList, 'Home'>;

// Define the form data type
type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const navigation = useNavigation<Props["navigation"]>();
    const { login } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useUserStore();

    // Check if user is already logged in
    if (user) {
        Toast.show({
            type: "info",
            text1: "Already logged in",
            text2: "You are already logged in. Redirecting to home.",
        })
        navigation.navigate("Tabs");
    }

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);

            // Call your login function from the store
            await login({
                email: data.email,
                password: data.password,
            });

            // Show success message
            Toast.show({
                type: "success",
                text1: "Login successful",
                text2: "Welcome back!",
            });

            // Navigate to home or dashboard screen
            navigation.navigate("Tabs");
        } catch (error) {
            // Handle specific error types from your API
            if (typeof error === "object" && error !== null && "message" in error) {
                const errorMessage = (error as Error).message;

                // Handle invalid credentials error
                if (errorMessage.toLowerCase().includes("invalid credentials") ||
                    errorMessage.toLowerCase().includes("email") ||
                    errorMessage.toLowerCase().includes("password")) {
                    // Set error on both fields for invalid credentials
                    setError("email", {
                        type: "manual",
                        message: "Invalid email or password",
                    });
                    setError("password", {
                        type: "manual",
                        message: "Invalid email or password",
                    });
                } else {
                    // Generic error message
                    Toast.show({
                        type: "error",
                        text1: "Login failed",
                        text2: errorMessage || "Please try again later",
                    });
                }
            } else {
                // Fallback error message
                Toast.show({
                    type: "error",
                    text1: "Login failed",
                    text2: "Please try again later",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView variant="screen" style={{ justifyContent: "center" }}>
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
                    required: "Email is required",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address",
                    },
                }}
            />

            <FormField
                control={control}
                name="password"
                label="Password"
                isPassword
                placeholder="********"
                rules={{
                    required: "Password is required",
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                    },
                }}
            />

            <CustomButton
                style={tw`mt-5 ios:mt-2`}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </CustomButton>

            <View style={tw`flex-row justify-center mt-4 gap-x-1`}>
                <BodyText style={tw`text-black`}>Don't have an account?</BodyText>
                <CustomButton
                    variant="link"
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                >
                    Register
                </CustomButton>
            </View>
        </SafeAreaView>
    );
}
