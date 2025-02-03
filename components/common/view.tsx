import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

interface SafeAreaViewProps extends ViewProps {
    variant?: 'default' | 'screen' | 'card';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    gap?: 'none' | 'sm' | 'md' | 'lg';
    includeSafeArea?: boolean;
}

export const SafeAreaView = ({
    children,
    variant = 'default',
    padding = 'sm',
    gap = 'none',
    includeSafeArea = true,
    style,
    ...props
    }: SafeAreaViewProps) => {
    const insets = useSafeAreaInsets();

    const variantStyles = {
        default: '',
        screen: 'flex-1 bg-white dark:bg-gray-900',
        card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md'
    };

    const paddingStyles = {
        none: '',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
    };

    const gapStyles = {
        none: '',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6'
    };

    return (
        <View
        {...props}
        style={[
            tw`${variantStyles[variant]} ${paddingStyles[padding]} ${gapStyles[gap]}`,
            includeSafeArea && {
            paddingTop: insets.top,
            paddingBottom: insets.bottom
            },
            style
        ]}
        >
        {children}
        </View>
    );
};
