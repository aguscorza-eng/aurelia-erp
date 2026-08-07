"use client";

import { useEffect, useState } from "react";


interface Props {

month:number;

year:number;

}



export default function ReportCards({

month,

year

}:Props){



const [sales,setSales]=useState<any[]>([]);

const [purchases,setPurchases]=useState<any[]>([]);






useEffect(()=>{


const salesData = JSON.parse(

localStorage.getItem("sales") || "[]"

);



const purchasesData = JSON.parse(

localStorage.getItem("purchases") || "[]"

);



setSales(salesData);

setPurchases(purchasesData);



},[]);









const monthlySales = sales.filter((sale:any)=>{


const date = new Date(

sale.createdAt || Date.now()

);



return (

date.getMonth()===month &&

date.getFullYear()===year

);


});








const monthlyPurchases = purchases.filter((purchase:any)=>{


const date = new Date(

purchase.createdAt || Date.now()

);



return (

date.getMonth()===month &&

date.getFullYear()===year

);


});








const totalSales = monthlySales.reduce(

(acc,item)=>

acc + Number(item.total || 0),

0

);







const totalPurchases = monthlyPurchases.reduce(

(acc,item)=>

acc + Number(item.total || 0),

0

);








const result = totalSales - totalPurchases;







const average = monthlySales.length

?

totalSales / monthlySales.length

:

0;









return (



<div className="
grid
grid-cols-3
gap-6
">







<div className="
bg-white
border
rounded-3xl
p-6
">


<p className="
text-sm
text-stone-500
">

Ventas del mes

</p>



<h2 className="
text-3xl
font-bold
mt-3
">

$

{totalSales.toLocaleString("es-AR")}

</h2>



<p className="
text-sm
text-stone-400
mt-2
">

{monthlySales.length}

ventas realizadas

</p>


</div>








<div className="
bg-white
border
rounded-3xl
p-6
">


<p className="
text-sm
text-stone-500
">

Compras del mes

</p>



<h2 className="
text-3xl
font-bold
mt-3
">

$

{totalPurchases.toLocaleString("es-AR")}

</h2>



<p className="
text-sm
text-stone-400
mt-2
">

{monthlyPurchases.length}

compras realizadas

</p>


</div>








<div className="
bg-[#F8F2E9]
border
rounded-3xl
p-6
">


<p className="
text-sm
text-stone-500
">

Resultado del mes

</p>



<h2 className="
text-3xl
font-bold
mt-3
">

$

{result.toLocaleString("es-AR")}

</h2>



<p className="
text-sm
text-stone-500
mt-2
">

Ticket promedio:

$

{average.toLocaleString("es-AR")}

</p>


</div>






</div>


);


}