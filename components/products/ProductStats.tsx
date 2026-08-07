"use client";

import { useEffect, useState } from "react";


type Stats = {
  total: number;
  totalUnits: number;
  lowStock: number;
  outOfStock: number;
  inventoryValue: number;
  salesValue: number;
  potentialProfit: number;
  averageMargin: number | string;
};


export default function ProductStats() {


  const [stats, setStats] = useState<Stats>({
    total: 0,
    totalUnits: 0,
    lowStock: 0,
    outOfStock: 0,
    inventoryValue: 0,
    salesValue: 0,
    potentialProfit: 0,
    averageMargin: 0,
  });



  useEffect(() => {

    loadStats();

  }, []);



  async function loadStats() {

    try {

      const res = await fetch("/api/products/stats");

      const data = await res.json();

      setStats(data);


    } catch (error) {

      console.error(error);

    }

  }



  const profitColor =
    stats.potentialProfit >= 0
      ? "text-emerald-600"
      : "text-red-600";



  const marginColor =
    Number(stats.averageMargin) >= 0
      ? "text-purple-600"
      : "text-red-600";




  return (

    <div className="grid grid-cols-4 gap-6">


      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Productos
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.total}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Unidades Stock
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.totalUnits}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Stock Bajo
        </p>

        <h2 className="text-3xl font-bold mt-2 text-amber-600">
          {stats.lowStock}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Sin Stock
        </p>

        <h2 className="text-3xl font-bold mt-2 text-red-600">
          {stats.outOfStock}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Inversión Inventario
        </p>

        <h2 className="text-3xl font-bold mt-2">
          $
          {stats.inventoryValue.toLocaleString("es-AR")}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Venta Potencial
        </p>

        <h2 className="text-3xl font-bold mt-2 text-blue-600">
          $
          {stats.salesValue.toLocaleString("es-AR")}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Ganancia Potencial
        </p>

        <h2 className={`text-3xl font-bold mt-2 ${profitColor}`}>
          $
          {stats.potentialProfit.toLocaleString("es-AR")}
        </h2>

      </div>




      <div className="bg-white rounded-3xl border p-6">

        <p className="text-stone-500 text-sm">
          Margen Promedio
        </p>

        <h2 className={`text-3xl font-bold mt-2 ${marginColor}`}>
          {stats.averageMargin}%
        </h2>

      </div>


    </div>

  );

}