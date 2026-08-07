import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const suppliers = await prisma.supplier.findMany({

      where: {
        active: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });


    return NextResponse.json({

      ok: true,

      data: suppliers,

    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        error: "Error obteniendo proveedores",
      },
      {
        status: 500,
      }
    );

  }

}




export async function POST(req: Request) {

  try {

    const body = await req.json();


    const supplier = await prisma.supplier.create({

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
        error: "Error creando proveedor",
      },
      {
        status: 500,
      }
    );

  }

}