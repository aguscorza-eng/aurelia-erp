"use client";


interface Props {

  onNewPurchase: () => void;

}



export default function PurchasesHeader({
  onNewPurchase,
}: Props) {


  return (

    <div className="flex justify-between items-center">


      <div>

        <h1 className="text-3xl font-bold">
          Compras
        </h1>


        <p className="text-stone-500 mt-1">
          Gestioná compras y reposición de stock.
        </p>

      </div>




      <button

        onClick={onNewPurchase}

        className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-stone-800"

      >

        + Nueva compra

      </button>



    </div>

  );

}