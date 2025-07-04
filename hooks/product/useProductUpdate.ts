import { useState } from "react";
import { updateProduct } from "@/service/product.service";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: any;
  vendeurs: string;
  image: string;
  isActive: boolean;
}

export const useProductUpdate = (id: string | undefined) => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (formData: ProductFormData): Promise<boolean> => {
    if (!id) return false;

    setLoading(true);
    try {
      const success = updateProduct(id, formData);
      return success;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading };
};
