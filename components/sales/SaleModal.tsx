"use client";

import { useEffect, useState } from "react";


interface Props {

  open:boolean;

  onClose:()=>void;

  onSave:(order:any)=>void;

}



type OrderProduct = {

  id:string;

  name:string;

  quantity:number;

  price:number;

  cost:number;

};





export default function SaleModal({

  open,

  onClose,

  onSave

}:Props){

const [availableProducts,setAvailableProducts] = useState<any[]>([]);
const [selectedProduct,setSelectedProduct] = useState<any>(null);

  const [client,setClient] = useState("");

  const [selectedClient,setSelectedClient] = useState<any>(null);

  const [clients,setClients] = useState<any[]>([]);

  const [searchClient,setSearchClient] = useState("");

  const [showClients,setShowClients] = useState(false);

  const [showNewClient,setShowNewClient] = useState(false);

  const [newClientName,setNewClientName] = useState("");

  const [newClientPhone,setNewClientPhone] = useState("");

  const [newClientEmail,setNewClientEmail] = useState("");



  const [products,setProducts] = useState<OrderProduct[]>([]);

  const [productName,setProductName] = useState("");

  const [quantity,setQuantity] = useState(1);

  const [total,setTotal] = useState(0);

  const [advance,setAdvance] = useState(0);

  const [payment,setPayment] = useState("TRANSFERENCIA");

  const [status,setStatus] = useState("PENDIENTE");





  useEffect(()=>{

    if(!open) return;

    async function loadClients(){

      try{

        const res = await fetch("/api/customers");

        const data = await res.json();

        if(res.ok){
          setClients(data.data || []);
        }

      }catch(error){
        console.error(error);
      }

    }

    loadClients();

  },[open]);

useEffect(()=>{

  async function loadProducts(){

    try{

      const res = await fetch("/api/products");

      const data = await res.json();

      if(data.ok){

        setAvailableProducts(data.data);

      }

    }catch(error){

      console.error(error);

    }

  }


  if(open){

    loadProducts();

  }


},[open]);





  const balance = total - advance;








  function addProduct(){

  if(!selectedProduct) return;


  setProducts((prev)=>[

    ...prev,

    {

      id:selectedProduct.id,

      name:selectedProduct.name,

      quantity,

      price:Number(selectedProduct.price),

      cost:Number(selectedProduct.cost)

    }

  ]);


  setSelectedProduct(null);

  setQuantity(1);

}



  







  function removeProduct(index:number){


    setProducts((prev)=>

      prev.filter((_,i)=>i!==index)

    );


  }








  async function createQuickClient(){


    const name = newClientName.trim();


    if(!name){

      alert("Ingresá al menos el nombre del cliente");

      return;

    }


    try{

      const res = await fetch("/api/customers",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          name,
          firstName:name,
          phone:newClientPhone.trim(),
          email:newClientEmail.trim()
        })
      });

      const data = await res.json();

      if(!res.ok){
        console.error(data.error);
        alert("Error al crear el cliente");
        return;
      }

      const client = data.data;


      // Lo agregamos a la lista y lo seleccionamos para la venta.
      setClients((prev)=>[client, ...prev]);
      setSelectedClient(client);
      setClient(client.name);
      setSearchClient("");
      setShowClients(false);


      setNewClientName("");
      setNewClientPhone("");
      setNewClientEmail("");
      setShowNewClient(false);


    }catch(error){
      console.error(error);
      alert("Error de conexión");
    }


  }




  function saveOrder(){



    const order = {


      client,

      clientId:selectedClient?.id || null,

      clientPhone:selectedClient?.phone || "",

      clientEmail:selectedClient?.email || "",

      products,

      total,

      advance,

      balance,

      payment,

      status,

      createdAt:new Date().toISOString()


    };



    onSave(order);




    setClient("");

    setSelectedClient(null);

    setSearchClient("");

    setProducts([]);

    setProductName("");

    setQuantity(1);

    setTotal(0);

    setAdvance(0);

    setPayment("TRANSFERENCIA");

    setStatus("PENDIENTE");



    onClose();


  }








  if(!open) return null;







  const filteredClients = clients.filter((item)=>


    item.name

    .toLowerCase()

    .includes(

      searchClient.toLowerCase()

    )


  );









  return (


    <div className="
    fixed
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-50
    ">


      <div className="
      bg-white
      rounded-3xl
      p-8
      w-[650px]
      space-y-5
      max-h-[90vh]
      overflow-y-auto
      ">





        <h2 className="text-2xl font-bold">

          Nuevo pedido

        </h2>







        <div className="relative">


          <input

            className="w-full border rounded-xl p-3"

            placeholder="Buscar cliente..."

            value={client}

            onFocus={()=>setShowClients(true)}

            onChange={(e)=>{

              setClient(e.target.value);

              setSearchClient(e.target.value);

              setSelectedClient(null);

            }}

          />



          {showClients && filteredClients.length > 0 && (


            <div className="
            absolute
            top-14
            left-0
            right-0
            bg-white
            border
            rounded-xl
            shadow-lg
            z-20
            max-h-48
            overflow-y-auto
            ">


              {filteredClients.map((item:any)=>(


                <button

                  key={item.id || item.name}

                  onClick={()=>{


                    setClient(item.name);

                    setSelectedClient(item);

                    setSearchClient("");

                    setShowClients(false);


                  }}


                  className="
                  w-full
                  text-left
                  px-4
                  py-3
                  hover:bg-stone-100
                  "

                >

                  <div className="font-semibold">

                    {item.name}

                  </div>


                  {item.phone && (

                    <div className="text-xs text-stone-500">

                      📱 {item.phone}

                    </div>

                  )}


                </button>


              ))}



            </div>


          )}



        </div>







        {/* Crear cliente rápido */}
        <div>

          <button
            type="button"
            onClick={()=>setShowNewClient((v)=>!v)}
            className="text-sm font-medium text-[#B08D57] hover:underline"
          >
            {showNewClient ? "Cancelar cliente nuevo" : "+ Cliente nuevo"}
          </button>


          {showNewClient && (

            <div className="mt-3 border rounded-2xl p-4 space-y-3 bg-stone-50">

              <input
                placeholder="Nombre y apellido"
                value={newClientName}
                onChange={(e)=>setNewClientName(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="WhatsApp"
                  value={newClientPhone}
                  onChange={(e)=>setNewClientPhone(e.target.value)}
                  className="border rounded-xl p-3"
                />

                <input
                  placeholder="Email"
                  value={newClientEmail}
                  onChange={(e)=>setNewClientEmail(e.target.value)}
                  className="border rounded-xl p-3"
                />

              </div>

              <button
                type="button"
                onClick={createQuickClient}
                className="w-full bg-stone-900 text-white py-2 rounded-xl font-medium"
              >
                Guardar cliente
              </button>

            </div>

          )}

        </div>


        <div className="border rounded-xl p-4 space-y-3">


          <h3 className="font-bold">

            Productos

          </h3>




          <div className="grid grid-cols-3 gap-3">

  <select
    className="border rounded-xl p-3 col-span-2"
    value={selectedProduct?.id || ""}
    onChange={(e)=>{

      const product = availableProducts.find(
        (p)=>p.id === e.target.value
      );

      setSelectedProduct(product || null);

    }}
  >

    <option value="">
      Seleccionar producto
    </option>

    {availableProducts.map((product)=>(

      <option
        key={product.id}
        value={product.id}
      >

        {product.name}

      </option>

    ))}

  </select>


  <input
    type="number"
    className="border rounded-xl p-3"
    value={quantity}
    onChange={(e)=>setQuantity(Number(e.target.value))}
  />

</div>





          <button

            onClick={addProduct}

            className="border rounded-xl px-4 py-2"

          >

            Agregar producto

          </button>





          {products.map((p,index)=>(


            <div

              key={index}

              className="flex justify-between bg-stone-50 p-3 rounded-xl"

            >

              <span>

                {p.name} x {p.quantity}

              </span>


              <button

                onClick={()=>removeProduct(index)}

                className="text-red-600"

              >

                Quitar

              </button>


            </div>


          ))}



        </div>







        <div className="grid grid-cols-2 gap-4">


  <div>

    <label className="text-sm text-stone-500 block mb-1">
      Precio de venta total
    </label>

    <input

      type="number"

      className="border rounded-xl p-3 w-full"

      value={total}

      onChange={(e)=>setTotal(Number(e.target.value))}

    />

  </div>



  <div>

    <label className="text-sm text-stone-500 block mb-1">
      Anticipo recibido
    </label>

    <input

      type="number"

      className="border rounded-xl p-3 w-full"

      value={advance}

      onChange={(e)=>setAdvance(Number(e.target.value))}

    />

  </div>


</div>






        <div className="bg-stone-100 rounded-xl p-4">

          Saldo pendiente:

          <strong className="block text-xl">

            ${balance.toLocaleString("es-AR")}

          </strong>

        </div>







        <select

          className="w-full border rounded-xl p-3"

          value={payment}

          onChange={(e)=>setPayment(e.target.value)}

        >

          <option value="TRANSFERENCIA">

            TRANSFERENCIA

          </option>

          <option value="EFECTIVO">

            EFECTIVO

          </option>


        </select>








        <select

          className="w-full border rounded-xl p-3"

          value={status}

          onChange={(e)=>setStatus(e.target.value)}

        >

          <option value="PENDIENTE">

            PENDIENTE

          </option>


          <option value="PRODUCCION">

            PRODUCCION

          </option>


          <option value="LISTO">

            LISTO

          </option>


          <option value="ENTREGADO">

            ENTREGADO

          </option>


        </select>








        <div className="flex justify-end gap-3">


          <button

            onClick={onClose}

            className="border px-5 py-2 rounded-xl"

          >

            Cancelar

          </button>




          <button

            onClick={saveOrder}

            className="
            bg-stone-900
            text-white
            px-5
            py-2
            rounded-xl
            "

          >

            Guardar pedido

          </button>



        </div>






      </div>


    </div>


  );


}