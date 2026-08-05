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
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-white px-3.5 py-1.5 text-[#98a1b3] shadow-[0_4px_14px_rgba(27,51,92,0.08)]">
            商品
          </span>

          <span className="text-[#98a1b3]">→</span>

          <span className="rounded-full bg-[#4fa8f0] px-3.5 py-1.5 text-white">
            カート
          </span>

          <span className="text-[#98a1b3]">→</span>

          <span className="rounded-full bg-white px-3.5 py-1.5 text-[#98a1b3] shadow-[0_4px_14px_rgba(27,51,92,0.08)]">
            お支払い
          </span>
        </div>

        <h1 className="mb-4 px-1 text-xl font-extrabold text-[#1b2333]">カート</h1>

        {cartItems.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center text-sm text-[#98a1b3] shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
            カートに商品がありません
          </div>
        )}

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="mb-3 flex items-center justify-between rounded-3xl bg-white p-5 shadow-[0_8px_28px_rgba(27,51,92,0.08)]"
          >
            <div>
              <h2 className="text-[15px] font-bold text-[#1b2333]">
                {item.name}
              </h2>

              <p className="mt-0.5 text-xs text-[#98a1b3]">
                ¥{item.price.toLocaleString()} × {item.quantity}
              </p>

              <p className="mt-1 text-lg font-extrabold tabular-nums text-[#1b2333]">
                ¥{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.id)}
                aria-label="数量を減らす"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f4f6fa] text-lg font-bold text-[#6b7486] transition-colors hover:bg-[#e3e8f0]"
              >
                −
              </button>

              <span className="min-w-6 text-center text-base font-bold tabular-nums text-[#1b2333]">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(item.id)}
                aria-label="数量を増やす"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#4fa8f0] text-lg font-bold text-white transition-colors hover:bg-[#2f93e6]"
              >
                ＋
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 rounded-3xl bg-white p-6 shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
          <p className="text-sm text-[#6b7486]">合計</p>

          <p className="mt-1 flex items-baseline gap-1 text-[#1b2333]">
            <span className="text-xl font-bold">¥</span>
            <span className="text-4xl font-extrabold tabular-nums">
              {total.toLocaleString()}
            </span>
          </p>

          <p className="mt-1 text-xs text-[#98a1b3]">
            税込 ・ {cartItems.reduce((sum, item) => sum + item.quantity, 0)}点
          </p>
        </div>

        {total > 0 ? (
          <a
            href="/checkout"
            className="mt-6 block rounded-2xl bg-[#4fa8f0] px-4 py-4 text-center text-base font-bold text-white transition-colors hover:bg-[#2f93e6]"
          >
            レジへ進む
          </a>
        ) : (
          <button
            onClick={() => router.push("/checkout")}
            disabled={total === 0}
            className="mt-6 w-full cursor-not-allowed rounded-2xl bg-[#b9c4d6] px-4 py-4 text-base font-bold text-white"
          >
            レジへ進む
          </button>
        )}

        <a
          href="/"
          className="mt-3 block w-full rounded-2xl py-3 text-center text-sm font-semibold text-[#6b7486] hover:text-[#1b2333]"
        >
          買い物を続ける
        </a>
      </div>
    </main>
  );
}