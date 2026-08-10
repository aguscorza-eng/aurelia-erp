import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// Copia de seguridad completa: devuelve todos los datos del negocio.
// Protegida por el proxy (requiere sesión).
export async function GET() {

  try {

    const [
      customers,
      sales,
      budgets,
      products,
      suppliers,
      purchases,
      categories
    ] = await Promise.all([
      prisma.customer.findMany(),
      prisma.sale.findMany({ include: { items: true } }),
      prisma.budget.findMany({ include: { items: true } }),
      prisma.product.findMany(),
      prisma.supplier.findMany(),
      prisma.purchase.findMany({ include: { items: true } }),
      prisma.category.findMany()
    ]);

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      version: 1,
      counts: {
        customers: customers.length,
        sales: sales.length,
        budgets: budgets.length,
        products: products.length,
        suppliers: suppliers.length,
        purchases: purchases.length
      },
      data: {
        customers,
        sales,
        budgets,
        products,
        suppliers,
        purchases,
        categories
      }
    });

  } catch (error: any) {

    console.error("ERROR BACKUP:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
