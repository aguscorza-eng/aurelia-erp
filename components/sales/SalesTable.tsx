"use client";

import { useState } from "react";
import {
  Eye,
  Pencil,
  FileText,
  Trash2,
  ArrowRight,
  ChevronDown,
  DollarSign,
} from "lucide-react";


interface Props {
  sales:any[];
  onView:(sale:any)=>void;
  onEdit:(sale:any)=>void;
  onDelete:(id:string)=>void;
  onReceipt:(sale:any)=>void;
  onStatusChange:(sale:any,status:string)=>void;
  onConfirmPayment:(sale:any)=>void;
}


export default function SalesTable({
  sales,
  onView,
  onEdit,
  onDelete,
  onReceipt,
  onStatusChange,
  onConfirmPayment
}:Props){


  const [openMonths,setOpenMonths] = useState<Record<string,boolean>>({});


  function statusStyle(status:string){
    switch(status){
      case "PENDIENTE": return "bg-yellow-100 text-yellow-700";
      case "PRODUCCION": return "bg-blue-100 text-blue-700";
      case "LISTO": return "bg-green-100 text-green-700";
      case "ENTREGADO": return "bg-stone-200 text-stone-700";
      default: return "bg-stone-100 text-stone-600";
    }
  }

  function nextStatus(status:string){
    switch(status){
      case "PENDIENTE": return "PRODUCCION";
      case "PRODUCCION": return "LISTO";
      case "LISTO": return "ENTREGADO";
      default: return null;
    }
  }

  function nextLabel(status:string){
    switch(status){
      case "PENDIENTE": return "Producción";
      case "PRODUCCION": return "Listo";
      case "LISTO": return "Entregar";
      default: return "";
    }
  }

  function nextButtonStyle(status:string){
    switch(status){
      case "PENDIENTE": return "bg-yellow-500 hover:bg-yellow-600";
      case "PRODUCCION": return "bg-blue-600 hover:bg-blue-700";
      case "LISTO": return "bg-green-600 hover:bg-green-700";
      default: return "bg-stone-900";
    }
  }

  function monthKey(dateStr:string){
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}`;
  }

  function monthLabel(dateStr:string){
    const d = new Date(dateStr);
    const label = d.toLocaleDateString("es-AR",{ month:"long", year:"numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }


  function renderRow(sale:any){
    return (
      <tr
        key={sale.id}
        className="border-t hover:bg-stone-50 transition"
      >

        <td className="px-6 py-5 font-bold">
          {sale.number || `#${sale.id.toString().slice(-5)}`}
        </td>

        <td className="text-sm text-stone-600 whitespace-nowrap">
          {sale.createdAt
            ? new Date(sale.createdAt).toLocaleDateString("es-AR")
            : "-"}
        </td>

        <td className="font-semibold">
          {sale.client}
        </td>

        <td>
          {sale.products && sale.products.length > 0 ? (
            sale.products.map((p:any,index:number)=>(
              <div key={index}>
                <p className="font-medium">
                  {p.name}
                </p>
                <p className="text-xs text-stone-500">
                  Cantidad: {p.quantity}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-600">
              {sale.detail || "-"}
            </p>
          )}
        </td>

        <td className="font-bold text-emerald-700">
          ${(sale.advance || 0).toLocaleString("es-AR")}
        </td>

        <td className="font-bold">
          ${(sale.total || 0).toLocaleString("es-AR")}
        </td>

        <td className="font-bold text-red-600">
          ${(sale.balance || 0).toLocaleString("es-AR")}
        </td>

        <td>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(sale.status)}`}
          >
            {sale.status}
          </span>
        </td>

        <td>
          <div className="flex gap-2 items-center">

            {/* CAMBIO DE ESTADO */}
            <div className="w-[120px]">
              {nextStatus(sale.status) ? (
                <button
                  onClick={()=>{
                    const next = nextStatus(sale.status);
                    if(next){ onStatusChange(sale, next); }
                  }}
                  className={`${nextButtonStyle(sale.status)} text-white px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition w-full`}
                >
                  <ArrowRight size={14}/>
                  {nextLabel(sale.status)}
                </button>
              ) : (
                <div className="h-9"></div>
              )}
            </div>

            {sale.balance > 0 && (
              <button
                onClick={()=>onConfirmPayment(sale)}
                className="border border-emerald-300 text-emerald-700 rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-1 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition"
                title="Confirmar pago del saldo"
              >
                <DollarSign size={14}/>
                Cobrar
              </button>
            )}

            <button
              onClick={()=>onView(sale)}
              className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"
              title="Ver"
            >
              <Eye size={16}/>
            </button>

            <button
              onClick={()=>onEdit(sale)}
              className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"
              title="Editar"
            >
              <Pencil size={16}/>
            </button>

            <button
              onClick={()=>onReceipt(sale)}
              className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"
              title="Comprobante"
            >
              <FileText size={16}/>
            </button>

            <button
              onClick={()=>onDelete(sale.id)}
              className="border rounded-xl p-2 text-red-600 hover:bg-red-50 transition"
              title="Eliminar"
            >
              <Trash2 size={16}/>
            </button>

          </div>
        </td>

      </tr>
    );
  }


  if(sales.length === 0){
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-stone-400">
        No hay pedidos cargados
      </div>
    );
  }


  // Agrupamos las ventas por mes (vienen ordenadas desc por fecha).
  const groupsMap:Record<string,{ label:string; items:any[]; total:number }> = {};
  for(const sale of sales){
    const key = monthKey(sale.createdAt);
    if(!groupsMap[key]){
      groupsMap[key] = {
        label: monthLabel(sale.createdAt),
        items: [],
        total: 0
      };
    }
    groupsMap[key].items.push(sale);
    groupsMap[key].total += Number(sale.total) || 0;
  }

  const groups = Object.keys(groupsMap)
    .sort()
    .reverse()
    .map((key)=>{
      const g = groupsMap[key];
      // Dentro del mes: la venta más reciente primero.
      g.items.sort((a:any,b:any)=>{
        const t = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return t !== 0 ? t : (Number(b.orderNumber) || 0) - (Number(a.orderNumber) || 0);
      });
      return { key, ...g };
    });


  return (

    <div className="space-y-4">

      {groups.map((group,index)=>{

        const isOpen = openMonths[group.key] ?? (index === 0);

        return (

          <div
            key={group.key}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden"
          >

            <button
              onClick={()=>setOpenMonths((prev)=>({ ...prev, [group.key]: !isOpen }))}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isOpen ? "" : "-rotate-90"}`}
                />
                <span className="font-semibold">
                  {group.label}
                </span>
                <span className="text-sm text-stone-400">
                  ({group.items.length} venta{group.items.length !== 1 ? "s" : ""})
                </span>
              </div>
              <span className="font-semibold">
                ${group.total.toLocaleString("es-AR")}
              </span>
            </button>

            {isOpen && (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-stone-50">
                    <tr className="text-left text-xs text-stone-500">
                      <th className="px-6 py-4">Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Anticipo</th>
                      <th>Total</th>
                      <th>Saldo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {group.items.map((sale)=>renderRow(sale))}
                  </tbody>

                </table>

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

}
