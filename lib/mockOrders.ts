export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "return_initiated";
export type PaymentMethod = "credit_card" | "bank_transfer" | "upi" | "cheque";

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  returnedQuantity?: number;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  transactionId: string;
  amount: number;
  paidAt: string;
  status: "completed" | "pending" | "failed";
}

export interface TimelineEvent {
  id: string;
  event: string;
  timestamp: string;
  status: OrderStatus;
  description?: string;
}

export interface TrackingStep {
  id: string;
  name: string;
  timestamp?: string;
  location?: string;
  completed: boolean;
  current: boolean;
}

export interface CourierInfo {
  id: string;
  name: string;
  logo: string;
  trackingNumber: string;
  trackingUrl: string;
  contactNumber?: string;
}

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  itemCount: number;
  total: number;
  gst: number;
  subtotal: number;
  discount: number;
  deliveryFee?: number;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  invoiceUrl: string;
  notes?: string;
  deliveryAddress?: DeliveryAddress;
  paymentInfo?: PaymentInfo;
  timeline?: TimelineEvent[];
  courier?: CourierInfo;
  trackingSteps?: TrackingStep[];
  currentLocation?: TrackingLocation;
  customerPhone?: string;
}

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ORD-2024-001",
    date: "2024-05-15",
    items: [
      { id: "p1", name: "Engine Oil Filter", brand: "Bosch", quantity: 10, price: 349 },
      { id: "p2", name: "Air Filter", brand: "Mann", quantity: 5, price: 299 },
    ],
    itemCount: 15,
    subtotal: 5485,
    discount: 822.75,
    gst: 751.48,
    deliveryFee: 0,
    total: 5413.73,
    status: "delivered",
    deliveryDate: "2024-05-20",
    invoiceUrl: "/invoices/ORD-2024-001.pdf",
    trackingNumber: "TRK123456",
    deliveryAddress: {
      name: "Rajesh Kumar",
      phone: "+91-9876543210",
      email: "rajesh.kumar@example.com",
      address: "456 Mechanic Street, Auto Repair Zone",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
    },
    paymentInfo: {
      method: "bank_transfer",
      transactionId: "TXN-2024-05-15-001",
      amount: 5413.73,
      paidAt: "2024-05-15T10:30:00Z",
      status: "completed",
    },
    timeline: [
      { id: "t1", event: "Order Placed", timestamp: "2024-05-15T10:00:00Z", status: "pending", description: "Order confirmed by system" },
      { id: "t2", event: "Confirmed", timestamp: "2024-05-15T11:00:00Z", status: "confirmed", description: "Order accepted and confirmed" },
      { id: "t3", event: "Shipped", timestamp: "2024-05-17T08:00:00Z", status: "shipped", description: "Order dispatched from warehouse" },
      { id: "t4", event: "Out for Delivery", timestamp: "2024-05-20T06:00:00Z", status: "out_for_delivery", description: "Order out for delivery" },
      { id: "t5", event: "Delivered", timestamp: "2024-05-20T16:30:00Z", status: "delivered", description: "Order delivered successfully" },
    ],
    courier: {
      id: "courier_001",
      name: "SpareKart Express",
      logo: "https://via.placeholder.com/40?text=SKX",
      trackingNumber: "TRK123456",
      trackingUrl: "https://track.sparekart.com/TRK123456",
      contactNumber: "+91-8765432100",
    },
    trackingSteps: [
      { id: "step_1", name: "Order Placed", timestamp: "2024-05-15T10:00:00Z", location: "Bangalore Warehouse", completed: true, current: false },
      { id: "step_2", name: "Order Confirmed", timestamp: "2024-05-15T11:00:00Z", location: "Processing Center, Bangalore", completed: true, current: false },
      { id: "step_3", name: "Packed & Ready", timestamp: "2024-05-16T14:00:00Z", location: "Warehouse, Bangalore", completed: true, current: false },
      { id: "step_4", name: "Picked Up by Courier", timestamp: "2024-05-17T08:00:00Z", location: "SpareKart Express Hub, Bangalore", completed: true, current: false },
      { id: "step_5", name: "In Transit", timestamp: "2024-05-19T06:00:00Z", location: "Krishnarajapuram Hub", completed: true, current: false },
      { id: "step_6", name: "Out for Delivery", timestamp: "2024-05-20T06:00:00Z", location: "Local Delivery Hub", completed: true, current: false },
      { id: "step_7", name: "Delivered", timestamp: "2024-05-20T16:30:00Z", location: "456 Mechanic Street, Bangalore", completed: true, current: false },
    ],
    currentLocation: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: "Krishnarajapuram Hub, Bangalore",
      timestamp: "2024-05-19T06:00:00Z",
    },
    customerPhone: "+91-9876543210",
  },
  {
    id: "ord_002",
    orderNumber: "ORD-2024-002",
    date: "2024-05-18",
    items: [
      { id: "p3", name: "Brake Pad Set", brand: "Brembo", quantity: 3, price: 1299 },
      { id: "p4", name: "Disc Rotor", brand: "TRW", quantity: 3, price: 899 },
    ],
    itemCount: 6,
    subtotal: 6594,
    discount: 1488.6,
    gst: 918.29,
    total: 6023.69,
    status: "shipped",
    estimatedDelivery: "2024-05-28",
    invoiceUrl: "/invoices/ORD-2024-002.pdf",
    trackingNumber: "TRK789012",
  },
  {
    id: "ord_003",
    orderNumber: "ORD-2024-003",
    date: "2024-05-20",
    items: [
      { id: "p5", name: "Spark Plugs Set", brand: "NGK", quantity: 20, price: 599 },
    ],
    itemCount: 20,
    subtotal: 11980,
    discount: 2876.2,
    gst: 1665.48,
    total: 10769.28,
    status: "confirmed",
    invoiceUrl: "/invoices/ORD-2024-003.pdf",
  },
  {
    id: "ord_004",
    orderNumber: "ORD-2024-004",
    date: "2024-05-22",
    items: [
      { id: "p6", name: "Battery 60Ah", brand: "Exide", quantity: 2, price: 4200 },
    ],
    itemCount: 2,
    subtotal: 8400,
    discount: 1932,
    gst: 1166.04,
    total: 7634.04,
    status: "pending",
    invoiceUrl: "/invoices/ORD-2024-004.pdf",
  },
  {
    id: "ord_005",
    orderNumber: "ORD-2024-005",
    date: "2024-05-12",
    items: [
      { id: "p7", name: "Water Pump", brand: "Kirloskar", quantity: 1, price: 2899 },
      { id: "p8", name: "Radiator", brand: "Modine", quantity: 1, price: 2599 },
    ],
    itemCount: 2,
    subtotal: 5498,
    discount: 1489.46,
    gst: 763.13,
    total: 4771.67,
    status: "delivered",
    deliveryDate: "2024-05-18",
    invoiceUrl: "/invoices/ORD-2024-005.pdf",
    trackingNumber: "TRK345678",
  },
  {
    id: "ord_006",
    orderNumber: "ORD-2024-006",
    date: "2024-05-21",
    items: [
      { id: "p9", name: "Alternator", brand: "Bosch", quantity: 1, price: 5999 },
    ],
    itemCount: 1,
    subtotal: 5999,
    discount: 1499.75,
    gst: 833.49,
    total: 5332.74,
    status: "pending",
    invoiceUrl: "/invoices/ORD-2024-006.pdf",
  },
  {
    id: "ord_007",
    orderNumber: "ORD-2024-007",
    date: "2024-05-10",
    items: [
      { id: "p10", name: "Suspension Spring", brand: "TRW", quantity: 4, price: 1899 },
    ],
    itemCount: 4,
    subtotal: 7596,
    discount: 1519.2,
    gst: 1055.26,
    total: 7131.06,
    status: "delivered",
    deliveryDate: "2024-05-16",
    invoiceUrl: "/invoices/ORD-2024-007.pdf",
    trackingNumber: "TRK567890",
  },
  {
    id: "ord_008",
    orderNumber: "ORD-2024-008",
    date: "2024-05-08",
    items: [
      { id: "p11", name: "Clutch Kit", brand: "Valeo", quantity: 2, price: 3499 },
    ],
    itemCount: 2,
    subtotal: 6998,
    discount: 1539.56,
    gst: 973.57,
    total: 6432.01,
    status: "cancelled",
    invoiceUrl: "/invoices/ORD-2024-008.pdf",
    notes: "Cancelled due to out of stock",
  },
  {
    id: "ord_009",
    orderNumber: "ORD-2024-009",
    date: "2024-05-14",
    items: [
      { id: "p12", name: "AC Compressor", brand: "Sanden", quantity: 1, price: 6999 },
    ],
    itemCount: 1,
    subtotal: 6999,
    discount: 2099.7,
    gst: 972.79,
    total: 5872.09,
    status: "shipped",
    estimatedDelivery: "2024-05-26",
    invoiceUrl: "/invoices/ORD-2024-009.pdf",
    trackingNumber: "TRK890123",
  },
  {
    id: "ord_010",
    orderNumber: "ORD-2024-010",
    date: "2024-05-19",
    items: [
      { id: "p13", name: "Fuel Pump", brand: "Bosch", quantity: 2, price: 4499 },
    ],
    itemCount: 2,
    subtotal: 8998,
    discount: 2519.44,
    gst: 1250.18,
    total: 7728.74,
    status: "confirmed",
    invoiceUrl: "/invoices/ORD-2024-010.pdf",
  },
  {
    id: "ord_011",
    orderNumber: "ORD-2024-011",
    date: "2024-05-06",
    items: [
      { id: "p14", name: "Starter Motor", brand: "Nippon Denso", quantity: 1, price: 3299 },
      { id: "p15", name: "Alternator Belt", brand: "Gates", quantity: 2, price: 599 },
    ],
    itemCount: 3,
    subtotal: 4497,
    discount: 809.46,
    gst: 624.87,
    total: 4312.41,
    status: "delivered",
    deliveryDate: "2024-05-12",
    invoiceUrl: "/invoices/ORD-2024-011.pdf",
    trackingNumber: "TRK012345",
  },
  {
    id: "ord_012",
    orderNumber: "ORD-2024-012",
    date: "2024-05-17",
    items: [
      { id: "p16", name: "Door Handle Assembly", brand: "OEM", quantity: 8, price: 799 },
    ],
    itemCount: 8,
    subtotal: 6392,
    discount: 767.04,
    gst: 888.91,
    total: 6514.87,
    status: "return_initiated",
    invoiceUrl: "/invoices/ORD-2024-012.pdf",
    notes: "Return initiated - Defective product",
  },
  {
    id: "ord_013",
    orderNumber: "ORD-2024-013",
    date: "2024-05-23",
    items: [
      { id: "p17", name: "Front Bumper", brand: "OEM", quantity: 1, price: 3499 },
      { id: "p18", name: "Side Mirror", brand: "Fiem", quantity: 2, price: 1299 },
    ],
    itemCount: 3,
    subtotal: 6097,
    discount: 1024.54,
    gst: 847.77,
    total: 5920.23,
    status: "pending",
    invoiceUrl: "/invoices/ORD-2024-013.pdf",
  },
  {
    id: "ord_014",
    orderNumber: "ORD-2024-014",
    date: "2024-05-11",
    items: [
      { id: "p19", name: "Windshield Wipers", brand: "Bosch", quantity: 15, price: 499 },
    ],
    itemCount: 15,
    subtotal: 7485,
    discount: 2095.8,
    gst: 1039.26,
    total: 6428.46,
    status: "delivered",
    deliveryDate: "2024-05-17",
    invoiceUrl: "/invoices/ORD-2024-014.pdf",
    trackingNumber: "TRK234567",
  },
  {
    id: "ord_015",
    orderNumber: "ORD-2024-015",
    date: "2024-05-24",
    items: [
      { id: "p20", name: "Cabin Air Filter", brand: "Mann", quantity: 12, price: 399 },
      { id: "p21", name: "Engine Oil 5L", brand: "Castrol", quantity: 5, price: 899 },
    ],
    itemCount: 17,
    subtotal: 9783,
    discount: 3228.39,
    gst: 1358.71,
    total: 7913.32,
    status: "confirmed",
    invoiceUrl: "/invoices/ORD-2024-015.pdf",
  },
];
