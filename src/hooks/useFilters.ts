"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (brandId) params.set("brandId", brandId);

    router.push(`/products?${params.toString()}`);
  };

  return {
    query,
    setQuery,
    brandId,
    setBrandId,
    applyFilters,
  };
}
