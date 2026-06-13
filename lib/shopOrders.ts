// B2C customer orders. Mock seed data + localStorage-backed placed orders.
// Separate from the B2B order data (lib/mockOrders.ts).

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export interface ShopOrderProduct {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  category: string;
  seller: string;
}

export interface ShopOrder {
  id: string; // e.g. "SK-2024-001"
  date: string; // ISO date, e.g. "2024-01-05"
  status: OrderStatus;
  items: ShopOrderProduct[];
  total: number;
  shippingAddress?: string;
  paymentMethod?: string;
  // Owner identity so My Orders only shows the signed-in user's orders.
  ownerEmail?: string;
  ownerPhone?: string;
}

const PART_IMAGE =
  "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop";

const STORED_ORDERS_KEY = "shop_orders";
const LAST_ORDER_KEY = "shop_last_order";

// Seed/demo orders belong to the demo customer account (customer@sparekart.com
// / 9876543210) so they only appear for that login — not for other users.
const SEED_ORDERS: ShopOrder[] = ([
  {
    id: "SK-2024-001",
    date: "2024-01-05",
    status: "Delivered",
    items: [
      {
        productId: "3",
        name: "Brake Pad Set (Brembo)",
        qty: 1,
        price: 1299,
        image: PART_IMAGE,
        category: "Brakes",
        seller: "Premium Auto Parts",
      },
    ],
    total: 1299,
  },
  {
    id: "SK-2024-002",
    date: "2024-01-12",
    status: "Shipped",
    items: [
      {
        productId: "4",
        name: "Spark Plugs (NGK)",
        qty: 2,
        price: 599,
        image: PART_IMAGE,
        category: "Engine Parts",
        seller: "OEM Supply Co",
      },
    ],
    total: 1198,
  },
  {
    id: "SK-2024-003",
    date: "2024-01-14",
    status: "Pending",
    items: [
      {
        productId: "1",
        name: "Engine Oil Filter (Bosch)",
        qty: 3,
        price: 349,
        image: PART_IMAGE,
        category: "Filters",
        seller: "AutoPro Store",
      },
    ],
    total: 1047,
  },
  {
    id: "SK-2024-004",
    date: "2023-12-28",
    status: "Delivered",
    items: [
      {
        productId: "2",
        name: "Air Intake Filter (Mann)",
        qty: 1,
        price: 299,
        image: PART_IMAGE,
        category: "Air Filters",
        seller: "TrueParts India",
      },
    ],
    total: 299,
  },
  {
    id: "SK-2024-005",
    date: "2023-12-20",
    status: "Cancelled",
    items: [
      {
        productId: "5",
        name: "Clutch Plate (LuK)",
        qty: 1,
        price: 2499,
        image: PART_IMAGE,
        category: "Clutch",
        seller: "ClutchTech India",
      },
    ],
    total: 2499,
  },
] as ShopOrder[]).map((o) => ({
  ownerEmail: "customer@sparekart.com",
  ownerPhone: "9876543210",
  ...o,
}));

export const mockShopOrders: ShopOrder[] = SEED_ORDERS;

// Match orders to the signed-in user by email or phone.
export function getOrdersForUser(email?: string, phone?: string): ShopOrder[] {
  const e = email?.toLowerCase();
  return getAllOrders().filter((o) => {
    const byEmail = !!e && !!o.ownerEmail && o.ownerEmail.toLowerCase() === e;
    const byPhone = !!phone && !!o.ownerPhone && o.ownerPhone === phone;
    return byEmail || byPhone;
  });
}

// ---- Stored (placed) orders ----

export function getStoredOrders(): ShopOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORED_ORDERS_KEY);
    return raw ? (JSON.parse(raw) as ShopOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: ShopOrder): void {
  if (typeof window === "undefined") return;
  try {
    const next = [order, ...getStoredOrders()];
    localStorage.setItem(STORED_ORDERS_KEY, JSON.stringify(next));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore storage failures */
  }
}

export function getLastOrder(): ShopOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as ShopOrder) : null;
  } catch {
    return null;
  }
}

// Placed orders first (most recent), then the demo seed orders.
export function getAllOrders(): ShopOrder[] {
  return [...getStoredOrders(), ...mockShopOrders];
}

export function findOrder(id: string): ShopOrder | undefined {
  return getAllOrders().find((o) => o.id === id);
}

// Kept for any server-side / static usage against the seed data.
export function getShopOrderById(id: string): ShopOrder | undefined {
  return mockShopOrders.find((o) => o.id === id);
}

// Generate a readable order id, e.g. "SK-2026-481723".
export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const suffix = Date.now().toString().slice(-6);
  return `SK-${year}-${suffix}`;
}

// ---- Helpers ----

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
