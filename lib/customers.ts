// Convierte un cliente de Prisma al formato que espera el frontend.
export function serializeCustomer(c: any) {

  return {
    id: c.id,
    name: c.name,
    firstName: c.firstName || "",
    lastName: c.lastName || "",
    company: c.company || "",
    phone: c.phone || "",
    email: c.email || "",
    notes: c.notes || "",
    createdAt: c.createdAt
  };

}


// Arma el objeto `data` de Prisma desde el body del frontend.
export function customerDataFromBody(body: any) {

  const name =
    (body.name || `${body.firstName || ""} ${body.lastName || ""}`).trim()
    || "Sin nombre";

  return {
    name,
    firstName: body.firstName || null,
    lastName: body.lastName || null,
    company: body.company || null,
    phone: body.phone || null,
    email: body.email || null,
    notes: body.notes || null
  };

}
