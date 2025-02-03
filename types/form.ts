import { TextInputProps } from "react-native";

export interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    isPassword?: boolean;
}