"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
} from "lucide-react";


type Supplier = {

  id:string;

  name:string;

  company?:string;

  phone?:string;

  email?:string;

  notes?:string;

};




interface Props {

  onEdit:(id:string)=>void;

}





export default function SuppliersTable({

onEdit

}:Props){



const [suppliers,setSuppliers]=useState<Supplier[]>([]);

const [loading,setLoading]=useState(true);






useEffect(()=>{

loadSuppliers();

},[]);








function loadSuppliers(){


const data = JSON.parse(

localStorage.getItem("suppliers") || "[]"

);



setSuppliers(data);

setLoading(false);


}









function deleteSupplier(id:string){



const ok = confirm(

"¿Eliminar proveedor?"

);



if(!ok)return;





const updated = suppliers.filter(

(supplier)=>

supplier.id !== id

);





localStorage.setItem(

"suppliers",

JSON.stringify(updated)

);




setSuppliers(updated);



}









if(loading){


return (

<div className="bg-white rounded-3xl border p-10 text-center">

Cargando proveedores...

</div>

);


}







return(


<div className="bg-white rounded-3xl border overflow-hidden">



<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-sm text-stone-500">


<th className="px-6 py-4">

Nombre

</th>


<th>

Empresa

</th>


<th>

Teléfono

</th>


<th>

Email

</th>


<th>

Estado

</th>


<th>

</th>


</tr>


</thead>






<tbody>


{suppliers.map((supplier)=>(



<tr

key={supplier.id}

className="border-t hover:bg-stone-50"

>



<td className="px-6 py-4 font-semibold">

{supplier.name}

</td>




<td>

{supplier.company || "-"}

</td>




<td>

{supplier.phone || "-"}

</td>




<td>

{supplier.email || "-"}

</td>




<td>


<span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">

Activo

</span>


</td>





<td>


<div className="flex gap-2 justify-end pr-5">





<button

onClick={()=>onEdit(supplier.id)}

className="h-9 w-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"

>

<Pencil size={16}/>

</button>







<button

onClick={()=>deleteSupplier(supplier.id)}

className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center justify-center"

>

<Trash2 size={16}/>

</button>






</div>


</td>




</tr>



))}






{suppliers.length===0 && (

<tr>

<td

colSpan={6}

className="text-center py-10 text-stone-400"

>

No hay proveedores cargados

</td>

</tr>

)}



</tbody>



</table>



</div>


);


}