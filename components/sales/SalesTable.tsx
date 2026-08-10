"use client";


import {
  Eye,
  Pencil,
  FileText,
  Trash2,
  ArrowRight,
} from "lucide-react";



interface Props {

  sales:any[];

  onView:(sale:any)=>void;

  onEdit:(sale:any)=>void;

  onDelete:(id:string)=>void;

  onReceipt:(sale:any)=>void;

  onStatusChange:(sale:any,status:string)=>void;

}





export default function SalesTable({

  sales,

  onView,

  onEdit,

  onDelete,

  onReceipt,

  onStatusChange

}:Props){





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







  function nextStatus(status:string){


    switch(status){


      case "PENDIENTE":

        return "PRODUCCION";


      case "PRODUCCION":

        return "LISTO";


      case "LISTO":

        return "ENTREGADO";


      default:

        return null;


    }


  }








  function nextLabel(status:string){


    switch(status){


      case "PENDIENTE":

        return "Producción";


      case "PRODUCCION":

        return "Listo";


      case "LISTO":

        return "Entregar";


      default:

        return "";


    }


  }







  function nextButtonStyle(status:string){


    switch(status){


      case "PENDIENTE":

        return "bg-yellow-500 hover:bg-yellow-600";


      case "PRODUCCION":

        return "bg-blue-600 hover:bg-blue-700";


      case "LISTO":

        return "bg-green-600 hover:bg-green-700";


      default:

        return "bg-stone-900";


    }


  }








  return (


    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">



      <table className="w-full">



        <thead className="bg-stone-50">


          <tr className="text-left text-xs text-stone-500">


            <th className="px-6 py-4">
              Pedido
            </th>


            <th>
              Cliente
            </th>


            <th>
              Productos
            </th>


            <th>
              Anticipo
            </th>


            <th>
              Total
            </th>


            <th>
              Saldo
            </th>


            <th>
              Estado
            </th>


            <th>
              Acciones
            </th>


          </tr>


        </thead>







        <tbody>



        {sales.map((sale)=>(



          <tr

            key={sale.id}

            className="border-t hover:bg-stone-50 transition"

          >





            <td className="px-6 py-5 font-bold">


              {sale.number ||

              `#${sale.id.toString().slice(-5)}`}


            </td>







            <td className="font-semibold">


              {sale.client}


            </td>








            <td>


              {sale.products && sale.products.length > 0 ? (

                sale.products.map((p:any,index:number)=>(


                <div key={index}>


                  <p className="font-medium">

                    {p.name}

                  </p>


                  <p className="text-xs text-stone-500">

                    Cantidad: {p.quantity}

                  </p>


                </div>


              ))

              ) : (

                <p className="text-sm text-stone-600">

                  {sale.detail || "-"}

                </p>

              )}


            </td>








            <td className="font-bold text-emerald-700">


              ${(sale.advance || 0).toLocaleString("es-AR")}


            </td>








            <td className="font-bold">


              ${(sale.total || 0).toLocaleString("es-AR")}


            </td>








            <td className="font-bold text-red-600">


              ${(sale.balance || 0).toLocaleString("es-AR")}


            </td>








            <td>


              <span

                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(sale.status)}`}

              >

                {sale.status}

              </span>


            </td>








            <td>

  <div className="flex gap-2 items-center">


    {/* ESPACIO FIJO PARA CAMBIO DE ESTADO */}

    <div className="w-[120px]">

      {
        nextStatus(sale.status) ? (

          <button

            onClick={()=>{

              const next = nextStatus(sale.status);

              if(next){

                onStatusChange(
                  sale,
                  next
                );

              }

            }}

            className={`${nextButtonStyle(sale.status)} text-white px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition w-full`}

          >

            <ArrowRight size={14}/>

            {nextLabel(sale.status)}

          </button>

        )

        :

        (

          <div className="h-9"></div>

        )

      }

    </div>







              <button

                onClick={()=>onView(sale)}

                className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"

                title="Ver"

              >

                <Eye size={16}/>

              </button>







              <button

                onClick={()=>onEdit(sale)}

                className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"

                title="Editar"

              >

                <Pencil size={16}/>

              </button>







              <button

                onClick={()=>onReceipt(sale)}

                className="border rounded-xl p-2 hover:bg-stone-900 hover:text-white transition"

                title="Comprobante"

              >

                <FileText size={16}/>

              </button>







              <button

                onClick={()=>onDelete(sale.id)}

                className="border rounded-xl p-2 text-red-600 hover:bg-red-50 transition"

                title="Eliminar"

              >

                <Trash2 size={16}/>

              </button>





              </div>


            </td>





          </tr>



        ))}







        {sales.length===0 && (


          <tr>

            <td

              colSpan={8}

              className="text-center py-10 text-stone-400"

            >

              No hay pedidos cargados

            </td>

          </tr>


        )}



        </tbody>



      </table>



    </div>


  );

}