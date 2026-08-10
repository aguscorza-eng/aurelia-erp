import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



// LISTAR COMPRAS
export async function GET() {

  try {

    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      ok: true,
      data: purchases
    });

  } catch (error: any) {

    console.error("ERROR GET COMPRAS:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



// CREAR COMPRA
//
// Una compra es de MATERIA PRIMA y es solo un registro (proveedor,
// items, total). NO toca el stock ni el costo de los productos: el
// stock de productos terminados se maneja de forma manual.
export async function POST(req: NextRequest) {

  try {

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

    const purchase = await prisma.purchase.create({
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

    return NextResponse.json({
      ok: true,
      data: purchase
    });

  } catch (error: any) {

    console.error("ERROR POST COMPRAS:", error);

    return NextResponse.json(
      { error: error.message || "Error creando compra" },
      { status: 500 }
    );

  }

}
