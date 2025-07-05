import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { product } from "@/types/product.type";
import { addProduct } from "@/service/product.service";
import { updateUserStats } from "@/service/users.service";
import { useProductContext } from "@/context/ProductContext";
import { useAuthContext } from "@/context/AuthContext";
import { connectedUser } from "@/util/token";
import FormProduct from "@/components/shared/FormProduct";

const Create = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useProductContext();
  const { userToken, refreshUserData } = useAuthContext();

  const handleSubmit = async (
    productData: Omit<product, "id">,
    resetForm: () => void
  ) => {
    setIsLoading(true);
    try {
      const success = await addProduct(productData);

      if (success) {
        // Update user statistics after successful product creation
        if (userToken) {
          const currentUser = connectedUser(userToken);
          if (currentUser) {
            const statsUpdated = await updateUserStats(currentUser.id);
            if (statsUpdated) {
              // Refresh user data to get updated statistics
              await refreshUserData();
            }
          }
        }

        // Reset the form after successful creation
        resetForm();

        // Trigger refresh of product list
        triggerRefresh();

        Alert.alert("Succès", "Le produit a été créé avec succès", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible de créer le produit");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la création");
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
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      submitButtonText="Créer le produit"
    />
  );
};

export default Create;
