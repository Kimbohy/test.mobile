export type product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category;
  vendeurs: string;
  image: string | number; // Can be string (URI) or number (require result)
  isActive: boolean;
};

export enum Category {
  ELECTRONICS = "électronique",
  CLOTHING = "vêtements",
  BOOKS = "livres",
  HOME = "maison",
  SPORTS = "sports",
  BEAUTY = "beauté",
  FOOD = "alimentation",
  AUTOMOTIVE = "automobile",
  TOYS = "jouets",
  HEALTH = "santé",
}
