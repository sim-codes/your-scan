import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { BodyText } from './text';

// Define color constants
export const COLORS = {
    PRIMARY_START: '#067ED3',
    PRIMARY_END: '#0055B7',
    SECONDARY_START: '#LIGHTER_PURPLE',
    SECONDARY_END: '#DARKER_PURPLE',
    WHITE: '#FFFFFF',
    BLACK: '#000000'
};

type ButtonVariant = 'primary' | 'secondary' | 'link' | 'outline';

interface CustomButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
}

export const CustomButton = ({
    children,
    variant = 'primary',
    style,
    ...props
}: CustomButtonProps) => {
    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    gradient: [`${COLORS.PRIMARY_START}`, `${COLORS.PRIMARY_END}`] as const,
                    textStyle: tw`text-white font-semibold text-lg`,
                    containerStyle: tw`px-4 py-3 rounded-md items-center justify-center h-14`
                };
            case 'secondary':
                return {
                    gradient: [`${COLORS.SECONDARY_START}`, `${COLORS.SECONDARY_END}`] as const,
                    textStyle: tw`text-white font-semibold text-lg`,
                    containerStyle: tw`px-4 py-3 rounded-full items-center justify-center h-14`
                };
            case 'outline':
                return {
                    gradient: ['transparent', 'transparent'] as const,
                    textStyle: tw`text-black font-semibold text-lg`,
                    containerStyle: tw`px-4 py-3 rounded-full items-center justify-center h-14 border border-black`
                };
            case 'link':
                return {
                    gradient: ['transparent', 'transparent'] as const,
                    textStyle: tw`text-primary font-semibold text-lg`,
                    containerStyle: tw`items-center justify-center`
                };
            default:
                return {
                    gradient: [`${COLORS.PRIMARY_START}`, `${COLORS.PRIMARY_END}`] as const,
                    textStyle: tw`text-white font-semibold text-lg`,
                    containerStyle: tw`px-4 py-3 rounded-full items-center justify-center h-14`
                };
        }
    };

    const { gradient, textStyle, containerStyle } = getButtonStyles();

    if (variant === 'link') {
        return (
            <TouchableOpacity {...props}>
                <BodyText style={textStyle}>{children}</BodyText>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity {...props}>
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[containerStyle, style]}
            >
                <BodyText style={textStyle}>{children}</BodyText>
            </LinearGradient>
        </TouchableOpacity>
    );
};
