import React, { memo } from "react";
import { FlatList, Text, ActivityIndicator } from "react-native";
import { View } from "@/components/Themed";
import ProductCard from "@/components/ProductCard";
import { product } from "@/types/product.type";
import { FilterOptions } from "@/components/FilterComponent";

interface ProductListProps {
  products: product[];
  loading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  totalCount: number;
  filters: FilterOptions;
  onEndReached: () => void;
  onRefresh: () => void;
  onScroll: (event: any) => void;
  showFilters?: boolean;
  filterComponent?: React.ReactNode;
}

const ProductList = memo(function ProductList({
  products,
  loading,
  loadingMore,
  hasNextPage,
  totalCount,
  filters,
  onEndReached,
  onRefresh,
  onScroll,
  showFilters = false,
  filterComponent,
}: ProductListProps) {
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="small" />
          <Text style={{ marginTop: 8, color: "#666" }}>Chargement...</Text>
        </View>
      );
    }

    if (!hasNextPage && products.length > 0) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#666" }}>
            Fin de la liste ({totalCount} produits trouvés)
          </Text>
        </View>
      );
    }

    if (products.length === 0 && !loading) {
      return (
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 16, textAlign: "center" }}>
            {filters.searchTerm || filters.category || filters.priceRange
              ? "Aucun produit ne correspond à vos critères de recherche"
              : "Aucun produit disponible"}
          </Text>
        </View>
      );
    }

    return null;
  };

  // Separate loading state - don't show when just filtering
  if (loading && products.length === 0 && !showFilters) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: "#666" }}>
          Chargement des produits...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: showFilters ? 0 : 8,
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <View style={{ paddingBottom: showFilters ? 8 : 0 }}>
          {showFilters && (
            <View>
              {filterComponent}
              {loading && products.length === 0 && (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator size="small" />
                  <Text style={{ marginTop: 8, color: "#666" }}>
                    Recherche en cours...
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      refreshing={loading && products.length > 0}
      onRefresh={onRefresh}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
});

export default ProductList;
