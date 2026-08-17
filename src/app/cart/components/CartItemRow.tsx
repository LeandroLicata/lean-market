"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CartItem } from "@/types/cartItem";

type Props = {
  item: CartItem;
  disabled: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export default function CartItemRow({
  item,
  disabled,
  onQuantityChange,
  onRemove,
}: Props) {
  // Hay productos con `image_url` apuntando a imágenes que ya no existen.
  const [imageFailed, setImageFailed] = useState(false);

  const product = item.product;
  if (!product) return null;

  const price = Number(product.price ?? 0);
  const subtotal = price * item.quantity;
  const atStockLimit = item.quantity >= product.stock;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link href={`/products/${product.id}`} className="shrink-0">
          {product.image_url && !imageFailed ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <Link href={`/products/${product.id}`}>
            <h2 className="font-medium hover:text-sky-bright transition">
              {product.name}
            </h2>
          </Link>
          <p className="mt-1 text-gray-700 font-semibold">
            ${price.toFixed(2)}
          </p>
          {atStockLimit && (
            <p className="text-xs text-amber-600 mt-1">
              Alcanzaste el stock disponible
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity - 1)}
            disabled={disabled}
            aria-label="Quitar una unidad"
            className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="px-4 font-semibold tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={disabled || atStockLimit}
            aria-label="Agregar una unidad"
            className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="w-24 text-right font-semibold tabular-nums">
          ${subtotal.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Quitar ${product.name} del carrito`}
          className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
