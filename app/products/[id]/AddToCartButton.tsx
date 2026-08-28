"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { NoCashAlert } from "@/components/Brand";

/** 数量ステッパー ＋ カートに入れる（① 商品ページの下部） */
export default function AddToCartButton({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    if (busy) return;

    setBusy(true);
    for (let i = 0; i < quantity; i += 1) {
      addToCart({ id, name, price });
    }
    router.push("/cart");
  };

  return (
    <>
      <div className="dg-qty">
        <span className="label">数量</span>

        <span className="ctrl">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="数量を1つ減らす"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="num">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9, q + 1))}
            aria-label="数量を1つ増やす"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </span>
      </div>

      <div className="dg-mt-3">
        <button type="button" onClick={handleClick} disabled={busy} className="dg-btn">
          {busy ? "カートへ移動しています…" : "カートに入れる"}
        </button>
      </div>

      <div className="dg-mt-2">
        <NoCashAlert />
      </div>
    </>
  );
}
