"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import BudgetDetailModal from "./BudgetDetailModal";


interface Props {

  onEdit:(id:string)=>void;
onView:(budget:any)=>void;
}



export default function BudgetTable({

  onEdit

}:Props){



const [budgets,setBudgets] = useState<any[]>([]);

const [selectedBudget,setSelectedBudget] = useState<any>(null);





useEffect(()=>{

loadBudgets();

},[]);






function loadBudgets(){


const data = JSON.parse(

localStorage.getItem("budgets") || "[]"

);


setBudgets(data);


}







function deleteBudget(id:any){


const confirmDelete = window.confirm(

"¿Eliminar este presupuesto?"

);



if(!confirmDelete) return;




const updated = budgets.filter(

(item)=>item.id !== id

);




localStorage.setItem(

"budgets",

JSON.stringify(updated)

);



setBudgets(updated);


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


<span className="
px-3
py-1
rounded-full
text-sm
bg-yellow-100
text-yellow-700
">

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


<div className="flex gap-2">






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