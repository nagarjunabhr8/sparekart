import { NextRequest, NextResponse } from "next/server";

interface Part {
  id: string;
  name: string;
  brand: string;
  partNumber: string;
  category: string;
  vehicles: string[];
  price: number;
}

const mockParts: Part[] = [
  {
    id: "1",
    name: "Air Filter",
    brand: "Bosch",
    partNumber: "BOS-AF-1234",
    category: "Engine",
    vehicles: ["Maruti Swift 2020", "Hyundai i10 2021", "Tata Nexon 2022"],
    price: 450,
  },
  {
    id: "2",
    name: "Brake Pad",
    brand: "NGK",
    partNumber: "NGK-BP-5678",
    category: "Brakes",
    vehicles: ["Maruti Swift 2020", "Honda City 2021", "Toyota Fortuner 2020"],
    price: 850,
  },
  {
    id: "3",
    name: "Spark Plug",
    brand: "Denso",
    partNumber: "DENSO-SP-9012",
    category: "Engine",
    vehicles: ["Maruti Swift 2020", "Hyundai i10 2021"],
    price: 250,
  },
  {
    id: "4",
    name: "Oil Filter",
    brand: "Bosch",
    partNumber: "BOS-OF-3456",
    category: "Engine",
    vehicles: ["Maruti Swift 2020", "Honda City 2021", "Tata Nexon 2022"],
    price: 320,
  },
  {
    id: "5",
    name: "Cabin Filter",
    brand: "Mann",
    partNumber: "MANN-CF-7890",
    category: "HVAC",
    vehicles: ["Toyota Fortuner 2020", "Honda City 2021"],
    price: 650,
  },
  {
    id: "6",
    name: "Battery",
    brand: "Amaron",
    partNumber: "AMARON-BAT-1111",
    category: "Electrical",
    vehicles: ["Maruti Swift 2020", "Hyundai i10 2021", "Tata Nexon 2022"],
    price: 4500,
  },
  {
    id: "7",
    name: "Radiator Hose",
    brand: "Gates",
    partNumber: "GATES-RH-2222",
    category: "Cooling",
    vehicles: ["Honda City 2021", "Toyota Fortuner 2020"],
    price: 520,
  },
  {
    id: "8",
    name: "Engine Belt",
    brand: "Serpentine",
    partNumber: "SERPENT-EB-3333",
    category: "Engine",
    vehicles: ["Maruti Swift 2020", "Tata Nexon 2022"],
    price: 780,
  },
  {
    id: "9",
    name: "Alternator",
    brand: "Bosch",
    partNumber: "BOS-ALT-4444",
    category: "Electrical",
    vehicles: ["Honda City 2021", "Toyota Fortuner 2020"],
    price: 5200,
  },
  {
    id: "10",
    name: "Starter Motor",
    brand: "Valeo",
    partNumber: "VALEO-SM-5555",
    category: "Electrical",
    vehicles: ["Maruti Swift 2020", "Hyundai i10 2021"],
    price: 3800,
  },
];

interface SearchResult {
  type: "part" | "brand" | "vehicle" | "partNumber";
  value: string;
  label: string;
  count?: number;
  part?: Part;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";

    if (!q || q.length < 1) {
      return NextResponse.json({ results: [] });
    }

    const results: SearchResult[] = [];
    const seenParts = new Set<string>();
    const seenBrands = new Set<string>();
    const seenVehicles = new Set<string>();

    // Search through parts
    mockParts.forEach((part) => {
      // Part name match
      if (part.name.toLowerCase().includes(q)) {
        if (!seenParts.has(part.id)) {
          results.push({
            type: "part",
            value: part.name,
            label: `${part.name} by ${part.brand}`,
            part,
          });
          seenParts.add(part.id);
        }
      }

      // Part number exact/prefix match
      if (part.partNumber.toLowerCase().includes(q)) {
        if (!seenParts.has(part.id)) {
          results.push({
            type: "partNumber",
            value: part.partNumber,
            label: `${part.partNumber} - ${part.name}`,
            part,
          });
          seenParts.add(part.id);
        }
      }

      // Brand match
      if (part.brand.toLowerCase().includes(q)) {
        if (!seenBrands.has(part.brand)) {
          const brandCount = mockParts.filter((p) =>
            p.brand.toLowerCase().includes(q)
          ).length;
          results.push({
            type: "brand",
            value: part.brand,
            label: `${part.brand} (${brandCount} parts)`,
            count: brandCount,
          });
          seenBrands.add(part.brand);
        }
      }

      // Vehicle compatibility match
      part.vehicles.forEach((vehicle) => {
        if (vehicle.toLowerCase().includes(q) && !seenVehicles.has(vehicle)) {
          results.push({
            type: "vehicle",
            value: vehicle,
            label: `Parts for ${vehicle}`,
          });
          seenVehicles.add(vehicle);
        }
      });
    });

    return NextResponse.json({
      results: results.slice(0, 10), // Limit to 10 results
      total: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
