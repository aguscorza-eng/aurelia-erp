"use client";

import { Bell, Search, Settings, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SaleModal from "@/components/sales/SaleModal";


export default function Header() {

  const router = useRouter();

  const [user,setUser] = useState<any>(null);

  const [openSale,setOpenSale] = useState(false);



  useEffect(()=>{

    const data = localStorage.getItem("user");

    if(data){

      setUser(
        JSON.parse(data)
      );

    }

  },[]);



  async function logout(){

    try{
      await fetch("/api/logout", { method: "POST" });
    }catch(error){
      console.error(error);
    }

    localStorage.removeItem("auth");
    localStorage.removeItem("user");

    router.push("/login");

  }



  // Registra una venta rápida desde cualquier sección (mismo modal
  // que la sección Ventas). La venta va a la base y descuenta stock.
  async function saveQuickSale(order:any){

    try{

      const res = await fetch("/api/sales",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(order)
      });

      const data = await res.json();

      if(!res.ok){
        console.error(data.error);
        alert("Error guardando la venta");
        return;
      }

      // Éxito: el modal se cierra solo, sin pop-up.

    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }

  }



  return (
    <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-10">


      {/* Buscador */}

      <div className="relative w-[420px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          placeholder="Buscar productos, clientes o ventas..."
          className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 outline-none focus:border-[#B08D57] transition"
        />

      </div>



      {/* Derecha */}

      <div className="flex items-center gap-5">


        {/* Venta rápida */}
        <button
          onClick={()=>setOpenSale(true)}
          className="flex items-center gap-2 bg-[#B08D57] hover:bg-[#9a794a] text-white px-4 h-11 rounded-xl font-medium transition"
        >
          <Plus size={18}/>
          Venta rápida
        </button>


        <button className="text-stone-500 hover:text-black">
          <Bell size={21}/>
        </button>



        <button className="text-stone-500 hover:text-black">
          <Settings size={21}/>
        </button>



        <div className="flex items-center gap-3">


          <div className="w-10 h-10 rounded-full bg-[#B08D57] text-white flex items-center justify-center font-semibold">
            {
              user?.name
              ?
              user.name.charAt(0)
              :
              "A"
            }
          </div>



          <div>

            <p className="text-sm font-semibold">
              {
                user?.name || "Usuario"
              }
            </p>

            <p className="text-xs text-stone-500">
              {
                user?.role || "Administrador"
              }
            </p>

          </div>



          <button
            onClick={logout}
            className="
            ml-3
            text-stone-500
            hover:text-red-600
            transition
            "
            title="Cerrar sesión"
          >

            <LogOut size={20}/>

          </button>


        </div>


      </div>



      <SaleModal
        open={openSale}
        onClose={()=>setOpenSale(false)}
        onSave={saveQuickSale}
      />


    </header>
  );
}