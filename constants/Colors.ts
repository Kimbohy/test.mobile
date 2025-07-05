import { Category } from "@/types/product.type";

const tintColorLight = "#2f95dc";
const tintColorDark = "#0A84FF";

export default {
  light: {
    text: "#1f2937", // gris très foncé plutôt que #000
    background: "#f9fafb", // blanc cassé plus doux
    tint: tintColorLight,
    tabIconDefault: "#9ca3af", // gris moyen pour icon inactive
    tabIconSelected: tintColorLight,
    border: "#e5e7eb", // couleur de séparation subtile
    card: "#ffffff", // couleur de fond de carte
    shadow: "rgba(0, 0, 0, 0.1)", // ombre légère
  },
  dark: {
    text: "#e5e7eb", // gris clair pour texte
    background: "#121212", // gris anthracite (moins agressif que #000)
    tint: tintColorDark,
    tabIconDefault: "#6b7280", // gris plus foncé
    tabIconSelected: tintColorDark,
    border: "#2c2c2e", // ligne de séparation discrète
    card: "#1e1e1f", // fond de carte en dark
    shadow: "rgba(0, 0, 0, 0.6)", // ombre plus marquée pour relief
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
