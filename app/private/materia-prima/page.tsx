"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


import MateriaPrimaHeader from "../../../components/materia-prima/MateriaPrimaHeader";
import MateriaPrimaTable from "../../../components/materia-prima/MateriaPrimaTable";
import MateriaPrimaModal from "../../../components/materia-prima/MateriaPrimaModal";



export default function MateriaPrimaPage(){


const [openModal,setOpenModal]=useState(false);

const [editingId,setEditingId]=useState<string|null>(null);





function newItem(){

setEditingId(null);

setOpenModal(true);

}





function editItem(id:string){

setEditingId(id);

setOpenModal(true);

}





function closeModal(){

setOpenModal(false);

setEditingId(null);

}









return (

<main className="flex h-screen bg-[#F8F8F6]">


<Sidebar />



<section className="flex-1 flex flex-col overflow-hidden">



<Header />



<div className="flex-1 overflow-y-auto p-10 space-y-8">





<MateriaPrimaHeader

onNew={newItem}

/>







<MateriaPrimaTable

onEdit={editItem}

/>








<MateriaPrimaModal

open={openModal}

onClose={closeModal}

productId={editingId}

/>





</div>



</section>



</main>


);


}