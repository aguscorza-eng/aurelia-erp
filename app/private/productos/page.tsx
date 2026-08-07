"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


import ProductsHeader from "../../../components/products/ProductsHeader";
import ProductStats from "../../../components/products/ProductStats";
import StockAlerts from "../../../components/products/StockAlerts";
import ProductsTable from "../../../components/products/ProductsTable";
import ProductModal from "../../../components/products/ProductModal";



export default function ProductosPage() {


  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);



  function openNewProduct() {

    setEditingId(null);

    setOpenModal(true);

  }



  function openEditProduct(id: string) {

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



          <ProductsHeader
            onNewProduct={openNewProduct}
          />



          <ProductStats />



          <StockAlerts />



          <ProductsTable
            onEdit={openEditProduct}
          />



          <ProductModal
            open={openModal}
            onClose={closeModal}
            productId={editingId}
          />



        </div>



      </section>



    </main>

  );

}