"use client";

import { Product } from "@/types/product";
import Link from "next/link";

const ProductCard: React.FC<Product> = ({
  id,
  name,
  description,
  image_url,
  price,
  Brands,
}) => {
  return (
    <Link href={`/products/${id}`}>
      <div
        className="border p-4 rounded-lg shadow-md bg-white 
                   cursor-pointer transition-transform duration-200 
                   hover:shadow-lg hover:scale-105 h-full flex flex-col"
      >
        <img
          src={image_url}
          alt={name}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
          {description}
        </p>

        {Brands && (
          <div className="flex items-center gap-2 mt-2">
            {/* Contenedor SOLO para el logo */}
            <div className="w-12 h-6 flex items-center justify-center">
              <img
                src={Brands.logo_url}
                alt={Brands.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {/* Nombre de la marca */}
            <span className="text-xs text-gray-500 italic">{Brands.name}</span>
          </div>
        )}

        <p className="text-lg font-bold mt-2">${price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
