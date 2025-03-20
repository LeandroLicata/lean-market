"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/features/product/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Product } from "@/types/product";

const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const products = useSelector(
    (state: RootState) => state.product.products
  ) as Product[];
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchProducts())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [dispatch]);

  return { products, isLoading };
};

export default useProducts;
