"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login(){

  const router = useRouter();

  const [user,setUser] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  async function handleLogin(){

    console.log("LOGIN CLICK");

    setLoading(true);
    setError("");


    try {

      const res = await fetch("/api/login",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          email:user,
          password:password
        })

      });


      const data = await res.json();

      console.log(data);


      if(!res.ok){

        setError(data.error || "Error");

        setLoading(false);

        return;
      }


      localStorage.setItem(
        "auth",
        "true"
      );


      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      router.push("/private");


    } catch(e){

      setError("Error de conexión");

    }


    setLoading(false);

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
"

placeholder="Email"

value={user}

onChange={(e)=>setUser(e.target.value)}

/>



<input

className="
w-full
border
rounded-xl
p-3
mb-4
"

placeholder="Contraseña"

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



{error && (

<p className="text-red-600 mb-4">

{error}

</p>

)}



<button

onClick={handleLogin}

disabled={loading}

className="
w-full
bg-[#B89B72]
text-white
rounded-xl
p-3
font-semibold
"

>

{loading ? "Ingresando..." : "Ingresar"}

</button>



</div>


</main>

);

}