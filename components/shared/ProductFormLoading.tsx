import React from "react";
import { ScrollView } from "react-native";
import FormProduct from "./FormProduct";

interface ProductFormLoadingProps {
  onSubmit: (formData: any) => Promise<boolean>;
  onCancel: () => void;
  submitButtonText?: string;
  title?: string;
}

const ProductFormLoading: React.FC<ProductFormLoadingProps> = ({
  onSubmit,
  onCancel,
  submitButtonText = "Charger...",
  title = "Chargement...",
}) => {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <FormProduct
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={true}
        submitButtonText={submitButtonText}
        title={title}
      />
    </ScrollView>
  );
};

export default ProductFormLoading;
