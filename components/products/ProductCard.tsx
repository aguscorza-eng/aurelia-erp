import {
  Package,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

interface Props {
  name: string;
  stock: number;
  price: string;
}

export default function ProductCard({
  name,
  stock,
  price,
}: Props) {
  const stockColor =
    stock <= 5
      ? "bg-red-100 text-red-700"
      : stock <= 15
      ? "bg-yellow-100 text-yellow-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div className="group bg-white rounded-3xl border border-stone-200 hover:border-stone-300 hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Imagen */}

      <div className="h-48 bg-stone-100 flex items-center justify-center">

        <Package
          size={70}
          className="text-stone-300"
        />

      </div>

      {/* Contenido */}

      <div className="p-6">

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-xl font-semibold">

              {name}

            </h2>

            <p className="text-stone-500 mt-1">
              SKU-0001
            </p>

          </div>

          <button className="opacity-0 group-hover:opacity-100 transition">

            <MoreHorizontal
              size={20}
              className="text-stone-400"
            />

          </button>

        </div>

        <div className="mt-6 flex justify-between items-center">

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${stockColor}`}
          >
            Stock {stock}
          </span>

          <p className="text-2xl font-bold">
            {price}
          </p>

        </div>

        <div className="flex gap-3 mt-6">

          <button className="flex-1 h-11 rounded-xl bg-stone-900 text-white flex items-center justify-center gap-2 hover:bg-stone-800 transition">

            <Pencil size={16} />

            Editar

          </button>

          <button className="h-11 w-11 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition">

            <Trash2 size={17} />

          </button>

        </div>

      </div>

    </div>
  );
}