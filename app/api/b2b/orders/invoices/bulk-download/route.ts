import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mockOrders";

export async function POST(request: Request) {
  try {
    const { orderIds } = await request.json();

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "No order IDs provided" }, { status: 400 });
    }

    const orders = mockOrders.filter((o) => orderIds.includes(o.id));

    if (orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    // In production, implement ZIP file creation:
    // 1. Generate PDF for each order
    // 2. Create ZIP archive
    // 3. Return ZIP file as response

    // Mock implementation - return CSV instead
    let csvContent =
      "Order Number,Invoice Number,Date,Total Amount,Items Count,Status\n";

    orders.forEach((order) => {
      const invoiceNumber = `INV-SK-${order.orderNumber.split("-")[2]}`;
      csvContent += `${order.orderNumber},${invoiceNumber},${new Date(order.date).toLocaleDateString("en-IN")},${order.total.toFixed(2)},${order.itemCount},${order.status}\n`;
    });

    // Return CSV for now (would be ZIP in production)
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="SpareKart_Invoices_${new Date().getTime()}.csv"`,
      },
    });

    // Production: Create and return ZIP file
    /*
    import JSZip from 'jszip';

    const zip = new JSZip();

    for (const order of orders) {
      const invoiceHTML = generateInvoiceHTML(order);
      const pdfBuffer = await generatePDFBuffer(invoiceHTML);
      const invoiceNumber = `INV-SK-${order.orderNumber.split("-")[2]}`;
      zip.file(`SpareKart_Invoice_${invoiceNumber}.pdf`, pdfBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="SpareKart_Invoices_${new Date().getTime()}.zip"`,
      },
    });
    */
  } catch (error) {
    console.error("Bulk invoice download error:", error);
    return NextResponse.json({ error: "Failed to prepare bulk download" }, { status: 500 });
  }
}
