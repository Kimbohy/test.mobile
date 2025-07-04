import { Text } from "react-native";
import { View } from "@/components/Themed";

interface ProductListHeaderProps {}

export default function ProductListHeader({}: ProductListHeaderProps) {
  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          margin: 16,
        }}
      >
        Liste des produits
      </Text>
    </View>
  );
}
