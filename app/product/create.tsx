import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { addProduct } from "@/service/product.service";
import { Category } from "@/types/product.type";
import FormInput from "@/components/shared/FormInput";
import { productSchema } from "@/schema/product.schema";
import { useFormValidation } from "@/hooks/useFormValidation";
import * as ImagePicker from "expo-image-picker";

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: Category.ELECTRONICS,
    vendeurs: "",
    image: "",
  });

  const { errors, validateField, validateForm, clearFieldError } =
    useFormValidation(productSchema);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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

  const handleCreate = async () => {
    // Validate all fields at once
    const isValid = validateForm(formData);

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

    setLoading(true);

    try {
      // Create new product
      const success = addProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        vendeurs: formData.vendeurs,
        // Use the selected image or fallback to default
        image: formData.image || "/assets/images/products/default.jpeg",
        isActive: true,
      });

      if (success) {
        Alert.alert("Succès", "Produit créé avec succès", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible de créer le produit");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création du produit"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Créer un produit
        </Text>

        {/* Image Picker Section */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage} className="mb-3">
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
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
          <TouchableOpacity
            onPress={pickImage}
            className="px-4 py-2 bg-blue-100 rounded-lg dark:bg-blue-900"
          >
            <Text className="text-blue-700 dark:text-blue-300">
              {formData.image ? "Changer l'image" : "Sélectionner une image"}
            </Text>
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

          <View className="flex-row mt-6 space-x-4">
            <TouchableOpacity
              className="flex-1 py-3 transition-transform bg-gray-500 rounded-lg dark:bg-gray-600 active:scale-95"
              onPress={() => router.back()}
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
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-lg font-semibold text-center text-white">
                  Créer
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Create;
