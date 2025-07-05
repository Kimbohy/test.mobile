import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/types/product.type";
import SelectComponent from "@/components/shared/SelectComponent";

export interface FilterOptions {
  searchTerm: string;
  category?: Category;
  priceRange?: [number | null, number | null];
}

interface FilterComponentProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const CATEGORIES = [
  { label: "Toutes catégories", value: undefined },
  { label: "Électronique", value: Category.ELECTRONICS },
  { label: "Vêtements", value: Category.CLOTHING },
  { label: "Livres", value: Category.BOOKS },
  { label: "Maison", value: Category.HOME },
  { label: "Sports", value: Category.SPORTS },
  { label: "Beauté", value: Category.BEAUTY },
  { label: "Alimentation", value: Category.FOOD },
  { label: "Automobile", value: Category.AUTOMOTIVE },
  { label: "Jouets", value: Category.TOYS },
  { label: "Santé", value: Category.HEALTH },
];

const FilterComponent = memo(function FilterComponent({
  onFiltersChange,
  initialFilters,
}: FilterComponentProps) {
  const [searchTerm, setSearchTerm] = useState(
    initialFilters?.searchTerm || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(initialFilters?.category);
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters?.priceRange?.[0]?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters?.priceRange?.[1]?.toString() || ""
  );

  const isFirstRender = useRef(true);

  // Function to apply filters
  const applyFilters = useCallback(() => {
    // Create price range from min/max inputs - let the service handle the logic
    let priceRange: [number | null, number | null] | undefined = undefined;
    const min = minPrice.trim() === "" ? null : parseFloat(minPrice);
    const max = maxPrice.trim() === "" ? null : parseFloat(maxPrice);

    // Only create priceRange if at least one value is valid
    if (min !== null || max !== null) {
      priceRange = [min, max];
    }

    onFiltersChange({
      searchTerm: searchTerm,
      category: selectedCategory,
      priceRange: priceRange,
    });
  }, [searchTerm, selectedCategory, minPrice, maxPrice, onFiltersChange]);

  // Apply filters when category changes (immediate)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    applyFilters();
  }, [selectedCategory]);

  const handleCategorySelect = (category: Category | undefined) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(undefined);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <View className="p-4 mx-0 mt-2 mb-2 rounded-xl">
      {/* Search Input */}
      <View className="flex-row items-center px-3 mb-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
        <Ionicons name="search" size={20} color="#6c757d" />
        <TextInput
          className="flex-1 px-2 py-3 text-base dark:text-gray-200"
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onBlur={applyFilters}
          placeholderTextColor="#6c757d"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchTerm("");
              // Apply filters immediately when clearing search
              setTimeout(applyFilters, 0);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#6c757d" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View className="mb-4">
        <Text className="mb-2 text-base font-semibold text-gray-600 dark:text-gray-400">
          Catégorie
        </Text>
        <SelectComponent
          options={CATEGORIES}
          selectedValue={selectedCategory}
          onValueChange={handleCategorySelect}
          placeholder="Sélectionnez une catégorie"
        />
      </View>

      {/* Price Range Filter */}
      <View className="mb-4">
        <Text className="mb-2 text-base font-semibold text-gray-600 dark:text-gray-400">
          Prix (Ar)
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <TextInput
              className="px-3 py-3 text-base bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              placeholder="Prix min"
              value={minPrice}
              onChangeText={setMinPrice}
              onBlur={applyFilters}
              keyboardType="numeric"
              placeholderTextColor="#6c757d"
            />
          </View>
          <Text className="text-base text-gray-500">-</Text>
          <View className="flex-1">
            <TextInput
              className="px-3 py-3 text-base bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              placeholder="Prix max"
              value={maxPrice}
              onChangeText={setMaxPrice}
              onBlur={applyFilters}
              keyboardType="numeric"
              placeholderTextColor="#6c757d"
            />
          </View>
        </View>
      </View>

      {/* Clear Filters Button */}
      {(searchTerm || selectedCategory || minPrice || maxPrice) && (
        <TouchableOpacity
          className="flex-row items-center justify-center py-3 bg-blue-500 rounded-lg"
          onPress={clearFilters}
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text className="ml-2 text-sm font-semibold text-white">
            Effacer les filtres
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default FilterComponent;
