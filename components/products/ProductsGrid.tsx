import ProductCard from "../../components/products/ProductCard";

const products = [
  {
    name: "Difusor Bamboo",
    stock: 52,
    price: "$12.500",
  },
  {
    name: "Vela Lavanda",
    stock: 18,
    price: "$8.900",
  },
  {
    name: "Gift Box Premium",
    stock: 12,
    price: "$25.000",
  },
  {
    name: "Hornito Cerámico",
    stock: 4,
    price: "$9.900",
  },
  {
    name: "Esencia Vainilla",
    stock: 33,
    price: "$6.500",
  },
  {
    name: "Pack Relax",
    stock: 2,
    price: "$19.500",
  },
];

export default function ProductsGrid() {
  return (
    <div className="space-y-6">

      {/* Resumen */}

      <div className="grid grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-stone-500 text-sm">
            Productos
          </p>

          <h2 className="text-3xl font-bold mt-2">
            126
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-stone-500 text-sm">
            Stock Bajo
          </p>

          <h2 className="text-3xl font-bold text-amber-600 mt-2">
            8
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-stone-500 text-sm">
            Sin Stock
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            2
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-stone-500 text-sm">
            Valor Inventario
          </p>

          <h2 className="text-3xl font-bold mt-2">
            $3.8M
          </h2>
        </div>

      </div>

      {/* Productos */}

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-7">

        {products.map((product) => (
          <ProductCard
            key={product.name}
            {...product}
          />
        ))}

      </div>

    </div>
  );
}