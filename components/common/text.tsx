import { Text, TextProps } from "react-native";
import tw from 'twrnc';
import { COLORS } from "@/colors";

interface CustomTextProps extends TextProps {
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const sizeMap = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
};

export const HeaderText = ({ children, size = '4xl', ...props }: CustomTextProps) => (
    <Text
        {...props}
        style={[
        tw`${sizeMap[size]} font-bold text-[#0066FF] dark:text-white mb-2`,
        props.style
        ]}
    >
        {children}
    </Text>
);

export const BodyText = ({ children, size = 'xl', ...props }: CustomTextProps) => (
    <Text
        {...props}
        style={[
        tw`${sizeMap[size]} text-[#0066FF] dark:text-gray-300`,
        props.style
        ]}
    >
        {children}
    </Text>
);