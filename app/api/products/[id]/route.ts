import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}


// Obtener un producto
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {

    const { id } = await params;


    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });


    if (!product) {

      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );

    }


    return NextResponse.json(product);


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      { error: "Error obteniendo producto" },
      { status: 500 }
    );

  }
}



// Editar producto
export async function PUT(
  req: NextRequest,
  { params }: Params
) {

  try {

    const { id } = await params;

    const body = await req.json();


    const product = await prisma.product.update({

      where: { id },

      data: {

        name: body.name,

        sku: body.sku,

        description: body.description,

        image: body.image || null,

        cost: Number(body.cost),

        price: Number(body.price),

        stock: Number(body.stock),

        minimumStock: Number(body.minimumStock),

        categoryId: body.categoryId,

      },

      include: {
        category: true,
      },

    });


    return NextResponse.json(product);


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 }
    );

  }

}



// Eliminar producto
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {

  try {

    const { id } = await params;


    await prisma.product.delete({
      where: { id },
    });


    return NextResponse.json({
      ok: true,
    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 }
    );

  }

}