"use client";

import { useState, type ReactNode } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

type Props = {
  src?: string | null;
  alt: string;
  /** Se usa tanto en la imagen como en el recuadro de reemplazo, para que midan igual. */
  className?: string;
  /** Qué mostrar si no carga. `null` no muestra nada. */
  fallback?: ReactNode;
};

/**
 * Imagen de producto o logo de marca con reemplazo si la URL no carga.
 *
 * Varios `image_url` de la base apuntan a tiendas que borraron sus imágenes o
 * que bloquean el hotlinking, y sin esto el navegador muestra el ícono de
 * imagen rota con el texto alternativo al lado.
 */
export default function ProductImage({
  src,
  alt,
  className = "",
  fallback,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center`}
        role="img"
        aria-label={alt}
      >
        <PhotoIcon className="w-1/3 h-1/3 text-gray-300" />
      </div>
    );
  }

  return (
    // Se usa <img> y no next/image porque las URLs vienen de dominios externos
    // arbitrarios y varias fallan: lo que importa acá es capturar el onError.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
