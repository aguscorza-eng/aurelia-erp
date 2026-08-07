"use client";

import { useEffect,useState } from "react";
import {
Pencil,
Trash2
} from "lucide-react";


interface Props {

onEdit:(id:string)=>void;

}



type MateriaPrima={

id:string;

name:string;

sku:string;

stock:number;

cost:number;

type:string;

};





export default function MateriaPrimaTable({

onEdit

}:Props){


const [items,setItems]=useState<MateriaPrima[]>([]);




useEffect(()=>{

load();

},[]);






async function load(){


try{


const res = await fetch("/api/products");


const data = await res.json();



const materias = (data.data ?? []).filter(

(product:any)=>

product.type==="MATERIA_PRIMA"

);



setItems(materias);



}catch(error){


console.error(
"Error cargando materia prima",
error
);


}


}







async function deleteItem(id:string){



const ok = confirm(
"¿Eliminar materia prima?"
);


if(!ok)return;



await fetch(

`/api/products/${id}`,

{

method:"DELETE"

}

);



load();


}







return (


<div className="bg-white rounded-3xl border overflow-hidden">


<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-sm text-stone-500">


<th className="px-6 py-4">
Insumo
</th>


<th>
SKU
</th>


<th>
Stock
</th>


<th>
Costo
</th>


<th>
</th>


</tr>


</thead>





<tbody>



{items.map(item=>(


<tr

key={item.id}

className="border-t hover:bg-stone-50"

>



<td className="px-6 py-4 font-semibold">

{item.name}

</td>




<td>

{item.sku}

</td>




<td>

{item.stock}

</td>




<td>

${Number(item.cost).toLocaleString("es-AR")}

</td>




<td>


<div className="flex gap-2 justify-end pr-5">



<button

onClick={()=>onEdit(item.id)}

className="h-9 w-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"

>

<Pencil size={16}/>

</button>






<button

onClick={()=>deleteItem(item.id)}

className="h-9 w-9 rounded-lg hover:bg-red-100 text-red-600 flex items-center justify-center"

>

<Trash2 size={16}/>

</button>



</div>


</td>



</tr>


))}






{items.length===0 && (

<tr>

<td

colSpan={5}

className="text-center py-10 text-stone-400"

>

No hay materias primas cargadas

</td>

</tr>

)}



</tbody>


</table>


</div>


);


}