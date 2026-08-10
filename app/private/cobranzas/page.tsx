"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { DollarSign, MessageCircle } from "lucide-react";


const money = (n:number)=>
  `$${Number(n || 0).toLocaleString("es-AR",{ maximumFractionDigits:0 })}`;


// Días transcurridos desde la fecha de la venta.
function diasDeuda(dateStr:string){
  if(!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000*60*60*24)));
}


function diasColor(dias:number){
  if(dias > 30) return "text-red-600";
  if(dias > 7) return "text-amber-600";
  return "text-stone-500";
}


export default function CobranzasPage(){

  const [sales,setSales] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{
    loadSales();
  },[]);


  async function loadSales(){
    try{
      const res = await fetch("/api/sales");
      const data = await res.json();
      const pendientes = (data.data || []).filter(
        (s:any)=>Number(s.balance) > 0
      );
      setSales(pendientes);
    }catch(error){
      console.error(error);
    }
    setLoading(false);
  }


  const totalPorCobrar = sales.reduce(
    (acc,s)=>acc + Number(s.balance || 0),
    0
  );


  async function cobrar(sale:any){

    const ok = window.confirm(
      `¿Confirmar el pago de ${money(sale.balance)} de ${sale.client}?`
    );

    if(!ok) return;

    try{
      const res = await fetch(`/api/sales/${sale.id}`,{
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ advance: sale.total, balance: 0 })
      });

      if(!res.ok){
        alert("Error al confirmar el pago");
        return;
      }

      setSales((prev)=>prev.filter((s)=>s.id !== sale.id));

    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }

  }


  function recordar(sale:any){

    const phone = (sale.clientPhone || "").replace(/\D/g,"");

    if(!phone){
      alert("El cliente no tiene WhatsApp cargado");
      return;
    }

    const msg =
      `Hola ${sale.client}! 😊 Te recordamos que tenés un saldo pendiente de ${money(sale.balance)} del pedido ${sale.number || ""}. ¡Muchas gracias!`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

  }


  return (

    <main className="flex h-screen bg-[#F8F8F6]">

      <Sidebar />

      <section className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <div className="flex-1 overflow-y-auto p-10 space-y-8">


          <div>
            <h1 className="text-3xl font-bold">
              Cuentas por cobrar
            </h1>
            <p className="text-stone-500">
              Saldos pendientes de tus ventas
            </p>
          </div>


          <div className="bg-white border border-stone-100 rounded-3xl px-7 py-6 flex items-center justify-between shadow-sm shadow-stone-200/40">
            <div>
              <p className="text-xs tracking-widest text-[#B08D57] font-medium uppercase mb-1">
                Total por cobrar
              </p>
              <h2 className="text-4xl font-bold text-red-600">
                {money(totalPorCobrar)}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {sales.length} venta{sales.length !== 1 ? "s" : ""} con saldo pendiente
              </p>
            </div>
            <div className="bg-[#F8F2E9] text-[#B08D57] rounded-full p-4">
              <DollarSign size={26}/>
            </div>
          </div>


          {loading ? (

            <div className="bg-white rounded-3xl border p-10 text-center text-stone-400">
              Cargando...
            </div>

          ) : sales.length === 0 ? (

            <div className="bg-white rounded-3xl border p-10 text-center text-stone-400">
              🎉 No hay saldos pendientes. ¡Todo cobrado!
            </div>

          ) : (

            <div className="bg-white rounded-3xl border overflow-hidden">

              <table className="w-full">

                <thead className="bg-stone-50">
                  <tr className="text-left text-xs text-stone-500">
                    <th className="px-6 py-4">Pedido</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Anticipo</th>
                    <th>Saldo</th>
                    <th>Días de deuda</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {sales.map((sale)=>(

                    <tr
                      key={sale.id}
                      className="border-t hover:bg-stone-50"
                    >

                      <td className="px-6 py-4 font-bold">
                        {sale.number || `#${sale.id.slice(-5)}`}
                      </td>

                      <td className="text-sm text-stone-600">
                        {sale.createdAt
                          ? new Date(sale.createdAt).toLocaleDateString("es-AR")
                          : "-"}
                      </td>

                      <td className="font-semibold">
                        {sale.client}
                      </td>

                      <td className="font-bold">
                        {money(sale.total)}
                      </td>

                      <td className="font-bold text-emerald-700">
                        {money(sale.advance)}
                      </td>

                      <td className="font-bold text-red-600">
                        {money(sale.balance)}
                      </td>

                      <td>
                        <span className={`text-sm font-medium ${diasColor(diasDeuda(sale.createdAt))}`}>
                          {diasDeuda(sale.createdAt)} días
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-2">

                          <button
                            onClick={()=>cobrar(sale)}
                            className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 hover:bg-emerald-700"
                          >
                            <DollarSign size={14}/> Cobrar
                          </button>

                          <button
                            onClick={()=>recordar(sale)}
                            className="border border-green-200 text-green-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 hover:bg-green-50"
                            title="Recordar por WhatsApp"
                          >
                            <MessageCircle size={14}/> Recordar
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}


        </div>

      </section>

    </main>

  );

}
