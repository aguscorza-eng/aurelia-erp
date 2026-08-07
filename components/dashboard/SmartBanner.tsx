import {
  AlertTriangle,
  CheckCircle2,
  Flame,
} from "lucide-react";

type BannerType = "warning" | "success" | "highlight" | null;

// Cambiá este valor para probar distintos estados
const banner: BannerType = "warning";

export default function SmartBanner() {
  if (banner === null) return null;

  if (banner === "warning") {
    return (
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 flex items-center gap-4">

        <AlertTriangle
          size={24}
          className="text-amber-600"
        />

        <div>

          <h3 className="font-semibold text-amber-900">
            Atención
          </h3>

          <p className="text-amber-700 mt-1">
            Hay 3 productos con stock crítico.
            Revisá el inventario para evitar faltantes.
          </p>

        </div>

      </div>
    );
  }

  if (banner === "success") {
    return (
      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 flex items-center gap-4">

        <CheckCircle2
          size={24}
          className="text-emerald-600"
        />

        <div>

          <h3 className="font-semibold text-emerald-900">
            Excelente jornada
          </h3>

          <p className="text-emerald-700 mt-1">
            Las ventas vienen un 18% por encima del mes pasado.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 flex items-center gap-4">

      <Flame
        size={24}
        className="text-rose-600"
      />

      <div>

        <h3 className="font-semibold text-rose-900">
          Producto destacado
        </h3>

        <p className="text-rose-700 mt-1">
          Difusor Bamboo es el producto más vendido de la semana.
        </p>

      </div>

    </div>
  );
}