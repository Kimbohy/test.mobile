import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, FlatList } from "react-native";
import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";

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

  const selectedOption = options.find(
    (option) => JSON.stringify(option.value) === JSON.stringify(selectedValue)
  );

  const handleSelect = (value: T) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: "#e1e5e9",
          ...style,
        }}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={{
            fontSize: 16,
            color: selectedOption ? "#495057" : "#6c757d",
            flex: 1,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6c757d"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              maxHeight: 300,
              width: "80%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                    backgroundColor:
                      JSON.stringify(item.value) ===
                      JSON.stringify(selectedValue)
                        ? "#f8f9fa"
                        : "white",
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        JSON.stringify(item.value) ===
                        JSON.stringify(selectedValue)
                          ? "#007AFF"
                          : "#495057",
                      fontWeight:
                        JSON.stringify(item.value) ===
                        JSON.stringify(selectedValue)
                          ? "600"
                          : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
