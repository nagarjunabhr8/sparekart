"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, MessageCircle, Phone, MessageSquare, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ticketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be a valid 10-digit number"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z.string().min(4, "Vehicle year is required"),
  partNeeded: z.string().min(2, "Part description is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

type ContactTab = "chat" | "call" | "whatsapp" | "ticket";

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<ContactTab>("ticket");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmitTicket = async (data: TicketFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit ticket");
      }

      toast.success("Ticket submitted successfully! Our team will contact you soon.");
      reset();
      setActiveTab("ticket");
    } catch (error) {
      toast.error("Failed to submit ticket. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = "Hi, I need help finding spare parts for my vehicle. Can you assist?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:+919876543210";
  };

  const handleLiveChat = () => {
    if ((window as any).$crisp) {
      (window as any).$crisp.push(["do", "chat:open"]);
    } else {
      toast.success("Live chat will be available soon!");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                  <Dialog.Title className="text-2xl font-bold text-neutral-900">
                    Talk to a Parts Expert
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Contact Options Tabs */}
                  <div className="flex gap-3 mb-6 flex-wrap">
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "chat"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-700 hover:bg-slate-200"
                      }`}
                    >
                      <MessageCircle size={18} />
                      Live Chat
                    </button>
                    <button
                      onClick={() => setActiveTab("call")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "call"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-700 hover:bg-slate-200"
                      }`}
                    >
                      <Phone size={18} />
                      Call Us
                    </button>
                    <button
                      onClick={() => setActiveTab("whatsapp")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "whatsapp"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-700 hover:bg-slate-200"
                      }`}
                    >
                      <MessageSquare size={18} />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => setActiveTab("ticket")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "ticket"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-700 hover:bg-slate-200"
                      }`}
                    >
                      <Ticket size={18} />
                      Raise Ticket
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-64">
                    {/* Live Chat */}
                    {activeTab === "chat" && (
                      <div className="space-y-4">
                        <p className="text-neutral-600">
                          Connect with our expert team via live chat. Get instant support from our parts specialists.
                        </p>
                        <button
                          onClick={handleLiveChat}
                          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
                        >
                          Start Live Chat
                        </button>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                          <p className="font-semibold mb-1">Business Hours</p>
                          <p>Mon – Sat, 6:00 AM – 10:00 PM IST</p>
                        </div>
                      </div>
                    )}

                    {/* Call Us */}
                    {activeTab === "call" && (
                      <div className="space-y-4">
                        <p className="text-neutral-600">
                          Speak directly with our parts experts. We're available during business hours to help you find exactly what you need.
                        </p>
                        <button
                          onClick={handleCall}
                          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone size={20} />
                          Call +91 9876543210
                        </button>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                          <p className="font-semibold mb-1">Business Hours</p>
                          <p>Mon – Sat, 6:00 AM – 10:00 PM IST</p>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {activeTab === "whatsapp" && (
                      <div className="space-y-4">
                        <p className="text-neutral-600">
                          Chat with us on WhatsApp for quick assistance. Share images and get instant recommendations.
                        </p>
                        <button
                          onClick={handleWhatsApp}
                          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquare size={20} />
                          Open WhatsApp
                        </button>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                          <p className="font-semibold mb-1">Business Hours</p>
                          <p>Mon – Sat, 6:00 AM – 10:00 PM IST</p>
                        </div>
                      </div>
                    )}

                    {/* Raise Ticket Form */}
                    {activeTab === "ticket" && (
                      <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Full Name
                            </label>
                            <input
                              {...register("name")}
                              type="text"
                              placeholder="Your name"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.name && (
                              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              {...register("phone")}
                              type="tel"
                              placeholder="10-digit number"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Vehicle Make
                            </label>
                            <input
                              {...register("vehicleMake")}
                              type="text"
                              placeholder="e.g., Maruti, Honda"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.vehicleMake && (
                              <p className="text-red-600 text-sm mt-1">{errors.vehicleMake.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Vehicle Model
                            </label>
                            <input
                              {...register("vehicleModel")}
                              type="text"
                              placeholder="e.g., Swift, Civic"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.vehicleModel && (
                              <p className="text-red-600 text-sm mt-1">{errors.vehicleModel.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Vehicle Year
                            </label>
                            <input
                              {...register("vehicleYear")}
                              type="text"
                              placeholder="e.g., 2022"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.vehicleYear && (
                              <p className="text-red-600 text-sm mt-1">{errors.vehicleYear.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Part Needed
                            </label>
                            <input
                              {...register("partNeeded")}
                              type="text"
                              placeholder="e.g., Brake Pads"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.partNeeded && (
                              <p className="text-red-600 text-sm mt-1">{errors.partNeeded.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Additional Details
                          </label>
                          <textarea
                            {...register("message")}
                            placeholder="Describe your requirement..."
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                          {errors.message && (
                            <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Ticket"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
