import { useState, useCallback } from "react";
import { productSchema, ProductSchemaType } from "@/schema/product.schema";

export const useProductValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: string, value: any): boolean => {
    try {
      const fieldSchema = productSchema.shape[field as keyof ProductSchemaType];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (error: any) {
      const errorMessage = error.issues?.[0]?.message || "Erreur de validation";
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
      return false;
    }
  }, []);

  const validateForm = useCallback((formData: any): boolean => {
    try {
      productSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.issues?.forEach((issue: any) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
  };
};
