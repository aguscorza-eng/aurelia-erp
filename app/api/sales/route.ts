import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const sales = await prisma.sale.findMany({

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


    return NextResponse.json({
      data: sales
    });


  } catch(error:any){

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