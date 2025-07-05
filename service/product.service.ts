import { mockProducts } from "@/data/products";
import { Category, product } from "@/types/product.type";

type Filters = {
  category?: Category;
  priceRange?: [number | null, number | null];
  searchTerm?: string;
};

type PaginationOptions = {
  page?: number;
  limit?: number;
};

type PaginatedResponse = {
  products: product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const getProductsPaginated = async (
  filters?: Filters,
  pagination?: PaginationOptions
): Promise<PaginatedResponse> => {
  // Simulation du délai de chargement
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 5;

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = filters?.category
      ? product.category === filters.category
      : true;

    let matchesPriceRange = true;
    if (filters?.priceRange) {
      let [min, max] = filters.priceRange;

      // Switch values if min is greater than max (only if both are not null)
      if (min !== null && max !== null && min > max) {
        [min, max] = [max, min];
      }

      // Handle cases where min or max might be null
      const hasMin = min !== null && min !== undefined && !isNaN(min);
      const hasMax = max !== null && max !== undefined && !isNaN(max);

      if (hasMin && hasMax) {
        // Both min and max are defined (TypeScript knows they're not null here)
        matchesPriceRange = product.price >= min! && product.price <= max!;
      } else if (hasMin) {
        // Only min is defined
        matchesPriceRange = product.price >= min!;
      } else if (hasMax) {
        // Only max is defined
        matchesPriceRange = product.price <= max!;
      }
      // If neither min nor max are defined, matchesPriceRange remains true
    }

    const matchesSearchTerm = filters?.searchTerm
      ? product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesPriceRange && matchesSearchTerm;
  });

  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = filteredProducts.slice(startIndex, endIndex);

  return {
    products,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const getProductById = (id: string): product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const addProduct = async (
  newProduct: Omit<product, "id">
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const id = String(
      Number(mockProducts[mockProducts.length - 1]?.id) + 1 || 1
    );
    mockProducts.push({ ...newProduct, id });
    return true;
  } catch (error) {
    return false;
  }
};

export const updateProduct = async (
  id: string,
  updatedProduct: Partial<product>
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const index = mockProducts.findIndex((product) => product.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const index = mockProducts.findIndex((product) => product.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Legacy sync methods for backward compatibility
export const addProductSync = (newProduct: Omit<product, "id">): boolean => {
  const id = String(Number(mockProducts[mockProducts.length - 1]?.id) + 1 || 1);
  mockProducts.push({ ...newProduct, id });
  return true;
};

export const updateProductSync = (
  id: string,
  updatedProduct: Partial<product>
): boolean => {
  const index = mockProducts.findIndex((product) => product.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
    return true;
  }
  return false;
};

export const deleteProductSync = (id: string): boolean => {
  const index = mockProducts.findIndex((product) => product.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
};
