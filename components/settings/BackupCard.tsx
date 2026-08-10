"use client";

import { useState } from "react";
import { Download, ShieldCheck } from "lucide-react";


export default function BackupCard(){

  const [loading,setLoading]=useState(false);


  async function downloadBackup(){

    setLoading(true);

    try{

      const res = await fetch("/api/backup");

      if(!res.ok){
        alert("Error al generar la copia de seguridad");
        return;
      }

      const data = await res.json();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const fecha = new Date().toISOString().slice(0,10);

      const a = document.createElement("a");
      a.href = url;
      a.download = `aurelia-backup-${fecha}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }finally{
      setLoading(false);
    }

  }


  return (

    <div className="bg-white border rounded-3xl p-7">

      <div className="flex items-center gap-3">
        <div className="bg-[#F8F2E9] text-[#B08D57] rounded-full p-3">
          <ShieldCheck size={22}/>
        </div>
        <div>
          <h2 className="text-xl font-bold">Copia de seguridad</h2>
          <p className="text-sm text-stone-500">Descargá un respaldo de todos tus datos</p>
        </div>
      </div>

      <p className="text-sm text-stone-500 mt-5 leading-relaxed">
        Genera un archivo con <strong>todos tus datos</strong> (ventas, clientes,
        presupuestos, compras, proveedores y productos). Guardalo en un lugar seguro
        (Google Drive, mail, un pendrive). Si algún día pasa algo con la base, se puede
        <strong> restaurar todo</strong> desde este archivo. Conviene hacerlo cada tanto (por ejemplo, una vez por semana).
      </p>

      <button
        onClick={downloadBackup}
        disabled={loading}
        className="mt-5 bg-stone-900 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
      >
        <Download size={18}/>
        {loading ? "Generando..." : "Descargar copia de seguridad"}
      </button>

    </div>

  );

}
