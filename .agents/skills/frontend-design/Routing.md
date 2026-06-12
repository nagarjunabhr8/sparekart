Wire up the "Shop by Category" section on the SpareKart home page so each category card navigates to the Browse Parts page filtered by that category.

Requirements:
1. Each category card click → navigate to /shop/products?category=
   Example: Engine Parts → /shop/products?category=Engine+Parts
2. Add hover animation on cards: subtle scale(1.03) + shadow on hover using Tailwind
3. Category icons — use lucide-react icons mapped as:
   Engine Parts → Cog, Brakes → Disc, Suspension → Activity, Electrical → Zap,
   Cooling System → Thermometer, Fuel System → Droplet, Air Filters → Wind, Oil Filters → Filter
4. Show part count below each category name (use the existing counts: Engine Parts 2340, Brakes 1890, etc.)
5. "View All" should navigate to /shop/products with no category filter (show all)