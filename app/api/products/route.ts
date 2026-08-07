import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {

  try {


    const products = await prisma.product.findMany({

      include:{
        category:true,
      },

      orderBy:{
        createdAt:"desc",
      },

    });



    return NextResponse.json({

      ok:true,

      total:products.length,

      data:products,

    });



  } catch(error:any){


    console.error(
      "ERROR PRODUCTOS GET:",
      error
    );


    return NextResponse.json(

      {
        ok:false,
        error:error.message || "Error obteniendo productos",
      },

      {
        status:500,
      }

    );


  }

}








export async function POST(
req:NextRequest
){


try{


const body = await req.json();



let categoryId = body.categoryId;





// Si no viene categoría,
// crea una categoría General

if(!categoryId){


const existingCategory = await prisma.category.findFirst({

where:{
name:"General"
}

});




if(existingCategory){

categoryId = existingCategory.id;


}else{


const newCategory = await prisma.category.create({

data:{
name:"General"
}

});


categoryId = newCategory.id;


}


}







const product = await prisma.product.create({

data:{



name:
body.name,



sku:
body.sku,



description:
body.description || "",



cost:
Number(body.cost) || 0,



price:
Number(body.price) || 0,



stock:
Number(body.stock) || 0,



minimumStock:
Number(body.minimumStock) || 0,





type:

body.type === "MATERIA_PRIMA"

?

"MATERIA_PRIMA"

:

"PRODUCTO_TERMINADO",





categoryId,



},



include:{


category:true,


},



});








return NextResponse.json(product);






}catch(error:any){



console.error(
"ERROR PRODUCTOS POST:",
error
);




return NextResponse.json(

{

error:
error.message ||
"No se pudo crear el producto"

},

{

status:500

}

);



}


}