// Convierte una venta de Prisma (con customer + items) al formato
// que espera el frontend: cliente por nombre, productos con nombre y
// cantidad, y los Decimal convertidos a number para formatear bien.
export function serializeSale(sale: any) {

  return {

    ...sale,

    total: Number(sale.total),

    advance: Number(sale.advance),

    balance: Number(sale.balance),

    client:
      sale.customer?.name || "Consumidor final",

    products:

      (sale.items || []).map((item: any) => ({

        id: item.productId,

        name: item.product?.name,

        quantity: item.quantity,

        price: Number(item.price)

      }))

  };

}
