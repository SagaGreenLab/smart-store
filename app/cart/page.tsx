"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);
  const decreaseQuantity = (id: number) => {
  const updatedCart = cartItems
    .map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};
const increaseQuantity = (id: number) => {
  const updatedCart = cartItems.map((item) =>
    item.id === id
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold">
          🛒 カート
        </h1>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="mb-4 rounded-2xl border p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {item.name}
            </h2>

           <div className="mt-2 flex items-center gap-3">
  <button
    type="button"
    onClick={() => decreaseQuantity(item.id)}
    className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
  >
    −
  </button>

  <span>数量：{item.quantity}</span>

  <button
    type="button"
    onClick={() => increaseQuantity(item.id)}
    className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
  >
    ＋
  </button>
</div>

            <p className="mt-2 text-lg">
              ¥{item.price.toLocaleString()}
            </p>
          </div>
        ))}

        <div className="mt-6 rounded-2xl bg-gray-100 p-5">
          <p className="text-xl font-bold">
            合計：¥{total.toLocaleString()}
          </p>
        </div>

        {total > 0 ? (
  <a
    href="/checkout"
    className="mt-6 block rounded-xl bg-green-600 px-4 py-4 text-center font-semibold text-white hover:bg-green-700"
  >
    レジへ進む
  </a>
) : (
  <button
  onClick={() => router.push("/checkout")}
  disabled={total === 0}
  className="mt-6 w-full rounded bg-green-600 px-4 py-3 text-white disabled:bg-gray-400"
>
  レジへ進む
</button>
)}
      </div>
    </main>
  );
}