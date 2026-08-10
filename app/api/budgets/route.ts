import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBudget, budgetDataFromBody } from "@/lib/budgets";



export async function GET() {

  try {

    const budgets = await prisma.budget.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      data: budgets.map((b) => serializeBudget(b))
    });

  } catch (error: any) {

    console.error("ERROR PRESUPUESTOS GET:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    // Número correlativo PRE-000001
    const count = await prisma.budget.count();
    const number = `PRE-${String(count + 1).padStart(6, "0")}`;

    const budget = await prisma.budget.create({

      data: {

        number,

        ...budgetDataFromBody(body),

        items: {
          create: (body.items || []).map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0
          }))
        }

      },

      include: { items: true }

    });

    return NextResponse.json({
      data: serializeBudget(budget)
    });

  } catch (error: any) {

    console.error("ERROR CREANDO PRESUPUESTO:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
