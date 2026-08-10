"use client";

import {
  X,
  User,
  ShoppingBag,
  Calendar,
  DollarSign,
  Plus,
  MessageCircle,
} from "lucide-react";


interface Props {

  client:string | null;

  sales:any[];

  clients?:any[];

  onClose:()=>void;

}



export default function CustomerHistoryModal({

  client,

  sales,

  clients: clientsList,

  onClose

}:Props){



  if(!client) return null;





  const clientSales = sales.filter(

    (sale:any)=>

      sale.client === client

  );





  const clientData = (clientsList || []).find(

    (c:any)=>

      c.name === client

  );






  const totalComprado = clientSales.reduce(

    (acc:number,sale:any)=>

      acc + (sale.total || 0),

    0

  );





  const lastPurchase = clientSales.length

    ? clientSales[clientSales.length - 1].createdAt

    : null;







  return (


    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">



      <div className="bg-white w-[750px] rounded-3xl shadow-2xl overflow-hidden">






        <div className="bg-stone-900 text-white p-7 flex justify-between">


          <div>


            <h2 className="text-3xl font-bold">

              {client}

            </h2>


            <p className="text-stone-300">

              Historial del cliente

            </p>


          </div>





          <button

            onClick={onClose}

            className="hover:bg-white/10 rounded-xl p-2"

          >

            <X/>

          </button>


        </div>








        <div className="p-8 space-y-6">







          {/* CONTACTO */}


          {(clientData?.phone || clientData?.email) && (


            <div className="border rounded-2xl p-5 flex justify-between items-center">


              <div>


                {clientData?.phone && (


                  <p className="font-semibold">

                    📱 {clientData.phone}

                  </p>


                )}



                {clientData?.email && (


                  <p className="text-stone-500">

                    ✉️ {clientData.email}

                  </p>


                )}



              </div>





              {clientData?.phone && (


                <a

                  href={`https://wa.me/${clientData.phone.replace(/\D/g,"")}`}

                  target="_blank"

                  className="
                  bg-green-600
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  flex
                  items-center
                  gap-2
                  font-semibold
                  "

                >

                  <MessageCircle size={18}/>

                  WhatsApp

                </a>


              )}



            </div>


          )}









          <div className="grid grid-cols-3 gap-4">





            <div className="border rounded-2xl p-5">


              <User className="text-[#B08D57] mb-3"/>


              <p className="text-sm text-stone-500">

                Pedidos

              </p>


              <strong className="text-2xl">

                {clientSales.length}

              </strong>


            </div>








            <div className="border rounded-2xl p-5">


              <DollarSign className="text-[#B08D57] mb-3"/>


              <p className="text-sm text-stone-500">

                Comprado

              </p>


              <strong className="text-xl">

                ${totalComprado.toLocaleString("es-AR")}

              </strong>


            </div>








            <div className="border rounded-2xl p-5">


              <Calendar className="text-[#B08D57] mb-3"/>


              <p className="text-sm text-stone-500">

                Última compra

              </p>


              <strong>


                {

                lastPurchase

                ?

                new Date(lastPurchase)

                .toLocaleDateString("es-AR")

                :

                "-"

                }


              </strong>


            </div>





          </div>








          <button


            className="
            w-full
            bg-stone-900
            text-white
            py-3
            rounded-xl
            font-semibold
            flex
            justify-center
            items-center
            gap-2
            hover:bg-stone-700
            "


          >


            <Plus size={18}/>

            Nueva venta para {client}


          </button>









          <div className="border rounded-2xl overflow-hidden">



            <div className="bg-stone-50 p-4 font-semibold flex gap-2">


              <ShoppingBag size={18}/>

              Pedidos realizados


            </div>








            <div className="divide-y max-h-[300px] overflow-y-auto">



              {clientSales.map((sale:any)=>(


                <div

                  key={sale.id}

                  className="p-5 flex justify-between items-center"

                >



                  <div>


                    <p className="font-bold">

                      {sale.number ||

                      `#${sale.id.toString().slice(-5)}`}

                    </p>



                    <p className="text-sm text-stone-500">


                      {sale.products?.map(

                        (p:any)=>p.name

                      ).join(", ")}


                    </p>


                  </div>





                  <div className="text-right">


                    <p className="font-bold">


                      ${(sale.total || 0)

                      .toLocaleString("es-AR")}


                    </p>



                    <span className="text-xs px-3 py-1 rounded-full bg-stone-100">


                      {sale.status}


                    </span>


                  </div>



                </div>



              ))}




              {clientSales.length===0 && (


                <p className="p-6 text-center text-stone-400">

                  Sin compras registradas

                </p>


              )}



            </div>



          </div>







        </div>




      </div>



    </div>


  );

}