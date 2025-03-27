export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  Brands: {
    id: string;
    name: string;
    logo_url: string;
  };
}
