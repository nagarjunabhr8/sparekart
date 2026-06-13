"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Star,
  ShieldCheck,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ChevronRight,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { brandModels } from "@/lib/shopData";
import { discountPct, type ShopProduct } from "@/lib/shopProducts";
import BrowseProductCard from "@/components/shop/BrowseProductCard";

type Tab = "description" | "specifications" | "compatibility" | "reviews";

const TABS: { id: Tab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "compatibility", label: "Compatibility" },
  { id: "reviews", label: "Reviews" },
];

export default function ProductDetailClient({
  product,
  related,
}: {
  product: ShopProduct;
  related: ShopProduct[];
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const discount = discountPct(product);
  const units = product.inStock ? (product.reviews % 45) + 6 : 0;

  const gallery = [product.image, product.image, product.image, product.image];
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Sibling models from the same brand for the compatibility list.
  const siblings = (brandModels[product.make] ?? [])
    .filter((m) => m !== product.model)
    .slice(0, 2);
  const compatTags = [
    `${product.make} ${product.model} ${product.year}–2024`,
    ...siblings.map((m) => `${product.make} ${m}`),
  ];

  const cartItem = {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    seller: product.seller,
    category: product.category,
  };

  const addToCart = () => {
    addItem({ ...cartItem, qty });
    toast.success(`Added ${qty} to cart`);
  };

  const buyNow = () => {
    addItem({ ...cartItem, qty });
    router.push("/shop/checkout");
  };

  const goToReviews = () => {
    setTab("reviews");
    tabsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container-app py-6">
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-neutral-500 mb-6 flex-wrap">
        <Link href="/shop" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop/products" className="hover:text-primary">Browse Parts</Link>
        <ChevronRight size={14} />
        <Link
          href={`/shop/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-neutral-800 font-medium">{product.name}</span>
      </nav>

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="card overflow-hidden mb-3">
            <img
              src={gallery[mainImage]}
              alt={product.name}
              className="w-full h-80 md:h-[420px] object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                data-testid={`product-thumb-${i}`}
                onClick={() => setMainImage(i)}
                className={`card overflow-hidden h-20 ${
                  mainImage === i ? "ring-2 ring-primary" : ""
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="badge-authentic inline-block mb-3">✓ Authentic</span>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {product.name}
          </h1>

          <button
            onClick={goToReviews}
            className="flex items-center gap-1 mb-4 group"
          >
            <span className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-accent text-accent"
                      : "text-neutral-300"
                  }
                />
              ))}
            </span>
            <span className="text-sm text-primary group-hover:underline">
              ({product.reviews} reviews)
            </span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-success bg-green-50 px-2 py-0.5 rounded">
                  -{discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-neutral-600 mb-2 flex items-center gap-1.5">
            By <span className="font-semibold text-neutral-800">{product.seller}</span>
            <ShieldCheck size={15} className="text-success" />
            <span className="text-xs text-success">Verified Seller</span>
          </p>

          <p
            className={`text-sm font-semibold mb-4 ${
              product.inStock ? "text-success" : "text-warning"
            }`}
          >
            {product.inStock
              ? `✓ In Stock — ${units} units left`
              : "Out of Stock"}
          </p>

          {/* Compatible vehicles */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-neutral-700 mb-2">
              Compatible vehicles
            </p>
            <div className="flex flex-wrap gap-2">
              {compatTags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-neutral-700">Quantity</span>
            <div className="flex items-center border border-neutral-300 rounded-lg">
              <button
                data-testid="product-qty-decrement"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="p-2 text-neutral-600 hover:text-primary disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span data-testid="product-qty" className="px-4 text-sm font-semibold">
                {qty}
              </span>
              <button
                data-testid="product-qty-increment"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                disabled={qty >= 10}
                className="p-2 text-neutral-600 hover:text-primary disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              data-testid="product-add-to-cart"
              onClick={addToCart}
              disabled={!product.inStock}
              className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
            <button
              data-testid="product-buy-now"
              onClick={buyNow}
              disabled={!product.inStock}
              className="flex-1 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery + returns */}
          <div className="space-y-2 text-sm text-neutral-600 border-t border-neutral-200 pt-4">
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              Estimated delivery: 24–48 hours to Hyderabad
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw size={16} className="text-primary" />
              30-day hassle-free returns
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div ref={tabsRef} className="scroll-mt-24 mb-12">
        <div className="flex gap-1 border-b border-neutral-200 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              data-testid={`product-tab-${t.id}`}
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "description" && (
          <div className="prose-sm max-w-3xl text-neutral-700 space-y-3">
            <p>
              The {product.name} is a genuine, OEM-verified component engineered
              for reliable performance and a precise fit. Manufactured by{" "}
              {product.brand}, it meets original equipment standards for
              durability and safety.
            </p>
            <p>
              Designed for {product.make} {product.model} ({product.fuel}) and
              compatible variants, this part is quality-checked and ships with a
              manufacturer warranty. Sold and fulfilled by {product.seller}.
            </p>
          </div>
        )}

        {tab === "specifications" && (
          <div className="max-w-2xl">
            <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
              <tbody className="divide-y divide-neutral-200">
                {[
                  ["Brand", product.brand],
                  ["Part Number", `SK-${product.id.padStart(4, "0")}-${product.category.replace(/\s/g, "").slice(0, 3).toUpperCase()}`],
                  ["Material", "High-grade alloy / composite"],
                  ["Weight", "0.8 kg"],
                  ["Dimensions", "20 × 12 × 8 cm"],
                  ["Warranty", "12 months manufacturer warranty"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="bg-neutral-50 font-medium text-neutral-700 px-4 py-3 w-1/3">
                      {k}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "compatibility" && (
          <div className="max-w-2xl overflow-x-auto">
            <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-neutral-50 text-left text-neutral-600">
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Year Range</th>
                  <th className="px-4 py-3 font-semibold">Fuel Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[product.model, ...siblings].map((m, i) => (
                  <tr key={m}>
                    <td className="px-4 py-3 text-neutral-800">{product.make}</td>
                    <td className="px-4 py-3 text-neutral-800">{m}</td>
                    <td className="px-4 py-3 text-neutral-800">
                      {i === 0 ? `${product.year}–2024` : "2018–2024"}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">{product.fuel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "reviews" && (
          <ReviewsTab product={product} />
        )}
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Related Products
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {related.map((p) => (
              <div key={p.id} className="w-64 flex-shrink-0">
                <BrowseProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ product }: { product: ShopProduct }) {
  const total = product.reviews;
  // Deterministic histogram derived from the review count.
  const dist = [
    Math.round(total * 0.7),
    Math.round(total * 0.18),
    Math.round(total * 0.07),
    Math.round(total * 0.03),
    Math.round(total * 0.02),
  ];
  const max = Math.max(...dist, 1);

  const reviews = [
    {
      name: "Rahul Sharma",
      date: "12 May 2025",
      rating: 5,
      comment:
        "Perfect fit and genuine part. Installation was smooth and it works exactly as expected. Highly recommend this seller.",
    },
    {
      name: "Anita Desai",
      date: "28 Apr 2025",
      rating: 4,
      comment:
        "Good quality and delivered on time. Packaging could be better but the part itself is authentic.",
    },
    {
      name: "Vikram Patel",
      date: "9 Apr 2025",
      rating: 5,
      comment:
        "Exactly what I needed for my vehicle. Great price compared to the local market. Will buy again.",
    },
  ];

  return (
    <div className="max-w-3xl">
      {/* Histogram */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="text-center sm:w-40">
          <p className="text-4xl font-bold text-neutral-900">{product.rating}</p>
          <div className="flex justify-center my-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(product.rating)
                    ? "fill-accent text-accent"
                    : "text-neutral-300"
                }
              />
            ))}
          </div>
          <p className="text-sm text-neutral-500">{total} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {dist.map((count, i) => {
            const stars = 5 - i;
            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-neutral-600">{stars}★</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-neutral-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.name} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {r.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <span className="font-semibold text-neutral-900 text-sm">
                  {r.name}
                </span>
                <Check size={14} className="text-success" />
              </div>
              <span className="text-xs text-neutral-500">{r.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < r.rating ? "fill-accent text-accent" : "text-neutral-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-neutral-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
