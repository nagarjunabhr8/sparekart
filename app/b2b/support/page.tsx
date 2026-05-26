"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, Plus, ChevronDown, Loader } from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  lastUpdated: string;
  description: string;
}

interface AccountManager {
  name: string;
  email: string;
  phone: string;
  photo: string;
}

const faqs = [
  {
    question: "What is the minimum order quantity for bulk pricing?",
    answer: "Our minimum order quantity for bulk pricing starts at ₹10,000. Larger orders qualify for better discounts.",
  },
  {
    question: "How long does delivery take for bulk orders?",
    answer: "Bulk orders are typically delivered within 3-5 business days. Express delivery is available for urgent orders.",
  },
  {
    question: "Can I return parts if they don't fit my vehicle?",
    answer: "Yes, we offer 30-day returns on genuine parts. Items must be unused and in original packaging.",
  },
  {
    question: "What payment methods do you accept for B2B?",
    answer: "We accept bank transfers, credit cards, and offer credit terms (15-30 days) for verified Professional and Enterprise customers.",
  },
  {
    question: "Do you provide invoices with GST details?",
    answer: "Yes, all invoices include detailed GST breakdowns. We support both GSTIN-based invoices for registered businesses.",
  },
  {
    question: "How can I track my order status?",
    answer: "You can track all orders in your account dashboard. We also send SMS and email notifications at every stage.",
  },
  {
    question: "Is there a dedicated account manager for my business?",
    answer: "Professional and Enterprise tier customers get a dedicated account manager. You can contact them directly via phone or email.",
  },
  {
    question: "What happens if a part is out of stock?",
    answer: "We notify you immediately and offer similar alternatives or can place a special order from our suppliers.",
  },
  {
    question: "Can I get technical support for part compatibility?",
    answer: "Yes, our technical team can help verify part compatibility with your vehicles. Contact your account manager.",
  },
  {
    question: "What is your warranty policy on parts?",
    answer: "All parts come with manufacturer warranties. We also provide extended warranty options for critical components.",
  },
];

const accountManagers: AccountManager[] = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@sparekart.com",
    phone: "+91 9876543210",
    photo: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@sparekart.com",
    phone: "+91 9876543211",
    photo: "https://i.pravatar.cc/150?img=2",
  },
];

export default function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"tickets" | "new" | "faq">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    category: "General",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTickets();
    const pollInterval = setInterval(fetchTickets, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/support/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets([newTicket, ...tickets]);
        setFormData({ category: "General", subject: "", description: "" });
        setSuccessMessage("Ticket created successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setActiveTab("tickets");
      } else {
        alert("Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Error creating ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "Resolved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Closed":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container-app py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Support Center</h1>
          <p className="text-lg text-neutral-600">
            Get help with orders, billing, and technical questions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "tickets"
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "new"
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            New Ticket
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "faq"
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Open Tickets</h2>
              <button
                onClick={() => setActiveTab("new")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                New Ticket
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            ) : tickets.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-bold text-neutral-900">Ticket ID</th>
                      <th className="text-left py-4 px-4 font-bold text-neutral-900">Subject</th>
                      <th className="text-left py-4 px-4 font-bold text-neutral-900">Category</th>
                      <th className="text-left py-4 px-4 font-bold text-neutral-900">Status</th>
                      <th className="text-left py-4 px-4 font-bold text-neutral-900">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="py-4 px-4 font-mono text-sm text-primary font-semibold">
                          {ticket.id}
                        </td>
                        <td className="py-4 px-4 text-neutral-900">{ticket.subject}</td>
                        <td className="py-4 px-4 text-neutral-600">{ticket.category}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-600 text-sm">
                          {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <MessageSquare size={48} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-600 mb-4">No open tickets</p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Your First Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* New Ticket Tab */}
        {activeTab === "new" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Create Support Ticket</h2>
            <form onSubmit={handleSubmitTicket} className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option>General</option>
                  <option>Order Issue</option>
                  <option>Billing</option>
                  <option>Technical Support</option>
                  <option>Returns & Refunds</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Provide detailed information about your issue..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader size={18} className="animate-spin" />}
                {submitting ? "Creating Ticket..." : "Create Ticket"}
              </button>
            </form>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-neutral-900 text-left">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition-transform text-neutral-600 ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <p className="text-neutral-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Manager Section */}
        {isAuthenticated && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Your Account Manager</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {accountManagers.map((manager) => (
                <div
                  key={manager.name}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={manager.photo}
                      alt={manager.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-neutral-900">{manager.name}</h3>
                      <p className="text-sm text-neutral-600">Account Manager</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a
                      href={`mailto:${manager.email}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors"
                    >
                      <Mail size={18} />
                      <span className="break-all">{manager.email}</span>
                    </a>
                    <a
                      href={`tel:${manager.phone}`}
                      className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors"
                    >
                      <Phone size={18} />
                      {manager.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Chat Widget Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-40 flex-shrink-0">
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
}
