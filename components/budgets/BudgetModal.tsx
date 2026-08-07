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






useEffect(()=>{


if(!open)return;


loadData();


},[open]);







async function loadData(){



const clientsData = JSON.parse(

localStorage.getItem("clients") || "[]"

);



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









function saveBudget(){



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







localStorage.setItem(

"budgets",

JSON.stringify([

...budgets,

budget

])

);





onClose();



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

Nuevo presupuesto

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