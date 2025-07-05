import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Category, product } from "@/types/product.type";
import {
  isImageUri,
  DEFAULT_PRODUCT_IMAGE,
  getImageSource,
} from "@/util/imageHelpers";
import { useProductValidation } from "@/hooks/product/useProductValidation";
import FormInput from "./FormInput";

interface FormProductProps {
  initialValues?: Partial<product>;
  onSubmit: (data: Omit<product, "id">, resetForm: () => void) => void;
  onCancel: (resetForm: () => void) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const FormProduct: React.FC<FormProductProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Enregistrer",
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    price: initialValues?.price ? initialValues.price.toString() : "",
    stock: initialValues?.stock ? initialValues.stock.toString() : "",
    category: initialValues?.category || Category.ELECTRONICS,
    vendeurs: initialValues?.vendeurs || "",
    image: initialValues?.image || "",
  });

  const { errors, validateField, clearErrors } = useProductValidation();
  const [imageUri, setImageUri] = useState<string | null>(
    isImageUri(initialValues?.image as string)
      ? (initialValues?.image as string)
      : null
  );
  const [hasInitialImage, setHasInitialImage] = useState<boolean>(
    !!(initialValues?.image && !isImageUri(initialValues.image as string))
  );

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission nécessaire",
        "Nous avons besoin de l'accès à votre galerie pour sélectionner des images."
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setFormData((prev) => ({ ...prev, image: uri }));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission nécessaire",
          "Nous avons besoin de l'accès à votre caméra pour prendre des photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setFormData((prev) => ({ ...prev, image: uri }));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Sélectionner une image", "Choisissez une option", [
      { text: "Galerie", onPress: pickImage },
      { text: "Caméra", onPress: takePhoto },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: Category.ELECTRONICS,
      vendeurs: "",
      image: "",
    });
    setImageUri(null);
    setHasInitialImage(false);
    clearErrors();
  };

  const handleCancel = () => {
    onCancel(resetForm);
  };

  const handleSubmit = () => {
    // Create a cleaned form data object for validation
    const formDataForValidation = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price.trim(),
      stock: formData.stock.trim(),
      category: formData.category,
      vendeurs: formData.vendeurs.trim(),
      image: formData.image,
    };

    // Debug: log the form data being validated
    console.log("Form data for validation:", formDataForValidation);
    console.log("Current errors:", errors);

    // Validate each field individually to get better error reporting
    const isNameValid = validateField("name", formDataForValidation.name);
    const isPriceValid = validateField("price", formDataForValidation.price);
    const isStockValid = validateField("stock", formDataForValidation.stock);
    const isVendeursValid = validateField(
      "vendeurs",
      formDataForValidation.vendeurs
    );

    // Use individual validations
    const isFormValid =
      isNameValid && isPriceValid && isStockValid && isVendeursValid;

    if (!isFormValid) {
      console.log("Validation failed, current errors:", errors);
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const submitData: Omit<product, "id"> = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      vendeurs: formData.vendeurs,
      image: formData.image || DEFAULT_PRODUCT_IMAGE,
      isActive: true,
    };

    onSubmit(submitData, resetForm);
  };

  const categories = Object.values(Category);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="space-y-4">
          {/* Image Section */}
          <View className="items-center mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              Image du produit
            </Text>
            <TouchableOpacity
              onPress={showImageOptions}
              className="items-center justify-center w-32 h-32 bg-gray-200 border-2 border-gray-400 border-dashed rounded-lg dark:bg-gray-700 dark:border-gray-500"
            >
              {imageUri || hasInitialImage ? (
                <Image
                  source={
                    imageUri
                      ? { uri: imageUri }
                      : getImageSource(initialValues?.image!)
                  }
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#9CA3AF" />
                  <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Ajouter une image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <FormInput
            label="Nom du produit *"
            placeholder="Entrez le nom du produit"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            error={errors.name}
          />

          <FormInput
            label="Description"
            placeholder="Entrez la description du produit"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          <FormInput
            label="Prix *"
            placeholder="0.00"
            value={formData.price}
            onChangeText={(value) => handleInputChange("price", value)}
            keyboardType="numeric"
            error={errors.price}
          />

          <FormInput
            label="Stock *"
            placeholder="0"
            value={formData.stock}
            onChangeText={(value) => handleInputChange("stock", value)}
            keyboardType="numeric"
            error={errors.stock}
          />

          <FormInput
            label="Vendeur *"
            placeholder="Nom du vendeur"
            value={formData.vendeurs}
            onChangeText={(value) => handleInputChange("vendeurs", value)}
            error={errors.vendeurs}
          />

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">
              Catégorie *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleInputChange("category", category)}
                    className={`px-4 py-2 rounded-full border ${
                      formData.category === category
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        formData.category === category
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.category && (
              <Text className="mt-1 text-sm text-red-500">
                {errors.category}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 py-3 bg-gray-200 rounded-lg dark:bg-gray-700"
              disabled={isLoading}
            >
              <Text className="font-medium text-center text-gray-700 dark:text-gray-300">
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className={`flex-1 py-3 rounded-lg ${
                isLoading ? "bg-gray-400" : "bg-blue-500"
              }`}
              disabled={isLoading}
            >
              <Text className="font-medium text-center text-white">
                {isLoading ? "Enregistrement..." : submitButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormProduct;
