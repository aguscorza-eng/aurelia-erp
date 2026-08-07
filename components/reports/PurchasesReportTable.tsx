"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


interface Props {

month:number;

year:number;

}



export default function PurchasesReportTable({

month,

year

}:Props){


const [purchases,setPurchases]=useState<any[]>([]);

const [open,setOpen]=useState(false);





useEffect(()=>{


const data = JSON.parse(

localStorage.getItem("purchases") || "[]"

);


setPurchases(data);


},[]);








const filtered = purchases.filter((purchase:any)=>{


const date = new Date(

purchase.createdAt ||

purchase.date ||

Date.now()

);



return (

date.getMonth()===month &&

date.getFullYear()===year

);


});









const total = filtered.reduce(

(acc,item)=>

acc + Number(item.total || 0),

0

);







function formatDate(value:any){


const date = new Date(value);



if(isNaN(date.getTime())){

return "-";

}



return date.toLocaleDateString("es-AR");


}









return (


<div className="
bg-white
border
rounded-3xl
overflow-hidden
">






<button

onClick={()=>setOpen(!open)}

className="
w-full
p-6
flex
justify-between
items-center
hover:bg-stone-50
"

>



<div className="text-left">


<h2 className="
text-xl
font-bold
">

🛒 Compras del mes

</h2>



<p className="
text-sm
text-stone-500
mt-1
">

{filtered.length} operaciones

</p>



</div>









<div className="
flex
items-center
gap-5
">



<div className="text-right">


<p className="
text-xs
text-stone-500
">

Total comprado

</p>



<p className="
text-2xl
font-bold
">

${total.toLocaleString("es-AR")}

</p>



</div>





{

open

?

<ChevronUp size={22}/>

:

<ChevronDown size={22}/>

}



</div>





</button>









{open && (



<table className="w-full">



<thead className="bg-stone-50">


<tr className="
text-left
text-sm
text-stone-500
">



<th className="px-6 py-4">

Fecha

</th>



<th>

Proveedor

</th>



<th>

Concepto

</th>



<th>

Total

</th>



</tr>


</thead>







<tbody>


{filtered.map((purchase:any,index:number)=>(


<tr

key={index}

className="border-t hover:bg-stone-50"

>



<td className="px-6 py-4">


{formatDate(

purchase.createdAt ||

purchase.date

)}


</td>







<td>

{

purchase.supplier ||

purchase.provider ||

"-"

}

</td>







<td>

{

purchase.description ||

purchase.name ||

"Compra"

}

</td>








<td className="font-bold">

$

{Number(purchase.total || 0)

.toLocaleString("es-AR")}

</td>





</tr>


))}



</tbody>



</table>



)}









{filtered.length===0 && (


<div className="
text-center
py-8
text-stone-400
">

No hay compras en este período

</div>


)}





</div>


);


}