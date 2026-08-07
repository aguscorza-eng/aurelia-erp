"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";


interface Props {

  open:boolean;

  onClose:()=>void;

  onSave:(client:any)=>void;

  clientEdit?:any;

}



export default function CustomerModal({

  open,

  onClose,

  onSave,

  clientEdit

}:Props){



const emptyForm = {

  firstName:"",

  lastName:"",

  company:"",

  phone:"",

  email:"",

  notes:""

};




const [form,setForm]=useState(emptyForm);






useEffect(()=>{


if(!open)return;



if(clientEdit){


const parts = (clientEdit.name || "").split(" ");



setForm({

firstName:clientEdit.firstName || parts[0] || "",

lastName:clientEdit.lastName || parts.slice(1).join(" ") || "",

company:clientEdit.company || "",

phone:clientEdit.phone || "",

email:clientEdit.email || "",

notes:clientEdit.notes || ""

});



}else{


setForm(emptyForm);


}



},[clientEdit,open]);









function update(

field:string,

value:string

){


setForm({

...form,

[field]:value

});


}








function save(){



if(!form.firstName.trim()) return;



const client = {


id:

clientEdit?.id ||

Date.now(),



firstName:

form.firstName.trim(),



lastName:

form.lastName.trim(),



company:

form.company.trim(),



// mantenemos name para compatibilidad

name:

`${form.firstName} ${form.lastName}`.trim(),



phone:

form.phone.trim(),



email:

form.email.trim(),



notes:

form.notes.trim(),



createdAt:

clientEdit?.createdAt ||

new Date().toISOString()


};




onSave(client);



setForm(emptyForm);



}






if(!open)return null;





return (


<div className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
z-50
">


<div className="
bg-white
w-[550px]
rounded-3xl
shadow-2xl
p-7
">





<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="text-2xl font-bold">

{clientEdit

?"Editar cliente"

:"Nuevo cliente"

}

</h2>



<button onClick={onClose}>

<X size={22}/>

</button>



</div>







<div className="space-y-4">





<div className="grid grid-cols-2 gap-3">


<input

placeholder="Nombre"

value={form.firstName}

onChange={(e)=>update("firstName",e.target.value)}

className="border rounded-xl px-4 py-3"

/>



<input

placeholder="Apellido"

value={form.lastName}

onChange={(e)=>update("lastName",e.target.value)}

className="border rounded-xl px-4 py-3"

/>


</div>








<input

placeholder="Empresa / Local"

value={form.company}

onChange={(e)=>update("company",e.target.value)}

className="w-full border rounded-xl px-4 py-3"

/>








<input

placeholder="WhatsApp"

value={form.phone}

onChange={(e)=>update("phone",e.target.value)}

className="w-full border rounded-xl px-4 py-3"

/>








<input

placeholder="Email"

value={form.email}

onChange={(e)=>update("email",e.target.value)}

className="w-full border rounded-xl px-4 py-3"

/>








<textarea

placeholder="Notas comerciales"

value={form.notes}

onChange={(e)=>update("notes",e.target.value)}

className="
w-full
border
rounded-xl
px-4
py-3
h-24
"

/>









<button

onClick={save}

className="
w-full
bg-stone-900
text-white
py-3
rounded-xl
font-semibold
"

>

{clientEdit

?"Guardar cambios"

:"Guardar cliente"

}

</button>





</div>



</div>


</div>


);


}