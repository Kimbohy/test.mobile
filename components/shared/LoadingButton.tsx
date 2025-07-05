import React from "react";
import { TouchableOpacity, ActivityIndicator, Text } from "react-native";

interface LoadingButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  variant = "primary",
  className = "",
}) => {
  const getButtonStyles = () => {
    const baseStyles =
      "px-6 py-3 rounded-lg flex-row items-center justify-center";

    switch (variant) {
      case "primary":
        return `${baseStyles} bg-blue-500 ${
          disabled || isLoading ? "opacity-50" : ""
        }`;
      case "secondary":
        return `${baseStyles} border border-gray-300 dark:border-gray-600 ${
          disabled || isLoading ? "opacity-50" : ""
        }`;
      case "danger":
        return `${baseStyles} bg-red-500 ${
          disabled || isLoading ? "opacity-50" : ""
        }`;
      default:
        return baseStyles;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "primary":
        return "text-white font-medium";
      case "secondary":
        return "text-gray-700 dark:text-gray-300 font-medium";
      case "danger":
        return "text-white font-medium";
      default:
        return "text-white font-medium";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${getButtonStyles()} ${className}`}
    >
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={variant === "secondary" ? "#6B7280" : "white"}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={getTextStyles()}>
        {isLoading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

export default LoadingButton;
