"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductDetail,
} from "@/features/product/productSlice";
import { AppDispatch, RootState } from "@/store/store";

interface ProductFilters {
  query?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

interface UseProductsOptions {
  type?: "all" | "featured" | "detail";
  filters?: ProductFilters;
  id?: string;
}

const useProducts = ({
  type = "all",
  filters = {},
  id,
}: UseProductsOptions) => {
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

  const refetch = () => {
    if (type === "featured") {
      dispatch(fetchFeaturedProducts());
    } else if (type === "detail" && id) {
      dispatch(fetchProductDetail(id));
    } else {
      dispatch(fetchProducts(filters));
    }
  };

  useEffect(() => {
    refetch();
  }, [type, id, JSON.stringify(filters)]);

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
