"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();


  useEffect(() => {

    const auth = localStorage.getItem("auth");


    if(auth !== "true") {

      router.replace("/login");

    }

  },[router]);


  return children;

}