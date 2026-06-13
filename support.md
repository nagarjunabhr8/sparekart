Build the Support Centre page for SpareKart at /shop/support.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/support/page.tsx

Page sections:

1. HERO: "How can we help you?"
   - Large search input: "Search for answers..."
   - Search filters topics and FAQ instantly (client-side)
   - Sub-text: "Or browse by topic below"

2. HELP TOPIC CARDS (2×3 grid):
   - Track My Order (icon: MapPin) → scroll to FAQ section filtered by orders
   - Return & Refunds (icon: RotateCcw) → scroll to returns FAQ
   - Part Compatibility (icon: Settings) → scroll to compatibility FAQ
   - Payment Issues (icon: CreditCard) → scroll to payment FAQ
   - Authenticity Queries (icon: ShieldCheck) → scroll to auth FAQ
   - Contact an Expert (icon: MessageCircle) → scroll to contact form

3. FAQ ACCORDION (grouped by topic):
   Each question expands on click. Include 4-5 questions per topic:

   ORDER TRACKING:
   - "How do I track my order?" → answer
   - "My order is delayed, what should I do?" → answer
   - "Can I change my delivery address after placing order?" → answer

   RETURNS & REFUNDS:
   - "What is the return policy?" → 30 days, unused, original packaging
   - "How long does refund take?" → 5-7 business days
   - "Can I return a used part?" → No, only defective parts

   PART COMPATIBILITY:
   - "How do I know if a part fits my vehicle?" → Use vehicle filter
   - "What if the part doesn't fit?" → Free return + exchange
   - "Do you have OEM parts?" → Yes, all parts are OEM-verified

   PAYMENT:
   - "What payment methods are accepted?" → UPI, Card, Net Banking, COD
   - "Is COD available for all pincodes?" → Select cities only
   - "My payment failed but amount was deducted" → Contact support within 24hrs

4. CONTACT OPTIONS ROW:
   - 📞 Call Us: +91 9876543210 (Mon–Sat 9AM–6PM)
   - ✉️ Email: support@sparekart.com (Reply within 24 hours)
   - 💬 Live Chat: "Chat with a mechanic expert" button → opens chat widget

5. CONTACT / TICKET FORM:
   - Name, Email, Phone, Order Number (optional), Category dropdown, Message textarea
   - File upload (attach image of part/issue)
   - Submit → show success message "We'll respond within 24 hours"
   - Validate all required fields before submit