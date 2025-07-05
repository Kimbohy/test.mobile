import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";

interface ProductListHeaderProps {
  onFilterPress?: () => void;
  isFilterActive?: boolean;
  resultsCount?: number;
  hasActiveFilters?: boolean;
}

const ProductListHeader = memo(function ProductListHeader({
  onFilterPress,
  isFilterActive = false,
  resultsCount,
  hasActiveFilters = false,
}: ProductListHeaderProps) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: resultsCount !== undefined ? 8 : 0,
        }}
      >
        <Text className="text-2xl font-bold dark:text-white">
          Liste des produits
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {hasActiveFilters && (
            <View
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 10,
                width: 8,
                height: 8,
                marginRight: 8,
              }}
            />
          )}
          <TouchableOpacity onPress={onFilterPress} style={{ padding: 8 }}>
            <MaterialIcons
              name={isFilterActive ? "filter-list-off" : "filter-list"}
              size={24}
              color={"#666"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {resultsCount !== undefined && isFilterActive && (
        <Text style={{ color: "#666", fontSize: 14 }}>
          {resultsCount} produit{resultsCount !== 1 ? "s" : ""} trouvé
          {resultsCount !== 1 ? "s" : ""}
          {hasActiveFilters ? " avec les filtres appliqués" : ""}
        </Text>
      )}
    </View>
  );
});

export default ProductListHeader;
