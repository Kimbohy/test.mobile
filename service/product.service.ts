import { mockProducts } from "@/data/products";
import { product } from "@/types/product.type";

export const getProducts = (): product[] => {
  return mockProducts;
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
