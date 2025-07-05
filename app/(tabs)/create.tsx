import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { product } from "@/types/product.type";
import {
  addProduct,
  updateProduct,
  getProductById,
} from "@/service/product.service";
import { useProductContext } from "@/context/ProductContext";
import FormProduct from "@/components/shared/FormProduct";

const Create = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useProductContext();

  // Get existing product data if productId is provided
  const existingProduct = productId
    ? getProductById(productId as string)
    : null;
  const isUpdateMode = !!existingProduct;

  const handleSubmit = async (productData: Omit<product, "id">) => {
    setIsLoading(true);
    try {
      let success: boolean;

      if (isUpdateMode && productId) {
        // Update existing product
        success = await updateProduct(productId as string, productData);
      } else {
        // Create new product
        success = await addProduct(productData);
      }

      if (success) {
        // Trigger refresh of product list
        triggerRefresh();

        Alert.alert(
          "Succès",
          isUpdateMode
            ? "Le produit a été modifié avec succès"
            : "Le produit a été créé avec succès",
          [
            {
              text: "OK",
              onPress: () => router.push("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Erreur",
          isUpdateMode
            ? "Impossible de modifier le produit"
            : "Impossible de créer le produit"
        );
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        isUpdateMode
          ? "Une erreur est survenue lors de la modification"
          : "Une erreur est survenue lors de la création"
      );
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
      initialValues={existingProduct || undefined}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      submitButtonText={
        isUpdateMode ? "Modifier le produit" : "Créer le produit"
      }
    />
  );
};

export default Create;
