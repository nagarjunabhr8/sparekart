"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cartContext";

interface AddToCartButtonProps {
  item: Omit<CartItem, "qty">;
  disabled?: boolean;
  testId?: string;
}

export default function AddToCartButton({
  item,
  disabled = false,
  testId,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(item.productId);

  const handleClick = (e: React.MouseEvent) => {
    // Cards are often wrapped in a <Link>; keep the click on the button.
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (inCart) {
      router.push("/shop/cart");
      return;
    }

    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (disabled) {
    return (
      <button
        data-testid={testId}
        disabled
        className="w-full text-sm flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-200 text-neutral-500 cursor-not-allowed font-semibold"
      >
        Out of Stock
      </button>
    );
  }

  let label = "Add to Cart";
  let icon = <ShoppingCart size={16} />;
  let className =
    "w-full btn-primary bg-primary hover:bg-orange-700 text-sm flex items-center justify-center gap-2 py-2";

  if (justAdded) {
    label = "Added";
    icon = <Check size={16} />;
    className =
      "w-full text-sm flex items-center justify-center gap-2 py-2 rounded-lg bg-success text-white font-semibold transition-colors";
  } else if (inCart) {
    label = "Go to Cart";
    icon = null as unknown as React.ReactElement;
    className =
      "w-full text-sm flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary text-white hover:bg-blue-900 font-semibold transition-colors";
  }

  return (
    <button
      data-testid={testId}
      data-in-cart={inCart}
      onClick={handleClick}
      className={className}
    >
      {justAdded ? (
        <>
          {icon}
          {label} ✓
        </>
      ) : inCart ? (
        <>
          {label}
          <ArrowRight size={16} />
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}
