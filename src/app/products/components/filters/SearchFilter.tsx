interface Props {
  queryParam: string;
  updateFilter: (key: string, value: string) => void;
}

export default function SearchFilter({ queryParam, updateFilter }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Buscar</label>
      <input
        type="text"
        defaultValue={queryParam}
        onChange={(e) => updateFilter("query", e.target.value)}
        className="w-full border rounded p-2"
        placeholder="Ej: notebook"
      />
    </div>
  );
}
