import { mockProducts } from "@/data/products";
import { product } from "@/types/product.type";

export const getProducts = (): product[] => {
  return mockProducts;
};
