import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeSale } from "@/lib/sales";



// Actualiza una venta (por ejemplo, el cambio de estado desde la lista).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const body = await req.json();


    const data: any = {};

    if (body.status !== undefined) data.status = body.status;
    if (body.total !== undefined) data.total = Number(body.total) || 0;
    if (body.advance !== undefined) data.advance = Number(body.advance) || 0;
    if (body.balance !== undefined) data.balance = Number(body.balance) || 0;
    if (body.payment !== undefined) data.paymentType = body.payment;
    if (body.date !== undefined && body.date) {
      const d = new Date(body.date);
      if (!isNaN(d.getTime())) {
        data.createdAt = d;
        data.dateIn = d;
      }
    }


    const sale = await prisma.sale.update({

      where: { id },

      data,

      include: {

        customer: true,

        items: {
          include: { product: true }
        }

      }

    });


    return NextResponse.json({
      data: serializeSale(sale)
    });


  } catch (error: any) {

    console.error("ERROR ACTUALIZANDO VENTA:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



// Elimina una venta. Devuelve al stock las unidades vendidas, borra
// los items (por la relación FK) y luego la venta. Todo en una
// transacción para no dejar el inventario a medias.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;


    const items = await prisma.saleItem.findMany({
      where: { saleId: id }
    });


    await prisma.$transaction(async (tx) => {

      for (const item of items) {

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });

      }

      await tx.saleItem.deleteMany({
        where: { saleId: id }
      });

      await tx.sale.delete({
        where: { id }
      });

    });


    return NextResponse.json({ ok: true });


  } catch (error: any) {

    console.error("ERROR ELIMINANDO VENTA:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
