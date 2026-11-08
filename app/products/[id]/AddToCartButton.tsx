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
  stock,
}: {
  id: string;
  name: string;
  price: number;
  stock: number;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  const max = Math.max(1, Math.min(9, stock));

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
      <div className="dg-card">
        <div className="dg-qty">
          <span className="label">
            数量
            <small>Quantity</small>
          </span>

          <span className="ctrl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="数量を1つ減らす"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="num">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(max, q + 1))}
              disabled={quantity >= max}
              aria-label="数量を1つ増やす"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </span>
        </div>

        <p className="dg-note">棚に のこり{stock}点</p>
      </div>

      <div className="dg-mt-2">
        <button type="button" onClick={handleClick} disabled={busy} className="dg-btn">
          {busy ? "カートへ移動しています…" : "カートに入れる"}
          {!busy && <small>Add to cart</small>}
        </button>
      </div>

      <div className="dg-mt-2">
        <NoCashAlert />
      </div>
    </>
  );
}
