"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";


interface Props {

  open:boolean;

  onClose:()=>void;

  budgetId:string|null;

}



type Client = {

  id:string;

  name:string;

  firstName?:string;

  lastName?:string;

  company?:string;

  phone?:string;

  email?:string;

};



type Product = {

  id:string;

  name:string;

  price:number;

};



type Item = {

  productId:string;

  name:string;

  quantity:number;

  price:number;

};





export default function BudgetModal({

open,

onClose,

budgetId

}:Props){



const [clients,setClients]=useState<Client[]>([]);

const [products,setProducts]=useState<Product[]>([]);



const [selectedClient,setSelectedClient]=useState<Client|null>(null);


const [productId,setProductId]=useState("");

const [quantity,setQuantity]=useState(1);


const [items,setItems]=useState<Item[]>([]);



const [discount,setDiscount]=useState(0);

const [bonus,setBonus]=useState(0);



// NUEVOS CAMPOS

const [preparationDays,setPreparationDays]=useState("");

const [deliveryDate,setDeliveryDate]=useState("");

const [customerNote,setCustomerNote]=useState("");


const [showNewClient,setShowNewClient]=useState(false);

const [newClientName,setNewClientName]=useState("");

const [newClientPhone,setNewClientPhone]=useState("");

const [newClientEmail,setNewClientEmail]=useState("");






useEffect(()=>{


if(!open)return;


loadData();


},[open]);







async function loadData(){



let clientsData:any[] = [];

try{

const custRes = await fetch("/api/customers");

const custData = await custRes.json();

if(custRes.ok){
clientsData = custData.data || [];
}

}catch(error){
console.error(error);
}



setClients(clientsData);





const res = await fetch("/api/products");


const data = await res.json();





const terminados = (data.data || [])

.filter(

(p:any)=>

p.type==="PRODUCTO_TERMINADO"

)

.map((p:any)=>({

id:p.id,

name:p.name,

price:Number(p.price)

}));




setProducts(terminados);


    // Si estamos editando, cargamos los datos del presupuesto.
    // Si es nuevo, limpiamos el formulario para no arrastrar datos viejos.
    if(budgetId){

      try{

        const res = await fetch(`/api/budgets/${budgetId}`);
        const data = await res.json();

        if(res.ok){

          const current = data.data;

          const cli = clientsData.find(
            (c:any)=>String(c.id)===String(current.client?.id)
          ) || current.client || null;

          setSelectedClient(cli);
          setItems(current.items || []);
          setDiscount(current.discount || 0);
          setBonus(current.bonus || 0);
          setPreparationDays(current.preparationDays || "");
          setDeliveryDate(current.deliveryDate || "");
          setCustomerNote(current.customerNote || "");

        }

      }catch(error){
        console.error(error);
      }

    }else{

      setSelectedClient(null);
      setItems([]);
      setProductId("");
      setQuantity(1);
      setDiscount(0);
      setBonus(0);
      setPreparationDays("");
      setDeliveryDate("");
      setCustomerNote("");

    }



}









async function createQuickClient(){


const name = newClientName.trim();


if(!name){

alert("Ingresá al menos el nombre del cliente");

return;

}


try{

const res = await fetch("/api/customers",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
name,
firstName:name,
phone:newClientPhone.trim(),
email:newClientEmail.trim()
})
});

const data = await res.json();

if(!res.ok){
console.error(data.error);
alert("Error al crear el cliente");
return;
}

const client = data.data;


// Actualizamos la lista y seleccionamos el cliente recién creado.
setClients((prev)=>[client, ...prev]);
setSelectedClient(client);


setNewClientName("");
setNewClientPhone("");
setNewClientEmail("");
setShowNewClient(false);

}catch(error){
console.error(error);
alert("Error de conexión");
}


}




function addItem(){



const product = products.find(

p=>p.id===productId

);



if(!product)return;




setItems([

...items,

{

productId:product.id,

name:product.name,

quantity,

price:product.price

}

]);



setProductId("");

setQuantity(1);



}









function removeItem(index:number){


setItems(

items.filter(

(_,i)=>i!==index

)

);


}









const subtotal = items.reduce(

(acc,item)=>

acc + item.quantity * item.price,

0

);





const discountAmount =

subtotal * (discount / 100);





const total =

subtotal -

discountAmount;









async function saveBudget(){



if(!selectedClient){

alert("Seleccioná cliente");

return;

}





if(items.length===0){

alert("Agregá productos");

return;

}





const budgets = JSON.parse(

localStorage.getItem("budgets") || "[]"

);







const budget = {


id:

budgetId ||

Date.now(),




number:

`PRE-${String(budgets.length + 1).padStart(6,"0")}`,




client:{


id:selectedClient.id,


name:selectedClient.name,


company:selectedClient.company || "",


phone:selectedClient.phone || "",


email:selectedClient.email || ""

},





items,



subtotal,

discount,

discountAmount,

bonus,



// NUEVOS DATOS

preparationDays,

deliveryDate,

customerNote,



total,



status:"PENDIENTE",



createdAt:

new Date().toISOString()


};







// Datos que enviamos a la API (sin id/número/estado: los maneja el server).
const payload = {
  client:budget.client,
  items,
  subtotal,
  discount,
  discountAmount,
  bonus,
  preparationDays,
  deliveryDate,
  customerNote,
  total
};


try{

  const res = budgetId

    ? await fetch(`/api/budgets/${budgetId}`,{
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
      })

    : await fetch("/api/budgets",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
      });


  const data = await res.json();


  if(!res.ok){
    console.error(data.error);
    alert("Error al guardar el presupuesto");
    return;
  }


  onClose();


}catch(error){
  console.error(error);
  alert("Error de conexión");
}



}








if(!open)return null;








return (



<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
">





<div className="
bg-white
rounded-3xl
w-[750px]
p-8
max-h-[90vh]
overflow-y-auto
">








<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="text-2xl font-bold">

{budgetId ? "Editar presupuesto" : "Nuevo presupuesto"}

</h2>



<button onClick={onClose}>

<X/>

</button>



</div>









<select

value={selectedClient?.id || ""}

onChange={(e)=>{


const c = clients.find(

x=>x.id.toString()===e.target.value

);



setSelectedClient(c || null);



}}

className="
w-full
border
rounded-xl
p-3
mb-4
"

>


<option value="">

Seleccionar cliente

</option>



{clients.map(c=>(


<option

key={c.id}

value={c.id}

>

{c.company

?

`${c.company} - ${c.name}`

:

c.name

}


</option>


))}



</select>









{selectedClient && (


<div className="
bg-stone-50
rounded-xl
p-4
mb-5
text-sm
">


<p>

<strong>Cliente:</strong> {selectedClient.name}

</p>



{selectedClient.company && (

<p>

<strong>Empresa:</strong> {selectedClient.company}

</p>

)}



{selectedClient.email && (

<p>

<strong>Email:</strong> {selectedClient.email}

</p>

)}



{selectedClient.phone && (

<p>

<strong>WhatsApp:</strong> {selectedClient.phone}

</p>

)}



</div>


)}









{/* Crear cliente rápido */}
<div className="mb-4">

<button
type="button"
onClick={()=>setShowNewClient((v)=>!v)}
className="text-sm font-medium text-[#B08D57] hover:underline"
>
{showNewClient ? "Cancelar cliente nuevo" : "+ Cliente nuevo"}
</button>


{showNewClient && (

<div className="mt-3 border rounded-2xl p-4 space-y-3 bg-stone-50">

<input
placeholder="Nombre y apellido"
value={newClientName}
onChange={(e)=>setNewClientName(e.target.value)}
className="w-full border rounded-xl p-3"
/>

<div className="grid grid-cols-2 gap-3">

<input
placeholder="WhatsApp"
value={newClientPhone}
onChange={(e)=>setNewClientPhone(e.target.value)}
className="border rounded-xl p-3"
/>

<input
placeholder="Email"
value={newClientEmail}
onChange={(e)=>setNewClientEmail(e.target.value)}
className="border rounded-xl p-3"
/>

</div>

<button
type="button"
onClick={createQuickClient}
className="w-full bg-stone-900 text-white py-2 rounded-xl font-medium"
>
Guardar cliente
</button>

</div>

)}

</div>


<div className="
grid
grid-cols-3
gap-3
">


<select

value={productId}

onChange={(e)=>setProductId(e.target.value)}

className="
border
rounded-xl
p-3
"

>


<option value="">

Producto

</option>


{products.map(p=>(

<option

key={p.id}

value={p.id}

>

{p.name}

</option>

))}


</select>





<input

type="number"

value={quantity}

onChange={(e)=>setQuantity(Number(e.target.value))}

className="
border
rounded-xl
p-3
"

/>




<button

onClick={addItem}

className="
bg-stone-900
text-white
rounded-xl
"

>

Agregar

</button>


</div>









<div className="mt-5 space-y-2">


{items.map((item,index)=>(


<div

key={index}

className="
bg-stone-50
rounded-xl
p-4
flex
justify-between
"


>


<div>

<strong>

{item.name}

</strong>


<br/>


{item.quantity} x ${item.price.toLocaleString("es-AR")}


</div>



<button

onClick={()=>removeItem(index)}

className="text-red-600"

>

Eliminar

</button>



</div>



))}


</div>









<div className="
grid
grid-cols-2
gap-4
mt-6
">


<div>

<label className="text-sm">

Descuento %

</label>


<input

type="number"

value={discount}

onChange={(e)=>setDiscount(Number(e.target.value))}

className="
w-full
border
rounded-xl
p-3
"

/>


</div>






<div>

<label className="text-sm">

Bonificación unidades

</label>


<input

type="number"

value={bonus}

onChange={(e)=>setBonus(Number(e.target.value))}

className="
w-full
border
rounded-xl
p-3
"

/>


</div>


</div>










<div className="
grid
grid-cols-2
gap-4
mt-6
">



<div>


<label className="text-sm">

Tiempo de preparación

</label>



<input

placeholder="Ej: 7 días hábiles"

value={preparationDays}

onChange={(e)=>setPreparationDays(e.target.value)}

className="
w-full
border
rounded-xl
p-3
"

/>


</div>







<div>


<label className="text-sm">

Fecha estimada de entrega

</label>



<input

type="date"

value={deliveryDate}

onChange={(e)=>setDeliveryDate(e.target.value)}

className="
w-full
border
rounded-xl
p-3
"

/>


</div>



</div>









<div className="mt-5">


<label className="text-sm">

Nota del cliente

</label>



<textarea

placeholder="Ej: Entrega urgente, packaging especial, observaciones..."

value={customerNote}

onChange={(e)=>setCustomerNote(e.target.value)}

className="
w-full
border
rounded-xl
p-3
h-24
"

/>


</div>









<div className="
mt-6
bg-stone-50
rounded-xl
p-5
">


<p>

Subtotal:

<strong>

${subtotal.toLocaleString("es-AR")}

</strong>

</p>



<p>

Descuento:

<strong>

-${discountAmount.toLocaleString("es-AR")}

</strong>

</p>



{bonus > 0 && (

<p className="text-emerald-700">

Bonificación:

<strong>

{" "}+{bonus} unidad{bonus !== 1 ? "es" : ""} sin cargo

</strong>

</p>

)}




<p className="text-xl mt-3 font-bold">

Total:

${total.toLocaleString("es-AR")}

</p>


</div>









<div className="
flex
justify-end
gap-3
mt-8
">


<button

onClick={onClose}

className="
border
px-5
py-3
rounded-xl
"

>

Cancelar

</button>







<button

onClick={saveBudget}

className="
bg-stone-900
text-white
px-5
py-3
rounded-xl
"

>

Guardar presupuesto

</button>



</div>







</div>





</div>



);


}