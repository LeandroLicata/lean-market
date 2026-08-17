import { withAuth } from "next-auth/middleware";

// Protege solo páginas. Los handlers de API validan la sesión por su cuenta.
// `/cart` queda fuera a propósito: un visitante sin cuenta puede ver su carrito
// local y el login se le pide al ir al checkout.
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
