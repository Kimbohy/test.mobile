import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { getProductById, updateProduct } from "@/service/product.service";
import { Category } from "@/types/product.type";

const Edit = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = getProductById(productId as string);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    stock: product?.stock.toString() || "",
    category: product?.category || Category.ELECTRONICS,
    vendeurs: product?.vendeurs || "",
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Erreur", "Le nom du produit est requis");
      return;
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      Alert.alert("Erreur", "Le prix doit être un nombre valide");
      return;
    }
    if (!formData.stock || isNaN(Number(formData.stock))) {
      Alert.alert("Erreur", "Le stock doit être un nombre valide");
      return;
    }

    // Update product
    const success = updateProduct(productId as string, {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      vendeurs: formData.vendeurs,
    });

    if (success) {
      Alert.alert("Succès", "Produit modifié avec succès", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Erreur", "Impossible de modifier le produit");
    }
  };

  if (!product) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50 dark:bg-gray-900">
        <Text className="text-xl text-gray-900 dark:text-white">
          Produit non trouvé
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Modifier le produit
        </Text>

        <View className="space-y-4">
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Nom du produit
            </Text>
            <TextInput
              className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nom du produit"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Description
            </Text>
            <TextInput
              className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Description du produit"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Prix (Ar)
            </Text>
            <TextInput
              className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Prix"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Stock
            </Text>
            <TextInput
              className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              placeholder="Quantité en stock"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </Text>
            <TouchableOpacity
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600"
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text className="text-gray-900 dark:text-white">
                {formData.category}
              </Text>
            </TouchableOpacity>

            {showCategoryPicker && (
              <View className="mt-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
                {Object.values(Category).map((category) => (
                  <TouchableOpacity
                    key={category}
                    className="px-4 py-3 border-b border-gray-200 dark:border-gray-600"
                    onPress={() => {
                      setFormData({ ...formData, category });
                      setShowCategoryPicker(false);
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

          <View className="mb-6">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Vendeur
            </Text>
            <TextInput
              className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.vendeurs}
              onChangeText={(text) =>
                setFormData({ ...formData, vendeurs: text })
              }
              placeholder="Nom du vendeur"
              placeholderTextColor="#9CA3AF"
            />
          </View>

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
              onPress={handleSave}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Sauvegarder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Edit;
