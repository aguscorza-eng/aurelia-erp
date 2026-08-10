import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



// ELIMINAR COMPRA
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    await prisma.$transaction(async (tx) => {
      await tx.purchaseItem.deleteMany({ where: { purchaseId: id } });
      await tx.purchase.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



// EDITAR COMPRA
//
// Mismo formato que POST: proveedor por nombre, insumos como texto.
// No toca stock ni costos de productos.
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;
    const body = await req.json();

    const { supplierName, purchaseType, items } = body;

    if (!supplierName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.findFirst({
      where: { name: supplierName }
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Proveedor no encontrado: " + supplierName },
        { status: 400 }
      );
    }

    let total = 0;
    for (const item of items) {
      total += Number(item.cost) * Number(item.quantity);
    }

    const result = await prisma.$transaction(async (tx) => {

      await tx.purchaseItem.deleteMany({ where: { purchaseId: id } });

      return tx.purchase.update({
        where: { id },
        data: {
          supplierId: supplier.id,
          purchaseType: purchaseType || "MATERIA_PRIMA",
          total,
          items: {
            create: items.map((item: any) => ({
              name: item.name || null,
              productId: item.productId || null,
              quantity: Number(item.quantity),
              cost: Number(item.cost)
            }))
          }
        },
        include: {
          supplier: true,
          items: { include: { product: true } }
        }
      });

    });

    return NextResponse.json({ ok: true, data: result });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { error: error.message || "Error actualizando compra" },
      { status: 500 }
    );

  }

}
