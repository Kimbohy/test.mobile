import React from "react";
import { View, Text, TextInputProps } from "react-native";
import CustomTextInput from "./CustomTextInput";

interface FormInputProps extends TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  containerClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Text>
      <CustomTextInput
        variant="form"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className={className}
        {...props}
      />
    </View>
  );
};

export default FormInput;
