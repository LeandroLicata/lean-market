"use client";

interface SortFilterProps {
  sortBy: string;
  order: string;
  updateFilter: (
    key: string | Record<string, string | undefined>,
    value?: string
  ) => void;
}

const sortOptions = [
  { value: "", label: "Por defecto" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc", label: "Nombre: A-Z" },
  { value: "name_desc", label: "Nombre: Z-A" },
];

export default function SortFilter({
  sortBy,
  order,
  updateFilter,
}: SortFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      updateFilter({ sortBy: undefined, order: undefined });
      return;
    }

    const [field, direction] = value.split("_");
    updateFilter({ sortBy: field, order: direction });
  };

  const currentValue = sortBy && order ? `${sortBy}_${order}` : "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ordenar por
      </label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
        value={currentValue}
        onChange={handleChange}
      >
        {sortOptions.map(({ value, label }) => (
          <option key={value || "default"} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
