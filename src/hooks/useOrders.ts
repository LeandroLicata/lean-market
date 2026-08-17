"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmOrder, getOrders } from "@/features/order/orderSlice";
import { AppDispatch, RootState } from "@/store/store";

type Options = {
  /** Pedir los pedidos al montar. La página de checkout no los necesita. */
  fetchOnMount?: boolean;
};

const useOrders = ({ fetchOnMount = false }: Options = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { orders, lastOrder, status, error } = useSelector(
    (state: RootState) => state.order
  );

  const refetch = useCallback(() => {
    dispatch(getOrders());
  }, [dispatch]);

  /** Devuelve la orden creada; lanza el mensaje del servidor si falla. */
  const confirm = useCallback(async () => {
    return dispatch(confirmOrder()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    // Siempre al montar: después de comprar, la lista de la visita anterior
    // quedaría sin el pedido nuevo.
    if (fetchOnMount) refetch();
  }, [fetchOnMount, refetch]);

  return {
    orders,
    lastOrder,
    isLoading: status.fetch === "loading",
    isConfirming: status.confirm === "loading",
    error: error.fetch,
    confirmError: error.confirm,
    confirm,
    refetch,
  };
};

export default useOrders;
