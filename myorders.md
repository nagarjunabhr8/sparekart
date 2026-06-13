Build the My Orders page for SpareKart at /shop/orders.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/orders/page.tsx

Page layout:

HEADER:
- Title: "My Orders"
- Tabs: All Orders | Pending | Shipped | Delivered | Cancelled

SEARCH + FILTER BAR:
- Search by order number or product name
- Filter by date range: Last 30 days / Last 6 months / Last year / Custom

ORDER CARDS (one per order):
Each card shows:
- Order number: #SK-2024-001 (top right, copyable)
- Order date: "14 Jan 2024"
- Status badge: Pending (amber) | Shipped (blue) | Delivered (green) | Cancelled (red)
- Product thumbnail + name + qty + price
- Seller name
- Total amount: ₹1,598
- Action buttons based on status:
  * Pending: [Cancel Order] [Track Order]
  * Shipped: [Track Order] [Contact Support]
  * Delivered: [Reorder] [Write Review] [Return/Refund]
  * Cancelled: [Reorder] [View Details]
- Clicking card → /shop/orders/[orderId]

EMPTY STATE (when no orders):
- Illustration placeholder
- "No orders yet" message
- "Start Shopping →" CTA button to /shop/products

MOCK DATA — create 5 orders:
1. #SK-2024-001 — Delivered — Brake Pad Set (Brembo) × 1 = ₹1,299 — 5 Jan 2024
2. #SK-2024-002 — Shipped — Spark Plugs (NGK) × 2 = ₹1,198 — 12 Jan 2024
3. #SK-2024-003 — Pending — Engine Oil Filter (Bosch) × 3 = ₹1,047 — 14 Jan 2024
4. #SK-2024-004 — Delivered — Air Intake Filter (Mann) × 1 = ₹299 — 28 Dec 2023
5. #SK-2024-005 — Cancelled — Clutch Plate (LuK) × 1 = ₹2,499 — 20 Dec 2023