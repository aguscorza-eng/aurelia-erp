import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {

  try {

    const body = await req.json();


    const {
      email,
      password
    } = body;



    const user = await prisma.user.findUnique({

      where:{
        email
      }

    });



    if(!user){

      return NextResponse.json(
        {
          error:"Usuario no encontrado"
        },
        {
          status:401
        }
      );

    }



    if(!user.active){

      return NextResponse.json(
        {
          error:"Usuario desactivado"
        },
        {
          status:401
        }
      );

    }



    const validPassword = await bcrypt.compare(
  password,
  user.password
);

console.log("PASSWORD INGRESADA:", password);
console.log("HASH DB:", user.password);
console.log("RESULTADO:", validPassword);



    if(!validPassword){

      return NextResponse.json(
        {
          error:"Contraseña incorrecta"
        },
        {
          status:401
        }
      );

    }



    return NextResponse.json({

      success:true,

      user:{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
      }

    });



  } catch(error:any){

    console.error(error);


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }

}