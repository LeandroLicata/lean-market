import {
  getProducts,
  createProduct,
  updateProduct,
} from "@/server/handlers/products";

export const GET = getProducts;
export const POST = createProduct;
export const PATCH = updateProduct;
