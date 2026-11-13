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
import {
  ShopHeader,
  ShopFooter,
  NoCashAlert,
  Eyebrow,
  PlantIcon,
} from "@/components/Brand";

/**
 * サーバーが JSON を返せなかったときも落とさずに読む。
 *
 * APIが想定外に落ちると本文が空や HTML になる。そのまま res.json() すると
 * 例外になり、原因と無関係な「通信エラー」を客に見せてしまう。
 */
async function readJson(res: Response): Promise<{ [k: string]: unknown; error?: string; orderId?: string; checkoutId?: string }> {
  try {
    return await res.json();
  } catch {
    return {
      error: `サーバーから応答がありませんでした（${res.status}）。もう一度お試しください。`,
    };
  }
}

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

      // 送るのは「どの鉢を何個」だけ。単価と合計はサーバーが商品マスタから引き直す。
      // 金額を送ってしまうと、書き換えて1円で決済できてしまう。
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await readJson(res);

      if (!res.ok || !data.orderId) {
        setError(data.error ?? "注文の作成に失敗しました。もう一度お試しください。");
        return;
      }

      const terminalRes = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          paymentType,
        }),
      });
      const terminalData = await readJson(terminalRes);

      if (!terminalRes.ok) {
        setError(
          terminalRes.status === 503
            ? "レジの決済端末が準備中です。しばらくしてからお試しください。"
            : terminalData.error ??
              "決済端末とうまく通信できませんでした。もう一度お試しください。"
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

      <div className="dg-mt-1">
        <h1 className="dg-h1">ご注文の確認</h1>
        <p className="dg-en">Your order</p>
      </div>

      {items.length === 0 ? (
        <>
          <section className="dg-card dg-mt-3">
            <p className="dg-body">
              カートに鉢がありません。
              <br />
              棚のラベルにあるQRコードを読み取ってください。
            </p>
            <p className="dg-en">Scan the QR code on a pot to start.</p>
          </section>
          <div className="dg-mt-2">
            <Link href="/" className="dg-btn-outline">
              鉢を見る
              <small>See the plants</small>
            </Link>
          </div>
        </>
      ) : (
        <>
          <section className="dg-card dg-mt-3">
            {items.map((item) => {
              const product = findProduct(item.id);
              return (
                <div key={item.id} className="dg-item">
                  <span className="thumb">
                    {product?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt="" aria-hidden="true" />
                    ) : (
                      <PlantIcon size={26} />
                    )}
                  </span>

                  <span className="body">
                    <b>{item.name}</b>
                    {product && (
                      <span className="spec">
                        {product.potSize.replace(/（.*）/, "")}鉢・高さ{product.height}
                      </span>
                    )}
                    <span className="qty">
                      <span>数量 {item.quantity}</span>
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
          </section>

          <section className="dg-card">
            <div className="dg-sum">
              <span className="k">小計（{count}点）</span>
              <span className="v">¥{total.toLocaleString()}</span>
            </div>

            <hr className="dg-hr tight" />

            <div className="dg-total">
              <span className="k">
                お支払い金額
                <small>Total</small>
              </span>
              <p className="dg-price lg">
                <span className="n">¥{total.toLocaleString()}</span>
                <span className="tax">税込</span>
              </p>
            </div>
          </section>

          <div className="dg-mt-2">
            <NoCashAlert />
          </div>

          {/*
            Square Terminal API が paymentType を要求するため、ここで区分だけ選んでいただく。
            分類名だけ並べると自分の持ち物がどれに入るか分からないので、
            各選択肢の中に実際のブランドロゴを出して、読まずに見つけられるようにする。
          */}
          <section className="dg-card dg-mt-2">
            <Eyebrow ja="お支払いに使うもの" en="WHAT WILL YOU USE?" />
            <p className="dg-hint">お手持ちのものを選んでください</p>

            <div className="dg-choice">
              {PAYMENT_CHOICES.map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => setPaymentType(choice.key)}
                  className={paymentType === choice.key ? "on" : ""}
                  aria-pressed={paymentType === choice.key}
                >
                  <span className="dot" aria-hidden="true" />
                  <span className="t">
                    {choice.label}
                    <small>{choice.sub}</small>

                    {/* ロゴが読み上げから落ちないよう、画像には必ずブランド名を入れる */}
                    <span className="logos">
                      {choice.brands.map((brand) =>
                        brand.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={brand.key} src={brand.img} alt={brand.name} />
                        ) : (
                          <i key={brand.key}>{brand.name}</i>
                        )
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {error && (
            <p
              className="dg-mt-2"
              style={{ margin: 0, fontSize: 12, lineHeight: 1.85, color: "var(--warn)" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="dg-mt-3">
            <button
              type="button"
              onClick={startPayment}
              disabled={loading || total === 0}
              className="dg-btn"
            >
              {loading ? "端末に送信しています…" : "お支払いへ進む"}
              {!loading && <small>Continue to payment</small>}
            </button>
          </div>

          <p className="dg-caption">
            この先、レジ横の端末にカードやスマートフォンをかざしていただきます。
          </p>
        </>
      )}

      <ShopFooter />
    </main>
  );
}
