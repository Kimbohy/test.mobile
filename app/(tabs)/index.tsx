import { Alert, View } from "react-native";
import ProductListHeader from "@/components/ProductListHeader";
import FilterComponent, { FilterOptions } from "@/components/FilterComponent";
import ProductList from "@/components/ProductList";
import { getProductsPaginated } from "@/service/product.service";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { product } from "@/types/product.type";
import { useProductContext } from "@/context/ProductContext";

export default function Products() {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: undefined,
    priceRange: undefined,
  });
  const [totalCount, setTotalCount] = useState(0);

  const { registerRefreshCallback } = useProductContext();

  const loadProducts = async (page: number = 1, reset: boolean = true) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const serviceFilters = {
        searchTerm: filters.searchTerm || undefined,
        category: filters.category,
        priceRange: filters.priceRange,
      };

      const response = await getProductsPaginated(serviceFilters, {
        page,
        limit: 7,
      });

      if (reset) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setCurrentPage(response.currentPage);
      setHasNextPage(response.hasNextPage);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les produits");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFiltersChange = useCallback(
    (newFilters: FilterOptions) => {
      // Éviter les mises à jour inutiles si les filtres n'ont pas changé
      const currentFiltersStr = JSON.stringify(filters);
      const newFiltersStr = JSON.stringify(newFilters);

      if (currentFiltersStr !== newFiltersStr) {
        setFilters(newFilters);
        setCurrentPage(1);
        // Don't clear products immediately to avoid filter component flickering
        // setProducts([]);
      }
    },
    [filters]
  );

  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  // Effect to reload products when filters change
  useEffect(() => {
    loadProducts(1, true);
  }, [filters]);

  // Initial load and register refresh callback
  useEffect(() => {
    loadProducts();

    // Register refresh callback
    const unregister = registerRefreshCallback(() => {
      setCurrentPage(1);
      setFilters({
        searchTerm: "",
        category: undefined,
        priceRange: undefined,
      });
      loadProducts(1, true);
    });

    return unregister;
  }, [registerRefreshCallback]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !loadingMore) {
      loadProducts(currentPage + 1, false);
    }
  }, [hasNextPage, loadingMore, currentPage]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setFilters({
      searchTerm: "",
      category: undefined,
      priceRange: undefined,
    });
    loadProducts(1, true);
  }, []);

  const handleScroll = useCallback((event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  }, []);

  // Memoize filter component to prevent unnecessary re-renders - make it completely independent
  const memoizedFilterComponent = useMemo(() => {
    return (
      <FilterComponent
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />
    );
  }, [filters, handleFiltersChange]);

  // Memoize hasActiveFilters to prevent unnecessary header re-renders
  const hasActiveFilters = useMemo(() => {
    return !!(filters.searchTerm || filters.category || filters.priceRange);
  }, [filters.searchTerm, filters.category, filters.priceRange]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ProductListHeader
        onFilterPress={toggleFilters}
        isFilterActive={showFilters}
        resultsCount={totalCount}
        hasActiveFilters={hasActiveFilters}
      />
      <ProductList
        products={products}
        loading={loading}
        loadingMore={loadingMore}
        hasNextPage={hasNextPage}
        totalCount={totalCount}
        filters={filters}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        onScroll={handleScroll}
        showFilters={showFilters}
        filterComponent={memoizedFilterComponent}
      />
    </View>
  );
}
