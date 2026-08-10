"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, ChevronDown } from "lucide-react";


interface Props {
  month:number;
  year:number;
  sales:any[];
  purchases:any[];
}


const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const money = (n:number)=> `$${Number(n || 0).toLocaleString("es-AR")}`;

const fmt = (v:any)=>{
  const d = new Date(v);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-AR");
};


export default function ReportPDF({
  month,
  year,
  sales,
  purchases
}:Props){

  const [open,setOpen]=useState(false);


  const byMonth = (list:any[])=> list.filter((x)=>{
    const d = new Date(x.createdAt);
    return d.getMonth()===month && d.getFullYear()===year;
  });

  const byYear = (list:any[])=> list.filter(
    (x)=> new Date(x.createdAt).getFullYear()===year
  );


  function heading(doc:any, subtitle:string){
    doc.setFontSize(20);
    doc.text("Aurelia Fragancias", 20, 22);
    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text(subtitle, 20, 30);
    doc.setTextColor(0);
  }

  function afterY(doc:any){
    return (doc as any).lastAutoTable.finalY;
  }


  // Reporte del mes: ventas + compras en detalle + totales.
  function exportMonth(){
    const s = byMonth(sales);
    const p = byMonth(purchases);
    const totalS = s.reduce((a:number,x:any)=>a+Number(x.total||0),0);
    const totalP = p.reduce((a:number,x:any)=>a+Number(x.total||0),0);

    const doc = new jsPDF();
    heading(doc, `Reporte mensual — ${MONTHS[month]} ${year}`);

    doc.setFontSize(11);
    doc.text(`Ventas: ${money(totalS)}  (${s.length})`, 20, 42);
    doc.text(`Compras: ${money(totalP)}  (${p.length})`, 20, 49);
    doc.setFont("helvetica","bold");
    doc.text(`Resultado: ${money(totalS - totalP)}`, 20, 56);
    doc.setFont("helvetica","normal");

    autoTable(doc,{
      startY: 64,
      head: [["Fecha","Cliente","Total","Estado"]],
      body: s.map((x:any)=>[
        fmt(x.createdAt),
        x.client?.name || x.client || "-",
        money(x.total),
        x.status || "-"
      ]),
      headStyles:{ fillColor:[176,141,87] },
      styles:{ fontSize:9 }
    });

    autoTable(doc,{
      startY: afterY(doc) + 10,
      head: [["Fecha","Proveedor","Total"]],
      body: p.map((x:any)=>[
        fmt(x.createdAt),
        x.supplier?.name || "-",
        money(x.total)
      ]),
      headStyles:{ fillColor:[120,120,120] },
      styles:{ fontSize:9 }
    });

    doc.save(`Reporte_${MONTHS[month]}_${year}.pdf`);
  }


  // Reporte del año: desglose mes por mes.
  function exportYear(){
    const s = byYear(sales);
    const p = byYear(purchases);

    const rows = MONTHS.map((m,i)=>{
      const ms = s
        .filter((x:any)=>new Date(x.createdAt).getMonth()===i)
        .reduce((a:number,x:any)=>a+Number(x.total||0),0);
      const mp = p
        .filter((x:any)=>new Date(x.createdAt).getMonth()===i)
        .reduce((a:number,x:any)=>a+Number(x.total||0),0);
      return [m, money(ms), money(mp), money(ms - mp)];
    });

    const totalS = s.reduce((a:number,x:any)=>a+Number(x.total||0),0);
    const totalP = p.reduce((a:number,x:any)=>a+Number(x.total||0),0);

    const doc = new jsPDF();
    heading(doc, `Reporte anual — ${year}`);

    autoTable(doc,{
      startY: 40,
      head: [["Mes","Ventas","Compras","Resultado"]],
      body: rows,
      foot: [["Total", money(totalS), money(totalP), money(totalS - totalP)]],
      headStyles:{ fillColor:[176,141,87] },
      footStyles:{ fillColor:[240,235,225], textColor:[0,0,0], fontStyle:"bold" },
      styles:{ fontSize:10 }
    });

    doc.save(`Reporte_Anual_${year}.pdf`);
  }


  // Ranking de clientes del año.
  function exportClients(){
    const s = byYear(sales);
    const map:Record<string,{ n:number; total:number }> = {};

    for(const x of s){
      const name = x.client?.name || x.client || "-";
      if(!map[name]) map[name] = { n:0, total:0 };
      map[name].n++;
      map[name].total += Number(x.total||0);
    }

    const rows = Object.entries(map)
      .sort((a,b)=>b[1].total - a[1].total)
      .map(([name,v],i)=>[String(i+1), name, String(v.n), money(v.total)]);

    const doc = new jsPDF();
    heading(doc, `Ranking de clientes — ${year}`);

    autoTable(doc,{
      startY: 40,
      head: [["#","Cliente","Ventas","Total"]],
      body: rows,
      headStyles:{ fillColor:[176,141,87] },
      styles:{ fontSize:9 }
    });

    doc.save(`Clientes_${year}.pdf`);
  }


  return (

    <div className="relative">

      <button
        onClick={()=>setOpen(!open)}
        className="bg-stone-900 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
      >
        <FileText size={18}/>
        Exportar PDF
        <ChevronDown size={16}/>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg z-20 w-64 overflow-hidden">

          <button
            onClick={()=>{ exportMonth(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-stone-50 text-sm"
          >
            📄 Reporte del mes ({MONTHS[month]})
          </button>

          <button
            onClick={()=>{ exportYear(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-stone-50 text-sm border-t"
          >
            📅 Reporte del año ({year})
          </button>

          <button
            onClick={()=>{ exportClients(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-stone-50 text-sm border-t"
          >
            👥 Ranking de clientes ({year})
          </button>

        </div>
      )}

    </div>

  );

}
