// B2C customer orders — mock data. Separate from the B2B order data
// (lib/mockOrders.ts); this is only used by the /shop/orders pages.

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export interface ShopOrderProduct {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  category: string;
}

export interface ShopOrder {
  id: string; // e.g. "SK-2024-001"
  date: string; // ISO date, e.g. "2024-01-05"
  status: OrderStatus;
  product: ShopOrderProduct;
  seller: string;
  total: number;
}

const PART_IMAGE =
  "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop";

export const mockShopOrders: ShopOrder[] = [
  {
    id: "SK-2024-001",
    date: "2024-01-05",
    status: "Delivered",
    product: {
      productId: "3",
      name: "Brake Pad Set (Brembo)",
      qty: 1,
      price: 1299,
      image: PART_IMAGE,
      category: "Brakes",
    },
    seller: "Premium Auto Parts",
    total: 1299,
  },
  {
    id: "SK-2024-002",
    date: "2024-01-12",
    status: "Shipped",
    product: {
      productId: "4",
      name: "Spark Plugs (NGK)",
      qty: 2,
      price: 599,
      image: PART_IMAGE,
      category: "Engine Parts",
    },
    seller: "OEM Supply Co",
    total: 1198,
  },
  {
    id: "SK-2024-003",
    date: "2024-01-14",
    status: "Pending",
    product: {
      productId: "1",
      name: "Engine Oil Filter (Bosch)",
      qty: 3,
      price: 349,
      image: PART_IMAGE,
      category: "Filters",
    },
    seller: "AutoPro Store",
    total: 1047,
  },
  {
    id: "SK-2024-004",
    date: "2023-12-28",
    status: "Delivered",
    product: {
      productId: "2",
      name: "Air Intake Filter (Mann)",
      qty: 1,
      price: 299,
      image: PART_IMAGE,
      category: "Air Filters",
    },
    seller: "TrueParts India",
    total: 299,
  },
  {
    id: "SK-2024-005",
    date: "2023-12-20",
    status: "Cancelled",
    product: {
      productId: "5",
      name: "Clutch Plate (LuK)",
      qty: 1,
      price: 2499,
      image: PART_IMAGE,
      category: "Clutch",
    },
    seller: "ClutchTech India",
    total: 2499,
  },
];

export function getShopOrderById(id: string): ShopOrder | undefined {
  return mockShopOrders.find((o) => o.id === id);
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const STATUS_BADGE: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};
