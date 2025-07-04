import { mockProducts } from "@/data/products";
import { Category, product } from "@/types/product.type";

type Filters = {
  category?: Category;
  priceRange?: [number, number];
  searchTerm?: string;
};

export const getProducts = (filters?: Filters): product[] => {
  return mockProducts.filter((product) => {
    const matchesCategory = filters?.category
      ? product.category === filters.category
      : true;

    const matchesPriceRange = filters?.priceRange
      ? product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
      : true;

    const matchesSearchTerm = filters?.searchTerm
      ? product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesPriceRange && matchesSearchTerm;
  });
};

export const getProductById = (id: string): product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const updateProduct = (
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

export const deleteProduct = (id: string): boolean => {
  const index = mockProducts.findIndex((product) => product.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
};

export const addProduct = (newProduct: Omit<product, "id">): boolean => {
  const id = String(Number(mockProducts[mockProducts.length - 1]?.id) + 1 || 1);
  mockProducts.push({ ...newProduct, id });
  return true;
};
