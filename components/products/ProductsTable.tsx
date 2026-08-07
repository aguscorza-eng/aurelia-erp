"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  History,
} from "lucide-react";

import ProductFilters from "./ProductFilters";
import StockModal from "./StockModal";
import StockHistory from "./StockHistory";


type Product = {
  id:string;
  name:string;
  sku:string;
  image?:string;
  stock:number;
  minimumStock:number;
  cost:number;
  price:number;
  type:string;
};



interface Props {
  onEdit:(id:string)=>void;
}



export default function ProductsTable({
  onEdit
}:Props){


const [products,setProducts]=useState<Product[]>([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const [stockModal,setStockModal]=useState(false);

const [historyModal,setHistoryModal]=useState(false);


const [selectedProduct,setSelectedProduct]=useState<{
id:string;
name:string;
}|null>(null);





useEffect(()=>{

loadProducts();

},[]);







async function loadProducts(){

try{


const res = await fetch("/api/products");

const json = await res.json();


// SOLO PRODUCTOS TERMINADOS

const terminados = (json.data ?? []).filter(
(product:Product)=>
product.type === "PRODUCTO_TERMINADO"
);


setProducts(terminados);



}catch(error){

console.error(error);


}finally{

setLoading(false);

}

}








async function deleteProduct(
id:string,
name:string
){


const ok = confirm(
`¿Eliminar ${name}?`
);


if(!ok)return;



await fetch(
`/api/products/${id}`,
{
method:"DELETE"
}
);



setProducts(current=>
current.filter(
p=>p.id!==id
)
);



}









const filteredProducts = useMemo(()=>{


const value = search.toLowerCase();



return products.filter(product=>


product.name
.toLowerCase()
.includes(value)


||

product.sku
.toLowerCase()
.includes(value)


);



},[products,search]);










if(loading){

return(

<div className="bg-white rounded-3xl border p-10 text-center">

Cargando productos...

</div>

);

}








return(

<div className="space-y-5">





<ProductFilters

search={search}

setSearch={setSearch}

/>







<div className="bg-white rounded-3xl border overflow-hidden">



<table className="w-full">



<thead className="bg-stone-50">


<tr className="text-left text-sm text-stone-500">


<th className="px-6 py-4">
Imagen
</th>


<th>
Producto
</th>


<th>
SKU
</th>


<th>
Stock
</th>


<th>
Costo fabricación
</th>


<th>
Precio venta
</th>


<th>
Ganancia
</th>


<th>
Margen
</th>


<th>
Estado
</th>


<th></th>


</tr>


</thead>






<tbody>



{filteredProducts.map(product=>{



const ganancia =
Number(product.price) -
Number(product.cost);



const margen =
Number(product.price)>0
?
(
(ganancia /
Number(product.price))*100
).toFixed(0)
:
"0";





const estado =
product.stock===0
?
"Sin stock"
:
product.stock<=product.minimumStock
?
"Stock bajo"
:
"En stock";





return(



<tr

key={product.id}

className="border-t hover:bg-stone-50"

>





<td className="px-6 py-4">



{product.image ?


<img

src={product.image}

className="w-12 h-12 rounded-xl object-cover border"

/>


:


<div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xs">

IMG

</div>


}



</td>








<td className="font-semibold">

{product.name}

</td>






<td>

{product.sku}

</td>






<td>

{product.stock}

</td>







<td>

$
{Number(product.cost)
.toLocaleString("es-AR")}

</td>







<td>

$
{Number(product.price)
.toLocaleString("es-AR")}

</td>







<td>


<span className="text-emerald-600 font-semibold">

$
{ganancia.toLocaleString("es-AR")}

</span>


</td>







<td>


<span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">

{margen}%

</span>


</td>







<td>


<span className="px-3 py-1 rounded-full text-sm bg-stone-100">

{estado}

</span>


</td>







<td>


<div className="flex gap-2">



<button

onClick={()=>onEdit(product.id)}

className="h-9 w-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"

>

<Pencil size={16}/>

</button>







<button

onClick={()=>deleteProduct(product.id,product.name)}

className="h-9 w-9 rounded-lg hover:bg-red-100 text-red-600 flex items-center justify-center"

>

<Trash2 size={16}/>

</button>







<button

onClick={()=>{

setSelectedProduct({
id:product.id,
name:product.name
});


setStockModal(true);


}}

className="h-9 w-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"

>

<MoreHorizontal size={16}/>

</button>







<button

onClick={()=>{


setSelectedProduct({

id:product.id,

name:product.name

});


setHistoryModal(true);


}}

className="h-9 w-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"

>

<History size={16}/>

</button>



</div>


</td>





</tr>


);



})}



</tbody>



</table>



</div>







<StockModal

open={stockModal}

onClose={()=>setStockModal(false)}

productId={selectedProduct?.id ?? null}

productName={selectedProduct?.name ?? ""}

/>






<StockHistory

open={historyModal}

onClose={()=>setHistoryModal(false)}

productId={selectedProduct?.id ?? null}

productName={selectedProduct?.name ?? ""}

/>






</div>


);



}