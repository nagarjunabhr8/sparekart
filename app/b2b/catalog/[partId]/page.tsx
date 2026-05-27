"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Share2, ShoppingCart, Star, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/stores/cartStore";
import BulkOrderForm from "@/components/B2B/BulkOrderForm";

// Mock product data
const getMockProduct = (partId: string) => ({
  id: partId,
  name: "Air Filter Element Premium Quality",
  brand: "Bosch",
  partNumber: "BOS-AF-2024-001",
  mrp: 1500,
  b2bPrice: 1275,
  discount: 15,
  b2bTierDiscount: 15,
  genuine: true,
  rating: 4.5,
  reviewCount: 128,
  category: "Engine Parts",
  description: "Premium quality air filter element designed for optimal engine performance and fuel efficiency. Features advanced filtration technology to capture dust and particles.",
  images: [
    "⚙️",
    "🔧",
    "⚡",
    "🛡️",
    "✨",
  ],
  stock: {
    quantity: 47,
    status: "in-stock" as const,
    expectedDate: null,
  },
  compatibility: [
    { make: "Maruti", model: "Swift", years: "2018–2024", engineVariants: ["1.2L Petrol", "1.3L Diesel"] },
    { make: "Maruti", model: "Dzire", years: "2019–2024", engineVariants: ["1.2L Petrol", "1.2L Diesel"] },
    { make: "Hyundai", model: "i20", years: "2020–2024", engineVariants: ["1.2L Petrol"] },
  ],
  specs: {
    material: "Synthetic Polymer",
    warranty: "12 Months",
    weight: "250g",
    oemNumber: "OEM-AF-2024-001",
    filterType: "Dry Paper",
  },
  relatedParts: [
    {
      id: "part-2",
      name: "Cabin Air Filter",
      brand: "Mann",
      price: 890,
      b2bPrice: 756,
      image: "🌬️",
      discount: 15,
      b2bTierDiscount: 15,
      rating: 4.3,
    },
    {
      id: "part-3",
      name: "Oil Filter Premium",
      brand: "NGK",
      price: 650,
      b2bPrice: 553,
      image: "🛢️",
      discount: 15,
      b2bTierDiscount: 15,
      rating: 4.4,
    },
    {
      id: "part-4",
      name: "Spark Plugs Set (4)",
      brand: "Denso",
      price: 1200,
      b2bPrice: 1020,
      image: "⚡",
      discount: 15,
      b2bTierDiscount: 15,
      rating: 4.6,
    },
    {
      id: "part-5",
      name: "Engine Oil 5L",
      brand: "Castrol",
      price: 2500,
      b2bPrice: 2125,
      image: "🔧",
      discount: 15,
      b2bTierDiscount: 15,
      rating: 4.2,
    },
  ],
  frequentlyBoughtTogether: [
    { id: "part-2", name: "Cabin Air Filter", price: 756, image: "🌬️" },
    { id: "part-3", name: "Oil Filter Premium", price: 553, image: "🛢️" },
  ],
  reviews: [
    {
      author: "Rajesh Kumar",
      rating: 5,
      title: "Excellent quality",
      text: "Great product, fast delivery. Highly recommended for business use.",
      date: "2 weeks ago",
    },
    {
      author: "Priya Sharma",
      rating: 4,
      title: "Good value for money",
      text: "Good quality filter at reasonable B2B price. Service was excellent.",
      date: "1 month ago",
    },
    {
      author: "Amit Patel",
      rating: 5,
      title: "Perfect fit",
      text: "Perfect compatibility with my vehicle list. Great support.",
      date: "1 month ago",
    },
    {
      author: "Sunita Singh",
      rating: 4,
      title: "Reliable product",
      text: "Using this for 6 months now, no issues. Genuine product confirmed.",
      date: "2 months ago",
    },
    {
      author: "Vikram Desai",
      rating: 5,
      title: "Best B2B pricing",
      text: "Unbeatable pricing for genuine parts. Bulk ordering is very convenient.",
      date: "2 months ago",
    },
  ],
});

export default function PartDetailPage() {
  const params = useParams();
  const partId = params.partId as string;
  const product = getMockProduct(partId);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const { addItem } = useCartStore();
  const finalPrice = product.b2bPrice * quantity;
  const originalTotal = product.mrp * quantity;
  const totalSavings = originalTotal - finalPrice;

  const handleAddToCart = () => {
    const cartItem = {
      id: partId,
      name: product.name,
      brand: product.brand,
      price: product.b2bPrice,
      mrp: product.mrp,
      quantity,
      image: product.images[0],
      stock: product.stock.quantity,
      b2bTierDiscount: product.b2bTierDiscount,
    };
    addItem(cartItem);
    toast.success(`Added ${quantity} ${quantity === 1 ? "unit" : "units"} of ${product.name} to cart`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/b2b/catalog/${partId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const ratingCounts = [
    { stars: 5, count: 72 },
    { stars: 4, count: 38 },
    { stars: 3, count: 15 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];
  const totalRatings = ratingCounts.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/b2b" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/b2b/catalog" className="text-primary hover:underline">
              Catalog
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="#" className="text-primary hover:underline">
              {product.category}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: Image Gallery */}
            <div>
              <div className="relative bg-slate-100 rounded-lg aspect-square flex items-center justify-center mb-4 overflow-hidden group">
                <div className="text-8xl">{product.images[selectedImage]}</div>
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-slate-100 shadow-md transition-colors"
                  title="Share"
                >
                  <Share2 size={18} className="text-neutral-600" />
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 left-4 p-2 bg-white rounded-full hover:bg-slate-100 shadow-md transition-colors"
                  title="Add to wishlist"
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-400"}
                  />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-3xl transition-all ${
                      selectedImage === idx
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-slate-300"
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div>
              {/* Brand & Part Number */}
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-2">
                {product.brand} • {product.partNumber}
              </p>

              {/* Name */}
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  {product.rating}
                </span>
                <span className="text-sm text-neutral-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Compatibility Tags */}
              <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Compatible With</p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((compat, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700"
                    >
                      {compat.make} {compat.model}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Widget */}
              <div className="mb-4 pb-4 border-b border-slate-200 bg-green-50 p-3 rounded-lg border border-green-200">
                {product.stock.status === "in-stock" ? (
                  <p className="text-sm font-medium text-green-700">
                    ✓ In Stock ({product.stock.quantity} units available)
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <Calendar size={14} />
                    Expected: {product.stock.expectedDate}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-red-700">
                      ₹{product.b2bPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg text-neutral-500 line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-semibold text-green-700">
                      {product.discount}% off
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                      -{product.b2bTierDiscount}% B2B Tier
                    </span>
                    {product.genuine && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        ✓ Genuine
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-900 mb-3">Quantity (1–50)</p>
                  <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(50, quantity + 1))}
                      className="px-3 py-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 p-3 rounded-lg mb-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal ({quantity} unit{quantity > 1 ? "s" : ""})</span>
                    <span className="font-semibold">₹{finalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Your B2B Savings</span>
                    <span className="font-semibold">₹{totalSavings.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="w-full py-3 bg-slate-200 text-neutral-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Bulk Order Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Specs Table */}
      <div className="bg-white border-b border-slate-200 mt-8">
        <div className="container-app py-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Quick Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">
                  {key === "oemNumber"
                    ? "OEM Number"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <p className="font-semibold text-neutral-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white">
        <div className="container-app py-8">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
            {[
              { id: "description", label: "Description" },
              { id: "compatibility", label: "Compatibility" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary mb-1">15%</p>
                  <p className="text-xs text-neutral-600">B2B Discount</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700 mb-1">✓</p>
                  <p className="text-xs text-neutral-600">Genuine Parts</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700 mb-1">12M</p>
                  <p className="text-xs text-neutral-600">Warranty</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "compatibility" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-3 font-semibold text-neutral-900">Make</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Model</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Years</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Engine Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {product.compatibility.map((compat, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3 text-neutral-700">{compat.make}</td>
                      <td className="p-3 text-neutral-700">{compat.model}</td>
                      <td className="p-3 text-neutral-700">{compat.years}</td>
                      <td className="p-3 text-neutral-700">
                        {compat.engineVariants.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="space-y-4">
                <h3 className="font-bold text-neutral-900">Overall Rating</h3>
                <div className="space-y-3">
                  {ratingCounts.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-neutral-700">
                        {item.stars} {Array.from({ length: item.stars }).map((_, i) => (
                          <Star key={i} size={12} className="inline fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: `${(item.count / totalRatings) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm text-neutral-600">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="md:col-span-2 space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-neutral-900">{review.author}</p>
                        <p className="text-xs text-neutral-500">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-neutral-900 mb-1">
                      {review.title}
                    </p>
                    <p className="text-sm text-neutral-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Parts */}
      <div className="bg-slate-50 border-b border-slate-200 py-8 mt-8">
        <div className="container-app">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Related Parts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {product.relatedParts.map((part) => (
              <Link key={part.id} href={`/b2b/catalog/${part.id}`}>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
                  <div className="bg-slate-100 aspect-square flex items-center justify-center text-6xl">
                    {part.image}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-neutral-500 uppercase font-medium mb-1">
                      {part.brand}
                    </p>
                    <h3 className="font-semibold text-neutral-900 line-clamp-2 text-sm mb-2">
                      {part.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-red-700">
                        ₹{part.b2bPrice}
                      </span>
                      <span className="text-xs text-neutral-500 line-through">
                        ₹{part.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(part.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold">({part.rating})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="bg-white py-8 border-b border-slate-200">
        <div className="container-app">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">
            Frequently Bought Together
          </h2>
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Main Product */}
              <div className="flex items-center justify-center gap-3 md:justify-end">
                <div className="text-5xl">{product.images[0]}</div>
                <div>
                  <p className="text-sm text-neutral-600">This Item</p>
                  <p className="font-semibold text-neutral-900">
                    ₹{product.b2bPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Plus Signs */}
              <div className="flex justify-center">
                <span className="text-2xl font-bold text-neutral-400">+</span>
              </div>

              {/* Bundle */}
              <div className="space-y-3">
                {product.frequentlyBoughtTogether.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{item.image}</span>
                      <p className="text-sm text-neutral-700">{item.name}</p>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle Price */}
            <div className="mt-6 pt-6 border-t border-slate-300 flex justify-between items-center">
              <div>
                <p className="text-neutral-600 text-sm">Bundle Total</p>
                <p className="text-2xl font-bold text-red-700">
                  ₹{(
                    product.b2bPrice +
                    product.frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors">
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Order Form */}
      <BulkOrderForm
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        userPlan="Professional"
        userGST="18AABCU1234F1Z5"
      />
    </div>
  );
}
