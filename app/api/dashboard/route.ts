import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
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
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });


    const salesMonth = sales.reduce(
      (total, sale) =>
        total + Number(sale.total),
      0
    );


    const unitsSold = sales.reduce(
      (total, sale) =>
        total +
        sale.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      0
    );


    const profit = sales.reduce(
      (total, sale) => {

        const saleProfit = sale.items.reduce(
          (sum, item) => {

            return (
              sum +
              (
                Number(item.price) -
                Number(item.product.cost)
              ) *
              item.quantity
            );

          },
          0
        );


        return total + saleProfit;

      },
      0
    );


    const criticalStock = await prisma.product.count({
      where: {
        stock: {
          lte: 3
        }
      }
    });


    const products = await prisma.product.findMany({
      orderBy: {
        stock: "asc"
      },
      take: 5
    });



    return NextResponse.json({

      salesMonth,

      profit,

      unitsSold,

      criticalStock,

      products,

      recentSales: sales.slice(0,5).map((sale)=>({

        id: sale.id,

        customer:
          sale.customer?.name || "Consumidor final",

        total:
          Number(sale.total),

        date:
          sale.createdAt

      }))

    });



  } catch(error:any) {


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