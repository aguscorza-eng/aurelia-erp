"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login(){

  const router = useRouter();

  const [user,setUser] = useState("");
  const [password,setPassword] = useState("");



  function handleLogin(){

    if(user === "admin" && password === "1234"){

  localStorage.setItem(
    "auth",
    "true"
  );

  localStorage.setItem(
    "user",
    JSON.stringify({
      name:"Silvia",
      role:"Administrador"
    })
  );


  router.push("/private");

}

  }



  return (

    <main className="
    min-h-screen
    bg-[#F8F8F6]
    flex
    items-center
    justify-center
    ">


      <div className="
      bg-white
      border
      border-stone-200
      rounded-3xl
      p-10
      w-[420px]
      shadow-sm
      ">


        <h1 className="
        text-4xl
        font-bold
        text-center
        ">

          Aurelia

        </h1>



        <p className="
        text-center
        text-stone-500
        mt-2
        mb-8
        ">

          Sistema de gestión

        </p>




        <input

        className="
        w-full
        border
        rounded-xl
        p-3
        mb-4
        outline-none
        focus:ring-2
        "

        placeholder="Usuario"

        value={user}

        onChange={
          e=>setUser(e.target.value)
        }

        />





        <input

        className="
        w-full
        border
        rounded-xl
        p-3
        mb-6
        outline-none
        focus:ring-2
        "

        placeholder="Contraseña"

        type="password"

        value={password}

        onChange={
          e=>setPassword(e.target.value)
        }

        />





        <button

        onClick={handleLogin}

        className="
        w-full
        bg-[#B89B72]
        text-white
        rounded-xl
        p-3
        font-semibold
        hover:opacity-90
        transition
        "

        >

          Ingresar

        </button>




      </div>


    </main>

  );

}