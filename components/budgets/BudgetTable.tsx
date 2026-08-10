"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, ShoppingCart } from "lucide-react";

import BudgetDetailModal from "./BudgetDetailModal";


interface Props {

  onEdit:(id:string)=>void;
  onView:(budget:any)=>void;
  refreshKey?:number;
}



export default function BudgetTable({

  onEdit,
  refreshKey

}:Props){



const [budgets,setBudgets] = useState<any[]>([]);

const [selectedBudget,setSelectedBudget] = useState<any>(null);





useEffect(()=>{

loadBudgets();

},[refreshKey]);






async function loadBudgets(){


try{

const res = await fetch("/api/budgets");

const data = await res.json();

if(res.ok){
setBudgets(data.data || []);
}

}catch(error){
console.error(error);
}


}







async function deleteBudget(id:any){


const confirmDelete = window.confirm(

"¿Eliminar este presupuesto?"

);



if(!confirmDelete) return;



try{

const res = await fetch(`/api/budgets/${id}`,{
method:"DELETE"
});

if(!res.ok){
const data = await res.json();
console.error(data.error);
alert("Error al eliminar el presupuesto");
return;
}

setBudgets((prev)=>prev.filter((item)=>item.id !== id));

}catch(error){
console.error(error);
alert("Error de conexión");
}


}




function statusStyle(status:string){

switch(status){

case "CONVERTIDO":
return "bg-green-100 text-green-700";

case "APROBADO":
return "bg-blue-100 text-blue-700";

case "RECHAZADO":
return "bg-red-100 text-red-700";

default:
return "bg-yellow-100 text-yellow-700";

}

}




// Convierte el presupuesto en una venta real (en la base de datos).
// La venta descuenta stock; el presupuesto queda marcado CONVERTIDO.
async function convertToSale(budget:any){

if(budget.status === "CONVERTIDO"){
alert("Este presupuesto ya fue convertido en venta.");
return;
}

const ok = window.confirm(
`¿Generar una venta a partir del presupuesto ${budget.number}?`
);

if(!ok) return;


try{

const res = await fetch("/api/sales",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
client:budget.client?.name || "",
clientPhone:budget.client?.phone || "",
clientEmail:budget.client?.email || "",
products:(budget.items || []).map((it:any)=>({
id:it.productId,
name:it.name,
quantity:it.quantity,
price:it.price
})),
total:budget.total,
advance:0,
balance:budget.total,
payment:"TRANSFERENCIA",
status:"PENDIENTE"
})
});


const data = await res.json();


if(!res.ok){
console.error(data.error);
alert("Error al generar la venta");
return;
}


// Marcamos el presupuesto como convertido en la base.
await fetch(`/api/budgets/${budget.id}`,{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status:"CONVERTIDO",
saleId:data.data.id
})
});

setBudgets((prev:any[])=>prev.map((b:any)=>
b.id === budget.id
? { ...b, status:"CONVERTIDO", saleId:data.data.id }
: b
));

alert("✅ Venta generada. Ya aparece en la sección Ventas.");


}catch(error){
console.error(error);
alert("Error de conexión");
}

}








return (

<>



<div className="
bg-white
border
rounded-3xl
overflow-hidden
">





<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-sm text-stone-500">


<th className="px-6 py-4">
Número
</th>


<th>
Cliente
</th>


<th>
Empresa
</th>


<th>
Total
</th>


<th>
Estado
</th>


<th>
Fecha
</th>


<th>
Acciones
</th>


</tr>


</thead>






<tbody>



{budgets.map((budget:any)=>(



<tr

key={budget.id}

className="
border-t
hover:bg-stone-50
"

>




<td className="
px-6
py-5
font-semibold
">

{budget.number}

</td>





<td>

{budget.client?.name || "-"}

</td>





<td>

{budget.client?.company || "-"}

</td>





<td className="font-bold">

$

{Number(budget.total)

.toLocaleString("es-AR")}

</td>





<td>


<span className={`px-3 py-1 rounded-full text-sm ${statusStyle(budget.status)}`}>

{budget.status}

</span>


</td>






<td>


{budget.createdAt

?

new Date(budget.createdAt)

.toLocaleDateString("es-AR")

:

"-"

}


</td>






<td>


<div className="flex gap-2 items-center">


{/* GENERAR VENTA */}

{budget.status !== "CONVERTIDO" && (

<button

onClick={()=>convertToSale(budget)}

className="
h-9
px-3
rounded-lg
bg-stone-900
text-white
text-xs
font-medium
flex
items-center
gap-1
hover:bg-stone-800
"

title="Generar venta"

>

<ShoppingCart size={15}/>

Generar venta

</button>

)}







{/* VER PREMIUM */}

<button

onClick={()=>{

console.log("ABRIENDO",budget);

setSelectedBudget(budget);

}}

className="
h-9
w-9
rounded-lg
border
flex
items-center
justify-center
hover:bg-stone-100
"

title="Ver presupuesto"

>

<Eye size={16}/>

</button>









{/* EDITAR */}

<button

onClick={()=>onEdit(String(budget.id))}

className="
h-9
w-9
rounded-lg
border
flex
items-center
justify-center
hover:bg-stone-100
"

title="Editar"

>

<Pencil size={16}/>

</button>









{/* ELIMINAR */}

<button

onClick={()=>deleteBudget(budget.id)}

className="
h-9
w-9
rounded-lg
border
border-red-200
text-red-600
flex
items-center
justify-center
hover:bg-red-50
"

title="Eliminar"

>

<Trash2 size={16}/>

</button>







</div>


</td>







</tr>



))}







{budgets.length===0 && (


<tr>


<td

colSpan={7}

className="
text-center
py-10
text-stone-400
"

>

No hay presupuestos creados

</td>


</tr>


)}





</tbody>





</table>




</div>








<BudgetDetailModal

budget={selectedBudget}

onClose={()=>setSelectedBudget(null)}

/>





</>


);


}