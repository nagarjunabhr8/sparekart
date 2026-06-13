"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  MapPin,
  Car,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Plus,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";
import {
  brandModels,
  CAR_BRANDS,
  FUEL_TYPES,
  VEHICLE_YEARS,
  VEHICLE_TYPES,
  INDIAN_STATES,
} from "@/lib/shopData";

type TabKey = "profile" | "addresses" | "vehicles" | "password";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  type: "Home" | "Work" | "Other";
  isDefault?: boolean;
}

interface DetailedVehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
}

const ADDRESSES_KEY = "shop_addresses";
const VEHICLES_KEY = "shop_vehicles";

const NAV_ITEMS: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "addresses", label: "Saved Addresses", icon: MapPin },
  { key: "vehicles", label: "My Vehicles", icon: Car },
  { key: "password", label: "Change Password", icon: Lock },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function ShopProfilePage() {
  const router = useRouter();
  const { user, hydrated, updateUser, logout } = useShopAuth();
  const [tab, setTab] = useState<TabKey>("profile");
  const [signOutOpen, setSignOutOpen] = useState(false);

  // Protect the route — bounce unauthenticated visitors to login.
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/shop/login?redirect=/shop/profile");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const confirmSignOut = () => {
    logout();
    router.push("/shop/login");
  };

  return (
    <div className="mx-auto px-4 pt-8 pb-16" style={{ maxWidth: 1100 }}>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="md:w-60 md:flex-shrink-0">
          <div className="md:sticky md:top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold flex-shrink-0">
                {initials || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-neutral-500 truncate">
                  {user.email || `+91 ${user.phone}`}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;
                return (
                  <button
                    data-testid={`shop-profile-nav-${item.key}`}
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border-l-2 transition-colors ${
                      active
                        ? "border-[#EA580C] text-[#EA580C] bg-orange-50"
                        : "border-transparent text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              <div className="my-2 border-t border-neutral-200" />

              <button
                data-testid="shop-profile-nav-signout"
                onClick={() => setSignOutOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border-l-2 border-transparent text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 min-w-0">
          {tab === "profile" && <ProfileTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "vehicles" && <VehiclesTab />}
          {tab === "password" && <PasswordTab />}
        </section>
      </div>

      {/* SIGN OUT MODAL */}
      {signOutOpen && (
        <Modal onClose={() => setSignOutOpen(false)}>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Are you sure you want to sign out?
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            You&apos;ll need to sign in again to access your account.
          </p>
          <div className="flex justify-end gap-3">
            <button
              data-testid="shop-profile-signout-cancel"
              onClick={() => setSignOutOpen(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
            >
              Cancel
            </button>
            <button
              data-testid="shop-profile-signout-confirm"
              onClick={confirmSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </Modal>
      )}
    </div>
  );

  // ---------------- TAB: MY PROFILE ----------------
  function ProfileTab() {
    const [name, setName] = useState(user!.name);
    const [email, setEmail] = useState(user!.email ?? "");
    const [city, setCity] = useState(user!.city ?? "");
    const [stateVal, setStateVal] = useState(user!.state ?? "");
    const [pincode, setPincode] = useState(user!.pincode ?? "");
    const [vehicles, setVehicles] = useState<string[]>(user!.vehicles ?? []);
    const [nameError, setNameError] = useState("");

    const toggleVehicle = (v: string) =>
      setVehicles((prev) =>
        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
      );

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!/^[A-Za-z\s]{3,}$/.test(name.trim())) {
        setNameError("Enter at least 3 letters (letters and spaces only)");
        return;
      }
      setNameError("");
      updateUser({
        name: name.trim(),
        email: email || undefined,
        city,
        state: stateVal,
        pincode,
        vehicles,
      });
      toast.success("✓ Profile updated successfully");
    };

    return (
      <Card>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Profile</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label required>Full Name</Label>
            <input
              data-testid="shop-profile-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              className={inputClass(!!nameError)}
              placeholder="Your full name"
            />
            {nameError && (
              <p className="text-red-600 text-sm mt-1">{nameError}</p>
            )}
          </div>

          {(user!.email !== undefined || email) && (
            <div>
              <Label>Email</Label>
              <input
                data-testid="shop-profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(false)}
                placeholder="your@email.com"
              />
            </div>
          )}

          <div>
            <Label>Mobile</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-neutral-300 rounded-l-lg bg-neutral-100 text-neutral-600 text-sm">
                +91
              </span>
              <input
                data-testid="shop-profile-phone"
                value={user!.phone}
                readOnly
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-r-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <input
                data-testid="shop-profile-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass(false)}
                placeholder="Your city"
              />
            </div>
            <div>
              <Label>State</Label>
              <select
                data-testid="shop-profile-state"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Pincode</Label>
            <input
              data-testid="shop-profile-pincode"
              value={pincode}
              maxLength={6}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className={inputClass(false)}
              placeholder="6-digit pincode"
            />
          </div>

          <div>
            <Label>My Vehicles</Label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((v) => {
                const selected = vehicles.includes(v);
                return (
                  <button
                    data-testid={`shop-profile-vehicle-${v.toLowerCase()}`}
                    key={v}
                    type="button"
                    onClick={() => toggleVehicle(v)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? "bg-[#EA580C] text-white"
                        : "bg-white text-neutral-600 border border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            data-testid="shop-profile-save"
            type="submit"
            className="px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </Card>
    );
  }

  // ---------------- TAB: SAVED ADDRESSES ----------------
  function AddressesTab() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
      setAddresses(readJSON<Address[]>(ADDRESSES_KEY, []));
    }, []);

    const persist = (next: Address[]) => {
      setAddresses(next);
      try {
        localStorage.setItem(ADDRESSES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    };

    const blank: Address = {
      id: "",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pin: "",
      type: "Home",
    };
    const [form, setForm] = useState<Address>(blank);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const openAdd = () => {
      setForm(blank);
      setEditingId(null);
      setErrors({});
      setShowForm(true);
    };
    const openEdit = (a: Address) => {
      setForm(a);
      setEditingId(a.id);
      setErrors({});
      setShowForm(true);
    };

    const validate = () => {
      const e: Record<string, string> = {};
      if (!form.name.trim()) e.name = "Required";
      if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
      if (!form.line1.trim()) e.line1 = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.state) e.state = "Required";
      if (!/^\d{6}$/.test(form.pin)) e.pin = "Enter a 6-digit PIN";
      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const save = () => {
      if (!validate()) return;
      if (editingId) {
        persist(addresses.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)));
        toast.success("✓ Address updated");
      } else {
        const newAddr: Address = {
          ...form,
          id: Date.now().toString(),
          isDefault: addresses.length === 0,
        };
        persist([...addresses, newAddr]);
        toast.success("✓ Address added");
      }
      setShowForm(false);
    };

    const remove = (id: string) => {
      persist(addresses.filter((a) => a.id !== id));
      toast.success("Address removed");
    };

    const setDefault = (id: string) => {
      persist(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success("✓ Default address set");
    };

    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Saved Addresses</h1>
          {!showForm && (
            <button
              data-testid="shop-profile-add-address"
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg hover:bg-orange-700 font-medium text-sm"
            >
              <Plus size={16} />
              Add New Address
            </button>
          )}
        </div>

        {addresses.length === 0 && !showForm && (
          <p className="text-neutral-500 text-sm">No saved addresses yet.</p>
        )}

        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              data-testid={`shop-profile-address-${a.id}`}
              key={a.id}
              className="border border-neutral-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">{a.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {a.type}
                    </span>
                    {a.isDefault && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">{a.phone}</p>
                  <p className="text-sm text-neutral-600">
                    {[a.line1, a.line2, a.city, a.state, a.pin]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                <button
                  onClick={() => openEdit(a)}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-[#EA580C]"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} /> Delete
                </button>
                {!a.isDefault && (
                  <button
                    onClick={() => setDefault(a.id)}
                    className="inline-flex items-center gap-1 text-neutral-600 hover:text-[#EA580C]"
                  >
                    <Check size={14} /> Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mt-6 border-t border-neutral-200 pt-6 space-y-4">
            <h3 className="font-semibold text-neutral-900">
              {editingId ? "Edit Address" : "New Address"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AddrInput label="Full Name" required value={form.name} error={errors.name}
                onChange={(v) => setForm({ ...form, name: v })} />
              <AddrInput label="Phone" required value={form.phone} error={errors.phone}
                onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 10) })} />
            </div>
            <AddrInput label="Address Line 1" required value={form.line1} error={errors.line1}
              onChange={(v) => setForm({ ...form, line1: v })} />
            <AddrInput label="Address Line 2" value={form.line2 ?? ""}
              onChange={(v) => setForm({ ...form, line2: v })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AddrInput label="City" required value={form.city} error={errors.city}
                onChange={(v) => setForm({ ...form, city: v })} />
              <div>
                <Label required>State</Label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={inputClass(!!errors.state)}
                >
                  <option value="">Select</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
              <AddrInput label="PIN" required value={form.pin} error={errors.pin}
                onChange={(v) => setForm({ ...form, pin: v.replace(/\D/g, "").slice(0, 6) })} />
            </div>
            <div>
              <Label required>Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Address["type"] })}
                className={inputClass(false)}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                data-testid="shop-profile-save-address"
                onClick={save}
                className="px-5 py-2.5 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700"
              >
                Save Address
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // ---------------- TAB: MY VEHICLES ----------------
  function VehiclesTab() {
    const [vehicles, setVehicles] = useState<DetailedVehicle[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [fuel, setFuel] = useState("");

    useEffect(() => {
      setVehicles(readJSON<DetailedVehicle[]>(VEHICLES_KEY, []));
    }, []);

    const persist = (next: DetailedVehicle[]) => {
      setVehicles(next);
      try {
        localStorage.setItem(VEHICLES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    };

    const add = () => {
      if (!brand || !model || !year || !fuel) {
        toast.error("Please fill all vehicle details");
        return;
      }
      persist([
        ...vehicles,
        { id: Date.now().toString(), brand, model, year, fuel },
      ]);
      toast.success("✓ Vehicle added");
      setBrand("");
      setModel("");
      setYear("");
      setFuel("");
      setModalOpen(false);
    };

    const remove = (id: string) => {
      persist(vehicles.filter((v) => v.id !== id));
      toast.success("Vehicle removed");
    };

    const tags = user!.vehicles ?? [];

    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">My Vehicles</h1>
          <button
            data-testid="shop-profile-add-vehicle"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg hover:bg-orange-700 font-medium text-sm"
          >
            <Plus size={16} />
            Add Vehicle
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {vehicles.length === 0 ? (
          <p className="text-neutral-500 text-sm">No vehicles added yet.</p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                data-testid={`shop-profile-vehicle-card-${v.id}`}
                key={v.id}
                className="border border-neutral-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Car size={18} className="text-[#EA580C]" />
                  <span className="font-semibold">{v.brand}</span>
                  <span className="text-neutral-400">|</span>
                  <span>{v.model}</span>
                  <span className="text-neutral-400">|</span>
                  <span>{v.year}</span>
                  <span className="text-neutral-400">|</span>
                  <span>{v.fuel}</span>
                </div>
                <button
                  onClick={() => remove(v.id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Add Vehicle</h3>
            <div className="space-y-4">
              <div>
                <Label required>Brand</Label>
                <select
                  data-testid="shop-profile-vehicle-brand"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                  }}
                  className={inputClass(false)}
                >
                  <option value="">Select brand</option>
                  {CAR_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label required>Model</Label>
                <select
                  data-testid="shop-profile-vehicle-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className={`${inputClass(false)} disabled:bg-neutral-100 disabled:cursor-not-allowed`}
                >
                  <option value="">{brand ? "Select model" : "Select brand first"}</option>
                  {(brandModels[brand] ?? []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Year</Label>
                  <select
                    data-testid="shop-profile-vehicle-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={inputClass(false)}
                  >
                    <option value="">Year</option>
                    {VEHICLE_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label required>Fuel Type</Label>
                  <select
                    data-testid="shop-profile-vehicle-fuel"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className={inputClass(false)}
                  >
                    <option value="">Fuel</option>
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  data-testid="shop-profile-vehicle-add-confirm"
                  onClick={add}
                  className="px-5 py-2.5 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700"
                >
                  Add Vehicle
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Card>
    );
  }

  // ---------------- TAB: CHANGE PASSWORD ----------------
  function PasswordTab() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [error, setError] = useState("");

    const rules = {
      length: next.length >= 8,
      upper: /[A-Z]/.test(next),
      number: /[0-9]/.test(next),
      special: /[!@#$%]/.test(next),
    };
    const strength = Object.values(rules).filter(Boolean).length;
    const meta = [
      { label: "", color: "" },
      { label: "Weak", color: "bg-red-500" },
      { label: "Fair", color: "bg-amber-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ][strength];

    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!current) {
        setError("Enter your current password");
        return;
      }
      if (strength < 4) {
        setError("New password does not meet all requirements");
        return;
      }
      if (next !== confirm) {
        setError("New passwords do not match");
        return;
      }
      setError("");
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("✓ Password updated");
    };

    return (
      <Card>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Change Password</h1>
        <form onSubmit={submit} className="space-y-4 max-w-md">
          <div>
            <Label required>Current Password</Label>
            <div className="relative">
              <input
                data-testid="shop-profile-current-password"
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => {
                  setCurrent(e.target.value);
                  setError("");
                }}
                className={`${inputClass(false)} pr-11`}
              />
              <PwToggle shown={showCurrent} onClick={() => setShowCurrent((s) => !s)} />
            </div>
          </div>

          <div>
            <Label required>New Password</Label>
            <div className="relative">
              <input
                data-testid="shop-profile-new-password"
                type={showNext ? "text" : "password"}
                value={next}
                onChange={(e) => {
                  setNext(e.target.value);
                  setError("");
                }}
                className={`${inputClass(false)} pr-11`}
              />
              <PwToggle shown={showNext} onClick={() => setShowNext((s) => !s)} />
            </div>
            {next.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < strength ? meta.color : "bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                {meta.label && (
                  <p className="text-xs text-neutral-600 mt-1">{meta.label}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label required>Confirm New Password</Label>
            <input
              data-testid="shop-profile-confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              className={inputClass(false)}
            />
            {confirm.length > 0 && (
              <p
                className={`text-sm mt-1 ${
                  next === confirm ? "text-green-600" : "text-red-600"
                }`}
              >
                {next === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            data-testid="shop-profile-update-password"
            type="submit"
            className="px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </Card>
    );
  }
}

// ---------------- Shared presentational helpers ----------------
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8">
      {children}
    </div>
  );
}

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
    hasError ? "border-red-500 bg-red-50" : "border-neutral-300"
  }`;
}

function AddrInput({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(!!error)}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

function PwToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
      aria-label={shown ? "Hide password" : "Show password"}
    >
      {shown ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
