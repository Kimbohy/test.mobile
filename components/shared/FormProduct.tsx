import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Category, product } from "@/types/product.type";
import FormInput from "@/components/shared/FormInput";
import { productSchema } from "@/schema/product.schema";
import { useFormValidation } from "@/hooks/useFormValidation";
import * as ImagePicker from "expo-image-picker";

interface FormProductProps {
  onSubmit: (formData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: Category;
    vendeurs: string;
    image: string;
    isActive: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
  initialData?: {
    name?: string;
    description?: string;
    price?: string | number;
    stock?: string | number;
    category?: Category;
    vendeurs?: string;
    image?: string | number;
  };
  submitButtonText?: string;
  title?: string;
}

const FormProduct: React.FC<FormProductProps> = ({
  onSubmit,
  onCancel,
  loading,
  initialData = {},
  submitButtonText = "Créer",
  title = "Créer un produit",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: Category.ELECTRONICS,
    vendeurs: "",
    image: "" as string | number,
  });

  // Update form data when initialData changes
  useEffect(() => {
    // Only update if initialData has actual content (not just an empty object)
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price:
          typeof initialData.price === "number"
            ? initialData.price.toString()
            : initialData.price || "",
        stock:
          typeof initialData.stock === "number"
            ? initialData.stock.toString()
            : initialData.stock || "",
        category: initialData.category || Category.ELECTRONICS,
        vendeurs: initialData.vendeurs || "",
        image: initialData.image || "",
      });
    }
  }, [
    initialData?.name,
    initialData?.description,
    initialData?.price,
    initialData?.stock,
    initialData?.category,
    initialData?.vendeurs,
    initialData?.image,
  ]);

  const { errors, validateField, validateForm, clearFieldError } =
    useFormValidation(productSchema);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Helper function to get the correct image source
  const getImageSource = (imageValue: string | number) => {
    if (typeof imageValue === "number") {
      // It's a require() result, use it directly
      return imageValue;
    } else if (typeof imageValue === "string") {
      if (
        imageValue.startsWith("http") ||
        imageValue.startsWith("file://") ||
        imageValue.startsWith("content://")
      ) {
        // It's a URI string
        return { uri: imageValue };
      } else {
        // It's a local path, convert to URI format
        return { uri: imageValue };
      }
    }
    // Fallback to default image
    return { uri: "/assets/images/products/default.jpeg" };
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l'accès à votre galerie pour sélectionner une image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setFormData({ ...formData, image: result.assets[0].uri });
        clearFieldError("image");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de charger l'image. Veuillez réessayer."
      );
      console.error("Image picker error:", error);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields at once - ensure price and stock are strings for validation
    const validationData = {
      ...formData,
      price: String(formData.price),
      stock: String(formData.stock),
      image: typeof formData.image === "number" ? "" : formData.image, // Convert number to empty string for validation
    };
    const isValid = validateForm(validationData);

    if (!isValid) {
      // Wait a bit for the errors state to update, then check for errors
      setTimeout(() => {
        const errorMessages = Object.entries(errors)
          .filter(([_, message]) => message !== null && message !== "")
          .map(([field, message]) => `${message}`);

        if (errorMessages.length > 0) {
          Alert.alert("Erreur de validation", errorMessages[0]);
        } else {
          Alert.alert(
            "Erreur de validation",
            "Veuillez vérifier tous les champs requis"
          );
        }
      }, 100);
      return;
    }

    try {
      const success = await onSubmit({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        vendeurs: formData.vendeurs,
        // Use the selected image or fallback to default, convert number to string if needed
        image:
          typeof formData.image === "number"
            ? "/assets/images/products/default.jpeg"
            : formData.image || "/assets/images/products/default.jpeg",
        isActive: true,
      });

      if (success) {
        Alert.alert("Succès", "Produit traité avec succès", [
          { text: "OK", onPress: onCancel },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible de traiter le produit");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors du traitement du produit"
      );
      console.error(error);
    }
  };

  return (
    <View className="p-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </Text>

      {/* Image Picker Section */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage} className="mb-3">
          {formData.image ? (
            <Image
              source={getImageSource(formData.image)}
              className="w-40 h-40 rounded-lg"
            />
          ) : (
            <View className="items-center justify-center w-40 h-40 bg-gray-200 rounded-lg dark:bg-gray-700">
              <Text className="text-gray-500 dark:text-gray-400">
                Ajouter une image
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        <FormInput
          label="Nom du produit"
          placeholder="Nom du produit"
          value={formData.name}
          onChangeText={(text) => {
            setFormData({ ...formData, name: text });
            clearFieldError("name");
          }}
          fieldName="name"
          validator={validateField}
          error={errors.name}
        />

        <FormInput
          label="Description"
          placeholder="Description du produit"
          value={formData.description}
          onChangeText={(text) => {
            setFormData({ ...formData, description: text });
            clearFieldError("description");
          }}
          fieldName="description"
          validator={validateField}
          error={errors.description}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <FormInput
          label="Prix (Ar)"
          placeholder="Prix"
          value={String(formData.price)}
          onChangeText={(text) => {
            setFormData({ ...formData, price: text });
            clearFieldError("price");
          }}
          fieldName="price"
          validator={validateField}
          error={errors.price}
          keyboardType="numeric"
        />

        <FormInput
          label="Stock"
          placeholder="Quantité en stock"
          value={String(formData.stock)}
          onChangeText={(text) => {
            setFormData({ ...formData, stock: text });
            clearFieldError("stock");
          }}
          fieldName="stock"
          validator={validateField}
          error={errors.stock}
          keyboardType="numeric"
        />

        <View className="mb-4">
          <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
            Catégorie
          </Text>
          <TouchableOpacity
            className={`px-4 py-3 bg-white border rounded-lg dark:bg-gray-800 ${
              errors.category
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text className="text-gray-900 dark:text-white">
              {formData.category}
            </Text>
          </TouchableOpacity>
          {errors.category && (
            <Text className="mt-2 ml-2 text-red-500">{errors.category}</Text>
          )}

          {showCategoryPicker && (
            <View className="mt-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              {Object.values(Category).map((category) => (
                <TouchableOpacity
                  key={category}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-600"
                  onPress={() => {
                    setFormData({ ...formData, category });
                    setShowCategoryPicker(false);
                    validateField("category", category);
                  }}
                >
                  <Text className="text-gray-900 dark:text-white">
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <FormInput
          label="Vendeur"
          placeholder="Nom du vendeur"
          value={formData.vendeurs}
          onChangeText={(text) => {
            setFormData({ ...formData, vendeurs: text });
            clearFieldError("vendeurs");
          }}
          fieldName="vendeurs"
          validator={validateField}
          error={errors.vendeurs}
          containerClassName="mb-6"
        />

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="flex-1 py-3 transition-transform bg-gray-500 rounded-lg dark:bg-gray-600 active:scale-95"
            onPress={onCancel}
            disabled={loading}
          >
            <Text className="text-lg font-semibold text-center text-white">
              Annuler
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 transition-transform ${
              loading ? "bg-blue-400" : "bg-blue-600 active:scale-95"
            } rounded-lg dark:bg-blue-500`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-lg font-semibold text-center text-white">
                {submitButtonText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FormProduct;
