import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// ELIMINAR COMPRA

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;


    await prisma.$transaction(async (tx)=>{


      await tx.purchaseItem.deleteMany({
        where:{
          purchaseId:id
        }
      });


      await tx.purchase.delete({
        where:{
          id
        }
      });


    });


    return NextResponse.json({
      ok:true
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





// EDITAR COMPRA

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {


  try {


    const { id } = await context.params;


    const body = await req.json();


    const {
      supplierId,
      purchaseType,
      items
    } = body;



    if(
      !supplierId ||
      !items ||
      items.length === 0
    ){

      return NextResponse.json(
        {
          error:"Datos incompletos"
        },
        {
          status:400
        }
      );

    }




    const result = await prisma.$transaction(async(tx)=>{


      // borrar items anteriores

      await tx.purchaseItem.deleteMany({

        where:{
          purchaseId:id
        }

      });



      let total = 0;


      for(const item of items){

        total +=
          Number(item.cost) *
          Number(item.quantity);

      }




      // crear nuevos items

      const purchase = await tx.purchase.update({

        where:{
          id
        },

        data:{


          supplierId,

          total,


          items:{

            create:items.map((item:any)=>({

              productId:item.productId,

              quantity:Number(item.quantity),

              cost:Number(item.cost)

            }))

          }


        },

        include:{
          items:true
        }

      });



      return purchase;


    });




    return NextResponse.json({

      ok:true,

      data:result

    });



  } catch(error:any){


    console.error(error);


    return NextResponse.json(

      {
        error:
          error.message ||
          "Error actualizando compra"
      },

      {
        status:500
      }

    );


  }

}