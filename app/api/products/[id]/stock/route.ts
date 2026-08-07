import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}


export async function POST(
  req: NextRequest,
  { params }: Params
) {

  try {

    const { id } = await params;

    const body = await req.json();


    const type = body.type;
    const quantity = Number(body.quantity);
    const note = body.note || "";



    if (!type || !quantity || quantity <= 0) {

      return NextResponse.json(
        {
          error: "Datos inválidos",
        },
        {
          status: 400,
        }
      );

    }



    const product = await prisma.product.findUnique({

      where: {
        id,
      },

    });



    if (!product) {

      return NextResponse.json(
        {
          error: "Producto no encontrado",
        },
        {
          status: 404,
        }
      );

    }



    let newStock = product.stock;



    if (type === "ENTRADA") {

      newStock += quantity;

    }



    if (type === "SALIDA") {

      newStock -= quantity;

    }



    if (newStock < 0) {

      return NextResponse.json(
        {
          error: "No hay stock suficiente",
        },
        {
          status: 400,
        }
      );

    }



    const result = await prisma.$transaction([


      prisma.product.update({

        where: {
          id,
        },

        data: {

          stock: newStock,

        },

      }),



      prisma.stockMovement.create({

        data: {

          type,

          quantity,

          note,

          productId: id,

        },

      }),


    ]);




    return NextResponse.json({

      ok: true,

      product: result[0],

      movement: result[1],

      message: "Stock actualizado y movimiento guardado",

    });



  } catch (error) {

    console.error(error);


    return NextResponse.json(

      {
        error: "Error actualizando stock",
      },

      {
        status: 500,
      }

    );

  }

}