"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";


type ProductAlert = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minimumStock: number;
  type: string;
};



export default function StockAlerts() {


  const [products, setProducts] = useState<ProductAlert[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadAlerts();

  }, []);





  async function loadAlerts() {

    try {


      const res = await fetch("/api/products");

      const data = await res.json();



      const alerts = (data.data ?? []).filter(
        (product: ProductAlert) =>

          product.type === "PRODUCTO_TERMINADO" &&

          product.stock <= product.minimumStock

      );



      setProducts(alerts);



    } catch (error) {

      console.error(error);


    } finally {

      setLoading(false);

    }

  }





  if (loading || products.length === 0) {

    return null;

  }





  return (

    <div className="bg-white rounded-3xl border p-6">



      <div className="flex items-center gap-3 mb-5">


        <div className="bg-amber-100 text-amber-700 p-2 rounded-xl">

          <AlertTriangle size={22} />

        </div>



        <div>


          <h2 className="font-bold text-xl">
            Alertas de inventario
          </h2>


          <p className="text-sm text-stone-500">
            Productos terminados con stock bajo
          </p>


        </div>


      </div>





      <div className="space-y-3">



        {products.map((product) => (


          <div

            key={product.id}

            className="border rounded-2xl p-4 flex justify-between"

          >



            <div>


              <p className="font-semibold">

                {product.name}

              </p>



              <p className="text-sm text-stone-500">

                SKU: {product.sku}

              </p>



            </div>





            <div className="text-right">


              <p

                className={

                  product.stock === 0

                    ? "text-red-600 font-bold"

                    : "text-amber-600 font-bold"

                }

              >

                Stock: {product.stock}

              </p>




              <p className="text-xs text-stone-400">

                Mínimo: {product.minimumStock}

              </p>




            </div>



          </div>


        ))}



      </div>



    </div>

  );


}