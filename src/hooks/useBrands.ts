"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "@/features/brand/brandSlice";
import { AppDispatch, RootState } from "@/store/store";

const useBrands = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { brands, status } = useSelector((state: RootState) => state.brand);

  const isLoading = status === "loading";
  const error =
    status === "failed" ? "Ocurrió un error al cargar las marcas." : null;

  const refetch = useCallback(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    brands,
    isLoading,
    error,
    refetch,
  };
};

export default useBrands;
