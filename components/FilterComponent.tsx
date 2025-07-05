import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { TextInput, TouchableOpacity, Text, ScrollView } from "react-native";
import { View } from "@/components/Themed";
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
    <View
      style={{
        padding: 16,
        backgroundColor: "#f8f9fa",
        marginHorizontal: 0,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Search Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#e1e5e9",
        }}
      >
        <Ionicons name="search" size={20} color="#6c757d" />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 8,
            fontSize: 16,
          }}
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
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
            color: "#495057",
          }}
        >
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
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
            color: "#495057",
          }}
        >
          Prix (Ar)
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#e1e5e9",
                fontSize: 16,
              }}
              placeholder="Prix min"
              value={minPrice}
              onChangeText={setMinPrice}
              onBlur={applyFilters}
              keyboardType="numeric"
              placeholderTextColor="#6c757d"
            />
          </View>
          <Text style={{ color: "#6c757d", fontSize: 16 }}>-</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#e1e5e9",
                fontSize: 16,
              }}
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
          style={{
            backgroundColor: "#dc3545",
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={clearFilters}
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            Effacer les filtres
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default FilterComponent;
