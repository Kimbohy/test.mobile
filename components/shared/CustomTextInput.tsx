import React from "react";
import { TextInput, TextInputProps, Text, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  variant?: "auth" | "form";
  error?: string | null;
  fieldName?: string; // Optional field name for validation purposes
  validator?: (fieldName: any, value: any) => boolean; // Optional custom validator function
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  className = "",
  variant = "auth",
  error,
  fieldName,
  validator,
  ...props
}) => {
  const baseClasses =
    variant === "auth"
      ? "w-full p-4 text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white"
      : "px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white";

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={`${baseClasses} ${className} ${error && "border-red-500"} `}
        placeholderTextColor="#9CA3AF"
        {...(fieldName &&
          validator && {
            onBlur: () => {
              validator(fieldName, value);
            },
          })}
        {...props}
      />
      {error && <Text className="mt-2 ml-2 text-red-500 ">{error}</Text>}
    </View>
  );
};

export default CustomTextInput;
