"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, CheckCircle } from "lucide-react";



export default function Alerts() {


  const [alerts,setAlerts] = useState<string[]>([]);





  useEffect(()=>{


    const data = localStorage.getItem("sales");


    if(!data){

      setAlerts([

        "Todavía no hay ventas registradas"

      ]);

      return;

    }



    const sales = JSON.parse(data);




    const newAlerts:string[] = [];





    const pendientes = sales.filter(

      (sale:any)=>

        sale.status === "PENDIENTE"

    ).length;





    const produccion = sales.filter(

      (sale:any)=>

        sale.status === "PRODUCCION"

    ).length;





    const saldo = sales.reduce(

      (acc:number,sale:any)=>

        acc + (sale.balance || 0),

      0

    );







    if(pendientes > 0){


      newAlerts.push(

        `${pendientes} pedidos pendientes de atención`

      );


    }







    if(produccion > 0){


      newAlerts.push(

        `${produccion} pedidos en producción`

      );


    }







    if(saldo > 0){


      newAlerts.push(

        `Saldo pendiente de cobrar: $${saldo.toLocaleString("es-AR")}`

      );


    }







    if(newAlerts.length===0){


      newAlerts.push(

        "La operación se encuentra funcionando correctamente"

      );


    }






    setAlerts(newAlerts);



  },[]);








  return (


    <div className="bg-white rounded-3xl border border-stone-200 p-6 h-full">



      <h2 className="text-xl font-semibold mb-6">

        Alertas

      </h2>






      <div className="space-y-4">



        {alerts.map((alert,index)=>(



          <div

            key={index}

            className="flex items-start gap-3"

          >



            {alert.includes("correctamente") ? (


              <CheckCircle

                size={18}

                className="text-emerald-500 mt-1"

              />


            ) : (


              <AlertTriangle

                size={18}

                className="text-amber-500 mt-1"

              />


            )}






            <p className="text-sm leading-6">

              {alert}

            </p>



          </div>



        ))}



      </div>





    </div>


  );

}