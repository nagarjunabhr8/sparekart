Build the Browse Parts page for SpareKart at /shop/products route.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/products/page.tsx
- Must read URL query params: brand, model, year, fuel, category, sort, page, search

Page layout (desktop — 2 column: sidebar + product grid):

LEFT SIDEBAR (filters — sticky):
- Search box: text input "Search by part name or brand..."
- Brand filter: checkbox list (Maruti, Hyundai, Tata, Honda, Mahindra, Toyota, Kia, Skoda)
- Category filter: checkbox list (Engine Parts, Brakes, Suspension, Electrical, Cooling, Body Parts, Filters, Clutch)
- Fuel type: checkbox list (Petrol, Diesel, CNG, Electric)
- Price range: dual-handle range slider ₹0 – ₹50,000
- Rating: star filter (4★+, 3★+, 2★+)
- In Stock only: toggle switch
- Clear All Filters button
- On mobile: filters collapse into a bottom drawer triggered by "Filters" button

RIGHT — PRODUCT GRID:
- Sort bar: "Showing X results" + Sort dropdown (Relevance, Price: Low to High, Price: High to Low, Rating, Newest)
- Product cards (3 per row desktop, 2 tablet, 1 mobile) each showing:
  * Product image (placeholder if none)
  * "✓ Authentic" green badge top-left
  * Discount % badge top-right (e.g. -30%)
  * Category tag
  * Product name (bold)
  * Star rating + review count
  * Seller name (By AutoPro Store)
  * Price: ₹349 (strike-through ₹499)
  * In Stock / Out of Stock indicator
  * Add to Cart button
  * Clicking card → /shop/products/[id]
- Pagination: page numbers at bottom (10 products per page)

Mock data — create 20 products spanning all categories with Indian brands (Bosch, Brembo, NGK, Denso, MRF, Minda, etc.) and realistic INR pricing.

URL sync: when filters change, update URL params (use next/navigation useRouter + useSearchParams) so filtered URL is shareable.

Keep SpareKart navbar and footer from the existing layout.