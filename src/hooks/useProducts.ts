"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
} from "@/features/product/productSlice";
import { AppDispatch, RootState } from "@/store/store";

interface UseProductsOptions {
  type?: "all" | "featured";
  query?: string;
}

const useProducts = ({ type = "all", query }: UseProductsOptions = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) =>
    type === "featured"
      ? state.product.featuredProducts
      : state.product.products
  );

  const status = useSelector((state: RootState) =>
    type === "featured"
      ? state.product.status.featured
      : state.product.status.list
  );

  const isLoading = status === "loading";
  const error =
    status === "failed" ? "Ocurrió un error al cargar los productos." : null;

  const refetch = (overrideQuery?: string) => {
    if (type === "featured") {
      dispatch(fetchFeaturedProducts());
    } else {
      dispatch(fetchProducts(overrideQuery ?? query));
    }
  };

  useEffect(() => {
    refetch(query);
  }, [type, query]);

  return {
    products,
    isLoading,
    error,
    refetch,
  };
};

export default useProducts;
