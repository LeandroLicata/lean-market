import { Brand } from "@/types/brand";

interface Props {
  brandParam: string;
  updateFilter: (key: string, value: string) => void;
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
}

export default function BrandFilter({
  brandParam,
  updateFilter,
  brands,
  isLoading,
  error,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Marca</label>
      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          value={brandParam}
          onChange={(e) => updateFilter("brandId", e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
