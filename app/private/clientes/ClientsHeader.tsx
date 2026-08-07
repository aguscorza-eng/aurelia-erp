"use client";

import { Plus, Search } from "lucide-react";

export default function ClientsHeader() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Clientes
          </h1>

          <p className="text-stone-500 mt-2">
            Administrá todos tus clientes.
          </p>

        </div>

        <button
          className="
            h-12
            px-6
            rounded-2xl
            bg-stone-900
            text-white
            flex
            items-center
            gap-2
          "
        >
          <Plus size={18} />

          Nuevo cliente

        </button>

      </div>

      <div
        className="
          h-14
          rounded-2xl
          bg-white
          border
          flex
          items-center
          px-5
          gap-3
        "
      >

        <Search
          size={20}
          className="text-stone-400"
        />

        <input
          placeholder="Buscar clientes..."
          className="flex-1 outline-none bg-transparent"
        />

      </div>

    </div>
  );
}