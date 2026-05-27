import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mockOrders";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const order = mockOrders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // In production, implement email sending:
    // 1. Generate PDF from invoice HTML
    // 2. Use service like SendGrid, AWS SES, or Nodemailer
    // 3. Send email with PDF attachment

    // Mock implementation
    console.log(`Email invoice for order ${order.orderNumber} to ${email}`);

    // Example with nodemailer (production):
    /*
    import nodemailer from 'nodemailer';

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const invoiceHTML = generateInvoiceHTML(order);
    const pdfBuffer = await generatePDFBuffer(invoiceHTML); // using puppeteer

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `SpareKart Invoice - ${order.orderNumber}`,
      html: `
        <p>Dear ${order.deliveryAddress?.name},</p>
        <p>Please find attached your invoice for order <strong>${order.orderNumber}</strong>.</p>
        <p>If you have any questions, please reply to this email or contact support@sparekart.com</p>
        <br>
        <p>Best regards,<br>SpareKart Team</p>
      `,
      attachments: [
        {
          filename: `SpareKart_Invoice_INV-${order.orderNumber.split("-")[2]}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
    */

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${email}`,
      orderId,
      email,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send invoice email" }, { status: 500 });
  }
}
