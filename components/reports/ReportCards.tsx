"use client";


interface Props {
  month:number;
  year:number;
  sales:any[];
  purchases:any[];
}


export default function ReportCards({
  month,
  year,
  sales,
  purchases
}:Props){


  const inMonth = (x:any)=>{
    const d = new Date(x.createdAt);
    return d.getMonth()===month && d.getFullYear()===year;
  };

  const monthlySales = sales.filter(inMonth);
  const monthlyPurchases = purchases.filter(inMonth);

  const totalSales = monthlySales.reduce(
    (acc,i)=>acc + Number(i.total || 0),
    0
  );

  const totalPurchases = monthlyPurchases.reduce(
    (acc,i)=>acc + Number(i.total || 0),
    0
  );

  const result = totalSales - totalPurchases;

  const average = monthlySales.length
    ? totalSales / monthlySales.length
    : 0;


  return (

    <div className="grid grid-cols-3 gap-6">


      <div className="bg-white border rounded-3xl p-6">
        <p className="text-sm text-stone-500">Ventas del mes</p>
        <h2 className="text-3xl font-bold mt-3">
          ${totalSales.toLocaleString("es-AR")}
        </h2>
        <p className="text-sm text-stone-400 mt-2">
          {monthlySales.length} ventas realizadas
        </p>
      </div>


      <div className="bg-white border rounded-3xl p-6">
        <p className="text-sm text-stone-500">Compras del mes</p>
        <h2 className="text-3xl font-bold mt-3">
          ${totalPurchases.toLocaleString("es-AR")}
        </h2>
        <p className="text-sm text-stone-400 mt-2">
          {monthlyPurchases.length} compras realizadas
        </p>
      </div>


      <div className="bg-[#F8F2E9] border rounded-3xl p-6">
        <p className="text-sm text-stone-500">Resultado del mes</p>
        <h2 className="text-3xl font-bold mt-3">
          ${result.toLocaleString("es-AR")}
        </h2>
        <p className="text-sm text-stone-500 mt-2">
          Ticket promedio: ${Math.round(average).toLocaleString("es-AR")}
        </p>
      </div>


    </div>

  );

}
