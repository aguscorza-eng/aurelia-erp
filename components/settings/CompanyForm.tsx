"use client";

import { useEffect, useState } from "react";


export default function CompanyForm(){


const [form,setForm]=useState({

name:"",
businessName:"",
cuit:"",
phone:"",
whatsapp:"",
email:"",
instagram:"",
address:"",
logo:""

});





useEffect(()=>{


const data = localStorage.getItem("company");


if(data){

setForm(JSON.parse(data));

}


},[]);







function save(){


localStorage.setItem(

"company",

JSON.stringify(form)

);


alert("Datos guardados correctamente");


}







return (

<div className="
bg-white
border
rounded-3xl
p-8
space-y-6
">





<h2 className="
text-2xl
font-bold
">

Datos de empresa

</h2>







<div className="
grid
grid-cols-2
gap-5
">






<input

placeholder="Nombre comercial"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>






<input

placeholder="Razón social"

value={form.businessName}

onChange={(e)=>

setForm({

...form,

businessName:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>








<input

placeholder="CUIT"

value={form.cuit}

onChange={(e)=>

setForm({

...form,

cuit:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>








<input

placeholder="Teléfono"

value={form.phone}

onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>








<input

placeholder="WhatsApp"

value={form.whatsapp}

onChange={(e)=>

setForm({

...form,

whatsapp:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>








<input

placeholder="Email"

value={form.email}

onChange={(e)=>

setForm({

...form,

email:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>








<input

placeholder="Instagram"

value={form.instagram}

onChange={(e)=>

setForm({

...form,

instagram:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
"

/>






<input

placeholder="Dirección"

value={form.address}

onChange={(e)=>

setForm({

...form,

address:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
col-span-2
"

/>






</div>









<div>


<label className="text-sm text-stone-500">

URL del logo

</label>


<input

placeholder="/logo-aurelia.png"

value={form.logo}

onChange={(e)=>

setForm({

...form,

logo:e.target.value

})

}

className="
border
rounded-xl
px-4
py-3
w-full
mt-2
"

/>


</div>










<button

onClick={save}

className="
bg-stone-900
text-white
px-6
py-3
rounded-xl
font-semibold
"

>

Guardar configuración

</button>







</div>


);


}