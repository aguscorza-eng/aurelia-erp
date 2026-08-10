"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import BudgetHeader from "@/components/budgets/BudgetHeader";
import BudgetTable from "@/components/budgets/BudgetTable";
import BudgetModal from "@/components/budgets/BudgetModal";
import BudgetDetailModal from "@/components/budgets/BudgetDetailModal";



export default function PresupuestosPage(){


const [openModal,setOpenModal] = useState(false);

const [editingId,setEditingId] = useState<string|null>(null);

const [refreshKey,setRefreshKey] = useState(0);


const [selectedBudget,setSelectedBudget] = useState<any>(null);








function newBudget(){

setEditingId(null);

setOpenModal(true);

}








function editBudget(id:string){

setEditingId(id);

setOpenModal(true);

}








function closeModal(){

setOpenModal(false);

setEditingId(null);

setRefreshKey((k)=>k+1);

}








return (


<main className="flex h-screen bg-[#F8F8F6]">


<Sidebar />




<section className="flex-1 flex flex-col overflow-hidden">



<Header />




<div className="
flex-1
overflow-y-auto
p-10
space-y-8
">






<BudgetHeader

onNew={newBudget}

/>







<BudgetTable

onEdit={editBudget}

onView={(budget)=>setSelectedBudget(budget)}

refreshKey={refreshKey}

/>








<BudgetModal

open={openModal}

onClose={closeModal}

budgetId={editingId}

/>








<BudgetDetailModal

budget={selectedBudget}

onClose={()=>setSelectedBudget(null)}

/>






</div>




</section>




</main>


);


}