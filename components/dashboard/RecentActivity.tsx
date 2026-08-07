"use client";

import { useEffect, useState } from "react";

import {
  ShoppingCart,
  Package,
  DollarSign,
  CheckCircle,
} from "lucide-react";



export default function RecentActivity() {


  const [activity,setActivity] = useState<any[]>([]);





  useEffect(()=>{


    const data = localStorage.getItem("sales");


    if(!data) return;



    const sales = JSON.parse(data);





    const lastSales = sales

      .slice(-4)

      .reverse()

      .map((sale:any)=>{


        let icon = ShoppingCart;

        let title = "Venta realizada";

        let subtitle =

          sale.number || `Pedido #${sale.id.toString().slice(-5)}`





        if(sale.status==="PRODUCCION"){

          icon = Package;

          title = "Producción en curso";

        }



        if(sale.status==="LISTO"){

          icon = CheckCircle;

          title = "Pedido listo";

        }



        if(sale.advance > 0){

          subtitle +=

          ` | Anticipo $${sale.advance.toLocaleString("es-AR")}`;

        }




        return {

          icon,

          title,

          subtitle

        };


      });





    setActivity(lastSales);



  },[]);








  return (


    <div className="bg-white rounded-3xl border border-stone-200 p-6 h-full">



      <h2 className="text-xl font-semibold mb-6">

        Actividad reciente

      </h2>





      <div className="space-y-5">



        {activity.length===0 && (


          <p className="text-stone-400">

            Sin actividad registrada

          </p>


        )}






        {activity.map((item,index)=>{


          const Icon = item.icon;



          return (



            <div

              key={index}

              className="flex items-center gap-4"

            >



              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center">


                <Icon

                  size={20}

                  className="text-[#B08D57]"

                />


              </div>






              <div>


                <p className="font-medium">

                  {item.title}

                </p>




                <p className="text-sm text-stone-500">

                  {item.subtitle}

                </p>



              </div>



            </div>


          );


        })}



      </div>



    </div>


  );

}