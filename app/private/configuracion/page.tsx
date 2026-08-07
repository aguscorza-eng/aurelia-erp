"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import CompanyForm from "@/components/settings/CompanyForm";



export default function ConfiguracionPage(){


return (


<main className="
flex
h-screen
bg-[#F8F8F6]
">



<Sidebar />






<section className="
flex-1
flex
flex-col
overflow-hidden
">





<Header />







<div className="
flex-1
overflow-y-auto
p-10
space-y-8
">







<div>


<h1 className="
text-4xl
font-bold
">

Configuración

</h1>



<p className="
text-stone-500
mt-2
">

Administración general de Aurelia

</p>


</div>









<CompanyForm />








</div>





</section>





</main>


);


}