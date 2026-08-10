"use client";


import { useEffect, useState } from "react";

import { TrendingUp } from "lucide-react";



type TopProduct = {
  id: string;
  name: string;
  price: number;
  units: number;
};


interface Props {
  products?: TopProduct[];
}



const money = (n: number) =>
  `$${Number(n || 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0
  })}`;



export default function TopProductsCarousel({
  products = []
}: Props){


  const [current, setCurrent] = useState(0);



  // Si cambia la lista, aseguramos que el índice no quede fuera de rango.
  useEffect(()=>{

    setCurrent(0);

  },[products.length]);



  // Auto-desliza cada 4 segundos mientras haya más de un producto.
  useEffect(()=>{

    if(products.length <= 1) return;


    const timer = setInterval(()=>{

      setCurrent(prev => (prev + 1) % products.length);

    },4000);


    return ()=>clearInterval(timer);

  },[products.length]);



  if(products.length === 0){

    return (

      <div className="bg-white border border-stone-100 rounded-3xl p-7 h-full flex items-center justify-center">

        <p className="text-stone-400">

          Sin productos vendidos

        </p>

      </div>

    );

  }



  const product = products[current];



  return (


    <div className="bg-white border border-stone-100 rounded-3xl p-7 shadow-sm shadow-stone-200/40 h-full flex flex-col">



      {/* HEADER */}

      <div className="flex justify-between items-start">


        <div>

          <p className="text-xs tracking-widest text-stone-400 font-medium">

            RANKING

          </p>


          <h2 className="text-lg font-bold mt-1 text-stone-900">

            Producto líder

          </h2>

        </div>



        <div className="bg-[#F7F2EB] rounded-full px-3 py-1">

          <span className="font-bold text-[#B08D57]">

            #{current + 1}

          </span>

        </div>


      </div>



      {/* PRODUCTO */}

      <div className="mt-6">

        <h3 className="text-2xl font-semibold leading-tight text-stone-900">

          {product.name}

        </h3>


        <p className="text-sm text-stone-500 mt-1">

          Producto más vendido

        </p>

      </div>



      {/* DATOS */}

      <div className="mt-6 space-y-4">


        <div className="flex justify-between">

          <span className="text-stone-500">

            Unidades vendidas

          </span>

          <strong className="text-stone-900 tabular-nums">

            {product.units}

          </strong>

        </div>



        <div className="flex justify-between">

          <span className="text-stone-500">

            Precio

          </span>

          <strong className="text-stone-900 tabular-nums">

            {product.price > 0 ? money(product.price) : "--"}

          </strong>

        </div>



        <div className="flex justify-between">

          <span className="text-stone-500">

            Tendencia

          </span>

          <span className="flex items-center gap-2 text-emerald-600 font-semibold">

            <TrendingUp size={17}/>

            TOP

          </span>

        </div>


      </div>



      {/* PAGINADOR */}

      <div className="flex justify-center gap-2 pt-5 mt-auto">


        {products.map((_, index)=>(

          <button

            key={index}

            onClick={()=>setCurrent(index)}

            className={`rounded-full transition-all ${
              current === index
                ? "w-8 h-2 bg-[#B08D57]"
                : "w-2 h-2 bg-stone-300"
            }`}

          />

        ))}


      </div>


    </div>


  );


}
