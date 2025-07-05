import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectModal from "./SelectModal";

interface SelectOption<T> {
  label: string;
  value: T;
}

interface SelectComponentProps<T> {
  options: SelectOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  style?: any;
}

export default function SelectComponent<T>({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Sélectionnez...",
  style,
}: SelectComponentProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();

  const selectedOption = options.find(
    (option) => JSON.stringify(option.value) === JSON.stringify(selectedValue)
  );

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // backgroundColor: "white",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderWidth: 1,
          // borderColor: "#e1e5e9",
          ...style,
        }}
        className="dark:bg-gray-800 dark:border-gray-600 "
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={{
            fontSize: 16,
            color: selectedOption
              ? colorScheme === "dark"
                ? "#e5e7eb" // light text for dark mode
                : "#495057" // dark text for light mode
              : colorScheme === "dark"
              ? "#9ca3aa" // muted text for dark mode
              : "#6c757d", // muted text for light mode
            flex: 1,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colorScheme === "dark" ? "#9ca3af" : "#6c757d"}
        />
      </TouchableOpacity>

      <SelectModal
        visible={isOpen}
        options={options}
        selectedValue={selectedValue}
        onSelect={onValueChange}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
