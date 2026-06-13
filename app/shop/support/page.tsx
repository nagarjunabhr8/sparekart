"use client";

import { useMemo, useRef, useState } from "react";
import {
  Search,
  MapPin,
  RotateCcw,
  Settings,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  ChevronDown,
  Phone,
  Mail,
  Upload,
  Check,
  X,
} from "lucide-react";

type TopicId =
  | "orders"
  | "returns"
  | "compatibility"
  | "payment"
  | "authenticity";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  id: TopicId;
  title: string;
  items: FaqItem[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "orders",
    title: "Order Tracking",
    items: [
      {
        q: "How do I track my order?",
        a: "Go to My Orders, open the order, and tap Track Order to see live status updates from dispatch to delivery.",
      },
      {
        q: "My order is delayed, what should I do?",
        a: "Most delays clear within 24-48 hours. If your order is past its delivery window, contact support with your order number and we'll chase the courier for you.",
      },
      {
        q: "Can I change my delivery address after placing the order?",
        a: "Address changes are possible while the order is still Pending. Once it ships, the address is locked — reach out to support immediately and we'll try to reroute it.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    items: [
      {
        q: "What is the return policy?",
        a: "Parts can be returned within 30 days if unused and in their original packaging.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 5-7 business days to your original payment method once the return is received and inspected.",
      },
      {
        q: "Can I return a used part?",
        a: "No. Used parts cannot be returned — only defective parts are eligible for return or replacement.",
      },
    ],
  },
  {
    id: "compatibility",
    title: "Part Compatibility",
    items: [
      {
        q: "How do I know if a part fits my vehicle?",
        a: "Use the vehicle filter on the home page (brand, model, year, fuel) to see only parts compatible with your vehicle.",
      },
      {
        q: "What if the part doesn't fit?",
        a: "If a part doesn't fit, you get a free return plus an exchange for the correct component at no extra cost.",
      },
      {
        q: "Do you have OEM parts?",
        a: "Yes. All parts on SpareKart are OEM-verified for guaranteed compatibility and quality.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, Credit/Debit Card, Net Banking, and Cash on Delivery (COD).",
      },
      {
        q: "Is COD available for all pincodes?",
        a: "COD is available for select cities only. Availability is shown at checkout based on your delivery pincode.",
      },
      {
        q: "My payment failed but the amount was deducted.",
        a: "Deducted amounts for failed payments are auto-reversed within a few days. If it doesn't reflect, contact support within 24 hours with your transaction reference.",
      },
    ],
  },
  {
    id: "authenticity",
    title: "Authenticity",
    items: [
      {
        q: "Are all parts genuine?",
        a: "Every part is OEM-verified and carries an authenticity badge along with verified seller information.",
      },
      {
        q: "How can I verify a part's authenticity?",
        a: "Genuine parts include manufacturer holograms and serials. Check the authenticity badge and seller details on the product page.",
      },
      {
        q: "What if I receive a counterfeit part?",
        a: "Report it within 48 hours of delivery for a full refund and investigation. We take counterfeit reports seriously.",
      },
    ],
  },
];

const TOPIC_CARDS: {
  id: TopicId | "contact";
  label: string;
  icon: typeof MapPin;
}[] = [
  { id: "orders", label: "Track My Order", icon: MapPin },
  { id: "returns", label: "Return & Refunds", icon: RotateCcw },
  { id: "compatibility", label: "Part Compatibility", icon: Settings },
  { id: "payment", label: "Payment Issues", icon: CreditCard },
  { id: "authenticity", label: "Authenticity Queries", icon: ShieldCheck },
  { id: "contact", label: "Contact an Expert", icon: MessageCircle },
];

const CATEGORY_OPTIONS = [
  "Order Tracking",
  "Returns & Refunds",
  "Part Compatibility",
  "Payment",
  "Authenticity",
  "Other",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShopSupportPage() {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null);
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);

  const faqRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Searching looks across all topics; otherwise honour the selected topic.
  const effectiveTopic = query.trim() ? null : selectedTopic;

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_GROUPS.filter((g) => !effectiveTopic || g.id === effectiveTopic)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            !q ||
            it.q.toLowerCase().includes(q) ||
            it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, effectiveTopic]);

  const toggleKey = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleTopicCard = (id: TopicId | "contact") => {
    if (id === "contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSelectedTopic(id);
    setQuery("");
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#EA580C] to-[#3730A3] text-white">
        <div className="container-app py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            How can we help you?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              data-testid="shop-support-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-neutral-900 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
          <p className="text-white/80 mt-4 text-sm">Or browse by topic below</p>
        </div>
      </section>

      <div className="container-app py-12 space-y-14">
        {/* TOPIC CARDS */}
        <section>
          <div
            data-testid="shop-support-topics"
            className="grid grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {TOPIC_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  data-testid={`shop-support-topic-${card.id}`}
                  key={card.id}
                  onClick={() => handleTopicCard(card.id)}
                  className="card p-6 flex flex-col items-center text-center gap-3 hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <span className="w-12 h-12 rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center">
                    <Icon size={24} />
                  </span>
                  <span className="font-semibold text-neutral-900 text-sm">
                    {card.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>
            {selectedTopic && !query && (
              <button
                data-testid="shop-support-clear-topic"
                onClick={() => setSelectedTopic(null)}
                className="text-sm text-[#EA580C] font-medium hover:underline"
              >
                Show all topics
              </button>
            )}
          </div>

          {visibleGroups.length === 0 ? (
            <p
              data-testid="shop-support-no-results"
              className="text-neutral-500 text-sm"
            >
              No answers matched &quot;{query}&quot;. Try the contact form below.
            </p>
          ) : (
            <div className="space-y-8">
              {visibleGroups.map((group) => (
                <div key={group.id} data-testid={`shop-support-faq-${group.id}`}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((item, idx) => {
                      const key = `${group.id}-${idx}`;
                      const open = openKeys.has(key);
                      return (
                        <div
                          key={key}
                          className="card overflow-hidden"
                        >
                          <button
                            data-testid={`shop-support-q-${key}`}
                            onClick={() => toggleKey(key)}
                            className="w-full flex items-center justify-between gap-4 p-4 text-left"
                          >
                            <span className="font-medium text-neutral-900">
                              {item.q}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-neutral-500 flex-shrink-0 transition-transform ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {open && (
                            <div className="px-4 pb-4 text-sm text-neutral-600">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT OPTIONS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 text-center">
            <Phone size={24} className="mx-auto text-[#EA580C] mb-3" />
            <p className="font-semibold text-neutral-900">Call Us</p>
            <a
              href="tel:+919876543210"
              className="text-[#EA580C] font-medium block mt-1"
            >
              +91 9876543210
            </a>
            <p className="text-xs text-neutral-500 mt-1">Mon–Sat, 9AM–6PM</p>
          </div>
          <div className="card p-6 text-center">
            <Mail size={24} className="mx-auto text-[#EA580C] mb-3" />
            <p className="font-semibold text-neutral-900">Email</p>
            <a
              href="mailto:support@sparekart.com"
              className="text-[#EA580C] font-medium block mt-1"
            >
              support@sparekart.com
            </a>
            <p className="text-xs text-neutral-500 mt-1">Reply within 24 hours</p>
          </div>
          <div className="card p-6 text-center">
            <MessageCircle size={24} className="mx-auto text-[#EA580C] mb-3" />
            <p className="font-semibold text-neutral-900">Live Chat</p>
            <button
              data-testid="shop-support-live-chat"
              onClick={() => setChatOpen(true)}
              className="mt-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
            >
              Chat with a mechanic expert
            </button>
          </div>
        </section>

        {/* CONTACT / TICKET FORM */}
        <section ref={contactRef} className="scroll-mt-24">
          <ContactForm />
        </section>
      </div>

      {/* LIVE CHAT WIDGET */}
      {chatOpen && (
        <div
          data-testid="shop-support-chat-widget"
          className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
        >
          <div className="bg-[#EA580C] text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm flex items-center gap-2">
              <MessageCircle size={16} /> Mechanic Expert
            </span>
            <button onClick={() => setChatOpen(false)} aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="bg-neutral-100 rounded-lg p-3 text-neutral-700">
              Hi! 👋 You&apos;re connected to a SpareKart mechanic expert. How can
              I help with your vehicle today?
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
              <button className="px-3 py-2 bg-[#EA580C] text-white rounded-lg text-sm font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!emailRegex.test(email)) e.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit number";
    if (!category) e.category = "Please select a category";
    if (!message.trim()) e.message = "Please describe your issue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        data-testid="shop-support-success"
        className="card p-8 text-center max-w-2xl mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={36} className="text-green-600" strokeWidth={3} />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          Ticket submitted
        </h3>
        <p className="text-neutral-600">We&apos;ll respond within 24 hours.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setPhone("");
            setOrderNumber("");
            setCategory("");
            setMessage("");
            setFileName("");
          }}
          className="mt-6 text-[#EA580C] font-semibold hover:underline text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
      hasError ? "border-red-500 bg-red-50" : "border-neutral-300"
    }`;

  return (
    <div className="card p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-neutral-900 mb-1">
        Still need help?
      </h2>
      <p className="text-neutral-600 text-sm mb-6">
        Raise a ticket and our team will get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              data-testid="shop-support-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((er) => ({ ...er, name: "" }));
              }}
              className={inputClass(!!errors.name)}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              data-testid="shop-support-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((er) => ({ ...er, email: "" }));
              }}
              className={inputClass(!!errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-neutral-300 rounded-l-lg bg-neutral-100 text-neutral-600 text-sm">
                +91
              </span>
              <input
                data-testid="shop-support-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setErrors((er) => ({ ...er, phone: "" }));
                }}
                className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] ${
                  errors.phone ? "border-red-500 bg-red-50" : "border-neutral-300"
                }`}
                placeholder="10-digit number"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Order Number{" "}
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              data-testid="shop-support-order"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className={inputClass(false)}
              placeholder="#SK-2024-001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            data-testid="shop-support-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors((er) => ({ ...er, category: "" }));
            }}
            className={inputClass(!!errors.category)}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            data-testid="shop-support-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrors((er) => ({ ...er, message: "" }));
            }}
            rows={4}
            className={inputClass(!!errors.message)}
            placeholder="Describe your issue..."
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Attach an image{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 text-sm text-neutral-600">
            <Upload size={16} />
            {fileName || "Upload an image of the part/issue"}
            <input
              data-testid="shop-support-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        <button
          data-testid="shop-support-submit"
          type="submit"
          className="w-full py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
