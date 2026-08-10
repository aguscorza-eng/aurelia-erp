import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCustomer, customerDataFromBody } from "@/lib/customers";



export async function GET() {

  try {

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      data: customers.map((c) => serializeCustomer(c))
    });

  } catch (error: any) {

    console.error("ERROR CLIENTES GET:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}



export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const customer = await prisma.customer.create({
      data: customerDataFromBody(body)
    });

    return NextResponse.json({
      data: serializeCustomer(customer)
    });

  } catch (error: any) {

    console.error("ERROR CREANDO CLIENTE:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
