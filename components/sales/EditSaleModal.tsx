"use client";

import { useEffect, useState } from "react";


interface Props {

  sale:any;

  open:boolean;

  onClose:()=>void;

  onSave:(sale:any)=>void;

}



export default function EditSaleModal({

  sale,

  open,

  onClose,

  onSave

}:Props){



  const [client,setClient] = useState("");

  const [total,setTotal] = useState(0);

  const [advance,setAdvance] = useState(0);

  const [status,setStatus] = useState("PENDIENTE");

  const [date,setDate] = useState("");





  useEffect(()=>{


    if(sale){

      setClient(sale.client);

      setTotal(sale.total);

      setAdvance(sale.advance);

      setStatus(sale.status);

      const d = sale.createdAt ? new Date(sale.createdAt) : new Date();
      setDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);

    }


  },[sale]);





  if(!open || !sale) return null;





  function save(){


    const [y,m,d] = date.split("-").map(Number);
    const dateISO = (y && m && d)
      ? new Date(y, m-1, d, 12, 0, 0).toISOString()
      : sale.createdAt;

    const updated = {


      ...sale,

      client,

      total,

      advance,

      balance: total - advance,

      status,

      date: dateISO


    };



    onSave(updated);


    onClose();


  }





  return (


    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white rounded-3xl p-8 w-[500px] space-y-5">



        <h2 className="text-2xl font-bold">

          Editar pedido {sale.number || `#${sale.id.toString().slice(-5)}`}

        </h2>





        <div>


          <label className="text-sm">

            Cliente

          </label>


          <input

            className="w-full border rounded-xl p-3"

            value={client}

            onChange={(e)=>setClient(e.target.value)}

          />


        </div>







        <div>


          <label className="text-sm">

            Fecha

          </label>


          <input

            type="date"

            className="w-full border rounded-xl p-3"

            value={date}

            onChange={(e)=>setDate(e.target.value)}

          />


        </div>




        <div>


          <label className="text-sm">

            Total

          </label>


          <input

            type="number"

            className="w-full border rounded-xl p-3"

            value={total}

            onChange={(e)=>setTotal(Number(e.target.value))}

          />


        </div>







        <div>


          <label className="text-sm">

            Anticipo

          </label>


          <input

            type="number"

            className="w-full border rounded-xl p-3"

            value={advance}

            onChange={(e)=>setAdvance(Number(e.target.value))}

          />


        </div>







        <div className="bg-stone-100 rounded-xl p-4">


          Saldo pendiente:


          <strong className="block text-xl">

            ${(total - advance).toLocaleString("es-AR")}

          </strong>


        </div>







        <select

          className="w-full border rounded-xl p-3"

          value={status}

          onChange={(e)=>setStatus(e.target.value)}

        >


          <option value="PENDIENTE">

            PENDIENTE

          </option>


          <option value="PRODUCCION">

            PRODUCCION

          </option>


          <option value="LISTO">

            LISTO

          </option>


          <option value="ENTREGADO">

            ENTREGADO

          </option>


        </select>







        <div className="flex justify-end gap-3">


          <button

            onClick={onClose}

            className="border px-5 py-2 rounded-xl"

          >

            Cancelar

          </button>




          <button

            onClick={save}

            className="bg-stone-900 text-white px-5 py-2 rounded-xl"

          >

            Guardar cambios

          </button>



        </div>





      </div>


    </div>


  );

}