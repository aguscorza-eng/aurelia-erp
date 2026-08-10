import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;
    const body = await req.json();

    const recipe = await prisma.costRecipe.update({
      where: { id },
      data: {
        name: body.name,
        data: body.data
      }
    });

    return NextResponse.json({ data: recipe });

  } catch (error: any) {

    console.error("ERROR RECETA PUT:", error);

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

    await prisma.costRecipe.delete({ where: { id } });

    return NextResponse.json({ ok: true });

  } catch (error: any) {

    console.error("ERROR RECETA DELETE:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
