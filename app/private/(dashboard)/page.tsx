"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProductsCarousel from "@/components/dashboard/TopProductsCarousel";

import {
  AlertTriangle,
  TrendingUp,
  Box,
  Clock,
  Receipt,
} from "lucide-react";


const money = (n:number)=>
  `$${Number(n || 0).toLocaleString("es-AR",{
    maximumFractionDigits:0
  })}`;


const today = new Date().toLocaleDateString("es-AR",{
  weekday:"long",
  day:"numeric",
  month:"long",
});


export default function Home(){


  const [dashboard,setDashboard] = useState<any>(null);


  useEffect(()=>{


    async function load(){

      try{

        const res = await fetch("/api/dashboard");

        const data = await res.json();

        setDashboard(data);


      }catch(error){

        console.error(error);

      }


    }


    load();


  },[]);



  if(!dashboard){

    return (

      <main className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">

        <p className="text-stone-400">
          Cargando dashboard...
        </p>

      </main>

    );

  }



  const sales = dashboard.recentSales || [];

  const topProducts = dashboard.topProducts || [];

  const totalSales = dashboard.salesMonth || 0;

  const salesChange = dashboard.salesChange;

  const totalGlobal = dashboard.totalGlobal || 0;

  const salesCount = dashboard.salesCount || 0;

  const pendingBalance = dashboard.pendingBalance || 0;

  const unitsSold = dashboard.unitsSold || 0;

  const criticalStock = dashboard.criticalStock || 0;



  return (

    <main className="flex h-screen bg-[#F8F8F6]">

      <Sidebar />


      <section className="flex-1 flex flex-col overflow-hidden">


        <Header />


        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">


          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">
                Panel general
              </p>


              <h1 className="text-3xl font-bold text-stone-900">
                Dashboard
              </h1>


            </div>


            <p className="text-sm text-stone-400 capitalize">
              {today}
            </p>


          </div>



          {criticalStock > 0 && (

            <div className="bg-[#FFF9E8] border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">

              <AlertTriangle size={18}/>

              <p className="text-sm">
                Hay {criticalStock} productos con stock crítico.
              </p>

            </div>

          )}



          {/* BALANCE GLOBAL — suma de todas las ventas de todos los meses */}
          <div className="bg-white border border-stone-100 rounded-3xl px-7 py-6 flex items-center justify-between shadow-sm shadow-stone-200/40">

            <div>
              <p className="text-xs tracking-widest text-[#B08D57] font-medium uppercase mb-1">
                Balance global de ventas
              </p>
              <h2 className="text-4xl font-bold text-stone-900">
                {money(totalGlobal)}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {salesCount} ventas acumuladas — todos los meses
              </p>
            </div>

            <div className="bg-[#F8F2E9] text-[#B08D57] rounded-full p-4">
              <TrendingUp size={26}/>
            </div>

          </div>



          <section>


            <SectionLabel>
              Resumen del mes
            </SectionLabel>



            <div className="grid grid-cols-4 gap-5 mt-4">


              <Card
                title="Ventas del mes"
                value={money(totalSales)}
                icon={<TrendingUp size={19}/>}
                change={salesChange}
                accent="green"
              />


              <Card
                title="Saldo pendiente"
                value={money(pendingBalance)}
                icon={<Receipt size={19}/>}
                accent="amber"
              />


              <Card
                title="Productos vendidos"
                value={unitsSold}
                icon={<Box size={19}/>}
                accent="blue"
              />


              <Card
                title="Stock crítico"
                value={criticalStock}
                icon={<Clock size={19}/>}
                accent="red"
              />


            </div>


          </section>




          <section>


            <SectionLabel>
              Rendimiento
            </SectionLabel>


            <div className="grid grid-cols-3 gap-6 mt-4">


              <div className="col-span-2">

                <SalesChart data={dashboard.monthlySales || []}/>

              </div>




              <TopProductsCarousel products={topProducts}/>


            </div>


          </section>




          <section>


            <SectionLabel>
              Últimas operaciones
            </SectionLabel>



            <div className="bg-white rounded-3xl border border-stone-100 p-7 mt-4">


              {
                sales.length === 0

                ?

                <EmptyState text="Todavía no hay ventas registradas"/>

                :

                sales.map((sale:any,index:number)=>(


                  <div
                  key={index}
                  className="flex justify-between py-3 border-b border-stone-100"
                  >

                    <div>

                      <p className="font-medium">
                        {sale.customer}
                      </p>

                      <p className="text-xs text-stone-400">
                        Venta registrada
                      </p>

                    </div>


                    <strong>
                      {money(sale.total)}
                    </strong>


                  </div>


                ))

              }


            </div>


          </section>



        </div>


      </section>


    </main>

  );

}




function SectionLabel({children}:{
  children:React.ReactNode
}){

return (

<p className="text-xs font-semibold tracking-widest text-stone-400 uppercase">

{children}

</p>

)

}




function EmptyState({text}:{
 text:string
}){

return (

<div className="py-8 text-center text-stone-400">

{text}

</div>

)

}




const CARD_ACCENTS:Record<string,{ card:string; circle:string }> = {
 green:   { card:"bg-emerald-50 border-emerald-100", circle:"bg-emerald-100 text-emerald-700" },
 amber:   { card:"bg-amber-50 border-amber-100",     circle:"bg-amber-100 text-amber-700" },
 blue:    { card:"bg-blue-50 border-blue-100",       circle:"bg-blue-100 text-blue-700" },
 red:     { card:"bg-red-50 border-red-100",         circle:"bg-red-100 text-red-700" },
 neutral: { card:"bg-white border-stone-100",        circle:"bg-[#F8F2E9] text-[#B08D57]" }
};


function Card({
 title,
 value,
 icon,
 change,
 accent = "neutral"
}:{
 title:string;
 value:any;
 icon:any;
 change?:number | null;
 accent?:string;
}){

 const a = CARD_ACCENTS[accent] || CARD_ACCENTS.neutral;


return (

<div className={`rounded-3xl p-5 border flex justify-between items-center ${a.card}`}>


<div>

<p className="text-xs text-stone-500">
{title}
</p>


<h2 className="text-2xl font-bold mt-2">
{value}
</h2>


{typeof change === "number" && (
<p className={`text-xs font-medium mt-1 ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
{change >= 0 ? "+" : ""}{change}% vs mes anterior
</p>
)}


</div>


<div className={`rounded-full p-3 ${a.circle}`}>
{icon}
</div>


</div>

)

}