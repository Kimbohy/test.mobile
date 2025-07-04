import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import FormProduct from "@/components/shared/FormProduct";
import { useProductCreate } from "@/hooks/product/useProductCreate";

const Create = () => {
  const router = useRouter();
  const { handleCreate, loading } = useProductCreate();

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <FormProduct
        onSubmit={handleCreate}
        onCancel={handleCancel}
        loading={loading}
        submitButtonText="Créer"
        title="Créer un produit"
      />
    </ScrollView>
  );
};

export default Create;
