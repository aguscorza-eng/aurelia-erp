// Convierte una venta de Prisma (con customer + items) al formato
// que espera el frontend: cliente por nombre, productos con nombre y
// cantidad, y los Decimal convertidos a number para formatear bien.
export function serializeSale(sale: any) {

  return {

    ...sale,

    total: Number(sale.total),

    advance: Number(sale.advance),

    balance: Number(sale.balance),

    number: sale.orderNumber
      ? `PED${String(sale.orderNumber).padStart(3, "0")}`
      : null,

    client:
      sale.customer?.name || "Consumidor final",

    clientPhone: sale.customer?.phone || "",

    products:

      (sale.items || []).map((item: any) => ({

        id: item.productId,

        name: item.product?.name,

        quantity: item.quantity,

        price: Number(item.price)

      }))

  };

}
