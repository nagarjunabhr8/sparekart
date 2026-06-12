Implement the "Find Your Perfect Part" vehicle filter section on the SpareKart home page at /shop.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- Route: /shop (page.tsx or home component)
- Live URL: https://sparekart.vercel.app/shop

Requirements:
1. Car Brand dropdown: Maruti, Hyundai, Tata, Honda, Mahindra, Toyota, Kia, Skoda
2. Model text input: placeholder "e.g., Swift, Creta" — filter model options dynamically based on selected brand
3. Year dropdown: 2005–2024
4. Fuel Type dropdown: Petrol, Diesel, CNG, Electric
5. Part Category dropdown: Engine Parts, Brakes, Suspension, Electrical, Cooling, Body Parts, Filters, Clutch
6. "Search Parts" button: on click, navigate to /shop/products with all selected filters as URL query params
   Example: /shop/products?brand=Maruti&model=Swift&year=2022&fuel=Petrol&category=Brakes
7. If no filters selected, show a toast/inline error "Please select at least Car Brand and Part Category"
8. Keep the existing UI layout — 5 dropdowns in a row, responsive grid on mobile

Brand → Model mapping to implement:
Maruti: Swift, Dzire, Baleno, Vitara Brezza, Wagon R, Alto, Ertiga, S-Cross
Hyundai: Creta, i20, Venue, Verna, Tucson, Aura, Grand i10
Tata: Nexon, Harrier, Safari, Punch, Tiago, Tigor, Altroz
Honda: City, Amaze, WR-V, Jazz, CR-V
Mahindra: Scorpio, XUV700, XUV300, Thar, Bolero
Toyota: Innova, Fortuner, Glanza, Urban Cruiser, Camry
Kia: Seltos, Sonet, Carnival, EV6
Skoda: Octavia, Superb, Kushaq, Slavia