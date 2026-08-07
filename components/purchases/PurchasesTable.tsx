"use client";

import { useEffect, useState } from "react";


type Purchase = {

  id:string;

  supplier:string;

  total:number;

  status:string;

  createdAt:string;

  items:{
    product:string;
    quantity:number;
    cost:number;
  }[];

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






function loadPurchases(){


 const data = JSON.parse(

  localStorage.getItem("purchases") || "[]"

 );


 setPurchases(data);


 setLoading(false);


}






function deletePurchase(id:string){


 const ok = confirm(

  "¿Eliminar compra?"

 );


 if(!ok)return;



 const updated = purchases.filter(

  (purchase)=>purchase.id !== id

 );



 localStorage.setItem(

  "purchases",

  JSON.stringify(updated)

 );



 setPurchases(updated);


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

{purchase.supplier}

</td>





<td>

{purchase.items.length} productos

</td>





<td className="font-semibold">

$
{purchase.total.toLocaleString("es-AR")}

</td>





<td>

<span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">

{purchase.status}

</span>

</td>





<td>


<div className="flex gap-2">



<button

onClick={()=>onEdit(purchase.id)}

className="px-3 py-1 border rounded-lg"

>

✏️

</button>




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