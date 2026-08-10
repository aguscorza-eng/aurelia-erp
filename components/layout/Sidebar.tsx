"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  ShoppingCart,
  ShoppingBag,
  Boxes,
  Wallet,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  Calculator,
} from "lucide-react";



const menu = [


  {
    title: "GENERAL",

    items: [

      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/private",
      },


      {
        icon: Package,
        label: "Productos",
        href: "/private/productos",
      },


      {
        icon: Calculator,
        label: "Calculadora",
        href: "/private/calculadora",
      },


      {
        icon: Boxes,
        label: "Materia Prima",
        href: "/private/materia-prima",
      },


      {
        icon: Truck,
        label: "Proveedores",
        href: "/private/proveedores",
      },


      {
        icon: Users,
        label: "Clientes",
        href: "/private/clientes",
      },


      {
        icon: FileText,
        label: "Presupuestos",
        href: "/private/presupuestos",
      },


      {
        icon: ShoppingCart,
        label: "Ventas",
        href: "/private/sales",
      },


    ],

  },



  {
    title: "NEGOCIO",

    items: [


      {
        icon: ShoppingBag,
        label: "Compras",
        href: "/private/compras",
      },


      {
        icon: Wallet,
        label: "Caja",
        href: "/private/caja",
      },


      {
        icon: DollarSign,
        label: "Cuentas por cobrar",
        href: "/private/cobranzas",
      },


      {
        icon: BarChart3,
        label: "Reportes",
        href: "/private/reportes",
      },


      {
        icon: Settings,
        label: "Configuración",
        href: "/private/configuracion",
      },


    ],

  },


];






export default function Sidebar(){


const pathname = usePathname();



return (


<aside className="
w-[270px]
bg-white
border-r
border-stone-200
flex
flex-col
">



<div className="px-8 py-8">


<h1 className="
text-4xl
font-light
tracking-tight
">

Aurelia

</h1>



<p className="
text-sm
text-stone-500
mt-1
">

Business Manager

</p>


</div>







<nav className="
flex-1
px-5
">



{menu.map((section)=>(


<div

key={section.title}

className="mb-10"

>


<p className="
text-xs
font-semibold
tracking-[0.22em]
text-stone-400
mb-4
">

{section.title}

</p>





{section.items.map((item)=>{


const Icon = item.icon;


const active = pathname === item.href;



return (


<Link

key={item.label}

href={item.href}

className={`

flex
items-center
gap-3
rounded-xl
px-4
py-3
mb-2
transition-all

${

active

?

"bg-[#F8F2E9] text-[#B08D57] shadow-sm"

:

"text-stone-600 hover:bg-stone-100"

}

`}

>



<Icon size={20}/>



<span className="font-medium">

{item.label}

</span>



</Link>


);



})}



</div>


))}



</nav>







<div className="
border-t
border-stone-200
p-5
">



<div className="
flex
items-center
gap-3
">



<div className="
h-11
w-11
rounded-full
bg-[#B08D57]
text-white
flex
items-center
justify-center
font-semibold
">

A

</div>





<div>


<p className="font-semibold">

Agustín

</p>



<p className="
text-sm
text-stone-500
">

Administrador

</p>



</div>



</div>




</div>







</aside>


);


}