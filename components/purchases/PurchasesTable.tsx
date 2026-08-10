"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";


type Purchase = {
  id:string;
  supplier:any;
  total:number;
  status:string;
  createdAt:string;
  items:any[];
};


interface Props {
  onEdit:(id:string)=>void;
}


export default function PurchasesTable({
  onEdit
}:Props){


  const [purchases,setPurchases] = useState<Purchase[]>([]);

  const [loading,setLoading] = useState(true);

  // Qué meses están desplegados. Si un mes no está en el objeto,
  // se usa el default (el más reciente abierto, el resto cerrados).
  const [openMonths,setOpenMonths] = useState<Record<string,boolean>>({});


  useEffect(()=>{
    loadPurchases();
  },[]);


  async function loadPurchases(){

    try{
      const res = await fetch("/api/purchases");
      const data = await res.json();
      setPurchases(data.data || []);
    }catch(error){
      console.error(error);
    }

    setLoading(false);

  }


  async function deletePurchase(id:string){

    const ok = confirm("¿Eliminar compra?");
    if(!ok) return;

    try{
      const res = await fetch(`/api/purchases/${id}`,{ method:"DELETE" });
      if(!res.ok){
        alert("Error al eliminar la compra");
        return;
      }
      setPurchases((prev)=>prev.filter((p)=>p.id !== id));
    }catch(error){
      console.error(error);
      alert("Error de conexión");
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


  if(loading){
    return (
      <div className="bg-white rounded-3xl border p-10 text-center">
        Cargando compras...
      </div>
    );
  }


  if(purchases.length === 0){
    return (
      <div className="bg-white rounded-3xl border p-10 text-center text-stone-400">
        No hay compras registradas
      </div>
    );
  }


  // Agrupamos por mes (las compras vienen ordenadas desc por fecha).
  const groupsMap:Record<string,{ label:string; items:Purchase[]; total:number }> = {};

  for(const purchase of purchases){
    const key = monthKey(purchase.createdAt);
    if(!groupsMap[key]){
      groupsMap[key] = {
        label: monthLabel(purchase.createdAt),
        items: [],
        total: 0
      };
    }
    groupsMap[key].items.push(purchase);
    groupsMap[key].total += Number(purchase.total) || 0;
  }

  const groups = Object.keys(groupsMap)
    .sort()
    .reverse()
    .map((key)=>({ key, ...groupsMap[key] }));


  return (

    <div className="space-y-4">

      {groups.map((group,index)=>{

        const isOpen = openMonths[group.key] ?? (index === 0);

        return (

          <div
            key={group.key}
            className="bg-white rounded-3xl border overflow-hidden"
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
                  ({group.items.length} compra{group.items.length !== 1 ? "s" : ""})
                </span>

              </div>

              <span className="font-semibold">
                ${group.total.toLocaleString("es-AR")}
              </span>

            </button>


            {isOpen && (

              <table className="w-full">

                <thead className="bg-stone-50">
                  <tr className="text-left text-sm text-stone-500">
                    <th className="px-6 py-4">Fecha</th>
                    <th>Proveedor</th>
                    <th>Insumos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {group.items.map((purchase)=>(

                    <tr
                      key={purchase.id}
                      className="border-t hover:bg-stone-50"
                    >

                      <td className="px-6 py-4">
                        {new Date(purchase.createdAt).toLocaleDateString("es-AR")}
                      </td>

                      <td className="font-semibold">
                        {purchase.supplier?.name || "-"}
                      </td>

                      <td>
                        {purchase.items.length} insumos
                      </td>

                      <td className="font-semibold">
                        ${Number(purchase.total).toLocaleString("es-AR")}
                      </td>

                      <td>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
                          {purchase.status}
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={()=>deletePurchase(purchase.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        );

      })}

    </div>

  );

}
