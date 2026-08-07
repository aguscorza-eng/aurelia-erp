"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



export default function BudgetPDF({budget}: {budget:any}){



function generatePDF(){



const doc = new jsPDF();





// LOGO

const logo = "/logo-aurelia.png";



doc.addImage(

logo,

"PNG",

70,

15,

70,

30

);






doc.setFontSize(12);

doc.text(

"Presupuesto comercial",

105,

60,

{align:"center"}

);






doc.setFontSize(18);

doc.text(

`PRE-000${budget.number?.replace(/\D/g,"") || ""}`,

105,

75,

{align:"center"}

);





doc.setFontSize(10);

doc.text(

`Fecha: ${new Date(budget.createdAt).toLocaleDateString("es-AR")}`,

20,

90

);







// CLIENTE

doc.setFontSize(13);

doc.text(

"Datos del cliente",

20,

110

);



doc.setFontSize(10);



doc.text(

`Nombre: ${budget.client?.name || "-"}`,

20,

120

);



if(budget.client?.company){

doc.text(

`Empresa: ${budget.client.company}`,

20,

128

);

}



if(budget.client?.email){

doc.text(

`Email: ${budget.client.email}`,

20,

136

);

}



if(budget.client?.phone){

doc.text(

`WhatsApp: ${budget.client.phone}`,

20,

144

);

}








// PRODUCTOS



autoTable(doc,{



startY:160,



head:[

[

"Producto",

"Cantidad",

"Precio",

"Total"

]

],



body:

budget.items?.map((item:any)=>

[

item.name,

item.quantity,

`$${item.price.toLocaleString("es-AR")}`,

`$${(

item.quantity *

item.price

).toLocaleString("es-AR")}`

]

)



});









const finalY =

(doc as any).lastAutoTable.finalY;






doc.setFontSize(12);



doc.text(

`Subtotal: $${budget.subtotal?.toLocaleString("es-AR") || 0}`,

140,

finalY + 20

);



doc.text(

`Descuento: -$${budget.discountAmount?.toLocaleString("es-AR") || 0}`,

140,

finalY + 30

);





doc.setFontSize(16);



doc.text(

`TOTAL: $${budget.total.toLocaleString("es-AR")}`,

140,

finalY + 45

);







doc.setFontSize(10);



doc.text(

"Condiciones comerciales:",

20,

finalY + 70

);



doc.text(

"• Presupuesto válido por 15 días",

20,

finalY + 80

);



doc.text(

"• Forma de pago a coordinar",

20,

finalY + 88

);



doc.text(

"Gracias por elegir Aurelia Fragancias",

20,

finalY + 105

);






doc.save(

`Presupuesto-${budget.number}.pdf`

);



}





return (

<button

onClick={generatePDF}

className="
bg-[#B08D57]
text-white
px-4
py-2
rounded-xl
font-semibold
"

>

📄 Descargar PDF

</button>

);


}