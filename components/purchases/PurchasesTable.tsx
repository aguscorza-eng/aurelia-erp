"use client";

import { useEffect, useState } from "react";


type Purchase = {

  id:string;

  supplier:any;

  total:number;

  status:string;

  createdAt:string;

  items:any[];

};



interface Props {

  onEdit:(id:string)=>void;

}



export default function PurchasesTable({

  onEdit

}:Props){



const [purchases,setPurchases] = useState<Purchase[]>([]);

const [loading,setLoading] = useState(true);






useEffect(()=>{

  loadPurchases();

},[]);






async function loadPurchases(){


 try{

  const res = await fetch("/api/purchases");

  const data = await res.json();

  setPurchases(data.data || []);

 }catch(error){

  console.error(error);

 }


 setLoading(false);


}






async function deletePurchase(id:string){


 const ok = confirm(

  "¿Eliminar compra?"

 );


 if(!ok)return;


 try{

  const res = await fetch(`/api/purchases/${id}`,{
   method:"DELETE"
  });

  if(!res.ok){
   alert("Error al eliminar la compra");
   return;
  }

  setPurchases((prev)=>prev.filter((p)=>p.id !== id));

 }catch(error){
  console.error(error);
  alert("Error de conexión");
 }


}








if(loading){


return (

<div className="bg-white rounded-3xl border p-10 text-center">

Cargando compras...

</div>

);


}







return (


<div className="bg-white rounded-3xl border overflow-hidden">



<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-sm text-stone-500">


<th className="px-6 py-4">
Fecha
</th>


<th>
Proveedor
</th>


<th>
Productos
</th>


<th>
Total
</th>


<th>
Estado
</th>


<th>
Acciones
</th>


</tr>


</thead>





<tbody>


{purchases.map((purchase)=>(


<tr

key={purchase.id}

className="border-t hover:bg-stone-50"

>



<td className="px-6 py-4">

{new Date(
purchase.createdAt
).toLocaleDateString("es-AR")}

</td>





<td className="font-semibold">

{purchase.supplier?.name || "-"}

</td>





<td>

{purchase.items.length} productos

</td>





<td className="font-semibold">

$
{Number(purchase.total).toLocaleString("es-AR")}

</td>





<td>

<span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">

{purchase.status}

</span>

</td>





<td>


<div className="flex gap-2">


<button

onClick={()=>deletePurchase(purchase.id)}

className="px-3 py-1 bg-red-100 text-red-700 rounded-lg"

>

🗑️

</button>


</div>


</td>



</tr>


))}






{purchases.length===0 && (

<tr>

<td

colSpan={6}

className="text-center py-10 text-stone-400"

>

No hay compras registradas

</td>

</tr>

)}



</tbody>



</table>



</div>


);


}