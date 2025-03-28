"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
} from "@/features/product/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Product } from "@/types/product";

interface UseProductsOptions {
  type?: "all" | "featured";
}

const useProducts = ({ type = "all" }: UseProductsOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector(
    (state: RootState) => state.product.products
  ) as Product[];
  const featuredProducts = useSelector(
    (state: RootState) => state.product.featuredProducts
  ) as Product[];

  useEffect(() => {
    setIsLoading(true);
    const fetchAction =
      type === "featured" ? fetchFeaturedProducts() : fetchProducts();
    dispatch(fetchAction)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [dispatch, type]);

  return {
    products: type === "featured" ? featuredProducts : products,
    isLoading,
  };
};

export default useProducts;
