"use client";

import { X, Download, MessageCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// Carga el logo y lo devuelve como dataURL para poder embeberlo en el PDF
// de forma confiable (addImage con una ruta suelta a veces no dibuja nada).
async function loadLogo(src:string):Promise<{ dataUrl:string; w:number; h:number } | null>{
  try{
    const img = await new Promise<HTMLImageElement>((resolve,reject)=>{
      const i = new Image();
      i.onload = ()=>resolve(i);
      i.onerror = reject;
      i.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if(!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      w: img.naturalWidth,
      h: img.naturalHeight
    };
  }catch{
    return null;
  }
}


interface Props {

  budget:any;

  onClose:()=>void;

}



export default function BudgetDetailModal({

  budget,

  onClose

}:Props){



if(!budget) return null;





async function downloadPDF(){

const doc = new jsPDF();

const pageW = doc.internal.pageSize.getWidth();
const pageH = doc.internal.pageSize.getHeight();
const marginX = 14;

// Paleta de marca
const gold:[number,number,number]    = [176,141,87];
const cream:[number,number,number]   = [248,242,233];
const softGray:[number,number,number]= [247,246,245];
const textGray:[number,number,number]= [125,118,110];
const ink:[number,number,number]     = [38,36,34];
const red:[number,number,number]     = [204,45,45];
const green:[number,number,number]   = [4,120,87];

const setFill = (c:[number,number,number])=>doc.setFillColor(c[0],c[1],c[2]);
const setText = (c:[number,number,number])=>doc.setTextColor(c[0],c[1],c[2]);
const setDraw = (c:[number,number,number])=>doc.setDrawColor(c[0],c[1],c[2]);


// ===== ENCABEZADO =====
let logoBottom = 32;
const logo = await loadLogo("/logo-aurelia.png");
if(logo){
  const targetW = 46;
  const targetH = targetW * (logo.h / logo.w);
  doc.addImage(logo.dataUrl, "PNG", marginX, 15, targetW, targetH);
  logoBottom = 15 + targetH;
}else{
  setText(ink);
  doc.setFont("helvetica","bold");
  doc.setFontSize(24);
  doc.text("Aurelia", marginX, 26);
  logoBottom = 30;
}

setText(textGray);
doc.setFont("helvetica","normal");
doc.setFontSize(9);
doc.text("PRESUPUESTO COMERCIAL", pageW - marginX, 20, { align:"right" });

setText(ink);
doc.setFont("helvetica","bold");
doc.setFontSize(19);
doc.text(String(budget.number), pageW - marginX, 29, { align:"right" });

setText(textGray);
doc.setFont("helvetica","normal");
doc.setFontSize(9);
doc.text(
  `Emisión: ${new Date(budget.createdAt).toLocaleDateString("es-AR")}`,
  pageW - marginX,
  36,
  { align:"right" }
);

// Línea dorada divisoria
let y = Math.max(logoBottom, 38) + 4;
setDraw(gold);
doc.setLineWidth(0.8);
doc.line(marginX, y, pageW - marginX, y);
y += 10;


// ===== TARJETAS: CLIENTE + ENTREGA =====
const colGap = 6;
const colW = (pageW - marginX * 2 - colGap) / 2;
const rightX = marginX + colW + colGap;
const cardTop = y;
const cardH = 44;

// Cliente
setFill(softGray);
doc.roundedRect(marginX, cardTop, colW, cardH, 3, 3, "F");

let cy = cardTop + 9;
setText(gold);
doc.setFont("helvetica","bold");
doc.setFontSize(8);
doc.text("CLIENTE", marginX + 6, cy);

cy += 8;
setText(ink);
doc.setFont("helvetica","bold");
doc.setFontSize(12);
doc.text(budget.client?.name || "-", marginX + 6, cy);

doc.setFont("helvetica","normal");
doc.setFontSize(9);
setText(textGray);
if(budget.client?.company){ cy += 6; doc.text(budget.client.company, marginX + 6, cy); }
if(budget.client?.email){ cy += 6; doc.text(budget.client.email, marginX + 6, cy); }
if(budget.client?.phone){ cy += 6; doc.text(budget.client.phone, marginX + 6, cy); }

// Entrega y validez
setFill(cream);
doc.roundedRect(rightX, cardTop, colW, cardH, 3, 3, "F");

let ry = cardTop + 9;
setText(gold);
doc.setFont("helvetica","bold");
doc.setFontSize(8);
doc.text("ENTREGA Y VALIDEZ", rightX + 6, ry);

const labelVal = (label:string, val:string)=>{
  ry += 8;
  setText(textGray);
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  doc.text(label, rightX + 6, ry);
  setText(ink);
  doc.setFont("helvetica","bold");
  doc.text(val, rightX + colW - 6, ry, { align:"right" });
};

labelVal("Estado", String(budget.status || "-"));
labelVal("Preparación", String(budget.preparationDays || "A confirmar"));
labelVal(
  "Entrega",
  budget.deliveryDate ? new Date(budget.deliveryDate).toLocaleDateString("es-AR") : "A confirmar"
);
labelVal("Validez", "15 días");

y = cardTop + cardH + 12;


// ===== TABLA DE PRODUCTOS =====
autoTable(doc,{
  startY: y,
  head: [["Producto","Cant.","Precio","Total"]],
  body: (budget.items || []).map((it:any)=>[
    it.name,
    String(it.quantity),
    `$${Number(it.price).toLocaleString("es-AR")}`,
    `$${(it.quantity * Number(it.price)).toLocaleString("es-AR")}`
  ]),
  headStyles:{
    fillColor:[176,141,87],
    textColor:[255,255,255],
    fontStyle:"bold",
    halign:"left",
    cellPadding:3
  },
  bodyStyles:{ textColor:[40,38,36], cellPadding:3 },
  alternateRowStyles:{ fillColor:[250,249,248] },
  columnStyles:{
    1:{ halign:"center" },
    2:{ halign:"right" },
    3:{ halign:"right", fontStyle:"bold" }
  },
  styles:{ fontSize:10 },
  margin:{ left:marginX, right:marginX }
});

let afterY = (doc as any).lastAutoTable.finalY + 10;


// ===== TOTALES =====
const boxW = 82;
const boxX = pageW - marginX - boxW;

const totalLine = (label:string, val:string, color:[number,number,number])=>{
  setText(textGray);
  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.text(label, boxX, afterY);
  setText(color);
  doc.setFont("helvetica","bold");
  doc.text(val, pageW - marginX, afterY, { align:"right" });
  afterY += 7;
};

totalLine("Subtotal", `$${Number(budget.subtotal).toLocaleString("es-AR")}`, ink);
totalLine("Descuento", `-$${Number(budget.discountAmount || 0).toLocaleString("es-AR")}`, red);
if(budget.bonus > 0){
  totalLine("Bonificación", `+${budget.bonus} u. sin cargo`, green);
}

// Barra TOTAL destacada
afterY += 1;
const barH = 13;
setFill(gold);
doc.roundedRect(boxX - 2, afterY, boxW + 2, barH, 2.5, 2.5, "F");
setText([255,255,255]);
doc.setFont("helvetica","bold");
doc.setFontSize(11);
doc.text("TOTAL", boxX + 3, afterY + 8.5);
doc.setFontSize(13);
doc.text(`$${Number(budget.total).toLocaleString("es-AR")}`, pageW - marginX - 3, afterY + 8.5, { align:"right" });

let footY = afterY + barH + 16;


// ===== CONDICIONES =====
setDraw([232,230,227]);
doc.setLineWidth(0.4);
doc.line(marginX, footY, pageW - marginX, footY);
footY += 8;

setText(ink);
doc.setFont("helvetica","bold");
doc.setFontSize(10);
doc.text("Condiciones comerciales", marginX, footY);

setText(textGray);
doc.setFont("helvetica","normal");
doc.setFontSize(9);
footY += 6;
doc.text("• Presupuesto válido por 15 días.", marginX, footY);
footY += 5;
doc.text("• Forma de pago a coordinar.", marginX, footY);
footY += 5;
doc.text("• La fecha de entrega puede variar según producción y disponibilidad.", marginX, footY);


// ===== PIE =====
setDraw(gold);
doc.setLineWidth(0.8);
doc.line(marginX, pageH - 20, pageW - marginX, pageH - 20);
setText(gold);
doc.setFont("helvetica","bold");
doc.setFontSize(10);
doc.text("Gracias por elegir Aurelia", pageW / 2, pageH - 13, { align:"center" });


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