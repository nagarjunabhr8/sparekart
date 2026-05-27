import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mockOrders";

// Mock GST rates and HSN codes
const HSN_CODES: Record<string, string> = {
  "Engine Oil Filter": "8481",
  "Air Filter": "8481",
  "Brake Pad Set": "8681",
  "Disc Rotor": "8681",
  "Spark Plugs Set": "8507",
  "Battery 60Ah": "8507",
  "Water Pump": "8413",
  "Radiator": "8414",
  "Alternator": "8511",
  "Suspension Spring": "7308",
  "Clutch Kit": "8703",
  "AC Compressor": "8414",
  "Fuel Pump": "8413",
  "Starter Motor": "8511",
  "Alternator Belt": "8484",
  "Door Handle Assembly": "8708",
  "Front Bumper": "8708",
  "Side Mirror": "8708",
  "Windshield Wipers": "8512",
  "Cabin Air Filter": "8481",
  "Engine Oil 5L": "2710",
};

// Generate HTML invoice template
function generateInvoiceHTML(order: typeof mockOrders[0]): string {
  const companyGSTIN = "07AABCU9603R1Z0";
  const companyRegAddress = "Bangalore, Karnataka 560001, India";
  const invoiceNumber = `INV-SK-${order.orderNumber.split("-")[2]}`;
  const invoiceDate = new Date(order.date).toLocaleDateString("en-IN");
  const dueDate = new Date(new Date(order.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN");

  const customerName = order.deliveryAddress?.name || "Customer";
  const customerGST = "37AABDU1234R1Z5"; // Mock GST
  const itemsHTML = order.items
    .map((item) => {
      const hsnCode = HSN_CODES[item.name] || "8481";
      const itemTotal = item.price * item.quantity;
      const gstAmount = itemTotal * 0.18;
      return `
        <tr>
          <td>${item.name}</td>
          <td>${hsnCode}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>18%</td>
          <td>₹${gstAmount.toFixed(2)}</td>
          <td>₹${(itemTotal + gstAmount).toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const cgst = (order.gst / 2).toFixed(2);
  const sgst = (order.gst / 2).toFixed(2);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; color: #333; font-size: 12px; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #003d7a; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #FF6B35; }
        .company-info { text-align: right; font-size: 11px; }
        .invoice-title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
        .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 11px; }
        .invoice-detail-box { border: 1px solid #ddd; padding: 10px; }
        .invoice-detail-box h4 { font-weight: bold; margin-bottom: 5px; color: #003d7a; }
        .invoice-detail-box p { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table th { background-color: #003d7a; color: white; padding: 10px; text-align: left; font-weight: bold; }
        table td { padding: 8px; border-bottom: 1px solid #ddd; }
        table tr:nth-child(even) { background-color: #f9f9f9; }
        .totals { margin: 20px 0; }
        .totals-row { display: grid; grid-template-columns: 1fr 150px; gap: 10px; margin: 5px 0; font-weight: bold; }
        .totals-row.total { color: #FF6B35; font-size: 14px; border-top: 2px solid #003d7a; border-bottom: 2px solid #003d7a; padding: 10px 0; }
        .payment-terms { border: 1px solid #ddd; padding: 10px; margin: 15px 0; font-size: 11px; }
        .signature-area { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 40px; font-size: 11px; }
        .stamp-area { border: 2px solid #ddd; padding: 30px; text-align: center; color: #999; font-size: 18px; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <div class="logo">SpareKart</div>
            <p style="font-size: 11px; margin-top: 5px;">Genuine Automobile Spare Parts</p>
          </div>
          <div class="company-info">
            <p><strong>SpareKart India Pvt. Ltd.</strong></p>
            <p>${companyRegAddress}</p>
            <p><strong>GSTIN:</strong> ${companyGSTIN}</p>
            <p><strong>Phone:</strong> +91-80-XXXX-XXXX</p>
            <p><strong>Email:</strong> invoices@sparekart.com</p>
          </div>
        </div>

        <div class="invoice-title">TAX INVOICE</div>

        <div class="invoice-details">
          <div class="invoice-detail-box">
            <h4>Bill To:</h4>
            <p><strong>${customerName}</strong></p>
            <p>GSTIN: ${customerGST}</p>
            <p>${order.deliveryAddress?.address}</p>
            <p>${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} ${order.deliveryAddress?.zipCode}</p>
            <p>Phone: ${order.customerPhone}</p>
          </div>

          <div class="invoice-detail-box">
            <h4>Ship To:</h4>
            <p><strong>${order.deliveryAddress?.name}</strong></p>
            <p>${order.deliveryAddress?.address}</p>
            <p>${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} ${order.deliveryAddress?.zipCode}</p>
            <p>Phone: ${order.customerPhone}</p>
          </div>
        </div>

        <div class="invoice-details">
          <div class="invoice-detail-box">
            <h4>Invoice Details:</h4>
            <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
          </div>

          <div class="invoice-detail-box">
            <h4>Shipping Details:</h4>
            <p><strong>Tracking #:</strong> ${order.trackingNumber || "N/A"}</p>
            <p><strong>Courier:</strong> ${order.courier?.name || "SpareKart Express"}</p>
            ${order.estimatedDelivery ? `<p><strong>Est. Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}</p>` : ""}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>GST %</th>
              <th>GST Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>₹${order.subtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>B2B Discount:</span>
            <span>-₹${order.discount.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>CGST (9%):</span>
            <span>₹${cgst}</span>
          </div>
          <div class="totals-row">
            <span>SGST (9%):</span>
            <span>₹${sgst}</span>
          </div>
          ${order.deliveryFee ? `<div class="totals-row"><span>Delivery Fee:</span><span>₹${order.deliveryFee.toFixed(2)}</span></div>` : ""}
          <div class="totals-row total">
            <span>Grand Total:</span>
            <span>₹${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="payment-terms">
          <h4 style="margin-bottom: 5px;">Payment Details:</h4>
          <p><strong>Payment Method:</strong> ${order.paymentInfo?.method.replace("_", " ").toUpperCase()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentInfo?.status.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${order.paymentInfo?.transactionId}</p>
        </div>

        <div class="payment-terms">
          <h4 style="margin-bottom: 5px;">Terms & Conditions:</h4>
          <p>• Goods once sold cannot be returned without prior approval from SpareKart.</p>
          <p>• Payment should be made within 30 days of invoice date as per agreed terms.</p>
          <p>• All disputes are subject to Bangalore jurisdiction.</p>
          <p>• This is a computer-generated invoice. No signature required.</p>
        </div>

        <div class="signature-area">
          <div>
            <div class="stamp-area">📋</div>
            <div class="signature-line">Stamp/Seal</div>
          </div>
          <div>
            <div class="signature-line">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const order = mockOrders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const html = generateInvoiceHTML(order);
    const invoiceNumber = `INV-SK-${order.orderNumber.split("-")[2]}`;

    // For now, return HTML that can be printed/converted to PDF on client
    // In production, use libraries like:
    // - puppeteer: npm install puppeteer
    // - pdfkit: npm install pdfkit
    // - @react-pdf/renderer: npm install @react-pdf/renderer

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="SpareKart_Invoice_${invoiceNumber}.html"`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
