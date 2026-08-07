"use client";


import { useEffect, useState } from "react";

import { TrendingUp } from "lucide-react";



export default function TopProductsCarousel(){


  const [products,setProducts] = useState<any[]>([]);

  const [current,setCurrent] = useState(0);





  useEffect(()=>{


    const data = localStorage.getItem("sales");


    if(!data) return;



    const sales = JSON.parse(data);


    const grouped:any = {};



    sales.forEach((sale:any)=>{


      sale.products?.forEach((product:any)=>{


        grouped[product.name] =

          (grouped[product.name] || 0)

          + product.quantity;



      });



    });





    const ranking = Object.keys(grouped)

      .map(name=>({

        name,

        sales:grouped[name]

      }))

      .sort((a,b)=>b.sales-a.sales)

      .slice(0,5)

      .map((item,index)=>({


        rank:`#${index+1}`,

        name:item.name,

        sales:item.sales


      }));




    setProducts(ranking);



  },[]);







  useEffect(()=>{


    if(products.length<=1) return;



    const timer=setInterval(()=>{


      setCurrent(prev=>

        (prev+1)%products.length

      );


    },4000);



    return ()=>clearInterval(timer);



  },[products]);







  if(products.length===0){


    return (

      <div className="bg-white border rounded-3xl p-6">

        <p className="text-stone-400">

          Sin productos vendidos

        </p>

      </div>

    );


  }






  const product = products[current];








  return (



    <div className="bg-white border border-stone-200 rounded-3xl p-6 h-[380px] flex flex-col">





      {/* HEADER */}


      <div className="flex justify-between items-start">


        <div>


          <p className="text-xs text-stone-500">

            Ranking

          </p>



          <h2 className="text-xl font-semibold">

            Producto líder

          </h2>


        </div>





        <div className="bg-[#F7F2EB] rounded-full px-3 py-1">


          <span className="font-bold text-[#B08D57]">

            {product.rank}

          </span>


        </div>


      </div>







      {/* PRODUCTO */}



      <div className="mt-8">


        <h3 className="text-2xl font-semibold leading-tight">

          {product.name}

        </h3>


        <p className="text-sm text-stone-500 mt-1">

          Producto más vendido

        </p>


      </div>







      {/* DATOS */}



      <div className="mt-8 space-y-4">


        <div className="flex justify-between">


          <span className="text-stone-500">

            Unidades

          </span>


          <strong>

            {product.sales}

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







      {/* LINEA */}


      <div className="border-t border-stone-200 my-auto" />







      {/* PAGINADOR */}


      <div className="flex justify-center gap-2 pt-5">


        {products.map((_,index)=>(


          <button


            key={index}


            onClick={()=>setCurrent(index)}


            className={`rounded-full transition-all ${

              current===index

              ?

              "w-8 h-2 bg-[#B08D57]"

              :

              "w-2 h-2 bg-stone-300"

            }`}


          />


        ))}


      </div>





    </div>


  );


}