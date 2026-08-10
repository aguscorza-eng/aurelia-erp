import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBudget, budgetDataFromBody } from "@/lib/budgets";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Presupuesto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: serializeBudget(budget)
    });

  } catch (error: any) {

    console.error("ERROR PRESUPUESTO GET:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;
    const body = await req.json();

    const data: any = {};

    // Cambios de estado / conversión a venta
    if (body.status !== undefined) data.status = body.status;
    if (body.saleId !== undefined) data.saleId = body.saleId;

    // Edición completa: si vienen items, reemplazamos todo el detalle.
    if (body.items !== undefined) {

      Object.assign(data, budgetDataFromBody(body));

      await prisma.budgetItem.deleteMany({
        where: { budgetId: id }
      });

      data.items = {
        create: body.items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0
        }))
      };

    }

    const budget = await prisma.budget.update({
      where: { id },
      data,
      include: { items: true }
    });

    return NextResponse.json({
      data: serializeBudget(budget)
    });

  } catch (error: any) {

    console.error("ERROR ACTUALIZANDO PRESUPUESTO:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    // Los items se borran en cascada (onDelete: Cascade en el schema).
    await prisma.budget.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {

    console.error("ERROR ELIMINANDO PRESUPUESTO:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
