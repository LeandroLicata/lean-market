import { FiFilter } from "react-icons/fi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function SidebarHeader({ open, setOpen }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {open && <h2 className="font-semibold text-lg">Filtros</h2>}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 hover:bg-gray-200 rounded"
      >
        {open ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <FiFilter className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
