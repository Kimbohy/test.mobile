import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View, Text } from "react-native";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text className="text-2xl font-bold dark:text-white">
        Product ID: {id}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProductDetail;
