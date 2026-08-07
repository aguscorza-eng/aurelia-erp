"use client";

import {
  X,
  Printer,
} from "lucide-react";


interface Props {

  sale:any;

  onClose:()=>void;

}



export default function SaleReceipt({

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





  function printReceipt(){


    window.print();


  }





  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 print:bg-white">



      <div

        id="receipt"

        className="bg-white w-[500px] rounded-3xl shadow-2xl overflow-hidden print:w-full print:shadow-none"

      >




        {/* CABECERA */}


        <div className="bg-stone-900 text-white p-8 text-center print:bg-white print:text-black">


          <h1 className="text-4xl font-bold tracking-widest">

            AURELIA

          </h1>


          <p className="text-stone-300 mt-2 print:text-stone-500">

            Business Manager

          </p>


          <p className="text-xs mt-4 text-stone-400">

            COMPROBANTE DE PEDIDO

          </p>


        </div>







        <div className="p-7 space-y-6 print:p-5">







          {/* DATOS */}


          <div className="flex justify-between">


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





            <div className="text-right">


              <p className="text-xs text-stone-400">

                Fecha

              </p>


              <p className="font-semibold">


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









          {/* CLIENTE */}


          <div className="border rounded-2xl p-4">


            <p className="text-xs text-stone-400">

              Cliente

            </p>


            <p className="text-lg font-bold">

              {sale.client}

            </p>


          </div>









          {/* PRODUCTOS */}


          <div className="border rounded-2xl overflow-hidden">


            <div className="bg-stone-50 px-5 py-3 font-semibold">

              Detalle


            </div>



            <div className="divide-y">


              {sale.products?.map((p:any,index:number)=>(


                <div

                  key={index}

                  className="flex justify-between px-5 py-4"

                >


                  <span>

                    {p.name}

                  </span>



                  <span className="font-bold">

                    x{p.quantity}

                  </span>


                </div>


              ))}


            </div>


          </div>









          {/* IMPORTES */}


          <div className="space-y-3">


            <div className="flex justify-between">

              <span>
                Total
              </span>


              <strong>

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


              <span className="font-bold">

                Saldo pendiente

              </span>


              <strong className="text-xl">

                ${(sale.balance || 0).toLocaleString("es-AR")}

              </strong>


            </div>


          </div>









          <div className="flex justify-center">


            <span

              className={`px-4 py-2 rounded-full font-semibold ${statusStyle(sale.status)}`}

            >

              {sale.status}

            </span>


          </div>









          {/* BOTONES */}


          <div className="flex gap-3 pt-3 print:hidden">


            <button

              onClick={printReceipt}

              className="flex-1 bg-stone-900 text-white py-3 rounded-xl flex items-center justify-center gap-2"

            >

              <Printer size={18}/>

              Imprimir

            </button>





            <button

              onClick={onClose}

              className="px-5 border rounded-xl"

            >

              <X size={20}/>

            </button>


          </div>





        </div>


      </div>




      <style jsx global>{`

        @media print {

          body * {

            visibility:hidden;

          }


          #receipt,

          #receipt * {

            visibility:visible;

          }


          #receipt {

            position:absolute;

            left:0;

            top:0;

          }


        }

      `}</style>



    </div>

  );

}