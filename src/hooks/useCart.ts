"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  adjustmentsCleared,
  clearCart,
  fetchCart,
  guestCartCleared,
  guestItemAdded,
  guestItemRemoved,
  guestItemUpdated,
  removeItem,
  updateItem,
} from "@/features/cart/cartSlice";
import { clearGuestCart } from "@/features/cart/guestCart";
import { AppDispatch, RootState } from "@/store/store";
import { Product } from "@/types/product";

/**
 * Consumo del carrito. No dispara la carga inicial: de eso se encarga
 * `CartSync`, montado una sola vez en los providers.
 *
 * Las acciones funcionan igual con o sin cuenta: en modo invitado escriben en
 * localStorage y en modo usuario van contra la API.
 */
const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { cart, mode, adjustments, status, error } = useSelector(
    (state: RootState) => state.cart
  );

  const isGuest = mode === "guest";
  const items = cart.items;

  const { totalItems, totalPrice } = useMemo(
    () =>
      items.reduce(
        (totals, item) => {
          totals.totalItems += item.quantity;
          totals.totalPrice += Number(item.product?.price ?? 0) * item.quantity;
          return totals;
        },
        { totalItems: 0, totalPrice: 0 }
      ),
    [items]
  );

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (isGuest) {
        dispatch(guestItemAdded({ product, quantity }));
        return;
      }
      // `unwrap` propaga el mensaje del servidor (por ejemplo el de stock).
      await dispatch(addItem({ productId: product.id, quantity })).unwrap();
    },
    [dispatch, isGuest]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (isGuest) {
        dispatch(guestItemUpdated({ productId, quantity }));
        return;
      }
      await dispatch(updateItem({ productId, quantity })).unwrap();
    },
    [dispatch, isGuest]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (isGuest) {
        dispatch(guestItemRemoved(productId));
        return;
      }
      await dispatch(removeItem({ productId })).unwrap();
    },
    [dispatch, isGuest]
  );

  const emptyCart = useCallback(async () => {
    if (isGuest) {
      dispatch(guestCartCleared());
      clearGuestCart();
      return;
    }
    await dispatch(clearCart()).unwrap();
  }, [dispatch, isGuest]);

  const refetch = useCallback(() => {
    if (isGuest) return;
    dispatch(fetchCart());
  }, [dispatch, isGuest]);

  const dismissAdjustments = useCallback(() => {
    dispatch(adjustmentsCleared());
  }, [dispatch]);

  return {
    cart,
    items,
    isGuest,
    totalItems,
    totalPrice,
    isLoading: status.fetch === "loading",
    isMutating: status.mutate === "loading",
    isMerging: status.merge === "loading",
    error: error.fetch,
    mutationError: error.mutate,
    adjustments,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
    refetch,
    dismissAdjustments,
  };
};

export default useCart;
