import { FlatList, Text } from "react-native";
import { View } from "@/components/Themed";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/service/product.service";

export default function Products() {
  const products = getProducts();
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, marginTop: 15 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
