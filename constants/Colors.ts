import { Category } from "@/types/product.type";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export const categoryColors: Record<Category, string> = {
  [Category.ELECTRONICS]: "#3B82F6", // Blue
  [Category.CLOTHING]: "#EF4444", // Red
  [Category.FOOD]: "#10B981", // Green
  [Category.BOOKS]: "#F59E0B", // Yellow
  [Category.SPORTS]: "#8B5CF6", // Purple
  [Category.HOME]: "#F97316", // Orange
  [Category.BEAUTY]: "#EC4899", // Pink
  [Category.AUTOMOTIVE]: "#6B7280", // Gray
  [Category.TOYS]: "#FBBF24", // Yellow
  [Category.HEALTH]: "#A345C2", // Purple
};
