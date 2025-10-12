import { Brand } from "./brand";

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
  stock: number;
  BrandId?: string;
  Brands?: Brand;
  specifications?: Record<string, string>;
}
