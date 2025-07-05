import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { getProductById } from "@/service/product.service";
import { Image } from "expo-image";
import Badge from "@/components/shared/CategoryBadge";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { deleteProduct } from "@/service/product.service";
import SuppressionModal from "@/components/shared/SuppressionModal";
import { useProductContext } from "@/context/ProductContext";

const ProductDetail = () => {
  const [showSuppressionModal, setShowSuppressionModal] = useState(false);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { triggerRefresh } = useProductContext();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = getProductById(productId as string);

  const handleDeleteProduct = async () => {
    if (!product || !productId) {
      console.error("Product or productId not found");
      return;
    }

    try {
      const success = await deleteProduct(productId);
      if (success) {
        // Trigger refresh of product list
        triggerRefresh();
        setShowSuppressionModal(false);
        router.back();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  if (!product) {
    return (
      <View>
        <Text>Product not found</Text>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <View className="relative">
        <Image
          source={product.image}
          placeholder={product.name}
          contentFit="cover"
          transition={1000}
          style={{ width: "100%", height: 400, borderRadius: 0 }}
        />
        <TouchableOpacity
          className="absolute p-2 rounded-full top-4 left-4 bg-black/20"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 -mt-6 bg-white shadow-lg dark:bg-gray-800 rounded-t-3xl">
        <View className="gap-4 p-6 space-y-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </Text>
              <Text className="text-lg font-semibold text-black dark:text-gray-200">
                {product.price} Ar
              </Text>
            </View>
            <Badge category={product.category} />
          </View>

          <View className="">
            <Text className="text-lg leading-6 text-gray-900 dark:text-gray-300">
              {product.description}
            </Text>
          </View>

          <View className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <Text className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              Vendeur
            </Text>
            <Text className="text-base text-gray-900 dark:text-white">
              {product.vendeurs}
            </Text>
          </View>

          <View className="p-4 bg-blue-50 dark:bg-blue-600/20 rounded-xl">
            <Text className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              Stock disponible
            </Text>
            <Text className="text-base font-semibold text-blue-800 dark:text-blue-300">
              {product.stock} unités
            </Text>
          </View>

          <View className="gap-2">
            <TouchableOpacity
              className="p-4 mt-6 transition-transform bg-blue-600 dark:bg-blue-500 rounded-xl active:scale-95"
              onPress={() =>
                router.push(`/product/edit?productId=${productId}`)
              }
            >
              <Text className="text-lg font-semibold text-center text-white">
                Modifier le produit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-3 transition-transform bg-red-500 border-2 border-red-600 rounded-xl active:scale-95"
              onPress={() => setShowSuppressionModal(true)}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showSuppressionModal && (
        <SuppressionModal
          productId={productId}
          onConfirm={handleDeleteProduct}
          onCancel={() => setShowSuppressionModal(false)}
        />
      )}
    </View>
  );
};

export default ProductDetail;
