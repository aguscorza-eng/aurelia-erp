import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {


    const products = await prisma.product.findMany({

      where: {
        type: "PRODUCTO_TERMINADO",
      },

    });




    const total = products.length;



    const totalUnits = products.reduce(
      (sum, p) =>
        sum + p.stock,
      0
    );




    const lowStock = products.filter(
      (p) =>
        p.stock > 0 &&
        p.stock <= p.minimumStock
    ).length;




    const outOfStock = products.filter(
      (p) =>
        p.stock === 0
    ).length;




    const inventoryValue = products.reduce(
      (sum, p) =>
        sum + Number(p.cost) * p.stock,
      0
    );




    const salesValue = products.reduce(
      (sum, p) =>
        sum + Number(p.price) * p.stock,
      0
    );




    const potentialProfit =
      salesValue - inventoryValue;




    const averageMargin =
      salesValue > 0
        ? ((potentialProfit / salesValue) * 100).toFixed(0)
        : 0;




    return NextResponse.json({

      total,

      totalUnits,

      lowStock,

      outOfStock,

      inventoryValue,

      salesValue,

      potentialProfit,

      averageMargin,

    });



  } catch (error) {


    console.error(
      "ERROR PRODUCT STATS:",
      error
    );



    return NextResponse.json(

      {
        error: "Error obteniendo estadísticas",
      },

      {
        status: 500,
      }

    );

  }

}