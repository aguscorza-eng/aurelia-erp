"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";


export default function Login(){

  const router = useRouter();

  const [user,setUser] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  async function handleLogin(){

    setLoading(true);
    setError("");

    try {

      const res = await fetch("/api/login",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ email:user, password })
      });

      const data = await res.json();

      if(!res.ok){
        setError(data.error || "Error");
        setLoading(false);
        return;
      }

      localStorage.setItem("auth","true");
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/private");

    } catch(e){
      setError("Error de conexión");
    }

    setLoading(false);

  }


  function onKey(e:React.KeyboardEvent){
    if(e.key === "Enter") handleLogin();
  }


  return (

    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EFE7DA] via-[#F7F3EC] to-[#F1E9DB]">

      {/* Manchas decorativas suaves */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E7D3B0] opacity-40 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#D9C2A0] opacity-40 blur-3xl" />


      <div className="relative bg-white/90 backdrop-blur-sm border border-white rounded-3xl shadow-2xl shadow-stone-400/20 p-10 w-[400px] max-w-[92vw]">


        <img
          src="/logo-aurelia.png"
          alt="Aurelia"
          className="w-44 max-w-full h-auto mx-auto"
        />

        <p className="text-center text-stone-500 mt-1 mb-8">
          Sistema de gestión
        </p>


        <div className="space-y-4">

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              className="w-full border border-stone-200 rounded-xl pl-11 pr-4 py-3 outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="Email"
              value={user}
              onChange={(e)=>setUser(e.target.value)}
              onKeyDown={onKey}
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              className="w-full border border-stone-200 rounded-xl pl-11 pr-4 py-3 outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              onKeyDown={onKey}
            />
          </div>

        </div>


        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}


        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition shadow-md shadow-[#B08D57]/30 bg-gradient-to-r from-[#B08D57] to-[#9a794a] hover:from-[#9a794a] hover:to-[#836540] disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>


        <p className="text-center text-xs text-stone-400 mt-6">
          Aurelia · Business Manager
        </p>


      </div>

    </main>

  );

}
