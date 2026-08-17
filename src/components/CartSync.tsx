"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  fetchCart,
  guestCartHydrated,
  mergeGuestCart,
  modeChanged,
  validateGuestCart,
} from "@/features/cart/cartSlice";
import { clearGuestCart, loadGuestCart, toPayload } from "@/features/cart/guestCart";
import { AppDispatch, RootState } from "@/store/store";

/**
 * Dueño único de la carga del carrito. Va montado una sola vez en los providers
 * y no renderiza nada: así el carrito se pide una vez por sesión en lugar de
 * una vez por componente que lo consuma, y el merge del carrito de invitado no
 * puede dispararse dos veces en paralelo.
 */
export default function CartSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { status: sessionStatus } = useSession();

  const mode = useSelector((state: RootState) => state.cart.mode);
  const fetchStatus = useSelector((state: RootState) => state.cart.status.fetch);
  const mergeStatus = useSelector((state: RootState) => state.cart.status.merge);

  // Último estado de sesión ya resuelto, para distinguir "recién inició sesión"
  // de "entró a la página ya autenticado".
  const previousSession = useRef<"authenticated" | "unauthenticated" | null>(
    null
  );

  // El modo sigue a la sesión.
  useEffect(() => {
    if (sessionStatus === "loading") return;
    dispatch(modeChanged(sessionStatus === "authenticated" ? "user" : "guest"));
  }, [sessionStatus, dispatch]);

  // Al iniciar sesión, el carrito local se fusiona con el de la cuenta.
  useEffect(() => {
    if (sessionStatus === "loading") return;

    const justLoggedIn =
      previousSession.current === "unauthenticated" &&
      sessionStatus === "authenticated";
    previousSession.current = sessionStatus;

    if (!justLoggedIn) return;

    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    dispatch(mergeGuestCart({ items: toPayload(guestItems) }))
      .unwrap()
      // El localStorage se limpia solo si el merge salió bien; si falla, el
      // carrito local queda intacto para reintentar.
      .then(() => clearGuestCart())
      .catch(() => {});
  }, [sessionStatus, dispatch]);

  // Carga inicial, una sola vez por modo.
  useEffect(() => {
    if (sessionStatus === "loading") return;

    // Espera a que el modo refleje la sesión antes de pedir nada.
    const expectedMode = sessionStatus === "authenticated" ? "user" : "guest";
    if (mode !== expectedMode) return;

    if (fetchStatus !== "idle") return;
    // El merge ya devuelve el carrito fusionado: no hace falta pedirlo aparte.
    if (mergeStatus !== "idle") return;

    if (mode === "user") {
      dispatch(fetchCart());
      return;
    }

    const guestItems = loadGuestCart();
    dispatch(guestCartHydrated(guestItems));
    if (guestItems.length > 0) {
      // Revalida precios y stock: la copia del localStorage puede estar vieja.
      dispatch(validateGuestCart({ items: toPayload(guestItems) }));
    }
  }, [mode, sessionStatus, fetchStatus, mergeStatus, dispatch]);

  return null;
}
