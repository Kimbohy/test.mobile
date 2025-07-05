import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { product } from "@/types/product.type";
import { updateProduct, getProductById } from "@/service/product.service";
import { useProductContext } from "@/context/ProductContext";
import FormProduct from "@/components/shared/FormProduct";

const EditProduct = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useProductContext();

  // Get existing product data
  const existingProduct = productId
    ? getProductById(productId as string)
    : null;

  if (!existingProduct) {
    return null; // Or show error message
  }

  const handleSubmit = async (
    productData: Omit<product, "id">,
    resetForm: () => void
  ) => {
    setIsLoading(true);
    try {
      const success = await updateProduct(productId as string, productData);

      if (success) {
        // Trigger refresh of product list
        triggerRefresh();

        Alert.alert("Succès", "Le produit a été modifié avec succès", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible de modifier le produit");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (resetForm: () => void) => {
    Alert.alert(
      "Annuler",
      "Êtes-vous sûr de vouloir annuler? Toutes les modifications seront perdues.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          style: "destructive",
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]
    );
  };

  return (
    <FormProduct
      initialValues={existingProduct}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      submitButtonText="Modifier le produit"
    />
  );
};

export default EditProduct;
