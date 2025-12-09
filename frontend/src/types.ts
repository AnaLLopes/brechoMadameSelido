export type Category = "feminino" | "masculino" | "infantil";
export interface Product {
  id: number;
  name: string;
  description?: string;
  category: Category;
  size?: string;
  number?: string;
  price: number;
  discount_percent?: number;
  available: boolean;
  image_url?: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
