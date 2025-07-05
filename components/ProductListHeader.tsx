import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between ">
        <Text className="text-2xl font-bold dark:text-white">
          Liste des produits
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {hasActiveFilters && (
            <View className="w-2 h-2 mr-2 bg-blue-500 rounded-full" />
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
        <Text className="text-gray-600 dark:text-gray-400">
          {resultsCount} produit{resultsCount !== 1 ? "s" : ""} trouvé
          {resultsCount !== 1 ? "s" : ""}
          {hasActiveFilters ? " avec les filtres appliqués" : ""}
        </Text>
      )}
    </View>
  );
});

export default ProductListHeader;
