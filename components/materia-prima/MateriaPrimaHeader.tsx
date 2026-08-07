"use client";


interface Props {
  onNew:()=>void;
}



export default function MateriaPrimaHeader({
onNew
}:Props){


return (

<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">

Materia Prima

</h1>


<p className="text-stone-500 mt-1">

Control de insumos para producción.

</p>


</div>





<button

onClick={onNew}

className="
bg-stone-900
text-white
px-6
py-3
rounded-2xl
font-semibold
hover:bg-stone-800
"

>

+ Nuevo insumo

</button>



</div>

);


}