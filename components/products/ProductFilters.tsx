"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function ProductFilters({
  search,
  setSearch,
}: Props) {
  return (
    <div className="space-y-4">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, SKU o categoría..."
          className="
            w-full
            h-12
            pl-11
            pr-4
            rounded-2xl
            border
            border-stone-200
            bg-white
            outline-none
            focus:ring-2
            focus:ring-stone-300
          "
        />

      </div>

      <div className="flex gap-3 flex-wrap">

        <select className="h-11 px-4 rounded-xl border border-stone-200 bg-white">
          <option>Todas las categorías</option>
        </select>

        <select className="h-11 px-4 rounded-xl border border-stone-200 bg-white">
          <option>Todos los estados</option>
          <option>En stock</option>
          <option>Stock bajo</option>
          <option>Sin stock</option>
        </select>

        <select className="h-11 px-4 rounded-xl border border-stone-200 bg-white">
          <option>Más recientes</option>
          <option>Nombre A-Z</option>
          <option>Mayor stock</option>
          <option>Menor stock</option>
        </select>

      </div>

    </div>
  );
}