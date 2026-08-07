"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";


interface Props {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string;
}


type Movement = {
  id: string;
  type: string;
  quantity: number;
  note?: string;
  createdAt: string;
};



export default function StockHistory({
  open,
  onClose,
  productId,
  productName,
}: Props) {


  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    if (!open || !productId) return;

    loadMovements();

  }, [open, productId]);



  async function loadMovements() {

    try {

      setLoading(true);


      const res = await fetch(
        `/api/products/${productId}/movements`
      );


      const data = await res.json();


      setMovements(data.data ?? []);


    } catch (error) {

      console.error(error);


    } finally {

      setLoading(false);

    }

  }





  if (!open) return null;




  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white rounded-3xl w-[550px] p-8 shadow-xl">


        <h2 className="text-2xl font-bold">
          Historial de stock
        </h2>


        <p className="text-stone-500 mt-1 mb-6">
          {productName}
        </p>



        {loading ? (

          <div className="py-10 text-center text-stone-400">
            Cargando movimientos...
          </div>


        ) : movements.length === 0 ? (

          <div className="py-10 text-center text-stone-400">
            No hay movimientos registrados
          </div>


        ) : (


          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">


            {movements.map((movement) => {


              const entrada =
                movement.type === "ENTRADA";



              return (


                <div
                  key={movement.id}
                  className="border rounded-2xl p-5 flex justify-between items-center"
                >


                  <div className="flex gap-4 items-center">


                    <div
                      className={
                        entrada
                          ? "bg-emerald-100 text-emerald-700 rounded-xl p-3"
                          : "bg-red-100 text-red-700 rounded-xl p-3"
                      }
                    >

                      {entrada ? (
                        <ArrowUpCircle size={24}/>
                      ) : (
                        <ArrowDownCircle size={24}/>
                      )}

                    </div>



                    <div>


                      <p className="font-semibold">

                        {entrada
                          ? "Entrada de stock"
                          : "Salida de stock"}

                      </p>


                      <p className="text-sm text-stone-500">

                        {movement.note || "Sin motivo"}

                      </p>


                      <p className="text-xs text-stone-400 mt-1">

                        {new Date(
                          movement.createdAt
                        ).toLocaleString("es-AR")}

                      </p>


                    </div>


                  </div>




                  <div
                    className={
                      entrada
                        ? "text-emerald-600 font-bold text-xl"
                        : "text-red-600 font-bold text-xl"
                    }
                  >

                    {entrada ? "+" : "-"}
                    {movement.quantity}

                  </div>


                </div>


              );


            })}


          </div>


        )}



        <div className="flex justify-end mt-8">

          <button
            onClick={onClose}
            className="px-6 h-11 rounded-xl bg-stone-900 text-white"
          >
            Cerrar
          </button>

        </div>


      </div>


    </div>

  );

}