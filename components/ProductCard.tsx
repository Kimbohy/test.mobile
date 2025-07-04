import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { product } from "@/types/product.type";
import Badge from "./shared/CategoryBadge";

const ProductCard = ({ product }: { product: product }) => {
  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)}>
      <View
        className="flex-row gap-3 p-1 bg-white dark:bg-slate-600 rounded-xl"
        style={styles.card}
      >
        <Image
          source={product.image || "@/assets/images/products/default.jpeg"}
          placeholder={product.name}
          contentFit="cover"
          transition={1000}
          style={styles.image}
        />
        <View className="flex-1 mt-2">
          <Text className="text-xl dark:text-white">{product.name}</Text>
          <View className="justify-between flex-1">
            <Text className="text-sm text-gray-600 dark:text-white">
              {product.price} Ar
            </Text>
            <View className="self-end pb-1 pr-1">
              <Badge category={product.category} variant="sm" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  image: {
    width: 170,
    height: 100,
    borderRadius: 8,
  },
});

export default ProductCard;
