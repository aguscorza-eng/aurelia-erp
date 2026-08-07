"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const router = useRouter();

  const [checking,setChecking] = useState(true);



  useEffect(()=>{


    const auth = localStorage.getItem("auth");


    if(auth !== "true"){

      router.push("/login");

    }else{

      setChecking(false);

    }


  },[router]);




  if(checking){

    return (

      <main className="
      min-h-screen
      bg-[#F8F8F6]
      flex
      items-center
      justify-center
      ">

        <div className="
        text-stone-500
        text-sm
        ">

          Cargando Aurelia...

        </div>


      </main>

    );

  }



  return (
    <>
      {children}
    </>
  );

}