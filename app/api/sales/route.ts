import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeSale } from "@/lib/sales";



// Resuelve el cliente contra la base de datos. Los clientes se
// guardan en localStorage, por eso el clientId que llega del front
// no existe en la tabla Customer. Buscamos por nombre y, si no
// existe, lo creamos. Sin nombre => venta a "Consumidor final".
async function resolveCustomerId(body: any): Promise<string | null> {

  const name = (body.client || "").trim();

  if (!name) return null;


  const existing = await prisma.customer.findFirst({

    where: { name }

  });

  if (existing) return existing.id;


  const created = await prisma.customer.create({

    data: {

      name,

      phone: body.clientPhone || null,

      email: body.clientEmail || null

    }

  });

  return created.id;

}



export async function GET() {

  try {

    const sales = await prisma.sale.findMany({

      include: {

        customer: true,

        items: {

          include: {

            product: true

          }

        }

      },

      orderBy: {

        createdAt: "desc"

      }

    });


    return NextResponse.json({

      data: sales.map((sale) => serializeSale(sale))

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





export async function POST(
  req: NextRequest
){

  try {


    const body = await req.json();


    console.log(
      "DATOS RECIBIDOS VENTA:",
      body
    );



    const customerId = await resolveCustomerId(body);


    const products = body.products || [];



    // Creamos la venta y descontamos el stock de cada producto en una
    // sola transacción: si algo falla, no se guarda nada y el stock
    // queda intacto.
    const sale = await prisma.$transaction(async (tx) => {


      // Número de pedido correlativo (PED001, PED002, ...)
      const last = await tx.sale.findFirst({
        orderBy: { orderNumber: "desc" },
        select: { orderNumber: true }
      });
      const nextNumber = (last?.orderNumber || 0) + 1;


      const created = await tx.sale.create({

        data:{


          orderNumber: nextNumber,


          customerId,


          status:
            body.status || "PENDIENTE",


          total:
            Number(body.total) || 0,


          advance:
            Number(body.advance) || 0,


          balance:
            Number(body.balance) || 0,


          paymentType:
            body.payment || null,



          items:{

            create:

              products.map((item:any)=>(

                {

                  productId:item.id,

                  quantity:Number(item.quantity),

                  price:Number(item.price)

                }

              ))

          }


        },


        include:{


          customer:true,


          items:{

            include:{

              product:true

            }

          }


        }


      });



      // Descontamos las unidades vendidas del stock.
      for(const item of products){

        await tx.product.update({

          where:{ id:item.id },

          data:{
            stock:{
              decrement:Number(item.quantity) || 0
            }
          }

        });

      }


      return created;


    });



    return NextResponse.json({

      data: serializeSale(sale)

    });



  }catch(error:any){


    console.error(
      "ERROR CREANDO VENTA:",
      error
    );



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