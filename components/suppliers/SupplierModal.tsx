"use client";

import { useEffect, useState } from "react";


interface Props {

  open:boolean;

  onClose:()=>void;

  supplierId:string|null;

}



export default function SupplierModal({

open,

onClose,

supplierId

}:Props){



const [name,setName]=useState("");

const [company,setCompany]=useState("");

const [phone,setPhone]=useState("");

const [email,setEmail]=useState("");

const [notes,setNotes]=useState("");








useEffect(()=>{


if(!open)return;


if(supplierId){

loadSupplier();

}else{

clearForm();

}


},[open,supplierId]);








async function loadSupplier(){


try{

const res = await fetch(`/api/suppliers/${supplierId}`);

const supplier = await res.json();

if(!res.ok || !supplier) return;

setName(supplier.name || "");

setCompany(supplier.company || "");

setPhone(supplier.phone || "");

setEmail(supplier.email || "");

setNotes(supplier.notes || "");

}catch(error){
console.error(error);
}



}








function clearForm(){


setName("");

setCompany("");

setPhone("");

setEmail("");

setNotes("");



}








async function saveSupplier(){



if(!name.trim()){

alert("Ingresá el nombre del proveedor");

return;

}


const payload = { name, company, phone, email, notes };


try{

const res = supplierId

? await fetch(`/api/suppliers/${supplierId}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(payload)
})

: await fetch("/api/suppliers",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(payload)
});

if(!res.ok){
alert("Error al guardar el proveedor");
return;
}

onClose();
window.location.reload();

}catch(error){
console.error(error);
alert("Error de conexión");
}



}









if(!open)return null;







return(


<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl w-[500px] p-8">



<h2 className="text-2xl font-bold mb-6">

{supplierId

?"Editar proveedor"

:"Nuevo proveedor"

}

</h2>





<div className="space-y-4">


<input

placeholder="Nombre"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full border rounded-xl px-4 h-11"

/>




<input

placeholder="Empresa"

value={company}

onChange={(e)=>setCompany(e.target.value)}

className="w-full border rounded-xl px-4 h-11"

/>




<input

placeholder="Teléfono"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

className="w-full border rounded-xl px-4 h-11"

/>




<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full border rounded-xl px-4 h-11"

/>




<textarea

placeholder="Notas"

value={notes}

onChange={(e)=>setNotes(e.target.value)}

className="w-full border rounded-xl px-4 py-3"

/>



</div>







<div className="flex justify-end gap-3 mt-6">


<button

onClick={onClose}

className="px-5 h-11 border rounded-xl"

>

Cancelar

</button>




<button

onClick={saveSupplier}

className="px-5 h-11 bg-stone-900 text-white rounded-xl"

>

Guardar

</button>



</div>





</div>


</div>


);


}