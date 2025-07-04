import FormProduct from "@/components/shared/FormProduct";
import ProductFormLoading from "@/components/shared/ProductFormLoading";
import { ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProductData } from "@/hooks/product/useProductData";
import { useProductUpdate } from "@/hooks/product/useProductUpdate";
import { transformProductToFormData } from "@/util/productTransform";

const Edit = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Custom hooks for data and operations
  const { productData, isDataLoaded } = useProductData(id);
  const { handleUpdate, loading } = useProductUpdate(id);

  const handleCancel = () => {
    router.back();
  };

  // Show loading state while data is being fetched
  if (!isDataLoaded) {
    return (
      <ProductFormLoading
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        submitButtonText="Mettre à jour"
        title="Modifier le produit"
      />
    );
  }

  // Transform product data for the form
  const initialData = transformProductToFormData(productData);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <FormProduct
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        loading={loading}
        initialData={initialData}
        submitButtonText="Mettre à jour"
        title="Modifier le produit"
      />
    </ScrollView>
  );
};

export default Edit;
