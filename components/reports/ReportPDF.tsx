"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface Props {

month:number;

year:number;

sales:any[];

purchases:any[];

}



export default function ReportPDF({

month,

year,

sales,

purchases

}:Props){



const months=[

"Enero",
"Febrero",
"Marzo",
"Abril",
"Mayo",
"Junio",
"Julio",
"Agosto",
"Septiembre",
"Octubre",
"Noviembre",
"Diciembre"

];







function generate(){


const doc = new jsPDF();





const totalSales = sales.reduce(

(acc,item)=>

acc + Number(item.total || 0),

0

);



const totalPurchases = purchases.reduce(

(acc,item)=>

acc + Number(item.total || 0),

0

);



const result = totalSales-totalPurchases;






doc.setFontSize(22);

doc.text(

"Aurelia Fragancias",

20,

25

);



doc.setFontSize(14);

doc.text(

`Reporte mensual - ${months[month]} ${year}`,

20,

38

);






doc.setFontSize(12);

doc.text(

`Ventas: $${totalSales.toLocaleString("es-AR")}`,

20,

55

);


doc.text(

`Compras: $${totalPurchases.toLocaleString("es-AR")}`,

20,

65

);



doc.text(

`Resultado: $${result.toLocaleString("es-AR")}`,

20,

75

);







autoTable(doc,{

startY:90,

head:[

[
"Fecha",
"Cliente",
"Total"

]

],

body:sales.map((sale:any)=>[

new Date(
sale.createdAt
).toLocaleDateString("es-AR"),

sale.client?.name || sale.client || "-",

`$${Number(sale.total).toLocaleString("es-AR")}`

])


});







autoTable(doc,{

startY:(doc as any).lastAutoTable.finalY + 15,

head:[

[
"Fecha",
"Proveedor",
"Total"

]

],

body:purchases.map((item:any)=>[

new Date(
item.createdAt
).toLocaleDateString("es-AR"),

item.supplier || item.provider || "-",

`$${Number(item.total).toLocaleString("es-AR")}`

])


});







doc.save(

`Reporte_Aurelia_${months[month]}_${year}.pdf`

);


}





return (

<button

onClick={generate}

className="
bg-stone-900
text-white
px-5
py-3
rounded-xl
font-semibold
"

>

📄 Exportar PDF

</button>


);


}