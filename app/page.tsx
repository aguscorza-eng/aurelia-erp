"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SalesChart from "@/components/dashboard/SalesChart";

import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Box,
  Clock,
  Receipt,
} from "lucide-react";

const money = (n: number) =>
  `$${n.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const today = new Date().toLocaleDateString("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function Home() {
  const [sales, setSales] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setSales(JSON.parse(localStorage.getItem("sales") || "[]"));
    setPurchases(JSON.parse(localStorage.getItem("purchases") || "[]"));
    setBudgets(JSON.parse(localStorage.getItem("budgets") || "[]"));
    setClients(JSON.parse(localStorage.getItem("clients") || "[]"));
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  const totalSales = sales.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

  const totalPurchases = purchases.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

  const gain = totalSales - totalPurchases;

  const pendingOrders = budgets.filter((b) => b.status === "PENDIENTE").length;

  const criticalStock = products.filter((p) => Number(p.stock || 0) <= 3).length;

  const unitsSold = sales.reduce(
    (acc, item) => acc + Number(item.quantity || 1),
    0
  );

  return (
    <main className="flex h-screen bg-[#F8F8F6]">
      <Sidebar />

      <section className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
          {/* ENCABEZADO */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
                Panel general
              </p>
              <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
            </div>
            <p className="text-sm text-stone-400 capitalize">{today}</p>
          </div>

          {/* ALERTA STOCK */}
          {criticalStock > 0 && (
            <div className="bg-[#FFF9E8] border border-yellow-200/80 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm shadow-yellow-100">
              <div className="bg-yellow-100 rounded-full p-2 shrink-0">
                <AlertTriangle size={16} className="text-yellow-700" />
              </div>
              <p className="text-sm text-stone-700">
                <strong className="font-semibold">Atención: </strong>
                Hay {criticalStock} producto{criticalStock !== 1 && "s"} con
                stock crítico.
              </p>
            </div>
          )}

          {/* INDICADORES */}
          <section>
            <SectionLabel>Resumen del mes</SectionLabel>
            <div className="grid grid-cols-4 gap-5 mt-4">
              <Card
                title="Ventas del mes"
                value={money(totalSales)}
                icon={<TrendingUp size={19} />}
                tone="neutral"
              />

              <Card
                title="Ganancia"
                value={money(gain)}
                icon={
                  gain >= 0 ? (
                    <TrendingUp size={19} />
                  ) : (
                    <TrendingDown size={19} />
                  )
                }
                tone={gain >= 0 ? "positive" : "negative"}
              />

              <Card
                title="Productos vendidos"
                value={unitsSold}
                icon={<Box size={19} />}
                tone="neutral"
              />

              <Card
                title="Pedidos pendientes"
                value={pendingOrders}
                icon={<Clock size={19} />}
                tone={pendingOrders > 0 ? "warning" : "neutral"}
              />
            </div>
          </section>

          {/* GRAFICO + RANKING */}
          <section>
            <SectionLabel>Rendimiento</SectionLabel>
            <div className="grid grid-cols-3 gap-6 mt-4 items-stretch">
              <div className="col-span-2 h-full">
                <SalesChart sales={sales} />
              </div>

              <div className="bg-white border border-stone-100 rounded-3xl p-7 shadow-sm shadow-stone-200/40 h-full">
                <p className="text-xs tracking-widest text-stone-400 font-medium">
                  RANKING
                </p>
                <h2 className="text-lg font-bold mt-1 text-stone-900">
                  Producto líder
                </h2>

                <div className="bg-[#F8F2E9] rounded-2xl p-4 mt-5">
                  <strong className="text-stone-900">
                    {products.length > 0 ? products[0]?.name : "Sin datos"}
                  </strong>
                  <p className="text-sm text-stone-500 mt-0.5">
                    Producto destacado
                  </p>
                </div>

                <div className="mt-5 space-y-1">
                  <Row title="Ventas" value={sales.length} />
                  <Row title="Clientes" value={clients.length} />
                  <Row title="Compras" value={purchases.length} last />
                </div>
              </div>
            </div>
          </section>

          {/* RESUMEN NEGOCIO */}
          <section>
            <SectionLabel>Actividad y estado</SectionLabel>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="bg-white border border-stone-100 rounded-3xl p-7 shadow-sm shadow-stone-200/40">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-stone-900">
                    Últimas operaciones
                  </h2>
                  <Receipt size={17} className="text-stone-300" />
                </div>

                {sales.length === 0 ? (
                  <EmptyState text="Todavía no registraste ventas." />
                ) : (
                  <div className="space-y-1">
                    {sales
                      .slice(-5)
                      .reverse()
                      .map((sale, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0 group"
                        >
                          <div>
                            <p className="font-medium text-stone-800 text-sm">
                              Venta #{sales.length - index}
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5">
                              Operación registrada
                            </p>
                          </div>

                          <strong className="text-stone-900 tabular-nums">
                            {money(Number(sale.total || 0))}
                          </strong>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-stone-100 rounded-3xl p-7 shadow-sm shadow-stone-200/40">
                <h2 className="text-lg font-bold mb-5 text-stone-900">
                  Estado del negocio
                </h2>

                <div className="space-y-1">
                  <Row
                    title="Presupuestos pendientes"
                    value={pendingOrders}
                  />
                  <Row title="Clientes registrados" value={clients.length} />
                  <Row title="Productos en catálogo" value={products.length} />
                  <Row
                    title="Compras realizadas"
                    value={purchases.length}
                    last
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
      {children}
    </p>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-stone-400">{text}</p>
    </div>
  );
}

const TONE_STYLES: Record<string, { bg: string; text: string }> = {
  neutral: { bg: "bg-[#F8F2E9]", text: "text-stone-700" },
  positive: { bg: "bg-emerald-50", text: "text-emerald-700" },
  negative: { bg: "bg-red-50", text: "text-red-700" },
  warning: { bg: "bg-amber-50", text: "text-amber-700" },
};

function Card({
  title,
  value,
  icon,
  tone = "neutral",
}: {
  title: string;
  value: any;
  icon: any;
  tone?: "neutral" | "positive" | "negative" | "warning";
}) {
  const style = TONE_STYLES[tone];

  return (
    <div className="bg-white border border-stone-100 rounded-3xl p-5 flex justify-between items-center shadow-sm shadow-stone-200/40 hover:shadow-md hover:shadow-stone-200/50 transition-shadow">
      <div>
        <p className="text-xs text-stone-500">{title}</p>
        <h2 className="text-2xl font-bold mt-2 text-stone-900 tabular-nums">
          {value}
        </h2>
      </div>

      <div className={`rounded-full p-3 ${style.bg} ${style.text}`}>
        {icon}
      </div>
    </div>
  );
}

function Row({
  title,
  value,
  last = false,
}: {
  title: string;
  value: any;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-3 ${
        last ? "" : "border-b border-stone-100"
      }`}
    >
      <span className="text-stone-500 text-sm">{title}</span>
      <strong className="text-stone-900 tabular-nums">{value}</strong>
    </div>
  );
}