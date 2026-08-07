"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string;
}

export default function StockModal({
  open,
  onClose,
  productId,
  productName,
}: Props) {

  const [type, setType] = useState("ENTRADA");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);


  if (!open) return null;


  async function saveMovement() {

    if (!productId) return;

    if (!quantity || Number(quantity) <= 0) {
      alert("Ingresá una cantidad válida");
      return;
    }


    setLoading(true);


    try {

      const res = await fetch(
        `/api/products/${productId}/stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            quantity: Number(quantity),
            note,
          }),
        }
      );


      if (!res.ok) {

        const error = await res.json();

        alert(
          error.error ?? "No se pudo actualizar stock"
        );

        return;
      }


      setQuantity("");
      setNote("");

      onClose();

      window.location.reload();


    } catch (error) {

      console.error(error);

      alert("Error de conexión");


    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white rounded-3xl p-8 w-[450px]">


        <h2 className="text-2xl font-bold mb-6">
          Movimiento de stock
        </h2>


        <p className="text-stone-500 mb-5">
          Producto:
          <span className="font-semibold text-stone-900 ml-2">
            {productName}
          </span>
        </p>



        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-xl w-full h-12 px-4 mb-4"
        >

          <option value="ENTRADA">
            Entrada de stock
          </option>

          <option value="SALIDA">
            Salida de stock
          </option>

        </select>



        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Cantidad"
          type="number"
          className="border rounded-xl w-full h-12 px-4 mb-4"
        />



        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Motivo (opcional)"
          className="border rounded-xl w-full h-28 p-4 resize-none"
        />



        <div className="flex justify-end gap-3 mt-6">


          <button
            onClick={onClose}
            disabled={loading}
            className="border rounded-xl px-6 h-11"
          >
            Cancelar
          </button>



          <button
            onClick={saveMovement}
            disabled={loading}
            className="bg-stone-900 text-white rounded-xl px-6 h-11"
          >
            {loading
              ? "Guardando..."
              : "Guardar"}
          </button>


        </div>


      </div>


    </div>

  );

}