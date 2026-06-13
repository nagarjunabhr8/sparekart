// Shared B2C reference data (vehicle + location constants) used across the
// home parts finder, registration, and the customer profile pages.

// Brand → Model mapping (mirrors the home "Find Your Perfect Part" filter).
export const brandModels: Record<string, string[]> = {
  Maruti: [
    "Swift",
    "Dzire",
    "Baleno",
    "Vitara Brezza",
    "Wagon R",
    "Alto",
    "Ertiga",
    "S-Cross",
  ],
  Hyundai: ["Creta", "i20", "Venue", "Verna", "Tucson", "Aura", "Grand i10"],
  Tata: ["Nexon", "Harrier", "Safari", "Punch", "Tiago", "Tigor", "Altroz"],
  Honda: ["City", "Amaze", "WR-V", "Jazz", "CR-V"],
  Mahindra: ["Scorpio", "XUV700", "XUV300", "Thar", "Bolero"],
  Toyota: ["Innova", "Fortuner", "Glanza", "Urban Cruiser", "Camry"],
  Kia: ["Seltos", "Sonet", "Carnival", "EV6"],
  Skoda: ["Octavia", "Superb", "Kushaq", "Slavia"],
};

export const CAR_BRANDS = Object.keys(brandModels);

export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric"];

// 2005–2024, newest first.
export const VEHICLE_YEARS = Array.from({ length: 20 }, (_, i) => 2024 - i);

// Vehicle category chips used in registration / profile.
export const VEHICLE_TYPES = ["Car", "Bike", "Truck", "Auto", "SUV"];

// All Indian states + union territories, alphabetically sorted.
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
  "Ladakh",
  "Jammu & Kashmir",
].sort((a, b) => a.localeCompare(b));
