"use client";

import { useEffect, useState } from "react";


interface Props {
  open:boolean;
  onClose:()=>void;
  purchaseId:string|null;
}



type Supplier = {
  id:string;
  name:string;
};



type Product = {
  id:string;
  name:string;
};



type Item = {
  productId:string;
  product:string;
  quantity:number;
  cost:number;
};







export default function PurchaseModal({

open,
onClose,
purchaseId

}:Props){



const [suppliers,setSuppliers]=useState<Supplier[]>([]);

const [products,setProducts]=useState<Product[]>([]);


const [supplier,setSupplier]=useState("");

const [items,setItems]=useState<Item[]>([]);


const [productId,setProductId]=useState("");

const [quantity,setQuantity]=useState(1);

const [cost,setCost]=useState(0);








useEffect(()=>{


if(!open)return;


loadData();

reset();


},[open]);










async function loadData(){



// PROVEEDORES

try{


const suppliersRes = await fetch("/api/suppliers");

const suppliersData = await suppliersRes.json();


setSuppliers(

suppliersData.data ?? []

);



}catch(error){

console.error(
"Error cargando proveedores",
error
);

}







// PRODUCTOS

try{


const productsRes = await fetch("/api/products");


const productsData = await productsRes.json();



console.log(
"PRODUCTOS:",
productsData.data
);



setProducts(

productsData.data ?? []

);



}catch(error){


console.error(
"Error cargando productos",
error
);


}



}









function reset(){


setSupplier("");

setItems([]);

setProductId("");

setQuantity(1);

setCost(0);


}









function addItem(){



if(!productId){

alert("Seleccioná producto");

return;

}



if(quantity<=0){

alert("Cantidad inválida");

return;

}



if(cost<=0){

alert("Ingresá costo");

return;

}






const product = products.find(

(p)=>p.id===productId

);





if(!product)return;








setItems((prev)=>[

...prev,

{

productId,

product:product.name,

quantity,

cost

}

]);





setProductId("");

setQuantity(1);

setCost(0);



}









function removeItem(index:number){


setItems((prev)=>

prev.filter((_,i)=>i!==index)

);


}









async function savePurchase(){



if(!supplier){

alert("Seleccioná proveedor");

return;

}



if(items.length===0){

alert("Agregá productos");

return;

}







try{



const res = await fetch(

"/api/purchases",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({


supplierName:supplier,


purchaseType:"MATERIA_PRIMA",



items:items.map(item=>({


productId:item.productId,


quantity:item.quantity,


cost:item.cost


}))



})


}

);









const data = await res.json();






if(!res.ok){


alert(

data.error ||

"Error creando compra"

);


return;


}







reset();

onClose();

window.location.reload();






}catch(error){


console.error(

"ERROR GUARDANDO COMPRA",

error

);


alert(

"Error guardando compra"

);


}



}









if(!open)return null;









return(


<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl p-8 w-[600px]">





<h2 className="text-2xl font-bold mb-6">

Nueva compra de materia prima

</h2>









<select

value={supplier}

onChange={(e)=>setSupplier(e.target.value)}

className="w-full border rounded-xl p-3 mb-4"

>



<option value="">

Seleccionar proveedor

</option>




{suppliers.map((s)=>(


<option

key={s.id}

value={s.name}

>

{s.name}

</option>


))}



</select>









<div className="grid grid-cols-3 gap-3">





<select

value={productId}

onChange={(e)=>setProductId(e.target.value)}

className="border rounded-xl p-3"

>



<option value="">

Seleccionar producto

</option>




{products.map((p)=>(


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

onChange={(e)=>

setQuantity(Number(e.target.value))

}

placeholder="Cantidad"

className="border rounded-xl p-3"

/>







<input

type="number"

value={cost}

onChange={(e)=>

setCost(Number(e.target.value))

}

placeholder="Costo"

className="border rounded-xl p-3"

/>





</div>









<button

onClick={addItem}

className="border rounded-xl px-5 py-2 mt-4"

>

Agregar producto

</button>









<div className="mt-5 space-y-2">



{items.map((item,index)=>(


<div

key={index}

className="bg-stone-50 rounded-xl p-3 flex justify-between"

>


<div>

<strong>{item.product}</strong>

<br/>

Cantidad: {item.quantity}

<br/>

Costo: ${item.cost}

</div>






<button

onClick={()=>removeItem(index)}

className="text-red-600"

>

Quitar

</button>



</div>


))}



</div>









<div className="flex justify-end gap-3 mt-6">



<button

onClick={onClose}

className="border px-5 py-2 rounded-xl"

>

Cancelar

</button>








<button

onClick={savePurchase}

className="bg-stone-900 text-white px-5 py-2 rounded-xl"

>

Guardar compra

</button>





</div>





</div>


</div>


);


}