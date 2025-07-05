import { Modal, View, TouchableOpacity, FlatList, Text } from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectOption<T> {
  label: string;
  value: T;
}

interface SelectModalProps<T> {
  visible: boolean;
  options: SelectOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
}

export default function SelectModal<T>({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectModalProps<T>) {
  const colorScheme = useColorScheme();

  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ position: "absolute", width: "100%", height: "100%" }}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: colorScheme === "dark" ? "#1f2937" : "white",
            borderRadius: 18,
            maxHeight: 360,
            width: "85%",
            paddingVertical: 12,
            paddingHorizontal: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingHorizontal: 12,
              marginBottom: 4,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 4,
                borderRadius: 16,
                backgroundColor: colorScheme === "dark" ? "#374151" : "#f1f3f6",
              }}
            >
              <Ionicons
                name="close"
                size={22}
                color={colorScheme === "dark" ? "#9ca3af" : "#6c757d"}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator
            style={{ paddingHorizontal: 4 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            renderItem={({ item }) => {
              const isSelected =
                JSON.stringify(item.value) === JSON.stringify(selectedValue);
              return (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginVertical: 2,
                    backgroundColor: isSelected
                      ? colorScheme === "dark"
                        ? "#2563eb" // changed: more vibrant blue for dark mode
                        : "#e6f0ff"
                      : colorScheme === "dark"
                      ? "#1f2937"
                      : "white",
                    borderWidth: isSelected ? 1.5 : 1,
                    borderColor: isSelected
                      ? "#007AFF"
                      : colorScheme === "dark"
                      ? "#374151"
                      : "#f0f0f0",
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: isSelected
                        ? colorScheme === "dark"
                          ? "#fff" // changed: white text for selected in dark mode
                          : "#007AFF"
                        : colorScheme === "dark"
                        ? "#e5e7eb"
                        : "#495057",
                      fontWeight: isSelected ? "700" : "400",
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
