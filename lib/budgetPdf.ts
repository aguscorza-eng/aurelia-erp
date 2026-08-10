import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// Carga el logo y lo devuelve como dataURL para poder embeberlo en el PDF
// de forma confiable (addImage con una ruta suelta a veces no dibuja nada).
async function loadLogo(src:string):Promise<{ dataUrl:string; w:number; h:number } | null>{
  try{
    const img = await new Promise<HTMLImageElement>((resolve,reject)=>{
      const i = new Image();
      i.onload = ()=>resolve(i);
      i.onerror = reject;
      i.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if(!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      w: img.naturalWidth,
      h: img.naturalHeight
    };
  }catch{
    return null;
  }
}


// Genera y descarga el PDF premium de un presupuesto.
// Se usa desde el modal de detalle y directamente desde la tabla.
export async function generateBudgetPDF(budget:any){

  const doc = new jsPDF();

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 14;

  // Paleta de marca
  const gold:[number,number,number]    = [176,141,87];
  const cream:[number,number,number]   = [248,242,233];
  const softGray:[number,number,number]= [247,246,245];
  const textGray:[number,number,number]= [125,118,110];
  const ink:[number,number,number]     = [38,36,34];
  const red:[number,number,number]     = [204,45,45];
  const green:[number,number,number]   = [4,120,87];

  const setFill = (c:[number,number,number])=>doc.setFillColor(c[0],c[1],c[2]);
  const setText = (c:[number,number,number])=>doc.setTextColor(c[0],c[1],c[2]);
  const setDraw = (c:[number,number,number])=>doc.setDrawColor(c[0],c[1],c[2]);


  // ===== ENCABEZADO =====
  let logoBottom = 32;
  const logo = await loadLogo("/logo-aurelia.png");
  if(logo){
    const targetW = 46;
    const targetH = targetW * (logo.h / logo.w);
    doc.addImage(logo.dataUrl, "PNG", marginX, 15, targetW, targetH);
    logoBottom = 15 + targetH;
  }else{
    setText(ink);
    doc.setFont("helvetica","bold");
    doc.setFontSize(24);
    doc.text("Aurelia", marginX, 26);
    logoBottom = 30;
  }

  setText(textGray);
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  doc.text("PRESUPUESTO COMERCIAL", pageW - marginX, 20, { align:"right" });

  setText(ink);
  doc.setFont("helvetica","bold");
  doc.setFontSize(19);
  doc.text(String(budget.number), pageW - marginX, 29, { align:"right" });

  setText(textGray);
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  doc.text(
    `Emisión: ${new Date(budget.createdAt).toLocaleDateString("es-AR")}`,
    pageW - marginX,
    36,
    { align:"right" }
  );

  // Línea dorada divisoria
  let y = Math.max(logoBottom, 38) + 4;
  setDraw(gold);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageW - marginX, y);
  y += 10;


  // ===== TARJETAS: CLIENTE + ENTREGA =====
  const colGap = 6;
  const colW = (pageW - marginX * 2 - colGap) / 2;
  const rightX = marginX + colW + colGap;
  const cardTop = y;
  const cardH = 44;

  // Cliente
  setFill(softGray);
  doc.roundedRect(marginX, cardTop, colW, cardH, 3, 3, "F");

  let cy = cardTop + 9;
  setText(gold);
  doc.setFont("helvetica","bold");
  doc.setFontSize(8);
  doc.text("CLIENTE", marginX + 6, cy);

  cy += 8;
  setText(ink);
  doc.setFont("helvetica","bold");
  doc.setFontSize(12);
  doc.text(budget.client?.name || "-", marginX + 6, cy);

  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  setText(textGray);
  if(budget.client?.company){ cy += 6; doc.text(budget.client.company, marginX + 6, cy); }
  if(budget.client?.email){ cy += 6; doc.text(budget.client.email, marginX + 6, cy); }
  if(budget.client?.phone){ cy += 6; doc.text(budget.client.phone, marginX + 6, cy); }

  // Entrega y validez
  setFill(cream);
  doc.roundedRect(rightX, cardTop, colW, cardH, 3, 3, "F");

  let ry = cardTop + 9;
  setText(gold);
  doc.setFont("helvetica","bold");
  doc.setFontSize(8);
  doc.text("ENTREGA Y VALIDEZ", rightX + 6, ry);

  const labelVal = (label:string, val:string)=>{
    ry += 8;
    setText(textGray);
    doc.setFont("helvetica","normal");
    doc.setFontSize(9);
    doc.text(label, rightX + 6, ry);
    setText(ink);
    doc.setFont("helvetica","bold");
    doc.text(val, rightX + colW - 6, ry, { align:"right" });
  };

  labelVal("Estado", String(budget.status || "-"));
  labelVal("Preparación", String(budget.preparationDays || "A confirmar"));
  labelVal(
    "Entrega",
    budget.deliveryDate ? new Date(budget.deliveryDate).toLocaleDateString("es-AR") : "A confirmar"
  );
  labelVal("Validez", "15 días");

  y = cardTop + cardH + 12;


  // ===== TABLA DE PRODUCTOS =====
  autoTable(doc,{
    startY: y,
    head: [["Producto","Cant.","Precio","Total"]],
    body: (budget.items || []).map((it:any)=>[
      it.name,
      String(it.quantity),
      `$${Number(it.price).toLocaleString("es-AR")}`,
      `$${(it.quantity * Number(it.price)).toLocaleString("es-AR")}`
    ]),
    headStyles:{
      fillColor:[176,141,87],
      textColor:[255,255,255],
      fontStyle:"bold",
      halign:"left",
      cellPadding:3
    },
    bodyStyles:{ textColor:[40,38,36], cellPadding:3 },
    alternateRowStyles:{ fillColor:[250,249,248] },
    columnStyles:{
      1:{ halign:"center" },
      2:{ halign:"right" },
      3:{ halign:"right", fontStyle:"bold" }
    },
    styles:{ fontSize:10 },
    margin:{ left:marginX, right:marginX }
  });

  let afterY = (doc as any).lastAutoTable.finalY + 10;


  // ===== TOTALES =====
  const boxW = 82;
  const boxX = pageW - marginX - boxW;

  const totalLine = (label:string, val:string, color:[number,number,number])=>{
    setText(textGray);
    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.text(label, boxX, afterY);
    setText(color);
    doc.setFont("helvetica","bold");
    doc.text(val, pageW - marginX, afterY, { align:"right" });
    afterY += 7;
  };

  totalLine("Subtotal", `$${Number(budget.subtotal).toLocaleString("es-AR")}`, ink);
  totalLine("Descuento", `-$${Number(budget.discountAmount || 0).toLocaleString("es-AR")}`, red);
  if(budget.bonus > 0){
    totalLine("Bonificación", `+${budget.bonus} u. sin cargo`, green);
  }

  // Barra TOTAL destacada
  afterY += 1;
  const barH = 13;
  setFill(gold);
  doc.roundedRect(boxX - 2, afterY, boxW + 2, barH, 2.5, 2.5, "F");
  setText([255,255,255]);
  doc.setFont("helvetica","bold");
  doc.setFontSize(11);
  doc.text("TOTAL", boxX + 3, afterY + 8.5);
  doc.setFontSize(13);
  doc.text(`$${Number(budget.total).toLocaleString("es-AR")}`, pageW - marginX - 3, afterY + 8.5, { align:"right" });

  let footY = afterY + barH + 16;


  // ===== CONDICIONES =====
  setDraw([232,230,227]);
  doc.setLineWidth(0.4);
  doc.line(marginX, footY, pageW - marginX, footY);
  footY += 8;

  setText(ink);
  doc.setFont("helvetica","bold");
  doc.setFontSize(10);
  doc.text("Condiciones comerciales", marginX, footY);

  setText(textGray);
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  footY += 6;
  doc.text("• Presupuesto válido por 15 días.", marginX, footY);
  footY += 5;
  doc.text("• Forma de pago a coordinar.", marginX, footY);
  footY += 5;
  doc.text("• La fecha de entrega puede variar según producción y disponibilidad.", marginX, footY);


  // ===== PIE =====
  setDraw(gold);
  doc.setLineWidth(0.8);
  doc.line(marginX, pageH - 20, pageW - marginX, pageH - 20);
  setText(gold);
  doc.setFont("helvetica","bold");
  doc.setFontSize(10);
  doc.text("Gracias por elegir Aurelia", pageW / 2, pageH - 13, { align:"center" });


  doc.save(`${budget.number}.pdf`);
}
