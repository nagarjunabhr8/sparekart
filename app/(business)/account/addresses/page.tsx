"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Check } from "lucide-react";

const addressSchema = z.object({
  label: z.string().min(2, "Label required"),
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: string;
}

export default function DeliveryAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Office",
      fullName: "Rajesh Kumar",
      phone: "9876543210",
      address: "123 Industrial Park, Tech Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    },
    {
      id: "2",
      label: "Warehouse",
      fullName: "Rajesh Kumar",
      phone: "9876543211",
      address: "456 Warehouse Complex",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      isDefault: false,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingId) {
        setAddresses(addresses.map((a) => (a.id === editingId ? { ...data, id: editingId } : a)));
        toast.success("Address updated successfully!");
      } else {
        const newAddress: Address = {
          ...data,
          id: Date.now().toString(),
        };
        setAddresses([...addresses, newAddress]);
        toast.success("Address added successfully!");
      }

      reset();
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    Object.entries(address).forEach(([key, value]) => {
      if (key !== "id") {
        setValue(key as keyof AddressFormData, value);
      }
    });
    setEditingId(address.id);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address deleted");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div data-testid="account-addresses-page" className="space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Label (e.g., Office, Warehouse)
                </label>
                <input
                  {...register("label")}
                  type="text"
                  placeholder="Office"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.label && <p className="text-red-600 text-sm mt-1">{errors.label.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="9876543210"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Pincode
                </label>
                <input
                  {...register("pincode")}
                  type="text"
                  placeholder="560001"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.pincode && (
                  <p className="text-red-600 text-sm mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Street Address
              </label>
              <input
                {...register("address")}
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                <input
                  {...register("state")}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  {...register("isDefault")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-medium text-neutral-700">Set as default address</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
              >
                <Check size={18} />
                {isLoading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
              </button>
            </div>
          </form>
        </div>

        {/* Addresses List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Saved Addresses</h3>
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">{address.label}</h4>
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">{address.fullName}</p>
                  <p className="text-sm text-neutral-600">{address.phone}</p>
                  <p className="text-sm text-neutral-600 mt-2">{address.address}</p>
                  <p className="text-sm text-neutral-600">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-neutral-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
