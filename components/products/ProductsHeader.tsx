"use client";

import { Plus } from "lucide-react";

interface Props {
  onNewProduct: () => void;
}

export default function ProductsHeader({
  onNewProduct,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          Productos
        </h1>

        <p className="text-stone-500 mt-2">
          Administrá tu inventario de productos.
        </p>

      </div>

      <button
        onClick={onNewProduct}
        className="
          h-12
          px-6
          rounded-2xl
          bg-stone-900
          text-white
          flex
          items-center
          gap-2
          hover:bg-stone-800
          transition
        "
      >
        <Plus size={18} />
        Nuevo producto
      </button>

    </div>
  );
}