"use client";

import { useEffect, useState } from "react";

import CustomerHistoryModal from "@/components/customers/CustomerHistoryModal";
import CustomerModal from "@/components/customers/CustomerModal";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


export default function ClientesPage(){


const [clients,setClients] = useState<any[]>([]);

const [sales,setSales] = useState<any[]>([]);

const [selectedClient,setSelectedClient] = useState<string | null>(null);

const [search,setSearch] = useState("");

const [openCustomer,setOpenCustomer] = useState(false);

const [clientEdit,setClientEdit] = useState<any>(null);





function loadClients(){


const salesData = JSON.parse(
localStorage.getItem("sales") || "[]"
);



const manualClients = JSON.parse(
localStorage.getItem("clients") || "[]"
);



setSales(salesData);



const grouped:any = {};




salesData.forEach((sale:any)=>{


const name = sale.client || "Sin cliente";



if(!grouped[name]){


grouped[name]={

name,

phone:"",

email:"",

orders:0,

total:0,

lastDate:null

};


}



grouped[name].orders += 1;

grouped[name].total += sale.total || 0;



if(sale.createdAt){

grouped[name].lastDate = sale.createdAt;

}


});






manualClients.forEach((client:any)=>{


grouped[client.name]={

...grouped[client.name],


id:client.id,


name:client.name,


firstName:client.firstName || "",


lastName:client.lastName || "",


company:client.company || "",


phone:client.phone || "",


email:client.email || "",


notes:client.notes || "",


orders:grouped[client.name]?.orders || 0,


total:grouped[client.name]?.total || 0,


lastDate:grouped[client.name]?.lastDate || null


};


});







const array:any[] = Object.values(grouped);



array.sort(

(a:any,b:any)=>

b.total-a.total

);



setClients(array);


}






useEffect(()=>{

loadClients();

},[]);







const filteredClients = clients.filter((client)=>


client.name

.toLowerCase()

.includes(search.toLowerCase())


);








function saveClient(client:any){


const oldClients = JSON.parse(

localStorage.getItem("clients") || "[]"

);



localStorage.setItem(

"clients",

JSON.stringify([

...oldClients,

client

])

);



setOpenCustomer(false);

loadClients();


}









function updateClient(client:any){


const oldClients = JSON.parse(

localStorage.getItem("clients") || "[]"

);



const updated = oldClients.map((item:any)=>{


if(

item.id === client.id

){


return {

...item,

...client

};


}



return item;


});



localStorage.setItem(

"clients",

JSON.stringify(updated)

);



setClientEdit(null);

setOpenCustomer(false);

loadClients();


}









function deleteClient(client:any){


const confirmar = window.confirm(

`¿Eliminar definitivamente a ${client.name}?`

);



if(!confirmar)return;




const clientsData = JSON.parse(

localStorage.getItem("clients") || "[]"

);



localStorage.setItem(

"clients",

JSON.stringify(

clientsData.filter(

(item:any)=>item.id !== client.id

)

)

);



loadClients();


}









return (


<main className="flex h-screen bg-[#F8F8F6]">


<Sidebar />



<section className="flex-1 flex flex-col overflow-hidden">


<Header />



<div className="flex-1 overflow-y-auto p-10 space-y-8">





<div className="flex justify-between items-start">


<div>


<h1 className="text-4xl font-bold">

Clientes

</h1>



<p className="text-stone-500 mt-2">

Historial y comportamiento de compradores

</p>


</div>





<button

onClick={()=>{

setClientEdit(null);

setOpenCustomer(true);

}}

className="
bg-stone-900
text-white
px-5
py-3
rounded-xl
font-semibold
"

>

+ Nuevo cliente

</button>


</div>








<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Buscar cliente..."

className="
mb-6
w-full
max-w-md
bg-white
border
rounded-2xl
px-5
py-3
"

/>









<div className="bg-white border rounded-3xl overflow-hidden">


<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-xs text-stone-500">


<th className="px-6 py-4">
Cliente
</th>



<th>
Contacto
</th>



<th>
Pedidos
</th>



<th>
Comprado
</th>



<th>
Última compra
</th>



<th>
Acción
</th>


</tr>


</thead>







<tbody>



{filteredClients.map((client:any)=>(



<tr

key={client.id || client.name}

className="border-t hover:bg-stone-50"

>




<td className="px-6 py-5 font-semibold">


<div>

{client.name}

</div>


{client.company && (

<p className="text-xs text-stone-500">

{client.company}

</p>

)}


</td>






<td>


<div className="space-y-1">


{client.phone && (

<p>

{client.phone}

</p>

)}



{client.email && (

<p className="text-xs text-stone-500">

{client.email}

</p>

)}



</div>


</td>






<td>

{client.orders}

</td>






<td className="font-bold">


${client.total.toLocaleString("es-AR")}


</td>






<td>


{

client.lastDate

?

new Date(client.lastDate)

.toLocaleDateString("es-AR")

:

"-"

}


</td>






<td>



<div className="flex gap-2 items-center">






{client.phone && (


<a


href={`https://wa.me/${client.phone.replace(/\D/g,"")}?text=${encodeURIComponent(

`Hola ${client.name}, te escribimos de Aurelia 😊`

)}`}


target="_blank"


rel="noopener noreferrer"


className="
bg-green-600
text-white
px-4
py-2
rounded-xl
text-sm
font-semibold
"


>

💬 WhatsApp


</a>


)}







<button

onClick={()=>setSelectedClient(client.name)}

className="
bg-stone-900
text-white
px-4
py-2
rounded-xl
text-sm
"

>

Historial

</button>







<button

onClick={()=>{

setClientEdit(client);

setOpenCustomer(true);

}}

className="
border
px-3
py-2
rounded-xl
"

>

✏️

</button>







<button

onClick={()=>deleteClient(client)}

className="
border
border-red-200
text-red-600
px-3
py-2
rounded-xl
"

>

🗑️

</button>



</div>


</td>






</tr>



))}



</tbody>


</table>


</div>








<CustomerHistoryModal

client={selectedClient}

sales={sales}

onClose={()=>setSelectedClient(null)}

/>







<CustomerModal

open={openCustomer}

clientEdit={clientEdit}

onClose={()=>{

setOpenCustomer(false);

setClientEdit(null);

}}

onSave={

clientEdit

?

updateClient

:

saveClient

}

/>






</div>


</section>


</main>


);


}