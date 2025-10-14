"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "@/features/cart/cartSlice";
import { AppDispatch, RootState } from "@/store/store";

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { cart, status, error } = useSelector((state: RootState) => state.cart);

  const isLoading = status === "loading";
  const hasError =
    status === "failed" ? "Ocurrió un error al cargar el carrito." : null;

  const refetch = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAddToCart = useCallback(
    async (productId: string, quantity = 1) => {
      try {
        await dispatch(addToCart({ productId, quantity })).unwrap();
      } catch (err) {
        console.error("Error al agregar al carrito:", err);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    cart,
    isLoading,
    error: hasError || error,
    refetch,
    addToCart: handleAddToCart,
  };
};

export default useCart;
