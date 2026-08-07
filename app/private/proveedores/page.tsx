"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


import SuppliersHeader from "../../../components/suppliers/SuppliersHeader";
import SuppliersTable from "../../../components/suppliers/SuppliersTable";
import SupplierModal from "../../../components/suppliers/SupplierModal";



export default function ProveedoresPage() {


  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);





  function openNewSupplier() {

    setEditingId(null);

    setOpenModal(true);

  }






  function openEditSupplier(id: string) {

    setEditingId(id);

    setOpenModal(true);

  }






  function closeModal() {

    setOpenModal(false);

    setEditingId(null);

  }







  return (

    <main className="flex h-screen bg-[#F8F8F6]">



      <Sidebar />



      <section className="flex-1 flex flex-col overflow-hidden">



        <Header />



        <div className="flex-1 overflow-y-auto p-10 space-y-8">





          <SuppliersHeader

            onNewSupplier={openNewSupplier}

          />






          <SuppliersTable

            onEdit={openEditSupplier}

          />







          <SupplierModal

            open={openModal}

            onClose={closeModal}

            supplierId={editingId}

          />





        </div>



      </section>



    </main>

  );

}