"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


import PurchasesHeader from "../../../components/purchases/PurchasesHeader";
import PurchasesTable from "../../../components/purchases/PurchasesTable";
import PurchaseModal from "../../../components/purchases/PurchaseModal";



export default function ComprasPage() {


  const [openModal, setOpenModal] = useState(false);

  const [editingPurchase, setEditingPurchase] = useState<any>(null);





  function openNewPurchase() {

    setEditingPurchase(null);

    setOpenModal(true);

  }






  function editPurchase(purchase:any) {

    setEditingPurchase(purchase);

    setOpenModal(true);

  }







  function closeModal() {

    setOpenModal(false);

    setEditingPurchase(null);

  }








  return (

    <main className="flex h-screen bg-[#F8F8F6]">



      <Sidebar />



      <section className="flex-1 flex flex-col overflow-hidden">



        <Header />



        <div className="flex-1 overflow-y-auto p-10 space-y-8">





          <PurchasesHeader

            onNewPurchase={openNewPurchase}

          />






          <PurchasesTable

            onEdit={editPurchase}

          />







          <PurchaseModal

            open={openModal}

            onClose={closeModal}

            purchase={editingPurchase}

          />





        </div>



      </section>



    </main>

  );

}