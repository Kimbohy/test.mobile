import { useState } from "react";
import { addProduct } from "@/service/product.service";

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

export const useProductCreate = () => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData: ProductFormData): Promise<boolean> => {
    setLoading(true);
    try {
      const success = addProduct(formData);
      return success;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreate, loading };
};
