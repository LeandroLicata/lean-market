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
}

const useProducts = ({ type = "all" }: UseProductsOptions = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) =>
    type === "featured"
      ? state.product.featuredProducts
      : state.product.products
  );

  const status = useSelector((state: RootState) =>
    type === "featured" ? state.product.featuredStatus : state.product.status
  );

  const isLoading = status === "loading";
  const error =
    status === "failed" ? "Ocurrió un error al cargar los productos." : null;

  const refetch = () => {
    const fetchAction =
      type === "featured" ? fetchFeaturedProducts() : fetchProducts();
    dispatch(fetchAction);
  };

  useEffect(() => {
    if (status === "idle") {
      refetch();
    }
  }, [dispatch, type]);

  return {
    products,
    isLoading,
    error,
    refetch,
  };
};

export default useProducts;
