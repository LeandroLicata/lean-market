export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
  BrandId?: string;
  Brands?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  specifications?: Record<string, string>;
}
