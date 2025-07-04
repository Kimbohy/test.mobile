import { FlatList, Text, ActivityIndicator, Alert } from "react-native";
import { View } from "@/components/Themed";
import ProductCard from "@/components/ProductCard";
import ProductListHeader from "@/components/ProductListHeader";
import { getProductsPaginated } from "@/service/product.service";
import { useState, useEffect, useRef } from "react";
import { product } from "@/types/product.type";

export default function Products() {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const loadProducts = async (page: number = 1, reset: boolean = true) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getProductsPaginated({}, { page, limit: 7 });

      if (reset) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setCurrentPage(response.currentPage);
      setHasNextPage(response.hasNextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les produits");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadNextPage = () => {
    if (hasNextPage && !loadingMore) {
      loadProducts(currentPage + 1, false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
            Fin de la liste ({products.length} produits)
          </Text>
        </View>
      );
    }

    return null;
  };

  if (loading) {
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
    <View style={{ flex: 1 }}>
      <ProductListHeader />
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        onRefresh={() => {
          setCurrentPage(1);
          loadProducts(1, true);
        }}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
}
