// Invoice generation and download service
// Uses html2pdf library for client-side PDF generation

export async function downloadInvoiceAsPDF(orderId: string, orderNumber: string) {
  try {
    // Fetch invoice HTML from API
    const response = await fetch(`/api/b2b/orders/${orderId}/invoice`);

    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }

    const html = await response.text();
    const invoiceNumber = `INV-SK-${orderNumber.split("-")[2]}`;

    // Create a temporary container
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // For production, implement one of these options:

    // Option 1: Use html2pdf library
    // import html2pdf from 'html2pdf.js';
    // const element = container.querySelector(".container");
    // const opt = {
    //   margin: 10,
    //   filename: `SpareKart_Invoice_${invoiceNumber}.pdf`,
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    // };
    // html2pdf().set(opt).from(element).save();

    // Option 2: Use browser print dialog to save as PDF
    // window.print();

    // Option 3: Server-side PDF generation (recommended)
    // Call your server PDF generation endpoint

    // For now, use window.print() - user can save as PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }

    // Cleanup
    document.body.removeChild(container);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Failed to download invoice. Please try again.");
  }
}

export async function sendInvoiceByEmail(orderId: string, orderNumber: string, email: string) {
  try {
    const response = await fetch(`/api/b2b/orders/${orderId}/invoice/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send invoice");
    }

    const data = await response.json();
    alert(`Invoice sent to ${email}`);
    return data;
  } catch (error) {
    console.error("Error sending invoice:", error);
    alert("Failed to send invoice. Please try again.");
  }
}

export async function downloadBulkInvoices(orderIds: string[], orderNumbers: Record<string, string>) {
  try {
    const response = await fetch("/api/b2b/orders/invoices/bulk-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to download invoices");
    }

    // Download ZIP file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SpareKart_Invoices_${new Date().getTime()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading bulk invoices:", error);
    alert("Failed to download invoices. Please try again.");
  }
}

// Installation instructions for production PDF generation:
/*
## Option 1: Client-side with html2pdf
npm install html2pdf.js

Usage:
import html2pdf from 'html2pdf.js';
const element = document.querySelector('#invoice');
html2pdf().set(opt).from(element).save();

## Option 2: Server-side with Puppeteer
npm install puppeteer

import puppeteer from 'puppeteer';

export async function generatePDFBuffer(html: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

## Option 3: Server-side with @react-pdf/renderer
npm install @react-pdf/renderer

Requires creating React components for PDF structure.
*/
