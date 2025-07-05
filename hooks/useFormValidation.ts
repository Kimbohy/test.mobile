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

      // Handle ZodEffects (schemas with .refine()) by accessing the underlying schema
      let actualSchema = schemaAny;
      if (
        schemaAny._def &&
        schemaAny._def.typeName === "ZodEffects" &&
        schemaAny._def.schema
      ) {
        actualSchema = schemaAny._def.schema;
      }

      if (actualSchema.shape && actualSchema.shape[fieldName]) {
        // Extract just the field's schema from the shape
        const fieldSchema = actualSchema.shape[fieldName];

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

      // If we can't extract the field schema, just check if the value is valid for basic validation
      // This prevents false positives when other required fields are missing
      if (value === undefined || value === null || value === "") {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: `${String(fieldName)} is required`,
        }));
        return false;
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
        return true;
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
