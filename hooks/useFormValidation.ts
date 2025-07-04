import { useState } from "react";
import { ZodError, ZodSchema } from "zod";

interface ValidationState {
  [key: string]: string | null;
}

// Helper function to debug validation issues (can be removed in production)
const debugValidation = (fieldName: string, value: any, result: any) => {
  if (process.env.NODE_ENV === "development") {
    if (!result.success) {
      console.log("Errors:", result.error.errors);
    }
  }
};

export function useFormValidation<T extends Record<string, any>>(
  schema: ZodSchema<T>
) {
  const [errors, setErrors] = useState<ValidationState>({});

  const validateField = (fieldName: keyof T, value: any): boolean => {
    try {
      // Access the schema's shape to validate individual fields
      // This works with zod object schemas
      const schemaAny = schema as any;

      if (schemaAny.shape && schemaAny.shape[fieldName]) {
        // Extract just the field's schema from the shape
        const fieldSchema = schemaAny.shape[fieldName];

        // Validate the field value directly with its schema
        const fieldResult = fieldSchema.safeParse(value);

        // Debug just the field validation
        debugValidation(String(fieldName), value, fieldResult);

        if (fieldResult.success) {
          setErrors((prev) => ({ ...prev, [fieldName]: null }));
          return true;
        } else {
          setErrors((prev) => ({
            ...prev,
            [fieldName]:
              fieldResult.error.errors[0]?.message ||
              `Invalid ${String(fieldName)}`,
          }));
          return false;
        }
      }

      // Fallback to whole schema validation if we can't extract the field
      const partialData = { [fieldName]: value } as unknown as T;
      // Only called for fallback
      const result = schema.safeParse(partialData);

      // Debug validation results (only once)
      debugValidation(String(fieldName), value, result);

      // For fallback validation, only care about errors for this specific field
      if (result.success) {
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
        return true;
      } else {
        // Extract error for this specific field - improve path checking
        const fieldErrors = result.error.errors.filter(
          (err: any) => err.path.length > 0 && err.path[0] === fieldName
        );

        if (fieldErrors.length > 0) {
          // Use the first applicable error message
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldErrors[0].message,
          }));
        } else {
          // No errors for this field, so it's valid within the context
          setErrors((prev) => ({ ...prev, [fieldName]: null }));
          return true;
        }
        return fieldErrors.length === 0;
      }
    } catch (error) {
      // This catch block handles unexpected errors, not validation errors
      console.error(`Unexpected error validating ${String(fieldName)}:`, error);
      setErrors((prev) => ({
        ...prev,
        [fieldName]:
          error instanceof Error
            ? error.message
            : `Unexpected error validating ${String(fieldName)}`,
      }));
      return false;
    }
  };

  const validateForm = (data: Partial<T>): boolean => {
    // Use safeParse instead of parse for better error handling
    const result = schema.safeParse(data);

    // Debugging output
    if (process.env.NODE_ENV === "development") {
      if (!result.success) {
        console.log("Errors:", result.error.errors);
      }
    }

    if (result.success) {
      setErrors({});
      return true;
    } else {
      const newErrors: ValidationState = {};

      // Process each validation error
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const path = err.path[0];
          // Only set the error if it doesn't exist yet or replace with a more specific one
          if (!newErrors[path] || err.path.length === 1) {
            newErrors[path] = err.message;
          }
        }
      });

      setErrors(newErrors);
      return false;
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (fieldName: keyof T) => {
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
  };
}
