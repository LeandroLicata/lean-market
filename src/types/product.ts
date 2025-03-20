export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  brand: {
    id: string;
    name: string;
    logo_url: string;
  };
}
