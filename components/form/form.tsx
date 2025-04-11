import React, { useState } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    TouchableOpacity
} from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import tw from 'twrnc';
import { BodyText } from '../common/text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomInputProps } from '@/types/form';
import { COLORS } from '@/colors';

export const CustomInput = ({
    label,
    error,
    style,
    isPassword = false,
    ...props
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={tw`mb-4`}>
        {label && (
            <BodyText style={tw`mb-2`}>
            {label}
            </BodyText>
        )}
        <View style={tw`flex-row items-center`}>
            <TextInput
                secureTextEntry={isPassword && !isPasswordVisible}
                placeholderTextColor="#999"
                style={[
                tw`flex-1 px-4 py-3 rounded-md border border-[#0066FF] text-base`,
                {
                    borderColor: error
                    ? COLORS.ERROR
                    : isFocused
                        ? COLORS.PRIMARY_START
                        : COLORS.BORDER_INACTIVE
                },
                style
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {isPassword && (
                <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={tw`absolute right-4 self-center`}
                >
                    {isPasswordVisible ? (
                        <Ionicons name = "eye-outline" size = { 24 } color = {COLORS.BORDER_ACTIVE} />
                    ) : (
                        <Ionicons name="eye-off-outline" size={24} color={COLORS.BORDER_ACTIVE} />
                    )}
                </TouchableOpacity>
            )}
        </View>
        {error && (
            <BodyText size='sm' style={tw`text-red-500 mt-1`}>
            {error}
            </BodyText>
        )}
        </View>
    );
};

interface FormFieldProps<T extends FieldValues> extends CustomInputProps {
    control: Control<T>;
    name: Path<T>;
    rules?: object;
}

export function FormField<T extends FieldValues>({
    control,
    name,
    rules,
    ...props
}: FormFieldProps<T>) {
    return (
        <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
            field: { onChange, value, onBlur },
            fieldState: { error }
        }) => (
            <CustomInput
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={error?.message}
            {...props}
            />
        )}
        />
    );
}
