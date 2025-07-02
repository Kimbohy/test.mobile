import { Text } from "react-native";
import { View } from "@/components/Themed";
import { Link } from "expo-router";

export default function Products() {
  return (
    <View>
      <Text className="text-2xl font-bold text-black dark:text-white">
        Products
      </Text>
      <Link href="/product/1" asChild>
        <Text className="text-blue-500">Go to Product 1</Text>
      </Link>
    </View>
  );
}
