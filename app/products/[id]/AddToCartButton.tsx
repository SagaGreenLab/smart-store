"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { NoCashAlert } from "@/components/Brand";

/**
 * 数量ステッパー ＋ 画面下に固定したカート導線（① 商品ページ）
 *
 * ボタンを本文の下に置くと、QRを読んだ直後の画面には入らない。
 * 「どう操作すればいいか分からない」という声が実際に出たため、
 * スクロール位置に関係なく押せるよう画面下に固定している。
 * 金額も並べて、いくらの何を買うのかが常に見えている状態にする。
 */
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
        <NoCashAlert />
      </div>

      {/* 画面下に固定。スクロールしても消えない */}
      <div className="dg-dock">
        <div className="dock-in">
          <p className="dg-price sm" aria-label={`合計 ${price * quantity}円 税込`}>
            <span className="n">¥{(price * quantity).toLocaleString()}</span>
            <span className="tax">税込</span>
          </p>

          <button
            type="button"
            onClick={handleClick}
            disabled={busy}
            className="dg-btn-mini wide"
          >
            {busy ? "移動しています…" : "カートに入れる"}
            {!busy && <small>Add to cart</small>}
          </button>
        </div>
      </div>
    </>
  );
}
