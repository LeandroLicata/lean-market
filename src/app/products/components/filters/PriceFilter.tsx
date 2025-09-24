"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  searchParams: ReturnType<typeof useSearchParams>;
  router: ReturnType<typeof useRouter>;
  minPriceParam: string;
  maxPriceParam: string;
}

export default function PriceFilter({
  searchParams,
  router,
  minPriceParam,
  maxPriceParam,
}: Props) {
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);
  const [priceError, setPriceError] = useState("");

  const applyPriceFilter = () => {
    const min = parseFloat(minPriceInput);
    const max = parseFloat(maxPriceInput);

    const minValue = isNaN(min) ? undefined : min;
    const maxValue = isNaN(max) ? undefined : max;

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      minValue > maxValue
    ) {
      setPriceError("El precio mínimo no puede ser mayor que el máximo");
      return;
    }

    setPriceError("");

    const params = new URLSearchParams(searchParams.toString());
    if (minValue !== undefined) params.set("minPrice", String(minValue));
    else params.delete("minPrice");

    if (maxValue !== undefined) params.set("maxPrice", String(maxValue));
    else params.delete("maxPrice");

    router.push(`products/?${params.toString()}`);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Precio</label>
      <div className="flex space-x-2">
        <input
          type="number"
          min={0}
          value={minPriceInput}
          onChange={(e) => setMinPriceInput(e.target.value)}
          className="w-1/2 border rounded p-2"
          placeholder="Mín"
        />
        <input
          type="number"
          min={0}
          value={maxPriceInput}
          onChange={(e) => setMaxPriceInput(e.target.value)}
          className="w-1/2 border rounded p-2"
          placeholder="Máx"
        />
      </div>
      {priceError && <p className="text-red-500 text-sm mt-1">{priceError}</p>}

      <button
        onClick={applyPriceFilter}
        className="mt-2 w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
      >
        Aplicar
      </button>
    </div>
  );
}
