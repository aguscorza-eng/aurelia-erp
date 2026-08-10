"use client";

import { useEffect, useState } from "react";


interface Props {

  open:boolean;

  onClose:()=>void;

  productId:string|null;

}



export default function ProductModal({

open,

onClose,

productId

}:Props){



const [name,setName]=useState("");

const [sku,setSku]=useState("");

const [skuEdited,setSkuEdited]=useState(false);

const [cost,setCost]=useState("");

const [price,setPrice]=useState("");

const [stock,setStock]=useState("");

const [minimumStock,setMinimumStock]=useState("");

const [description,setDescription]=useState("");

const [image,setImage]=useState("");

const [type,setType]=useState("PRODUCTO_TERMINADO");

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

setSkuEdited(true);

setCost(String(product.cost || ""));

setPrice(String(product.price || ""));

setStock(String(product.stock || ""));

setMinimumStock(String(product.minimumStock || ""));

setDescription(product.description || "");

setImage(product.image || "");

setType(product.type || "PRODUCTO_TERMINADO");



}catch(error){


console.error(error);


}


}










// Genera un SKU a partir del nombre: mayúsculas, sin acentos, con guiones.
function generateSku(text:string){
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .slice(0,24);
}



function clearForm(){


setName("");

setSku("");

setSkuEdited(false);

setCost("");

setPrice("");

setStock("");

setMinimumStock("");

setDescription("");

setImage("");

setType("PRODUCTO_TERMINADO");


}









// Achica la imagen a máx 600px y la guarda como data URL (base64).
function handleImageFile(file:File){

  const reader = new FileReader();

  reader.onload = (e)=>{

    const img = document.createElement("img");

    img.onload = ()=>{

      const maxDim = 600;
      let width = img.width;
      let height = img.height;

      if(width > height && width > maxDim){
        height = Math.round(height * maxDim / width);
        width = maxDim;
      } else if(height > maxDim){
        width = Math.round(width * maxDim / height);
        height = maxDim;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if(ctx){
        ctx.drawImage(img, 0, 0, width, height);
        setImage(canvas.toDataURL("image/jpeg", 0.75));
      }

    };

    img.src = e.target?.result as string;

  };

  reader.readAsDataURL(file);

}




async function saveProduct(){



if(!name.trim()){

alert("Ingresá nombre del producto");

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

price:Number(price),

stock:Number(stock),

minimumStock:Number(minimumStock),

description,

image,

type


})


}

);







const data = await res.json();





if(!res.ok){


alert(

data.error ||

"No se pudo guardar"

);


return;


}







clearForm();

onClose();

window.location.reload();







}catch(error){


console.error(error);

alert(
"Error guardando producto"
);



}finally{


setLoading(false);


}



}










if(!open)return null;








return(


<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl w-[700px] p-8">



<h2 className="text-3xl font-bold mb-8">


{productId

?"Editar Producto"

:"Nuevo Producto"

}


</h2>






<div className="grid grid-cols-2 gap-5">



<input

value={name}

onChange={(e)=>{
  const v = e.target.value;
  setName(v);
  if(!skuEdited) setSku(generateSku(v));
}}

placeholder="Nombre"

className="border rounded-xl h-12 px-4"

/>





<input

value={sku}

onChange={(e)=>{ setSku(e.target.value); setSkuEdited(true); }}

placeholder="SKU (automático)"

className="border rounded-xl h-12 px-4"

/>







<select

value={type}

onChange={(e)=>setType(e.target.value)}

className="border rounded-xl h-12 px-4"

>


<option value="PRODUCTO_TERMINADO">

Producto Terminado

</option>



<option value="MATERIA_PRIMA">

Materia Prima

</option>


</select>







<input

value={cost}

onChange={(e)=>setCost(e.target.value)}

type="number"

placeholder="Costo"

className="border rounded-xl h-12 px-4"

/>







<input

value={price}

onChange={(e)=>setPrice(e.target.value)}

type="number"

placeholder="Precio"

className="border rounded-xl h-12 px-4"

/>








<input

value={stock}

onChange={(e)=>setStock(e.target.value)}

type="number"

placeholder="Stock inicial"

className="border rounded-xl h-12 px-4"

/>








<input

value={minimumStock}

onChange={(e)=>setMinimumStock(e.target.value)}

type="number"

placeholder="Stock mínimo"

className="border rounded-xl h-12 px-4"

/>



</div>









{/* FOTO DEL PRODUCTO */}
<div className="mt-5">

<label className="text-sm text-stone-500 block mb-2">
Foto del producto
</label>

{image ? (

<div className="flex items-center gap-4">
<img
src={image}
alt="Producto"
className="w-24 h-24 object-cover rounded-xl border"
/>
<button
type="button"
onClick={()=>setImage("")}
className="text-red-600 text-sm"
>
Quitar foto
</button>
</div>

) : (

<label className="border border-dashed rounded-xl h-24 flex items-center justify-center cursor-pointer text-stone-400 hover:bg-stone-50">
+ Subir foto
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>{
const f = e.target.files?.[0];
if(f) handleImageFile(f);
}}
/>
</label>

)}

</div>



<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

placeholder="Descripción"

className="border rounded-xl w-full h-28 mt-5 p-4"

/>







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

{loading ? "Guardando..." : "Guardar producto"}

</button>





</div>




</div>


</div>


);


}