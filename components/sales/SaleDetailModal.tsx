"use client";

import {
  X,
  Package,
  User,
  Calendar,
} from "lucide-react";


interface Props {

  sale:any;

  onClose:()=>void;

}



export default function SaleDetailModal({

  sale,

  onClose

}:Props){


  if(!sale) return null;



  function statusStyle(status:string){


    switch(status){


      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-700";


      case "PRODUCCION":
        return "bg-blue-100 text-blue-700";


      case "LISTO":
        return "bg-green-100 text-green-700";


      case "ENTREGADO":
        return "bg-stone-200 text-stone-700";


      default:
        return "bg-stone-100 text-stone-600";


    }

  }



  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">


      <div className="bg-white w-[650px] rounded-3xl shadow-2xl overflow-hidden">



        {/* HEADER */}

        <div className="bg-stone-900 text-white p-8 flex justify-between items-start">


          <div>

            <h2 className="text-3xl font-bold">
              AURELIA
            </h2>


            <p className="text-stone-300">
              Comprobante interno de venta
            </p>


          </div>



          <button

            onClick={onClose}

            className="p-2 rounded-xl hover:bg-white/10"

          >

            <X size={22}/>

          </button>


        </div>







        <div className="p-7 space-y-5">







          {/* DATOS */}

          <div className="grid grid-cols-2 gap-5">


            <div className="flex gap-3">


              <User className="text-[#B08D57]"/>


              <div>


                <p className="text-xs text-stone-400">
                  Cliente
                </p>


                <p className="font-bold">
                  {sale.client}
                </p>


              </div>


            </div>







            <div className="flex gap-3">


              <Calendar className="text-[#B08D57]"/>


              <div>


                <p className="text-xs text-stone-400">
                  Fecha
                </p>



                <p className="font-bold">

                  {
                    sale.createdAt
                    ?
                    new Date(
                      sale.createdAt
                    ).toLocaleDateString("es-AR")
                    :
                    "Sin fecha"
                  }

                </p>


              </div>


            </div>


          </div>









          {/* PEDIDO */}

          <div className="flex justify-between items-center border rounded-2xl p-5">


            <div>


              <p className="text-xs text-stone-400">
                Pedido
              </p>



              <p className="text-2xl font-bold">

                {
                  sale.number ||
                  `#${sale.id.toString().slice(-5)}`
                }

              </p>


            </div>





            <span

              className={`px-4 py-2 rounded-full font-semibold ${statusStyle(sale.status)}`}

            >

              {sale.status}

            </span>


          </div>









          {/* PRODUCTOS */}


          <div className="border rounded-2xl overflow-hidden">



            <div className="bg-stone-50 px-5 py-3 font-semibold flex gap-2">


              <Package size={18}/>

              Productos


            </div>





            <div className="divide-y">



              {sale.products?.map((p:any,index:number)=>(


                <div

                  key={index}

                  className="flex justify-between px-5 py-4"

                >


                  <div>


                    <p className="font-semibold">
                      {p.name}
                    </p>



                    <p className="text-sm text-stone-500">
                      Cantidad: {p.quantity}
                    </p>


                  </div>


                </div>


              ))}


            </div>


          </div>









          {/* TOTALES */}


          <div className="border rounded-2xl p-5 space-y-4">



            <div className="flex justify-between">


              <span>
                Total
              </span>



              <strong className="text-xl">

                ${(sale.total || 0).toLocaleString("es-AR")}

              </strong>


            </div>







            <div className="flex justify-between text-emerald-600">


              <span>
                Anticipo
              </span>



              <strong>

                ${(sale.advance || 0).toLocaleString("es-AR")}

              </strong>


            </div>








            <div className="border-t pt-4 flex justify-between text-red-600">


              <span className="font-semibold">
                Saldo pendiente
              </span>



              <strong>

                ${(sale.balance || 0).toLocaleString("es-AR")}

              </strong>


            </div>



          </div>






        </div>



      </div>


    </div>

  );

}