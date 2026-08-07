import {
  TrendingUp,
  Package,
  AlertTriangle,
  Flame,
} from "lucide-react";

const items = [
  {
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50",
    text: "Vendiste $18.500 hoy",
  },
  {
    icon: Package,
    color: "text-sky-600 bg-sky-50",
    text: "Tenés 14 pedidos pendientes",
  },
  {
    icon: AlertTriangle,
    color: "text-amber-600 bg-amber-50",
    text: "3 productos con stock bajo",
  },
  {
    icon: Flame,
    color: "text-rose-600 bg-rose-50",
    text: "Difusor Bamboo fue el más vendido",
  },
];

export default function DailySummary() {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-8 mb-8">

      <h2 className="text-2xl font-semibold mb-6">
        Resumen del día
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {items.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.text}
              className="flex items-center gap-4 rounded-2xl bg-stone-50 p-5"
            >

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <Icon size={22} />
              </div>

              <span className="font-medium text-stone-700">
                {item.text}
              </span>

            </div>

          );

        })}

      </div>

    </div>
  );
}