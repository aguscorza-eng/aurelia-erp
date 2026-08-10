"use client";

import { X, Download, MessageCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface Props {

  budget:any;

  onClose:()=>void;

}



export default function BudgetDetailModal({

  budget,

  onClose

}:Props){



if(!budget) return null;





function downloadPDF(){

const doc = new jsPDF();


// Encabezado
doc.setFontSize(22);
doc.text("Aurelia", 14, 20);

doc.setFontSize(10);
doc.setTextColor(120);
doc.text("PRESUPUESTO COMERCIAL", 14, 27);

doc.setTextColor(0);
doc.setFontSize(15);
doc.text(String(budget.number), 14, 37);

doc.setFontSize(10);
doc.setTextColor(120);
doc.text(
`Fecha: ${new Date(budget.createdAt).toLocaleDateString("es-AR")}`,
150,
20
);
doc.setTextColor(0);


// Datos del cliente
let y = 50;
doc.setFontSize(11);
doc.text(`Cliente: ${budget.client?.name || "-"}`, 14, y);

if(budget.client?.company){ y += 6; doc.text(`Empresa: ${budget.client.company}`, 14, y); }
if(budget.client?.email){ y += 6; doc.text(`Email: ${budget.client.email}`, 14, y); }
if(budget.client?.phone){ y += 6; doc.text(`WhatsApp: ${budget.client.phone}`, 14, y); }


// Tabla de productos
autoTable(doc,{
startY: y + 8,
head: [["Producto","Cantidad","Precio","Total"]],
body: (budget.items || []).map((it:any)=>[
it.name,
String(it.quantity),
`$${Number(it.price).toLocaleString("es-AR")}`,
`$${(it.quantity * Number(it.price)).toLocaleString("es-AR")}`
]),
headStyles:{ fillColor:[176,141,87] },
styles:{ fontSize:10 }
});


let afterY = (doc as any).lastAutoTable.finalY + 12;


// Totales
doc.setFontSize(11);
doc.text(`Subtotal: $${Number(budget.subtotal).toLocaleString("es-AR")}`, 140, afterY);

afterY += 6;
doc.text(`Descuento: -$${Number(budget.discountAmount || 0).toLocaleString("es-AR")}`, 140, afterY);

if(budget.bonus > 0){
afterY += 6;
doc.text(`Bonificacion: +${budget.bonus} u. sin cargo`, 140, afterY);
}

afterY += 9;
doc.setFontSize(14);
doc.setFont("helvetica","bold");
doc.text(`TOTAL: $${Number(budget.total).toLocaleString("es-AR")}`, 140, afterY);
doc.setFont("helvetica","normal");


// Condiciones
afterY += 16;
doc.setFontSize(9);
doc.setTextColor(120);
doc.text("Presupuesto valido por 15 dias. Forma de pago a coordinar.", 14, afterY);


doc.save(`${budget.number}.pdf`);

}







function sendWhatsApp(){



const phone = budget.client?.phone?.replace(/\D/g,"");



if(!phone){

alert("El cliente no tiene WhatsApp cargado");

return;

}




const products = budget.items

?.map(

(item:any)=>

`• ${item.name} x${item.quantity}`

)

.join("\n");







const message =

`Hola ${budget.client?.name} 👋


Te enviamos el presupuesto ${budget.number} de Aurelia.


Detalle:

${products}


Subtotal:
$${Number(budget.subtotal).toLocaleString("es-AR")}


Descuento:
-$${Number(budget.discountAmount || 0).toLocaleString("es-AR")}
${budget.bonus > 0 ? `\nBonificación:\n+${budget.bonus} unidades sin cargo\n` : ""}

TOTAL:
$${Number(budget.total).toLocaleString("es-AR")}



Entrega estimada:

Tiempo de preparación:
${budget.preparationDays || "A confirmar"}


Fecha estimada:
${
budget.deliveryDate
?
new Date(budget.deliveryDate).toLocaleDateString("es-AR")
:
"A confirmar"
}



Muchas gracias por confiar en Aurelia.`;




window.open(

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

"_blank"

);


}









return (



<div className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
z-50
">







<div className="
bg-white
w-[850px]
rounded-3xl
shadow-2xl
p-10
max-h-[90vh]
overflow-y-auto
">







<div className="
flex
justify-between
items-start
mb-8
">





<div>


<img

src="/logo-aurelia.png"

className="
w-48
mb-4
"

/>




<p className="
text-stone-500
tracking-widest
text-sm
">

PRESUPUESTO COMERCIAL

</p>




<h1 className="
text-3xl
font-bold
">

{budget.number}

</h1>




</div>







<div className="text-right">


<p className="text-sm text-stone-500">

Fecha emisión

</p>



<p className="font-semibold">

{

new Date(

budget.createdAt

)

.toLocaleDateString("es-AR")

}

</p>




<button

onClick={onClose}

className="
mt-4
border
rounded-xl
p-2
"

>

<X size={20}/>

</button>




</div>





</div>









<div className="
grid
grid-cols-2
gap-6
mb-8
">






<div className="
bg-stone-50
rounded-2xl
p-5
">


<p className="
text-xs
tracking-widest
text-stone-400
mb-2
">

CLIENTE

</p>




<h3 className="
font-bold
text-lg
">

{budget.client?.name}

</h3>





{budget.client?.company && (

<p>

{budget.client.company}

</p>

)}





{budget.client?.email && (

<p className="text-stone-500">

{budget.client.email}

</p>

)}




{budget.client?.phone && (

<p className="text-stone-500">

{budget.client.phone}

</p>

)}






</div>










<div className="
bg-[#F8F2E9]
rounded-2xl
p-5
">


<p className="
text-xs
tracking-widest
text-stone-500
mb-2
">

RESUMEN

</p>





<p>

Estado:

<strong>

{" "}

{budget.status}

</strong>

</p>





<p>

Validez:

<strong>

15 días

</strong>

</p>




</div>





</div>









<div className="
grid
grid-cols-2
gap-6
mb-8
">






<div className="
bg-[#F8F2E9]
rounded-2xl
p-5
">


<p className="
text-xs
tracking-widest
text-stone-500
mb-3
">

ENTREGA

</p>





<p>

<strong>

Preparación:

</strong>

<br/>

{budget.preparationDays || "A confirmar"}

</p>





<p className="mt-3">

<strong>

Fecha estimada:

</strong>

<br/>


{

budget.deliveryDate

?

new Date(

budget.deliveryDate

)

.toLocaleDateString("es-AR")

:

"A confirmar"

}



</p>




</div>










<div className="
bg-stone-50
rounded-2xl
p-5
">


<p className="
text-xs
tracking-widest
text-stone-400
mb-3
">

NOTA INTERNA

</p>




<p className="text-sm">

{budget.internalNote || "Sin notas internas"}

</p>




</div>





</div>









<table className="w-full">


<thead className="bg-stone-50">


<tr className="
text-left
text-sm
text-stone-500
">


<th className="p-4">

Producto

</th>


<th>

Cantidad

</th>


<th>

Precio

</th>


<th>

Total

</th>



</tr>


</thead>







<tbody>



{budget.items?.map((item:any,index:number)=>(



<tr

key={index}

className="border-t"

>



<td className="p-4 font-semibold">

{item.name}

</td>




<td>

{item.quantity}

</td>




<td>

$

{Number(item.price)

.toLocaleString("es-AR")}

</td>





<td className="font-bold">

$

{(

item.quantity *

item.price

)

.toLocaleString("es-AR")}

</td>




</tr>



))}



</tbody>



</table>









<div className="
mt-8
flex
justify-end
">


<div className="
w-72
space-y-3
text-right
">





<div className="flex justify-between">

<span>

Subtotal

</span>

<strong>

${Number(budget.subtotal)

.toLocaleString("es-AR")}

</strong>

</div>






<div className="flex justify-between text-red-600">

<span>

Descuento

</span>


<strong>

-${Number(budget.discountAmount || 0)

.toLocaleString("es-AR")}

</strong>

</div>




{budget.bonus > 0 && (

<div className="flex justify-between text-emerald-700">

<span>

Bonificación

</span>

<strong>

+{budget.bonus} u. sin cargo

</strong>

</div>

)}







<div className="
border-t
pt-4
text-2xl
font-bold
flex
justify-between
">

<span>

TOTAL

</span>



<span>

${Number(budget.total)

.toLocaleString("es-AR")}

</span>


</div>






</div>


</div>









<div className="
mt-8
border-t
pt-5
text-sm
text-stone-500
">



<h4 className="font-bold text-stone-700 mb-2">

Condiciones comerciales

</h4>




<p>

• Presupuesto válido por 15 días.

</p>



<p>

• Forma de pago a coordinar.

</p>




<p>

• La fecha de entrega puede variar según producción y disponibilidad.

</p>




</div>









<div className="
mt-8
flex
justify-end
gap-3
">






<button

onClick={sendWhatsApp}

className="
bg-green-600
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-semibold
"

>


<MessageCircle size={18}/>

WhatsApp

</button>







<button

onClick={downloadPDF}

className="
bg-stone-900
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-semibold
"

>


<Download size={18}/>

Descargar PDF

</button>






</div>







</div>






</div>


);


}