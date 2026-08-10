"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import ReportCards from "@/components/reports/ReportCards";
import ReportFilters from "@/components/reports/ReportFilters";

import SalesReportTable from "@/components/reports/SalesReportTable";
import PurchasesReportTable from "@/components/reports/PurchasesReportTable";

import ReportPDF from "@/components/reports/ReportPDF";



export default function ReportesPage(){



const now = new Date();



const [month,setMonth]=useState(
now.getMonth()
);


const [year,setYear]=useState(
now.getFullYear()
);



const [sales,setSales]=useState<any[]>([]);

const [purchases,setPurchases]=useState<any[]>([]);








useEffect(()=>{

async function load(){
try{
const [sRes,pRes] = await Promise.all([
fetch("/api/sales"),
fetch("/api/purchases")
]);
const sData = await sRes.json();
const pData = await pRes.json();
setSales(sData.data || []);
setPurchases(pData.data || []);
}catch(error){
console.error(error);
}
}

load();

},[]);








return (


<main className="
flex
h-screen
bg-[#F8F8F6]
">



<Sidebar />






<section className="
flex-1
flex
flex-col
overflow-hidden
">



<Header />






<div className="
flex-1
overflow-y-auto
p-10
space-y-8
">






<div className="
flex
justify-between
items-start
">


<div>


<h1 className="
text-4xl
font-bold
">

Reportes

</h1>



<p className="
text-stone-500
mt-2
">

Análisis de ventas y compras del negocio

</p>


</div>







<ReportPDF

month={month}

year={year}

sales={sales}

purchases={purchases}

/>





</div>









<ReportFilters

month={month}

year={year}

setMonth={setMonth}

setYear={setYear}

/>










<ReportCards

month={month}

year={year}

sales={sales}

purchases={purchases}

/>











<div className="
space-y-6
">





<SalesReportTable

month={month}

year={year}

sales={sales}

/>





<PurchasesReportTable

month={month}

year={year}

purchases={purchases}

/>





</div>









<div className="
bg-white
border
rounded-3xl
p-8
">



<h2 className="
text-xl
font-bold
mb-5
">

Resumen mensual

</h2>



<p className="
text-stone-400
">

Aquí aparecerán los gráficos y comparaciones de ventas y compras.

</p>



</div>







</div>







</section>






</main>


);


}