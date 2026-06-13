Build the Product Detail page for SpareKart at /shop/products/[id].

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/products/[id]/page.tsx

Page sections:

1. BREADCRUMB: Home > Browse Parts > Engine Parts > Engine Oil Filter (Bosch)

2. PRODUCT HERO (2-col layout):
   Left: Image gallery — main large image + 3-4 thumbnail row below (use placeholder images)
   Right:
   - "✓ Authentic" green badge
   - Product name (24px bold)
   - Rating stars + "(234 reviews)" link → jumps to reviews section
   - Price: ₹349 (strikethrough ₹499) + "-30% off" tag
   - Seller: "By AutoPro Store" with verified seller badge
   - Stock: "✓ In Stock — 47 units left"
   - Compatible vehicles: tag list (Maruti Swift 2018-2024, Dzire 2019-2024)
   - Quantity selector: - 1 + (min 1, max 10)
   - [Add to Cart] primary button + [Buy Now] secondary button
   - Delivery: "Estimated delivery: 24-48 hours to Hyderabad"
   - Return policy: "30-day hassle-free returns"

3. TABS below hero: Description | Specifications | Compatibility | Reviews
   Description: Rich text about the part
   Specifications: table (Brand, Part Number, Material, Weight, Dimensions, Warranty)
   Compatibility: vehicle compatibility table (Brand, Model, Year range, Fuel type)
   Reviews: star histogram + 3 review cards with name, date, rating, comment

4. RELATED PRODUCTS: horizontal scroll row of 4 similar product cards

Use the existing product data (product id 1-4 already in the codebase from trending section). Add generateStaticParams for ids 1-20.