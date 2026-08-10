// Convierte un presupuesto de Prisma al formato que espera el frontend:
// cliente como objeto, items como lista y los Decimal como number.
export function serializeBudget(budget: any) {

  return {

    id: budget.id,

    number: budget.number,

    client: {
      id: budget.clientRef || null,
      name: budget.clientName,
      company: budget.clientCompany || "",
      phone: budget.clientPhone || "",
      email: budget.clientEmail || ""
    },

    items: (budget.items || []).map((item: any) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    })),

    subtotal: Number(budget.subtotal),
    discount: Number(budget.discount),
    discountAmount: Number(budget.discountAmount),
    bonus: budget.bonus,
    total: Number(budget.total),

    preparationDays: budget.preparationDays || "",
    deliveryDate: budget.deliveryDate || "",
    customerNote: budget.customerNote || "",

    status: budget.status,
    saleId: budget.saleId || null,

    createdAt: budget.createdAt

  };

}


// Arma el objeto `data` de Prisma a partir del body del frontend.
export function budgetDataFromBody(body: any) {

  return {

    clientRef: body.client?.id ? String(body.client.id) : null,
    clientName: body.client?.name || "Consumidor final",
    clientCompany: body.client?.company || null,
    clientPhone: body.client?.phone || null,
    clientEmail: body.client?.email || null,

    subtotal: Number(body.subtotal) || 0,
    discount: Number(body.discount) || 0,
    discountAmount: Number(body.discountAmount) || 0,
    bonus: Number(body.bonus) || 0,
    total: Number(body.total) || 0,

    preparationDays: body.preparationDays || null,
    deliveryDate: body.deliveryDate || null,
    customerNote: body.customerNote || null

  };

}
