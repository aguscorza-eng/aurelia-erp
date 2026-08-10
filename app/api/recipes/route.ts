import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const recipes = await prisma.costRecipe.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ data: recipes });

  } catch (error: any) {

    console.error("ERROR RECETAS GET:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}


export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const recipe = await prisma.costRecipe.create({
      data: {
        name: body.name || "Sin nombre",
        data: body.data || {}
      }
    });

    return NextResponse.json({ data: recipe });

  } catch (error: any) {

    console.error("ERROR RECETA POST:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
