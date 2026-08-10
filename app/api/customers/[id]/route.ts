import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCustomer, customerDataFromBody } from "@/lib/customers";



export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;
    const body = await req.json();

    const customer = await prisma.customer.update({
      where: { id },
      data: customerDataFromBody(body)
    });

    return NextResponse.json({
      data: serializeCustomer(customer)
    });

  } catch (error: any) {

    console.error("ERROR ACTUALIZANDO CLIENTE:", error);

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

    // Desvinculamos las ventas del cliente para no romper la FK, luego lo borramos.
    await prisma.sale.updateMany({
      where: { customerId: id },
      data: { customerId: null }
    });

    await prisma.customer.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {

    console.error("ERROR ELIMINANDO CLIENTE:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
