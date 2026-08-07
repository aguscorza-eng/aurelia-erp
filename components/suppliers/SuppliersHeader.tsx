"use client";


interface Props {

  onNewSupplier: () => void;

}



export default function SuppliersHeader({
  onNewSupplier,
}: Props) {


  return (

    <div className="flex justify-between items-center">


      <div>

        <h1 className="text-3xl font-bold">
          Proveedores
        </h1>


        <p className="text-stone-500 mt-1">
          Administrá tus proveedores y contactos.
        </p>

      </div>



      <button
        onClick={onNewSupplier}
        className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-stone-800"
      >
        + Nuevo proveedor
      </button>


    </div>

  );

}