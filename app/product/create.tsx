import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { addProduct } from "@/service/product.service";
import { Category } from "@/types/product.type";
import FormInput from "@/components/shared/FormInput";
import { productSchema } from "@/schema/product.schema";
import { useFormValidation } from "@/hooks/useFormValidation";

const Create = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: Category.ELECTRONICS,
    vendeurs: "",
  });

  const { errors, validateField, validateForm, clearFieldError } =
    useFormValidation(productSchema);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleCreate = () => {
    // Validate all fields at once
    const isValid = validateForm(formData);

    if (!isValid) {
      // Find the first error to display in an alert
      const errorMessages = Object.entries(errors)
        .filter(([_, message]) => message !== null)
        .map(([field, message]) => `${message}`);

      if (errorMessages.length > 0) {
        Alert.alert("Erreur de validation", errorMessages[0]);
        return;
      }
    }

    // Create new product
    const success = addProduct({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      vendeurs: formData.vendeurs,
      // These fields would typically be set by the backend
      image: "/assets/images/products/placeholder.jpg",
      isActive: true,
    });

    if (success) {
      Alert.alert("Succès", "Produit créé avec succès", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Erreur", "Impossible de créer le produit");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Créer un produit
        </Text>

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
            value={formData.price}
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
            value={formData.stock}
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

          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 py-3 transition-transform bg-gray-500 rounded-lg dark:bg-gray-600 active:scale-95"
              onPress={() => router.back()}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3 transition-transform bg-blue-600 rounded-lg dark:bg-blue-500 active:scale-95"
              onPress={handleCreate}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Créer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Create;
