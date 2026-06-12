Implement the "Add to Cart" functionality for the "Trending This Week" product cards on the SpareKart home page.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- Products shown: Engine Oil Filter (Bosch) ₹349, Air Intake Filter (Mann) ₹299, Brake Pad Set (Brembo) ₹1299, Spark Plugs (NGK) ₹599

Requirements:
1. Create a CartContext (React context + useReducer) that stores:
   { items: [{ productId, name, price, qty, image, seller, category }], totalItems, totalPrice }
2. Persist cart to localStorage so it survives page refresh
3. "Add to Cart" button behaviour:
   - First click: add item, button changes to "Added ✓" with green bg for 2 seconds, then reverts
   - If item already in cart: button shows "Go to Cart →" and navigates to /shop/cart
4. Show a cart badge (count) on the navbar "My Orders" or add a Cart icon in the nav
5. Wrap the root layout with CartProvider
6. Export useCart() hook for use in other pages (Browse Parts, Product Detail)
7. Do NOT break existing page routing or styles