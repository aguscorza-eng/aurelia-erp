"use client";


import { useEffect, useState } from "react";


import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


import SalesTable from "@/components/sales/SalesTable";
import SaleModal from "@/components/sales/SaleModal";
import SaleDetailModal from "@/components/sales/SaleDetailModal";
import EditSaleModal from "@/components/sales/EditSaleModal";
import SaleReceipt from "@/components/sales/SaleReceipt";






export default function SalesPage(){



  const [openModal,setOpenModal] = useState(false);

  const [sales,setSales] = useState<any[]>([]);

  const [selectedSale,setSelectedSale] = useState<any>(null);

  const [editSale,setEditSale] = useState<any>(null);

  const [receiptSale,setReceiptSale] = useState<any>(null);

  const [filterStatus,setFilterStatus] = useState("TODOS");






  useEffect(()=>{

    async function loadSales(){

      try{

        const res = await fetch("/api/sales");

        const data = await res.json();

        if(res.ok){

          setSales(data.data || []);

        }

      }catch(error){

        console.error(error);

      }

    }

    loadSales();

  },[]);







  const filteredSales = filterStatus === "TODOS"

    ? sales

    : sales.filter(

        (sale)=>sale.status === filterStatus

      );






  const pendientes = sales.filter(
    (sale)=>sale.status==="PENDIENTE"
  ).length;


  const produccion = sales.filter(
    (sale)=>sale.status==="PRODUCCION"
  ).length;


  const listos = sales.filter(
    (sale)=>sale.status==="LISTO"
  ).length;


  const entregados = sales.filter(
    (sale)=>sale.status==="ENTREGADO"
  ).length;






  const totalVentas = sales.reduce(

    (acc,sale)=>

      acc + (sale.total || 0),

    0

  );





  const totalAnticipos = sales.reduce(

    (acc,sale)=>

      acc + (sale.advance || 0),

    0

  );





  const totalPendiente = sales.reduce(

    (acc,sale)=>

      acc + (sale.balance || 0),

    0

  );








  async function addSale(order:any){

  try {


    const res = await fetch("/api/sales",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(order)

    });



    const data = await res.json();



    if(!res.ok){

      console.error(data.error);

      alert("Error guardando venta");

      return;

    }



    const newSale = data.data;



    setSales(prev => [

      ...prev,

      newSale

    ]);



    



  } catch(error){


    console.error(error);

    alert("Error de conexión");


  }


}







  async function updateSale(updated:any){


    try{

      const res = await fetch(`/api/sales/${updated.id}`,{

        method:"PATCH",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          status:updated.status,

          total:updated.total,

          advance:updated.advance,

          balance:updated.balance,

          payment:updated.payment

        })

      });


      const data = await res.json();


      if(!res.ok){

        console.error(data.error);

        alert("Error actualizando venta");

        return;

      }


      setSales((prev)=>

        prev.map((sale)=>

          sale.id === updated.id

            ? data.data

            : sale

        )

      );


    }catch(error){

      console.error(error);

      alert("Error de conexión");

    }


  }







  async function updateStatus(sale:any,status:string){


    try{

      const res = await fetch(`/api/sales/${sale.id}`,{

        method:"PATCH",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({ status })

      });


      const data = await res.json();


      if(!res.ok){

        console.error(data.error);

        alert("Error actualizando estado");

        return;

      }


      setSales((prev)=>

        prev.map((item)=>

          item.id === sale.id

            ? data.data

            : item

        )

      );


    }catch(error){

      console.error(error);

      alert("Error de conexión");

    }


  }







  async function deleteSale(id:string){


    const confirmDelete = window.confirm(

      "¿Eliminar este pedido?"

    );



    if(!confirmDelete)return;



    try{

      const res = await fetch(`/api/sales/${id}`,{

        method:"DELETE"

      });


      if(!res.ok){

        const data = await res.json();

        console.error(data.error);

        alert("Error eliminando venta");

        return;

      }


      setSales((prev)=>

        prev.filter((sale)=>sale.id !== id)

      );


    }catch(error){

      console.error(error);

      alert("Error de conexión");

    }


  }









  async function confirmPayment(sale:any){

    const ok = window.confirm(
      `¿Confirmar el pago del saldo pendiente de $${(sale.balance || 0).toLocaleString("es-AR")}?`
    );

    if(!ok) return;

    try{

      const res = await fetch(`/api/sales/${sale.id}`,{
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          advance: sale.total,
          balance: 0
        })
      });

      const data = await res.json();

      if(!res.ok){
        console.error(data.error);
        alert("Error al confirmar el pago");
        return;
      }

      setSales((prev)=>
        prev.map((item)=>
          item.id === sale.id ? data.data : item
        )
      );

    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }

  }




  return (


    <main className="flex h-screen bg-[#F8F8F6]">



      <Sidebar />




      <section className="flex-1 flex flex-col overflow-hidden">



        <Header />




        <div className="flex-1 overflow-y-auto p-10 space-y-8">







          <div className="flex justify-between items-center">


            <div>


              <h1 className="text-3xl font-bold">

                Ventas

              </h1>



              <p className="text-stone-500">

                Pedidos, reservas y anticipos

              </p>


            </div>





            <button

              onClick={()=>setOpenModal(true)}

              className="bg-stone-900 text-white px-5 py-3 rounded-xl"

            >

              Nuevo pedido

            </button>



          </div>







          <div className="grid grid-cols-4 gap-5">



            <div className="bg-white border rounded-3xl p-5">

              <p className="text-sm text-stone-500">

                Pedidos

              </p>


              <h2 className="text-3xl font-bold mt-2">

                {sales.length}

              </h2>


            </div>







            <div className="bg-white border rounded-3xl p-5">


              <p className="text-sm text-stone-500">

                Venta total

              </p>



              <h2 className="text-2xl font-bold">

                ${totalVentas.toLocaleString("es-AR")}

              </h2>


            </div>







            <div className="bg-white border rounded-3xl p-5">


              <p className="text-sm text-stone-500">

                Anticipos cobrados

              </p>



              <h2 className="text-2xl font-bold text-emerald-700">

                ${totalAnticipos.toLocaleString("es-AR")}

              </h2>


            </div>







            <div className="bg-white border rounded-3xl p-5">


              <p className="text-sm text-stone-500">

                Pendiente cobrar

              </p>



              <h2 className="text-2xl font-bold text-red-600">

                ${totalPendiente.toLocaleString("es-AR")}

              </h2>


            </div>



          </div>







          <div className="flex gap-3 flex-wrap">


            <button
              onClick={()=>setFilterStatus("TODOS")}
              className="px-5 py-2 rounded-xl bg-stone-900 text-white"
            >

              Todos ({sales.length})

            </button>



            <button
              onClick={()=>setFilterStatus("PENDIENTE")}
              className="px-5 py-2 rounded-xl bg-yellow-100 text-yellow-700"
            >

              🟡 Pendientes ({pendientes})

            </button>



            <button
              onClick={()=>setFilterStatus("PRODUCCION")}
              className="px-5 py-2 rounded-xl bg-blue-100 text-blue-700"
            >

              🔵 Producción ({produccion})

            </button>



            <button
              onClick={()=>setFilterStatus("LISTO")}
              className="px-5 py-2 rounded-xl bg-green-100 text-green-700"
            >

              🟢 Listos ({listos})

            </button>



            <button
              onClick={()=>setFilterStatus("ENTREGADO")}
              className="px-5 py-2 rounded-xl bg-stone-200 text-stone-700"
            >

              ⚫ Entregados ({entregados})

            </button>


          </div>







          <SalesTable

            sales={filteredSales}

            onView={(sale)=>setSelectedSale(sale)}

            onEdit={(sale)=>setEditSale(sale)}

            onDelete={deleteSale}

            onReceipt={(sale)=>setReceiptSale(sale)}

            onStatusChange={updateStatus}

            onConfirmPayment={confirmPayment}

          />








          <SaleModal

            open={openModal}

            onClose={()=>setOpenModal(false)}

            onSave={addSale}

          />







          <SaleDetailModal

            sale={selectedSale}

            onClose={()=>setSelectedSale(null)}

          />








          <EditSaleModal

            sale={editSale}

            open={!!editSale}

            onClose={()=>setEditSale(null)}

            onSave={(updated)=>{

              updateSale(updated);

              setEditSale(null);

            }}

          />








          <SaleReceipt

            sale={receiptSale}

            onClose={()=>setReceiptSale(null)}

          />






        </div>



      </section>



    </main>


  );


}