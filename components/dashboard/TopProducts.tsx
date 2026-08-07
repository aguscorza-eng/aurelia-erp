import { Flame, TrendingUp } from "lucide-react";

const products = [
  {
    name: "Difusor Bamboo",
    sales: 324,
    margin: "42%",
    color: "bg-emerald-100",
    emoji: "🥇",
  },
  {
    name: "Vela Lavanda",
    sales: 281,
    margin: "38%",
    color: "bg-amber-100",
    emoji: "🥈",
  },
  {
    name: "Gift Box Premium",
    sales: 194,
    margin: "35%",
    color: "bg-rose-100",
    emoji: "🥉",
  },
  {
    name: "Hornito Nórdico",
    sales: 132,
    margin: "31%",
    color: "bg-sky-100",
    emoji: "⭐",
  },
];

export default function TopProducts() {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-sm text-stone-500">
            Ranking
          </p>

          <h2 className="text-3xl font-semibold mt-1">
            Productos más vendidos
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#F8F2E9] flex items-center justify-center">

          <Flame
            size={26}
            className="text-[#B08D57]"
          />

        </div>

      </div>

      <div className="grid grid-cols-4 gap-6">

        {products.map((product) => (

          <div
            key={product.name}
            className="border border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >

            <div
              className={`w-16 h-16 rounded-2xl ${product.color} flex items-center justify-center text-3xl mb-5`}
            >
              {product.emoji}
            </div>

            <h3 className="font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-stone-500 mt-2">
              {product.sales} ventas
            </p>

            <div className="flex items-center gap-2 mt-5 text-emerald-600">

              <TrendingUp size={18} />

              <span className="font-medium">

                Margen {product.margin}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}