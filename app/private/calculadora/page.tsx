"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { Plus, Trash2, Calculator, Save } from "lucide-react";


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
  const [rinde,setRinde] = useState(1);


  const [recipes,setRecipes] = useState<any[]>([]);
  const [currentId,setCurrentId] = useState<string|null>(null);
  const [recipeName,setRecipeName] = useState("");


  useEffect(()=>{
    loadRecipes();
  },[]);

  async function loadRecipes(){
    try{
      const res = await fetch("/api/recipes");
      const data = await res.json();
      if(res.ok) setRecipes(data.data || []);
    }catch(error){
      console.error(error);
    }
  }


  const insumoCost = (i:Insumo)=>
    (Number(i.grams) || 0) / 1000 * (Number(i.pricePerKg) || 0);

  const totalInsumos = insumos.reduce((a,i)=>a + insumoCost(i), 0);
  const totalOtros = otros.reduce((a,o)=>a + (Number(o.price) || 0), 0);
  const costoTotal = totalInsumos + totalOtros;

  const costoUnidad = costoTotal / (Number(rinde) || 1);

  const round100 = (n:number)=> Math.round(n / 100) * 100;
  const precioMay = round100(costoUnidad * (Number(multMay) || 0));
  const precioMin = round100(costoUnidad * (Number(multMin) || 0));


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


  function nuevaReceta(){
    setCurrentId(null);
    setRecipeName("");
    setInsumos([{ name:"", grams:0, pricePerKg:0 }]);
    setOtros([]);
    setMultMay(3);
    setMultMin(4);
    setRinde(1);
  }

  function cargarReceta(id:string){
    if(!id){ nuevaReceta(); return; }
    const r = recipes.find((x)=>x.id===id);
    if(!r) return;
    const d = r.data || {};
    setCurrentId(r.id);
    setRecipeName(r.name || "");
    setInsumos(d.insumos || []);
    setOtros(d.otros || []);
    setMultMay(d.multMay ?? 3);
    setMultMin(d.multMin ?? 4);
    setRinde(d.rinde ?? 1);
  }

  async function guardarReceta(){
    if(!recipeName.trim()){
      alert("Ponele un nombre a la receta");
      return;
    }

    const payload = {
      name: recipeName.trim(),
      data: { insumos, otros, multMay, multMin, rinde }
    };

    try{
      const res = currentId
        ? await fetch(`/api/recipes/${currentId}`,{
            method:"PUT",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(payload)
          })
        : await fetch("/api/recipes",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(payload)
          });

      const data = await res.json();

      if(!res.ok){
        alert("Error al guardar la receta");
        return;
      }

      setCurrentId(data.data.id);
      await loadRecipes();
      alert(currentId ? "Receta actualizada ✅" : "Receta guardada ✅");

    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }
  }

  async function eliminarReceta(){
    if(!currentId) return;
    const ok = window.confirm(`¿Eliminar la receta "${recipeName}"?`);
    if(!ok) return;

    try{
      const res = await fetch(`/api/recipes/${currentId}`,{ method:"DELETE" });
      if(!res.ok){ alert("Error al eliminar"); return; }
      nuevaReceta();
      await loadRecipes();
    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }
  }


  const inputCls = "border rounded-lg px-2.5 py-1.5 text-sm";


  return (

    <main className="flex h-screen bg-[#F8F8F6]">

      <Sidebar />

      <section className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <div className="flex-1 overflow-y-auto p-6">

          <div className="max-w-3xl space-y-4">


            <div>
              <h1 className="text-2xl font-bold">Calculadora de costos</h1>
              <p className="text-sm text-stone-500">
                Cargá los insumos y te dice el costo y el precio sugerido
              </p>
            </div>


            {/* RECETAS */}
            <div className="bg-white border rounded-2xl p-4 flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-stone-500 block mb-1">Receta</label>
                <select
                  value={currentId || ""}
                  onChange={(e)=>cargarReceta(e.target.value)}
                  className={`${inputCls} w-full`}
                >
                  <option value="">— Nueva —</option>
                  {recipes.map((r)=>(
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-stone-500 block mb-1">Nombre</label>
                <input
                  value={recipeName}
                  onChange={(e)=>setRecipeName(e.target.value)}
                  placeholder="Ej: Caramelera con cera"
                  className={`${inputCls} w-full`}
                />
              </div>

              <button
                onClick={guardarReceta}
                className="bg-stone-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
              >
                <Save size={15}/>
                {currentId ? "Actualizar" : "Guardar"}
              </button>

              {currentId && (
                <button
                  onClick={eliminarReceta}
                  className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm"
                >
                  Eliminar
                </button>
              )}

              <button
                onClick={nuevaReceta}
                className="border px-3 py-1.5 rounded-lg text-sm"
              >
                Nueva
              </button>
            </div>


            {/* INSUMOS */}
            <div className="bg-white border rounded-2xl p-4">

              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold">Insumos (materia prima)</h2>
                <span className="text-xs text-stone-400">gramos + precio x kg/L</span>
              </div>

              <div className="hidden sm:grid grid-cols-[1fr_80px_110px_80px_28px] gap-2 text-[11px] text-stone-400 px-1 mb-1">
                <span>Insumo</span>
                <span>Cant. (g)</span>
                <span>Precio kg/L</span>
                <span className="text-right">Costo</span>
                <span></span>
              </div>

              <div className="space-y-1.5">
                {insumos.map((it,index)=>(
                  <div key={index} className="grid grid-cols-2 sm:grid-cols-[1fr_80px_110px_80px_28px] gap-2 items-center">
                    <input
                      value={it.name}
                      onChange={(e)=>updateInsumo(index,"name",e.target.value)}
                      placeholder="Nombre"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={it.grams}
                      onChange={(e)=>updateInsumo(index,"grams",e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={it.pricePerKg}
                      onChange={(e)=>updateInsumo(index,"pricePerKg",e.target.value)}
                      className={inputCls}
                    />
                    <span className="font-semibold text-sm text-right">{money(insumoCost(it))}</span>
                    <button
                      onClick={()=>setInsumos((prev)=>prev.filter((_,i)=>i!==index))}
                      className="text-red-500 flex justify-center"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={()=>setInsumos((prev)=>[...prev,{ name:"", grams:0, pricePerKg:0 }])}
                className="mt-3 text-sm font-medium text-[#B08D57] flex items-center gap-1 hover:underline"
              >
                <Plus size={15}/> Agregar insumo
              </button>

            </div>


            {/* OTROS COSTOS */}
            <div className="bg-white border rounded-2xl p-4">

              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold">Otros costos</h2>
                <span className="text-xs text-stone-400">envase, packaging, mano de obra</span>
              </div>

              <div className="space-y-1.5">
                {otros.map((it,index)=>(
                  <div key={index} className="grid grid-cols-[1fr_110px_28px] gap-2 items-center">
                    <input
                      value={it.name}
                      onChange={(e)=>updateOtro(index,"name",e.target.value)}
                      placeholder="Nombre"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={it.price}
                      onChange={(e)=>updateOtro(index,"price",e.target.value)}
                      placeholder="Precio"
                      className={inputCls}
                    />
                    <button
                      onClick={()=>setOtros((prev)=>prev.filter((_,i)=>i!==index))}
                      className="text-red-500 flex justify-center"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={()=>setOtros((prev)=>[...prev,{ name:"", price:0 }])}
                className="mt-3 text-sm font-medium text-[#B08D57] flex items-center gap-1 hover:underline"
              >
                <Plus size={15}/> Agregar costo
              </button>

            </div>


            {/* MULTIPLICADORES + RESULTADO EN UNA FILA */}
            <div className="bg-white border rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Rinde (unidades)</label>
                  <input
                    type="number"
                    min="1"
                    value={rinde}
                    onChange={(e)=>setRinde(Number(e.target.value))}
                    className={`${inputCls} w-24`}
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Mayorista (× costo)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={multMay}
                    onChange={(e)=>setMultMay(Number(e.target.value))}
                    className={`${inputCls} w-24`}
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Minorista (× costo)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={multMin}
                    onChange={(e)=>setMultMin(Number(e.target.value))}
                    className={`${inputCls} w-24`}
                  />
                </div>
              </div>
            </div>


            {/* RESULTADO */}
            <div className="grid grid-cols-3 gap-3">

              <div className="bg-white border rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <Calculator size={14}/> Costo x unidad
                </div>
                <h2 className="text-2xl font-bold mt-1">{money(costoUnidad)}</h2>
                {Number(rinde) > 1 && (
                  <p className="text-[11px] text-stone-400 mt-1">
                    Lote: {money(costoTotal)} ({rinde} u.)
                  </p>
                )}
              </div>

              <div className="bg-[#F8F2E9] border rounded-2xl p-4">
                <p className="text-xs text-stone-500">Mayorista (×{multMay})</p>
                <h2 className="text-2xl font-bold mt-1 text-[#B08D57]">{money(precioMay)}</h2>
              </div>

              <div className="bg-stone-900 text-white rounded-2xl p-4">
                <p className="text-xs text-stone-400">Minorista (×{multMin})</p>
                <h2 className="text-2xl font-bold mt-1">{money(precioMin)}</h2>
              </div>

            </div>


          </div>

        </div>

      </section>

    </main>

  );

}
