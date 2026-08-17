import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeanMarket",
  description:
    "Tienda de productos electrónicos y accesorios tecnológicos: consolas, auriculares, televisores y teléfonos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Columna de alto completo para que el footer quede abajo de la ventana
          aunque la página tenga poco contenido. Los providers no renderizan
          DOM, así que navbar, main y footer son hijos directos del body. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
