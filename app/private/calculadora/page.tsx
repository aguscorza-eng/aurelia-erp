"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { Plus, Trash2, Calculator } from "lucide-react";


const money = (n:number)=>
  `$${Math.round(Number(n) || 0).toLocaleString("es-AR")}`;


type Insumo = { name:string; grams:number; pricePerKg:number };
type Otro = { name:string; price:number };


export default function CalculadoraPage(){

  const [insumos,setInsumos] = useState<Insumo[]>([
    { name:"Esencia", grams:4, pricePerKg:40000 },
    { name:"Endurecedor", grams:3, pricePerKg:5000 },
    { name:"Cera", grams:39, pricePerKg:5000 }
  ]);

  const [otros,setOtros] = useState<Otro[]>([
    { name:"Caramelera de vidrio", price:3500 }
  ]);

  const [multMay,setMultMay] = useState(3);
  const [multMin,setMultMin] = useState(4);


  const insumoCost = (i:Insumo)=>
    (Number(i.grams) || 0) / 1000 * (Number(i.pricePerKg) || 0);

  const totalInsumos = insumos.reduce((a,i)=>a + insumoCost(i), 0);
  const totalOtros = otros.reduce((a,o)=>a + (Number(o.price) || 0), 0);
  const costoTotal = totalInsumos + totalOtros;

  const round100 = (n:number)=> Math.round(n / 100) * 100;
  const precioMay = round100(costoTotal * (Number(multMay) || 0));
  const precioMin = round100(costoTotal * (Number(multMin) || 0));


  function updateInsumo(index:number, field:keyof Insumo, value:any){
    setInsumos((prev)=>prev.map((it,i)=>
      i===index ? { ...it, [field]: field==="name" ? value : Number(value) } : it
    ));
  }

  function updateOtro(index:number, field:keyof Otro, value:any){
    setOtros((prev)=>prev.map((it,i)=>
      i===index ? { ...it, [field]: field==="name" ? value : Number(value) } : it
    ));
  }


  return (

    <main className="flex h-screen bg-[#F8F8F6]">

      <Sidebar />

      <section className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <div className="flex-1 overflow-y-auto p-10 space-y-8">


          <div>
            <h1 className="text-3xl font-bold">Calculadora de costos</h1>
            <p className="text-stone-500">
              Cargá los insumos y te dice el costo y el precio sugerido
            </p>
          </div>


          {/* INSUMOS */}
          <div className="bg-white border rounded-3xl p-7">

            <h2 className="text-lg font-bold mb-1">Insumos (materia prima)</h2>
            <p className="text-sm text-stone-400 mb-4">
              Cantidad en gramos y precio por kilo o litro
            </p>

            <div className="hidden md:grid grid-cols-[1fr_120px_150px_120px_40px] gap-3 text-xs text-stone-400 px-1 mb-1">
              <span>Insumo</span>
              <span>Cantidad (g)</span>
              <span>Precio x kg/L</span>
              <span className="text-right">Costo</span>
              <span></span>
            </div>

            <div className="space-y-2">
              {insumos.map((it,index)=>(
                <div key={index} className="grid grid-cols-2 md:grid-cols-[1fr_120px_150px_120px_40px] gap-3 items-center">
                  <input
                    value={it.name}
                    onChange={(e)=>updateInsumo(index,"name",e.target.value)}
                    placeholder="Nombre"
                    className="border rounded-xl p-2.5"
                  />
                  <input
                    type="number"
                    value={it.grams}
                    onChange={(e)=>updateInsumo(index,"grams",e.target.value)}
                    className="border rounded-xl p-2.5"
                  />
                  <input
                    type="number"
                    value={it.pricePerKg}
                    onChange={(e)=>updateInsumo(index,"pricePerKg",e.target.value)}
                    className="border rounded-xl p-2.5"
                  />
                  <span className="font-semibold text-right">{money(insumoCost(it))}</span>
                  <button
                    onClick={()=>setInsumos((prev)=>prev.filter((_,i)=>i!==index))}
                    className="text-red-500 flex justify-center"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={()=>setInsumos((prev)=>[...prev,{ name:"", grams:0, pricePerKg:0 }])}
              className="mt-4 text-sm font-medium text-[#B08D57] flex items-center gap-1 hover:underline"
            >
              <Plus size={16}/> Agregar insumo
            </button>

          </div>


          {/* OTROS COSTOS */}
          <div className="bg-white border rounded-3xl p-7">

            <h2 className="text-lg font-bold mb-1">Otros costos</h2>
            <p className="text-sm text-stone-400 mb-4">
              Envase, packaging, mano de obra, etc. (precio directo)
            </p>

            <div className="space-y-2">
              {otros.map((it,index)=>(
                <div key={index} className="grid grid-cols-[1fr_150px_40px] gap-3 items-center">
                  <input
                    value={it.name}
                    onChange={(e)=>updateOtro(index,"name",e.target.value)}
                    placeholder="Nombre"
                    className="border rounded-xl p-2.5"
                  />
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e)=>updateOtro(index,"price",e.target.value)}
                    placeholder="Precio"
                    className="border rounded-xl p-2.5"
                  />
                  <button
                    onClick={()=>setOtros((prev)=>prev.filter((_,i)=>i!==index))}
                    className="text-red-500 flex justify-center"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={()=>setOtros((prev)=>[...prev,{ name:"", price:0 }])}
              className="mt-4 text-sm font-medium text-[#B08D57] flex items-center gap-1 hover:underline"
            >
              <Plus size={16}/> Agregar costo
            </button>

          </div>


          {/* MULTIPLICADORES */}
          <div className="bg-white border rounded-3xl p-7">
            <h2 className="text-lg font-bold mb-4">Multiplicadores de precio</h2>
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div>
                <label className="text-sm text-stone-500 block mb-1">Mayorista (× costo)</label>
                <input
                  type="number"
                  step="0.1"
                  value={multMay}
                  onChange={(e)=>setMultMay(Number(e.target.value))}
                  className="w-full border rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="text-sm text-stone-500 block mb-1">Minorista (× costo)</label>
                <input
                  type="number"
                  step="0.1"
                  value={multMin}
                  onChange={(e)=>setMultMin(Number(e.target.value))}
                  className="w-full border rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>


          {/* RESULTADO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-white border rounded-3xl p-6">
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <Calculator size={16}/> Costo total
              </div>
              <h2 className="text-3xl font-bold mt-2">{money(costoTotal)}</h2>
            </div>

            <div className="bg-[#F8F2E9] border rounded-3xl p-6">
              <p className="text-sm text-stone-500">Precio mayorista (×{multMay})</p>
              <h2 className="text-3xl font-bold mt-2 text-[#B08D57]">{money(precioMay)}</h2>
            </div>

            <div className="bg-stone-900 text-white rounded-3xl p-6">
              <p className="text-sm text-stone-400">Precio minorista (×{multMin})</p>
              <h2 className="text-3xl font-bold mt-2">{money(precioMin)}</h2>
            </div>

          </div>


        </div>

      </section>

    </main>

  );

}
