import React, { useState } from "react";
import { TextInput, TouchableOpacity, Animated } from "react-native";
import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce } from "@/hooks/useDebounce";

interface QuickSearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function QuickSearchBar({
  onSearchChange,
  placeholder = "Rechercher...",
  initialValue = "",
}: QuickSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchPress = () => {
    setIsExpanded(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 25,
          paddingHorizontal: 15,
          marginHorizontal: 10,
          marginVertical: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          flex: 1,
        }}
      >
        <Ionicons name="search" size={20} color="#6c757d" />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          placeholder={placeholder}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#6c757d"
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleClearSearch} style={{ padding: 5 }}>
          <Ionicons name="close" size={20} color="#6c757d" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handleSearchPress} style={{ padding: 8 }}>
      <Ionicons name="search" size={24} color="#666" />
    </TouchableOpacity>
  );
}
