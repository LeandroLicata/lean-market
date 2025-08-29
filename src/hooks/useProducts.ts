"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductDetail,
} from "@/features/product/productSlice";
import { AppDispatch, RootState } from "@/store/store";

interface UseProductsOptions {
  type?: "all" | "featured" | "detail";
  query?: string; 
  id?: string; 
}

const useProducts = ({ type = "all", query, id }: UseProductsOptions) => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, featuredProducts, productDetail, status } = useSelector(
    (state: RootState) => state.product
  );

  const currentStatus =
    type === "featured"
      ? status.featured
      : type === "detail"
      ? status.detail
      : status.list;

  const isLoading = currentStatus === "loading";
  const error =
    currentStatus === "failed"
      ? "Ocurrió un error al cargar los productos."
      : null;

  const refetch = (overrideQuery?: string, overrideId?: string) => {
    if (type === "featured") {
      dispatch(fetchFeaturedProducts());
    } else if (type === "detail" && (overrideId ?? id)) {
      dispatch(fetchProductDetail(overrideId ?? id!));
    } else {
      dispatch(fetchProducts(overrideQuery ?? query));
    }
  };

  useEffect(() => {
    if (type === "detail") {
      if (!id) return; 
      refetch(undefined, id);
    } else {
      refetch(query);
    }
  }, [type, query, id]);

  return {
    products,
    featuredProducts,
    productDetail,
    isLoading,
    error,
    refetch,
  };
};

export default useProducts;
