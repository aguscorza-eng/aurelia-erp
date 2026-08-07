import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;


    if (!file) {

      return NextResponse.json(
        { error: "No se recibió imagen" },
        { status: 400 }
      );

    }


    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);


    const fileName =
      `${Date.now()}-${file.name.replace(/\s/g, "-")}`;


    const uploadDir = path.join(
      process.cwd(),
      "public",
      "products"
    );


    await mkdir(uploadDir, {
      recursive: true,
    });


    const filePath = path.join(
      uploadDir,
      fileName
    );


    await writeFile(
      filePath,
      buffer
    );


    return NextResponse.json({
      ok: true,
      url: `/products/${fileName}`,
    });


  } catch (error) {

    console.error("UPLOAD ERROR:", error);


    return NextResponse.json(
      {
        error: "Error subiendo imagen",
      },
      {
        status: 500,
      }
    );

  }

}