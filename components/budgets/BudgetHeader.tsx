"use client";


interface Props {
  onNew:()=>void;
}



export default function BudgetHeader({
  onNew
}:Props){


  return (

    <div className="flex justify-between items-start">


      <div>

        <h1 className="text-4xl font-bold">
          Presupuestos
        </h1>


        <p className="text-stone-500 mt-2">
          Cotizaciones y propuestas comerciales
        </p>

      </div>




      <button

        onClick={onNew}

        className="
        bg-stone-900
        text-white
        px-5
        py-3
        rounded-xl
        font-semibold
        "

      >

        + Nuevo presupuesto

      </button>


    </div>

  );


}