import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";
import { CustomButton } from "@/components/common/button";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/form";
import tw from "twrnc";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props } from "@/types/navigation";
import Toast from "react-native-toast-message";
import { useUserStore } from "@/lib/authContext";
import { useState } from "react";

// Define the form data type
type RegisterFormData = {
    fullname: string;
    email: string;
    password1: string;
    password2: string;
};

export default function RegisterScreen() {
    const navigation = useNavigation<Props["navigation"]>();
    const { register } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
        setError,
    } = useForm<RegisterFormData>({
        defaultValues: {
            fullname: "",
            email: "",
            password1: "",
            password2: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsSubmitting(true);

            // Check if passwords match
            if (data.password1 !== data.password2) {
                setError("password2", {
                    type: "manual",
                    message: "Passwords do not match",
                });
                return;
            }

            // Call your register function from the store
            await register({
                fullName: data.fullname,
                email: data.email,
                password: data.password1,
            });

            // Show success message
            Toast.show({
                type: "success",
                text1: "Registration successful",
                text2: "You can now login to your account",
            });

            // Navigate to login screen
            navigation.navigate("Login");
        } catch (error) {
            // Handle specific error types from your API
            if (typeof error === "object" && error !== null && "message" in error) {
                const errorMessage = (error as Error).message;

                // Handle email already exists error
                if (errorMessage.includes("email")) {
                    setError("email", {
                        type: "manual",
                        message: "Email already in use",
                    });
                } else {
                    // Generic error message
                    Toast.show({
                        type: "error",
                        text1: "Registration failed",
                        text2: errorMessage || "Please try again later",
                    });
                }
            } else {
                // Fallback error message
                Toast.show({
                    type: "error",
                    text1: "Registration failed",
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
                <HeaderText>Register</HeaderText>
                <BodyText size="base">Register to secure your work</BodyText>
            </View>

            <FormField
                control={control}
                name="fullname"
                label="Full Name"
                placeholder="John Olivia"
                rules={{
                    required: "Full name is required",
                }}
            />

            <FormField
                control={control}
                name="email"
                label="Email"
                placeholder="oliva@gmail.com"
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
                name="password1"
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

            <FormField
                control={control}
                name="password2"
                label="Confirm Password"
                isPassword
                placeholder="********"
                rules={{
                    required: "Confirm password is required",
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                    },
                    validate: (value: string) =>
                        value === getValues("password1") || "Passwords do not match",
                }}
            />

            <CustomButton
                style={tw`mt-5 ios:mt-2`}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Registering..." : "Register"}
            </CustomButton>

            <View style={tw`flex-row justify-center mt-4 gap-x-1`}>
                <BodyText style={tw`text-black`}>Have an account?</BodyText>
                <CustomButton
                    variant="link"
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                >
                    Login
                </CustomButton>
            </View>
        </SafeAreaView>
    );
}
