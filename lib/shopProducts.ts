// B2C storefront products for the Browse Parts page. Separate from the B2B
// catalog data (lib/mockData.ts) — this set carries a fuel type, seller, and
// MRP for the customer-facing grid.

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";

export interface ShopProduct {
  id: string;
  name: string;
  brand: string; // manufacturer, e.g. Bosch / Brembo
  seller: string;
  category: string; // part category
  make: string; // compatible vehicle brand
  model: string; // compatible model
  year: string;
  fuel: FuelType;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
}

export const PART_CATEGORIES = [
  "Engine Parts",
  "Brakes",
  "Suspension",
  "Electrical",
  "Cooling",
  "Body Parts",
  "Filters",
  "Clutch",
];

export const PRICE_MIN = 0;
export const PRICE_MAX = 50000;

const IMG =
  "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=400&h=400&fit=crop";

export const shopProducts: ShopProduct[] = [
  { id: "1", name: "Brake Pad Set (Brembo)", brand: "Brembo", seller: "Premium Auto Parts", category: "Brakes", make: "Maruti", model: "Swift", year: "2022", fuel: "Petrol", price: 1299, mrp: 1799, rating: 4.9, reviews: 456, inStock: true, image: IMG },
  { id: "2", name: "Engine Oil Filter (Bosch)", brand: "Bosch", seller: "AutoPro Store", category: "Filters", make: "Hyundai", model: "Creta", year: "2021", fuel: "Diesel", price: 349, mrp: 499, rating: 4.8, reviews: 234, inStock: true, image: IMG },
  { id: "3", name: "Spark Plug Set (NGK)", brand: "NGK", seller: "OEM Supply Co", category: "Engine Parts", make: "Honda", model: "City", year: "2020", fuel: "Petrol", price: 599, mrp: 899, rating: 4.6, reviews: 312, inStock: true, image: IMG },
  { id: "4", name: "Air Intake Filter (Mann)", brand: "Mann", seller: "TrueParts India", category: "Filters", make: "Maruti", model: "Baleno", year: "2023", fuel: "Petrol", price: 299, mrp: 449, rating: 4.7, reviews: 189, inStock: true, image: IMG },
  { id: "5", name: "Clutch Plate Kit (LuK)", brand: "LuK", seller: "ClutchTech India", category: "Clutch", make: "Tata", model: "Nexon", year: "2021", fuel: "Diesel", price: 2499, mrp: 3299, rating: 4.5, reviews: 142, inStock: true, image: IMG },
  { id: "6", name: "Front Shock Absorber (Gabriel)", brand: "Gabriel", seller: "RideComfort Parts", category: "Suspension", make: "Mahindra", model: "Scorpio", year: "2019", fuel: "Diesel", price: 3499, mrp: 4499, rating: 4.4, reviews: 98, inStock: true, image: IMG },
  { id: "7", name: "Car Battery 35Ah (Exide)", brand: "Exide", seller: "PowerCell Traders", category: "Electrical", make: "Maruti", model: "Wagon R", year: "2020", fuel: "CNG", price: 4299, mrp: 5199, rating: 4.7, reviews: 367, inStock: true, image: IMG },
  { id: "8", name: "Radiator Assembly (Denso)", brand: "Denso", seller: "CoolFlow Auto", category: "Cooling", make: "Toyota", model: "Innova", year: "2018", fuel: "Diesel", price: 6499, mrp: 8499, rating: 4.6, reviews: 76, inStock: true, image: IMG },
  { id: "9", name: "Headlight Assembly (Minda)", brand: "Minda", seller: "BrightDrive", category: "Electrical", make: "Tata", model: "Nexon", year: "2022", fuel: "Electric", price: 3899, mrp: 4999, rating: 4.3, reviews: 121, inStock: false, image: IMG },
  { id: "10", name: "Wiper Blade Set (Bosch)", brand: "Bosch", seller: "TrueParts India", category: "Body Parts", make: "Honda", model: "Amaze", year: "2021", fuel: "Petrol", price: 699, mrp: 999, rating: 4.5, reviews: 203, inStock: true, image: IMG },
  { id: "11", name: "Brake Disc Rotor (Brembo)", brand: "Brembo", seller: "Premium Auto Parts", category: "Brakes", make: "Kia", model: "Seltos", year: "2022", fuel: "Petrol", price: 2899, mrp: 3699, rating: 4.8, reviews: 87, inStock: true, image: IMG },
  { id: "12", name: "Timing Belt Kit (Gates)", brand: "Gates", seller: "OEM Supply Co", category: "Engine Parts", make: "Skoda", model: "Octavia", year: "2019", fuel: "Petrol", price: 4599, mrp: 5999, rating: 4.6, reviews: 54, inStock: true, image: IMG },
  { id: "13", name: "Fuel Pump Assembly (Bosch)", brand: "Bosch", seller: "AutoPro Store", category: "Engine Parts", make: "Tata", model: "Harrier", year: "2021", fuel: "Diesel", price: 5299, mrp: 6499, rating: 4.4, reviews: 63, inStock: true, image: IMG },
  { id: "14", name: "Cabin AC Filter (Mann)", brand: "Mann", seller: "CoolFlow Auto", category: "Filters", make: "Maruti", model: "Dzire", year: "2023", fuel: "Petrol", price: 399, mrp: 599, rating: 4.7, reviews: 278, inStock: true, image: IMG },
  { id: "15", name: "Rear Coil Spring (SKF)", brand: "SKF", seller: "RideComfort Parts", category: "Suspension", make: "Hyundai", model: "Venue", year: "2020", fuel: "Petrol", price: 1899, mrp: 2499, rating: 4.2, reviews: 45, inStock: true, image: IMG },
  { id: "16", name: "Alternator (Valeo)", brand: "Valeo", seller: "PowerCell Traders", category: "Electrical", make: "Mahindra", model: "XUV700", year: "2022", fuel: "Diesel", price: 7499, mrp: 9499, rating: 4.5, reviews: 39, inStock: false, image: IMG },
  { id: "17", name: "Coolant 1L (Castrol)", brand: "Castrol", seller: "CoolFlow Auto", category: "Cooling", make: "Toyota", model: "Glanza", year: "2021", fuel: "Petrol", price: 449, mrp: 599, rating: 4.6, reviews: 156, inStock: true, image: IMG },
  { id: "18", name: "Bonnet Hood Panel (Minda)", brand: "Minda", seller: "BodyLine Parts", category: "Body Parts", make: "Tata", model: "Tiago", year: "2020", fuel: "Petrol", price: 4999, mrp: 6499, rating: 4.1, reviews: 28, inStock: true, image: IMG },
  { id: "19", name: "Clutch Cable (LuK)", brand: "LuK", seller: "ClutchTech India", category: "Clutch", make: "Maruti", model: "Alto", year: "2019", fuel: "Petrol", price: 449, mrp: 699, rating: 4.3, reviews: 91, inStock: true, image: IMG },
  { id: "20", name: "Fan Belt (MRF)", brand: "MRF", seller: "MRF Authorized", category: "Cooling", make: "Kia", model: "Sonet", year: "2022", fuel: "Petrol", price: 899, mrp: 1299, rating: 4.7, reviews: 412, inStock: true, image: IMG },
];

export function discountPct(p: ShopProduct): number {
  return p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
}

export function getShopProductById(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id);
}
