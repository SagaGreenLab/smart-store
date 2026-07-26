"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function AddToCartButton({ id, name, price }: Props) {
  const router = useRouter();

  const addToCart = () => {
    const saved = localStorage.getItem("cart");
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];

    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  return (
    <button
      type="button"
      onClick={addToCart}
      className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white"
    >
      カートに追加
    </button>
  );
}
