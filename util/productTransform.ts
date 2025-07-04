import { product } from "@/types/product.type";

export const transformProductToFormData = (productData: product | null) => {
  if (!productData) return undefined;

  return {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    category: productData.category,
    vendeurs: productData.vendeurs,
    image: productData.image, // Keep as-is, can be string or number
  };
};
