"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


interface Props {
  month:number;
  year:number;
  sales:any[];
}


export default function SalesReportTable({
  month,
  year,
  sales
}:Props){

  const [open,setOpen]=useState(false);


  const filtered = sales.filter((sale:any)=>{
    const date = new Date(sale.createdAt || Date.now());
    return date.getMonth()===month && date.getFullYear()===year;
  });

  const total = filtered.reduce(
    (acc,i)=>acc + Number(i.total || 0),
    0
  );

  function formatDate(value:any){
    const date = new Date(value);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-AR");
  }


  return (

    <div className="bg-white border rounded-3xl overflow-hidden">

      <button
        onClick={()=>setOpen(!open)}
        className="w-full p-6 flex justify-between items-center hover:bg-stone-50"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold">📈 Ventas del mes</h2>
          <p className="text-sm text-stone-500 mt-1">
            {filtered.length} operaciones
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs text-stone-500">Total vendido</p>
            <p className="text-2xl font-bold">
              ${total.toLocaleString("es-AR")}
            </p>
          </div>
          {open ? <ChevronUp size={22}/> : <ChevronDown size={22}/>}
        </div>
      </button>


      {open && (

        <table className="w-full">
          <thead className="bg-stone-50">
            <tr className="text-left text-sm text-stone-500">
              <th className="px-6 py-4">Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sale:any,index:number)=>(
              <tr key={index} className="border-t hover:bg-stone-50">
                <td className="px-6 py-4">{formatDate(sale.createdAt)}</td>
                <td>{sale.client?.name || sale.client || "-"}</td>
                <td className="font-bold">
                  ${Number(sale.total || 0).toLocaleString("es-AR")}
                </td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-sm">
                    {sale.status || "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      )}


      {filtered.length===0 && (
        <div className="text-center py-8 text-stone-400">
          No hay ventas en este período
        </div>
      )}

    </div>

  );

}
