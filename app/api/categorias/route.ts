import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: categories,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error obteniendo categorías",
      },
      {
        status: 500,
      }
    );

  }
}