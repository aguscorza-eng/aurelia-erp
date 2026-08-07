import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}


export async function GET(
  req: NextRequest,
  { params }: Params
) {

  try {

    const { id } = await params;


    const movements = await prisma.stockMovement.findMany({

      where: {
        productId: id,
      },

      orderBy: {
        createdAt: "desc",
      },

    });


    return NextResponse.json({

      ok: true,

      data: movements,

    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(

      {
        error: "Error obteniendo movimientos",
      },

      {
        status: 500,
      }

    );

  }

}