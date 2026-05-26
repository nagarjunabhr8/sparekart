# SpareKart - Project Documentation

## Overview

**SpareKart** is a full-stack e-commerce platform for genuine automobile spare parts in India, serving three main user types:
- **Vehicle Owners (B2C)**: Individual customers buying parts for personal vehicles
- **Mechanics (B2B)**: Professional mechanics and independent repair shops
- **Garages/Workshops (B2B)**: Workshop chains and service centers

## Project Structure

### Frontend (Next.js 15 + React 19)

```
/app
  /b2c              # B2C Portal (Individual customers)
    /layout.tsx
    /page.tsx       # Home page
    /products       # Product listing and details
    /orders         # Order tracking
  /b2b              # B2B Portal (Businesses)
    /layout.tsx
    /page.tsx       # Home page
    /catalog        # Catalog management
    /orders         # Order management
    /account        # Account dashboard

/components         # Reusable UI Components
  Navigation.tsx    # Sticky navigation with B2C/B2B switching
  Hero.tsx          # Hero banner for both portals
  SmartPartsFinder.tsx   # Vehicle-based parts search
  FeaturedProducts.tsx   # Product showcase grid
  CategoriesGrid.tsx     # Category browsing
  TrustSection.tsx  # Trust badges and testimonials
  B2BFeatures.tsx   # B2B-specific features
  BulkOrderingSection.tsx  # Bulk order interface with pricing
  PricingTiers.tsx  # B2B pricing plans
  B2BTrustSection.tsx    # B2B trust elements
  Footer.tsx        # Global footer

/lib               # Utility functions and hooks (to be created)
/public            # Static assets (to be created)
/styles            # Global styles in app/globals.css
```

## Key Features Implemented

### B2C Portal
1. **Smart Parts Finder** - Filter by:
   - Car brand, model, year
   - Fuel type (Petrol, Diesel, CNG, Electric)
   - Part category
   
2. **Product Discovery**
   - Category grid with part counts
   - Featured products with authenticity badges
   - Star ratings and seller information
   - Real-time stock status

3. **Trust Components**
   - Authenticity verification badges
   - Customer testimonials
   - 6 key trust features (authentic, fast, returns, support, warranty, secure)

### B2B Portal
1. **Bulk Ordering Interface**
   - Quantity adjustment controls
   - Real-time price calculation
   - Bulk discount visualization (15% shown in demo)
   - GST calculation

2. **Pricing Tiers**
   - Starter: 5% discount
   - Professional (popular): 15% discount with credit terms
   - Enterprise: 25% discount with extended features

3. **Professional Features**
   - Dedicated account managers
   - GST invoicing
   - Credit terms (15-30 days)
   - Advanced analytics dashboard

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Icons**: Lucide React
- **State Management**: Zustand (configured, ready to use)
- **HTTP Client**: Axios

### Colors & Branding
- **Primary**: #FF6B35 (Orange) - Main CTA, highlights
- **Secondary**: #004E89 (Navy Blue) - B2B branding, headers
- **Accent**: #F7931E (Gold) - Ratings, highlights
- **Success**: #06D6A0 (Green) - Positive actions
- **Warning**: #EF476F (Red) - Warnings, urgent

### Components Architecture

All components are client-side (`"use client"`) for interactivity:
- **Navigation**: Responsive mobile-first menu with portal switching
- **Search/Filters**: Form-based with dropdown selections
- **Product Cards**: Grid layouts with hover effects
- **Order Management**: Quantity controls with live calculations
- **Pricing**: Clear breakdowns with discounts and taxes

## Key Design Patterns

1. **Mobile-First Responsive Design**
   - Mobile: Full-width single column
   - Tablet (md): 2-column grids
   - Desktop (lg): 3-4 column grids
   - Sticky elements for ease of use

2. **Trust & Authenticity Focus**
   - Green authenticity badges
   - Seller information visibility
   - Customer review counts
   - 30-day return assurance

3. **Transparency in Pricing**
   - Discount percentage display
   - Original vs. current price
   - GST included in calculations
   - Bulk discount tiers clearly visible

4. **Dual Portal Architecture**
   - Separate layouts for B2C and B2B
   - Shared components (Navigation, Footer)
   - Portal-specific features and pricing
   - Account type-aware UX

## Next Steps

### Phase 1: Core Features (Current)
- [x] Basic project setup
- [x] Portal architecture (B2C/B2B)
- [x] Homepage designs
- [x] Navigation system
- [ ] Product detail pages
- [ ] Cart and checkout flow
- [ ] User authentication
- [ ] Order tracking interface

### Phase 2: Backend Integration
- [ ] API routes for products, orders, users
- [ ] Database setup (PostgreSQL)
- [ ] Authentication system (JWT/Sessions)
- [ ] Payment gateway integration
- [ ] Inventory management

### Phase 3: B2B Enhancements
- [ ] Account dashboard
- [ ] Bulk order workflow
- [ ] GST invoice generation
- [ ] Credit management
- [ ] Analytics dashboard

### Phase 4: Advanced Features
- [ ] Search with vehicle database integration
- [ ] Expert chat support
- [ ] Real-time order tracking
- [ ] Mobile app (React Native/Flutter)
- [ ] Localization (Hindi + regional languages)

## Styling Guidelines

### Spacing (Tailwind)
- Use `container-app` class for consistent max-width and padding
- `py-12 md:py-16` for section vertical spacing
- `gap-4 md:gap-6 lg:gap-8` for responsive gaps

### Typography
- Headings: Bold (font-bold), size increases from md breakpoint
- Body text: Neutral-600 for secondary content
- Cards: White background with subtle shadow and border

### Interaction
- Hover effects: Color transition + subtle lift (-translate-y-1)
- Focus states: Ring-2 ring-primary for form inputs
- Transitions: duration-300 for smooth animations

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Environment Variables

See `.env.local.example` for required configuration.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (Chrome Mobile, Safari Mobile)
- Mobile-first CSS ensures progressive enhancement

---

**Last Updated**: 2024
**Status**: MVP Phase - UI Development
