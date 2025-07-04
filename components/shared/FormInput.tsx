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
  fieldName?: string; // Field name for validation
  validator?: (fieldName: any, value: any) => boolean; // Validator function
  error?: string | null; // Error message
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  className = "",
  containerClassName = "",
  fieldName,
  validator,
  error,
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
        fieldName={fieldName}
        validator={validator}
        error={error}
        {...props}
      />
    </View>
  );
};

export default FormInput;
