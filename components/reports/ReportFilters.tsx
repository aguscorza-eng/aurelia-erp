"use client";



interface Props {

month:number;

year:number;

setMonth:(value:number)=>void;

setYear:(value:number)=>void;

}



const months = [

" Enero",

"Febrero",

"Marzo",

"Abril",

"Mayo",

"Junio",

"Julio",

"Agosto",

"Septiembre",

"Octubre",

"Noviembre",

"Diciembre"

];





export default function ReportFilters({

month,

year,

setMonth,

setYear

}:Props){



return (


<div className="
bg-white
border
rounded-3xl
p-5
flex
gap-4
items-center
">


<div>


<p className="
text-sm
text-stone-500
mb-2
">

Mes

</p>


<select

value={month}

onChange={(e)=>

setMonth(Number(e.target.value))

}

className="
border
rounded-xl
px-4
py-3
"

>


{months.map((m,index)=>(


<option

key={index}

value={index}

>

{m}

</option>


))}



</select>


</div>







<div>


<p className="
text-sm
text-stone-500
mb-2
">

Año

</p>


<select

value={year}

onChange={(e)=>

setYear(Number(e.target.value))

}

className="
border
rounded-xl
px-4
py-3
"

>


{[2025,2026,2027].map(y=>(


<option

key={y}

value={y}

>

{y}

</option>


))}



</select>


</div>






</div>


);


}