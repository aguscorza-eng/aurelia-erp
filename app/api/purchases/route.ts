import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



// LISTAR COMPRAS

export async function GET() {

  try {

    const purchases = await prisma.purchase.findMany({

      include: {

        supplier:true,

        items:{

          include:{
            product:true
          }

        }

      },

      orderBy:{
        createdAt:"desc"
      }

    });



    return NextResponse.json({

      ok:true,

      data:purchases

    });



  } catch(error:any){


    console.error(
      "ERROR GET COMPRAS:",
      error
    );


    return NextResponse.json({

      error:error.message

    },{

      status:500

    });


  }

}









// CREAR COMPRA

export async function POST(
  req:NextRequest
){

try{


const body = await req.json();



console.log(
"COMPRA RECIBIDA:",
body
);





const {

supplierName,

purchaseType,

items

}=body;





if(

!supplierName ||

!items ||

items.length===0

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








const supplier = await prisma.supplier.findFirst({

where:{

name:supplierName

}

});






if(!supplier){


return NextResponse.json(

{

error:

"Proveedor no encontrado: " + supplierName

},

{

status:400

}

);


}









const result = await prisma.$transaction(

async(tx)=>{



let total = 0;




for(const item of items){


total +=

Number(item.cost) *

Number(item.quantity);


}









const purchase = await tx.purchase.create({

data:{


supplierId:supplier.id,


purchaseType:

purchaseType || "MATERIA_PRIMA",



total,



items:{

create:

items.map((item:any)=>(

{

productId:item.productId,

quantity:Number(item.quantity),

cost:Number(item.cost)

}

))

}


}

});








for(const item of items){



const product = await tx.product.findUnique({

where:{

id:item.productId

}

});







if(!product){


throw new Error(

"Producto no encontrado: " + item.productId

);


}







const nuevoStock =

product.stock +

Number(item.quantity);







await tx.product.update({

where:{

id:product.id

},

data:{


stock:nuevoStock,


cost:Number(item.cost)


}

});








await tx.stockMovement.create({

data:{


type:"ENTRADA",


quantity:Number(item.quantity),


note:

"Compra materia prima",



productId:product.id


}

});



}







return purchase;



}

);








return NextResponse.json({

ok:true,

data:result

});






}catch(error:any){


console.error(

"ERROR POST COMPRAS:",

error

);



return NextResponse.json(

{

error:

error.message ||

"Error creando compra"

},

{

status:500

}

);


}


}