import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { product } from "@/types/product.type";
import { getProductById } from "@/service/product.service";

export const useProductData = (id: string | undefined) => {
  const router = useRouter();
  const [productData, setProductData] = useState<product | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const product = getProductById(id);

      if (product) {
        setProductData(product);
      } else {
        Alert.alert("Erreur", "Produit non trouvé", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
      setIsDataLoaded(true);
    }
  }, [id, router]);

  return { productData, isDataLoaded };
};
