"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { commitOrder } from "@/lib/cart";
import { PAYMENT_BRAND_TILES } from "@/lib/payment-methods";
import { ShopHeader, ShopFooter } from "@/components/Brand";

type CheckoutStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "CANCEL_REQUESTED"
  | "CANCELED"
  | "COMPLETED"
  | "UNKNOWN";

const POLL_INTERVAL_MS = 2000;
/** TerminalCheckout の deadline は既定・最大とも5分。それに合わせる */
const MAX_POLL_COUNT = 150;

/** ③ 決済中 */
function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkoutId = searchParams.get("checkoutId");
  const amount = Number(searchParams.get("amount") ?? 0);

  const [status, setStatus] = useState<CheckoutStatus>("PENDING");
  const stoppedRef = useRef(false);

  const goError = useCallback(
    (reason: string) => {
      router.replace(`/payment-error?reason=${encodeURIComponent(reason)}`);
    },
    [router]
  );

  const finish = useCallback(() => {
    commitOrder(amount);
    router.replace("/complete");
  }, [amount, router]);

  useEffect(() => {
    if (!checkoutId) router.replace("/cart");
  }, [checkoutId, router]);

  useEffect(() => {
    if (!checkoutId) return;

    stoppedRef.current = false;
    let count = 0;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (stoppedRef.current) return;

      try {
        const res = await fetch(
          `/api/terminal/status?checkoutId=${encodeURIComponent(checkoutId)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (res.ok && data.success) {
          const next: CheckoutStatus = data.status;
          setStatus(next);

          if (next === "COMPLETED") {
            stoppedRef.current = true;
            finish();
            return;
          }

          if (next === "CANCELED") {
            stoppedRef.current = true;
            goError("canceled");
            return;
          }
        }
      } catch {
        // 一時的な通信エラーではポーリングを止めない
      }

      count += 1;

      if (count >= MAX_POLL_COUNT) {
        stoppedRef.current = true;
        goError("timeout");
        return;
      }

      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      stoppedRef.current = true;
      clearTimeout(timer);
    };
  }, [checkoutId, finish, goError]);

  const cancelCheckout = async () => {
    if (!checkoutId) return;

    stoppedRef.current = true;

    try {
      await fetch("/api/terminal/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutId }),
      });
    } catch {
      // 通信に失敗しても端末側は deadline で自動キャンセルされる
    } finally {
      router.replace("/cart");
    }
  };

  return (
    <main className="dg-wrap">
      <ShopHeader />

      <p className="dg-eyebrow" style={{ textAlign: "center" }}>
        お支払い金額
      </p>
      <p className="dg-price xl center dg-mt-1">
        <span className="n">¥{amount.toLocaleString()}</span>
        <span className="tax">税込</span>
      </p>

      <div className="dg-mt-3" style={{ display: "grid", placeItems: "center" }}>
        <svg width="132" height="132" viewBox="0 0 120 120" fill="none" stroke="var(--moss)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="26" y="46" width="52" height="58" rx="6" />
          <path d="M26 62h52" />
          <rect x="36" y="74" width="32" height="4" rx="2" stroke="var(--moss-line)" />
          <rect x="36" y="84" width="20" height="4" rx="2" stroke="var(--moss-line)" />
          <rect x="56" y="14" width="44" height="28" rx="4" transform="rotate(-12 56 14)" />
          <path d="M88 44a10 10 0 0 1 0 14" stroke="var(--moss-soft)" />
          <path d="M96 38a19 19 0 0 1 0 26" stroke="var(--moss-soft)" />
        </svg>
      </div>

      <h1 className="dg-h1 dg-mt-3" style={{ textAlign: "center", fontSize: 25, lineHeight: 1.5 }}>
        決済端末にタッチ
        <br />
        してください
      </h1>

      <p className="dg-body center dg-mt-2" style={{ fontSize: 13.5 }}>
        カード・スマートフォン・交通系ICを
        <br />
        端末の読み取り面にかざしてください。
      </p>

      <p className="dg-waiting" aria-live="polite">
        <i />
        <i />
        <i />
        <span>{status === "IN_PROGRESS" ? "お支払いを処理しています" : "読み取りを待っています"}</span>
      </p>

      <div className="dg-mt-4" style={{ width: "100%" }}>
        <div className="dg-brand-row">
          <span className="dg-eyebrow" style={{ whiteSpace: "nowrap" }}>ご利用いただけるお支払い</span>
          <span className="line" />
        </div>

        <div className="dg-brands">
          {PAYMENT_BRAND_TILES.map((tile) => (
            <span key={tile.key} className="dg-brand">
              {tile.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile.img} alt="" aria-hidden="true" />
              ) : (
                tile.label
              )}
            </span>
          ))}
        </div>

        <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--ink-5)" }}>
          ※「PiTaPa」はご利用いただけません。
        </p>
      </div>

      <div className="dg-mt-2">
        <button type="button" onClick={cancelCheckout} className="dg-btn-text">
          お支払いをやめる
        </button>
      </div>

      <ShopFooter />
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="dg-wrap">
          <p className="dg-body center" style={{ padding: "80px 0" }}>
            読み込んでいます…
          </p>
        </main>
      }
    >
      <PaymentInner />
    </Suspense>
  );
}
