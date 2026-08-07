"use client";

import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer
} from "recharts";


interface Props {

sales:any[];

}


export default function SalesChart({sales}:Props){



const months=[
"Ene",
"Feb",
"Mar",
"Abr",
"May",
"Jun",
"Jul",
"Ago",
"Sep",
"Oct",
"Nov",
"Dic"
];



const data = months.map((month,index)=>{


const total=sales
.filter((sale:any)=>{


const date=new Date(
sale.createdAt
);


return date.getMonth()===index;


})
.reduce(

(acc,item)=>

acc+Number(item.total||0),

0

);



return {

name:month,

ventas:total

};


});





return (

<div className="
bg-white
border
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
mb-6
">

Evolución de ventas

</h2>



<div className="
h-[280px]
">


<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart data={data}>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis dataKey="name"/>


<YAxis/>


<Tooltip/>




<Line

type="monotone"

dataKey="ventas"

stroke="#B08A4A"

strokeWidth={3}

/>


</LineChart>


</ResponsiveContainer>


</div>



</div>


);


}