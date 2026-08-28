"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  subscribeCart,
  getCartSnapshot,
  getCartServerSnapshot,
  writeCart,
  cartTotal,
  cartCount,
  setPendingOrder,
} from "@/lib/cart";
import { findProduct } from "@/lib/products";
import { PAYMENT_CHOICES, type PaymentTypeKey } from "@/lib/payment-methods";
import { ShopHeader, ShopFooter, NoCashAlert } from "@/components/Brand";

/**
 * ② ご注文の確認
 *
 * 改修前は /cart と /checkout に分かれていたが、アーティファクトでは1画面。
 * 無人店では画面数がそのまま離脱に効くため、確認と決済開始をここに統合した。
 */
export default function CartPage() {
  const router = useRouter();

  // localStorage を唯一の真とし、書き換えたら購読側が再描画される
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const [paymentType, setPaymentType] = useState<PaymentTypeKey>("CARD_PRESENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const removeItem = (id: string) => {
    writeCart(items.filter((i) => i.id !== id));
  };

  const total = cartTotal(items);
  const count = cartCount(items);

  const startPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // 明細も送る。無人店では手元に伝票が残らないので、
      // Square の Order に品名が載っていないと後から何が売れたか追えない。
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, items }),
      });
      const data = await res.json();

      if (!res.ok || !data.orderId) {
        setError(data.error ?? "注文の作成に失敗しました。もう一度お試しください。");
        return;
      }

      const terminalRes = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          amount: total,
          paymentType,
        }),
      });
      const terminalData = await terminalRes.json();

      if (!terminalRes.ok) {
        setError(
          terminalRes.status === 503
            ? "レジの決済端末が準備中です。しばらくしてからお試しください。"
            : "決済端末とうまく通信できませんでした。もう一度お試しください。"
        );
        return;
      }

      // Terminal API は「端末に金額を表示させた」だけ。決済はこれから端末で行われる。
      // カートは決済確定まで消さない。
      const checkoutId = terminalData.checkoutId;

      if (!checkoutId) {
        setError("決済端末の応答が取得できませんでした。もう一度お試しください。");
        return;
      }

      // 完了画面に「お支払い方法」「注文番号」を出すため控えておく
      setPendingOrder({
        method:
          PAYMENT_CHOICES.find((c) => c.key === paymentType)?.label ?? "",
        orderId: data.orderId,
      });

      router.push(
        `/payment?checkoutId=${encodeURIComponent(checkoutId)}&amount=${total}`
      );
    } catch {
      setError("通信エラーが発生しました。電波状況をご確認ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dg-wrap">
      <ShopHeader backHref="/" />

      <h1 className="dg-h1">ご注文の確認</h1>

      {items.length === 0 ? (
        <>
          <p className="dg-body dg-mt-3">
            カートに鉢がありません。棚の値札のQRコードを読み取ってください。
          </p>
          <div className="dg-mt-3">
            <Link href="/" className="dg-btn-outline">
              商品一覧を見る
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="dg-mt-2" style={{ borderTop: "1px solid var(--rule)" }}>
            {items.map((item) => {
              const product = findProduct(item.id);
              return (
                <div key={item.id} className="dg-item">
                  <span className="thumb" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="var(--moss-soft)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M39 94h42l-5 20H44z" />
                      <path d="M60 94V50" />
                      <path d="M60 72c-15-2-24-13-24-26 13 0 24 9 24 26z" />
                      <path d="M60 62c15-2 24-13 24-26-13 0-24 9-24 26z" />
                    </svg>
                  </span>

                  <span className="body">
                    <b>{item.name}</b>
                    {product && (
                      <span className="spec">
                        {product.potSize.replace(/（.*）/, "")}鉢・高さ{product.height}
                      </span>
                    )}
                    <span className="qty">
                      数量 {item.quantity}
                      <button type="button" onClick={() => removeItem(item.id)}>
                        取り消す
                      </button>
                    </span>
                  </span>

                  <span className="price">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="dg-mt-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13.5, color: "var(--ink-3)" }}>小計（{count}点）</span>
              <span className="dg-plain">¥{total.toLocaleString()}</span>
            </div>
            <div className="dg-hr" style={{ margin: 0, background: "var(--rule-3)" }} />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: ".04em" }}>お支払い金額</span>
              <p className="dg-price lg">
                <span className="n">¥{total.toLocaleString()}</span>
                <span className="tax">税込</span>
              </p>
            </div>
          </div>

          <div className="dg-mt-3">
            <NoCashAlert />
          </div>

          {/* Square Terminal API が paymentType を要求するため、ここで区分だけ選んでいただく */}
          <div className="dg-mt-3">
            <p className="dg-eyebrow">お支払い方法</p>

            <div className="dg-choice">
              {PAYMENT_CHOICES.map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => setPaymentType(choice.key)}
                  className={paymentType === choice.key ? "on" : ""}
                  aria-pressed={paymentType === choice.key}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p
              className="dg-mt-2"
              style={{ margin: 0, fontSize: 12, lineHeight: 1.85, color: "var(--warn)" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="dg-mt-4">
            <button
              type="button"
              onClick={startPayment}
              disabled={loading || total === 0}
              className="dg-btn"
            >
              {loading ? "端末に送信しています…" : "お支払いへ進む"}
            </button>
          </div>

          <p className="dg-caption">
            この先、レジ横の端末にカードやスマートフォンを
            <br />
            かざしていただきます。
          </p>
        </>
      )}

      <ShopFooter />
    </main>
  );
}
