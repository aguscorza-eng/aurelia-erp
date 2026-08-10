import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );


    const startOfYear = new Date(
      new Date().getFullYear(),
      0,
      1
    );


    const sales = await prisma.sale.findMany({

      where: {

        createdAt: {
          gte: startOfMonth
        }

      },

      include: {

        customer: true,

        items: {

          include: {

            product:true

          }

        }

      },

      orderBy: {

        createdAt:"desc"

      }

    });



    const salesMonth = sales.reduce(
      (total,sale)=>
        total + Number(sale.total),
      0
    );



    const pendingBalance = sales.reduce(
      (total,sale)=>
        total + Number(sale.balance),
      0
    );



    const collectedAdvance = sales.reduce(
      (total,sale)=>
        total + Number(sale.advance),
      0
    );



    const unitsSold = sales.reduce(
      (total,sale)=>
        total +
        sale.items.reduce(
          (sum,item)=>sum + item.quantity,
          0
        ),
      0
    );



    const profit = sales.reduce(

      (total,sale)=>

        total +

        sale.items.reduce(

          (sum,item)=>

            sum +

            (
              Number(item.price) -
              Number(item.product.cost)
            )

            *

            item.quantity,

          0

        ),

      0

    );



    // Ranking de productos más vendidos del mes, tomado de las ventas.
    // Sumamos las unidades por producto y nos quedamos con los 3 primeros.
    const productMap: Record<string, {
      id: string;
      name: string;
      price: number;
      units: number;
    }> = {};

    sales.forEach((sale) => {

      sale.items.forEach((item) => {

        const p = item.product;

        if (!productMap[p.id]) {
          productMap[p.id] = {
            id: p.id,
            name: p.name,
            price: Number(p.price),
            units: 0
          };
        }

        productMap[p.id].units += item.quantity;

      });

    });


    const topProducts = Object.values(productMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);



    // Evolución de ventas del año: total facturado por cada mes.
    const yearSales = await prisma.sale.findMany({

      where: {
        createdAt: {
          gte: startOfYear
        }
      },

      select: {
        total: true,
        createdAt: true
      }

    });


    const monthLabels = [
      "Ene","Feb","Mar","Abr","May","Jun",
      "Jul","Ago","Sep","Oct","Nov","Dic"
    ];


    const monthlySales = monthLabels.map((name, index) => {

      const ventas = yearSales

        .filter((sale) =>
          new Date(sale.createdAt).getMonth() === index
        )

        .reduce((acc, sale) => acc + Number(sale.total), 0);

      return { name, ventas };

    });



    const criticalStock = await prisma.product.count({

      where:{

        stock:{
          lte:3
        }

      }

    });



    const products = await prisma.product.findMany({

      orderBy:{
        stock:"asc"
      },

      take:5

    });



    return NextResponse.json({

      salesMonth,

      profit,

      pendingBalance,

      collectedAdvance,

      unitsSold,

      criticalStock,

      topProducts,

      monthlySales,

      products,


      recentSales:

        sales.slice(0,5).map((sale)=>({

          id:sale.id,

          customer:
            sale.customer?.name || "Consumidor final",

          total:Number(sale.total),

          date:sale.createdAt

        }))

    });



  }catch(error:any){


    console.error(error);


    return NextResponse.json(

      {
        error:error.message
      },

      {
        status:500
      }

    );


  }

}