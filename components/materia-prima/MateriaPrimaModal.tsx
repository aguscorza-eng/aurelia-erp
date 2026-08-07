"use client";

import { useEffect, useState } from "react";


interface Props {

  open:boolean;

  onClose:()=>void;

  productId:string|null;

}



export default function MateriaPrimaModal({

open,

onClose,

productId

}:Props){



const [name,setName]=useState("");

const [sku,setSku]=useState("");

const [cost,setCost]=useState("");

const [stock,setStock]=useState("");

const [minimumStock,setMinimumStock]=useState("");

const [description,setDescription]=useState("");

const [loading,setLoading]=useState(false);







useEffect(()=>{


if(!open)return;


if(productId){

loadProduct();

}else{

clearForm();

}


},[open,productId]);







async function loadProduct(){


try{


const res = await fetch(
`/api/products/${productId}`
);


const product = await res.json();



setName(product.name || "");

setSku(product.sku || "");

setCost(String(product.cost || ""));

setStock(String(product.stock || ""));

setMinimumStock(
String(product.minimumStock || "")
);

setDescription(
product.description || ""
);



}catch(error){

console.error(error);

}


}







function clearForm(){


setName("");

setSku("");

setCost("");

setStock("");

setMinimumStock("");

setDescription("");



}







async function saveProduct(){



if(!name.trim()){

alert("Ingresá nombre del insumo");

return;

}



if(!sku.trim()){

alert("Ingresá SKU");

return;

}



setLoading(true);



try{



const res = await fetch(

productId

? `/api/products/${productId}`

: "/api/products",

{


method:

productId

? "PUT"

: "POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

name,

sku,

cost:Number(cost),

price:0,

stock:Number(stock),

minimumStock:Number(minimumStock),

description,

type:"MATERIA_PRIMA",

})


}

);






const data = await res.json();



if(!res.ok){


alert(
data.error ||
"Error guardando insumo"
);


return;


}





clearForm();

onClose();

window.location.reload();





}catch(error){


console.error(error);

alert(
"Error guardando insumo"
);


}finally{


setLoading(false);


}



}







if(!open)return null;







return(


<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl w-[600px] p-8">





<h2 className="text-3xl font-bold mb-8">

{

productId

?

"Editar insumo"

:

"Nuevo insumo"

}

</h2>






<div className="space-y-4">





<input

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Nombre del insumo"

className="w-full border rounded-xl h-12 px-4"

/>





<input

value={sku}

onChange={(e)=>setSku(e.target.value)}

placeholder="SKU"

className="w-full border rounded-xl h-12 px-4"

/>





<input

value={cost}

onChange={(e)=>setCost(e.target.value)}

type="number"

placeholder="Costo"

className="w-full border rounded-xl h-12 px-4"

/>





<input

value={stock}

onChange={(e)=>setStock(e.target.value)}

type="number"

placeholder="Stock inicial"

className="w-full border rounded-xl h-12 px-4"

/>





<input

value={minimumStock}

onChange={(e)=>setMinimumStock(e.target.value)}

type="number"

placeholder="Stock mínimo"

className="w-full border rounded-xl h-12 px-4"

/>





<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

placeholder="Descripción"

className="w-full border rounded-xl p-4 h-28"

/>





</div>







<div className="flex justify-end gap-3 mt-8">



<button

onClick={onClose}

disabled={loading}

className="border px-6 py-3 rounded-xl"

>

Cancelar

</button>






<button

onClick={saveProduct}

disabled={loading}

className="bg-stone-900 text-white px-6 py-3 rounded-xl"

>

{loading ? "Guardando..." : "Guardar insumo"}

</button>





</div>






</div>


</div>


);


}