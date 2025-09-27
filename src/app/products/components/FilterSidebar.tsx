"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import useBrands from "@/hooks/useBrands";
import SidebarHeader from "./filters/SidebarHeader";
import SearchFilter from "./filters/SearchFilter";
import BrandFilter from "./filters/BrandFilter";
import PriceFilter from "./filters/PriceFilter";

interface Props {
  mobile?: boolean;
}

export default function FiltersSidebar({ mobile = false }: Props) {
  // estado apertura (si es mobile arranca cerrado)
  const [open, setOpen] = useState(!mobile);

  const { brands, isLoading, error } = useBrands();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("query") ?? "";
  const brandParam = searchParams.get("brandId") ?? "";
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`products/?${params.toString()}`);
  };

  const baseClasses = mobile
    ? `fixed top-0 left-0 h-screen z-50 bg-gray-50 shadow-lg transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } w-64`
    : `bg-gray-50 border-r flex flex-col h-screen transition-all duration-300 ${
        open ? "w-64" : "w-14"
      }`;

  return (
    <>
      {mobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-[80px] right-4 z-50 bg-white border rounded-full p-3 shadow-lg hover:bg-gray-100"
        >
          <FiFilter className="w-5 h-5" />
        </button>
      )}

      <aside className={baseClasses}>
        <SidebarHeader open={open} setOpen={setOpen} />

        {open && (
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            <SearchFilter queryParam={queryParam} updateFilter={updateFilter} />

            <BrandFilter
              brandParam={brandParam}
              updateFilter={updateFilter}
              brands={brands}
              isLoading={isLoading}
              error={error}
            />

            <PriceFilter
              searchParams={searchParams}
              router={router}
              minPriceParam={minPriceParam}
              maxPriceParam={maxPriceParam}
            />
          </div>
        )}
      </aside>

      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}
    </>
  );
}
