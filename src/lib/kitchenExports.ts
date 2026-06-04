import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { KitchenOrder } from '@/data/kitchenOrders';

const COMPANY = 'Dumas Pets Kitchen';

export async function downloadOrderPDF(order: KitchenOrder) {
  const doc = new jsPDF();
  doc.setFillColor(255, 134, 47);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(COMPANY, 14, 12);
  doc.setFontSize(10);
  doc.text('Kitchen Requisition Report', 14, 19);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(11);
  let y = 35;
  doc.text(`Order ID: ${order.id}`, 14, y);
  doc.text(`Order Date: ${order.orderDate}`, 110, y); y += 6;
  doc.text(`Pickup Date: ${order.pickupDate}`, 14, y);
  doc.text(`Time Slot: ${order.timeSlot}`, 110, y); y += 6;
  doc.text(`Status: ${order.status}`, 14, y); y += 10;

  doc.setFont(undefined, 'bold'); doc.text('Customer', 14, y); doc.setFont(undefined, 'normal'); y += 6;
  doc.text(`${order.customerName}  |  ${order.phone}`, 14, y); y += 6;
  doc.text(`${order.address}, ${order.landmark}, ${order.city}, ${order.state} - ${order.pincode}`, 14, y, { maxWidth: 180 }); y += 10;

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty', 'Raw Materials', 'Cooking Instructions']],
    body: order.items.map(i => [i.itemName, String(i.quantity), i.rawMaterials.join(', '), i.cookingInstructions]),
    headStyles: { fillColor: [255, 134, 47] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const afterY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont(undefined, 'bold'); doc.text('Delivery', 14, afterY); doc.setFont(undefined, 'normal');
  doc.text(`${order.deliveryBoy}  |  ${order.deliveryBoyPhone}${order.vehicleNumber ? '  |  ' + order.vehicleNumber : ''}`, 14, afterY + 6);

  doc.setFontSize(8); doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleString()}  |  By: Kitchen Admin`, 14, 285);

  doc.save(`Order-${order.id}.pdf`);
}

export async function downloadPackingSlipPDF(order: KitchenOrder) {
  const doc = new jsPDF({ format: [148, 210] }); // A5 portrait
  doc.setFillColor(255, 134, 47);
  doc.rect(0, 0, 148, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.text(COMPANY, 10, 9);
  doc.setFontSize(10); doc.text('PACKING SLIP', 10, 15);

  doc.setTextColor(20);
  doc.setFontSize(11);
  let y = 26;
  doc.setFont(undefined, 'bold'); doc.text(order.customerName, 10, y); doc.setFont(undefined, 'normal'); y += 5;
  doc.setFontSize(9);
  doc.text(order.phone, 10, y); y += 5;
  doc.text(`${order.address}`, 10, y, { maxWidth: 130 }); y += 5;
  doc.text(`${order.landmark}`, 10, y); y += 5;
  doc.text(`${order.city}, ${order.state} - ${order.pincode}`, 10, y); y += 8;

  doc.setFontSize(10); doc.setFont(undefined, 'bold');
  doc.text(`Order: ${order.id}`, 10, y);
  doc.text(`Pickup: ${order.pickupDate}`, 80, y); y += 5;
  doc.text(`Slot: ${order.timeSlot}`, 10, y); y += 7;
  doc.setFont(undefined, 'normal');

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty']],
    body: order.items.map(i => [i.itemName, String(i.quantity)]),
    headStyles: { fillColor: [255, 134, 47] },
    styles: { fontSize: 9 },
    margin: { left: 10, right: 10 },
  });

  const afterY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(9);
  doc.text(`Delivery: ${order.deliveryBoy}`, 10, afterY);
  doc.text(`${order.deliveryBoyPhone}`, 10, afterY + 4);

  try {
    const qrDataUrl = await QRCode.toDataURL(order.id, { width: 160, margin: 1 });
    doc.addImage(qrDataUrl, 'PNG', 100, afterY - 4, 38, 38);
  } catch {}

  doc.save(`PackingSlip-${order.id}.pdf`);
}

export function exportOrdersExcel(orders: KitchenOrder[]) {
  const rows = orders.flatMap(o =>
    o.items.map(i => ({
      'Order ID': o.id,
      'Order Date': o.orderDate,
      'Pickup Date': o.pickupDate,
      'Time Slot': o.timeSlot,
      'Customer Name': o.customerName,
      'Phone': o.phone,
      'Item Name': i.itemName,
      'Quantity': i.quantity,
      'Raw Materials': i.rawMaterials.join(', '),
      'Cooking Instructions': i.cookingInstructions,
      'Delivery Boy': o.deliveryBoy,
      'Address': `${o.address}, ${o.landmark}, ${o.city}, ${o.state} - ${o.pincode}`,
      'Status': o.status,
    }))
  );
  const ws = XLSX.utils.json_to_sheet(rows);
  const colWidths = Object.keys(rows[0] || {}).map(k => ({
    wch: Math.min(40, Math.max(k.length, ...rows.map(r => String((r as any)[k] ?? '').length))) + 2,
  }));
  ws['!cols'] = colWidths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kitchen Orders');
  XLSX.writeFile(wb, `kitchen-orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export interface ItemSummaryRow {
  itemName: string;
  totalQty: number;
  orderCount: number;
}

export function generateItemSummary(orders: KitchenOrder[]): ItemSummaryRow[] {
  const map = new Map<string, { totalQty: number; orderIds: Set<string> }>();
  for (const o of orders) {
    for (const i of o.items) {
      const entry = map.get(i.itemName) ?? { totalQty: 0, orderIds: new Set() };
      entry.totalQty += i.quantity;
      entry.orderIds.add(o.id);
      map.set(i.itemName, entry);
    }
  }
  return Array.from(map.entries())
    .map(([itemName, v]) => ({ itemName, totalQty: v.totalQty, orderCount: v.orderIds.size }))
    .sort((a, b) => b.totalQty - a.totalQty);
}

export function exportItemSummaryExcel(orders: KitchenOrder[]) {
  const summary = generateItemSummary(orders);
  const rows = summary.map(s => ({
    'Item Name': s.itemName,
    'Total Quantity': s.totalQty,
    'Number of Orders': s.orderCount,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 40 }, { wch: 16 }, { wch: 18 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Item Summary');
  XLSX.writeFile(wb, `kitchen-item-summary-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
