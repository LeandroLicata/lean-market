"use client";

import { Product } from "@/types/product";

const ProductCard: React.FC<Product> = ({
  name,
  description,
  image_url,
  price,
  Brands,
}) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <img
        src={image_url}
        alt={name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      {Brands && (
        <div className="flex items-center mt-2">
          <img
            src={Brands?.logo_url}
            alt={Brands?.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">{Brands?.name}</span>
        </div>
      )}
      <p className="text-lg font-bold mt-2">${price}</p>
    </div>
  );
};

export default ProductCard;
