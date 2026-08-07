import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


interface Params {

  params: Promise<{
    id: string;
  }>;

}



// Obtener proveedor

export async function GET(
  req: NextRequest,
  { params }: Params
) {


  try {


    const { id } = await params;



    const supplier = await prisma.supplier.findUnique({

      where: {
        id,
      },

    });



    if (!supplier) {

      return NextResponse.json(
        {
          error: "Proveedor no encontrado",
        },
        {
          status: 404,
        }
      );

    }



    return NextResponse.json(supplier);



  } catch (error) {


    console.error(error);


    return NextResponse.json(
      {
        error: "Error obteniendo proveedor",
      },
      {
        status: 500,
      }
    );

  }

}





// Editar proveedor

export async function PUT(
  req: NextRequest,
  { params }: Params
) {


  try {


    const { id } = await params;


    const body = await req.json();



    const supplier = await prisma.supplier.update({

      where: {
        id,
      },


      data: {

        name: body.name,

        company: body.company || null,

        phone: body.phone || null,

        email: body.email || null,

        notes: body.notes || null,

      },

    });



    return NextResponse.json(supplier);



  } catch (error) {


    console.error(error);


    return NextResponse.json(
      {
        error: "Error actualizando proveedor",
      },
      {
        status: 500,
      }
    );

  }

}





// Eliminar proveedor

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {


  try {


    const { id } = await params;



    await prisma.supplier.update({

      where: {
        id,
      },


      data: {

        active: false,

      },

    });



    return NextResponse.json({

      ok: true,

    });



  } catch (error) {


    console.error(error);


    return NextResponse.json(
      {
        error: "Error eliminando proveedor",
      },
      {
        status: 500,
      }
    );

  }

}