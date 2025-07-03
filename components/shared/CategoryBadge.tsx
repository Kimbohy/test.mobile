import { categoryColors } from "@/constants/Colors";
import { Category } from "@/types/product.type";
import { StyleSheet, View, Text } from "react-native";

function Badge({
  category,
  variant,
}: {
  category: Category;
  variant?: "sm" | "md";
}) {
  const backgroundColor = categoryColors[category] || "#6B7280";

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text
        style={[
          styles.badgeText,
          variant === "sm" ? { fontSize: 12 } : { fontSize: 17 },
        ]}
      >
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
  },
});

export default Badge;
