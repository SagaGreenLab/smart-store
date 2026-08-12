"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandBadge from "./BrandBadge";
import {
  CARD_BRANDS,
  EMONEY_BRANDS,
  QR_BRANDS,
  type Brand,
} from "@/lib/payment-brands";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type PaymentType = "CARD_PRESENT" | "FELICA_ALL" | "QR_CODE";

type PaymentMethod = {
  type: PaymentType;
  label: string;
  brands: Brand[];
  note?: string;
  icon: ReactNode;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: "CARD_PRESENT",
    label: "クレジット / デビットカード",
    brands: CARD_BRANDS,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    type: "FELICA_ALL",
    label: "電子マネー・交通系IC",
    brands: EMONEY_BRANDS,
    note: "※PiTaPaは対象外です",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5a10 10 0 0 1 20 0" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M8.5 15.5a3.5 3.5 0 0 1 7 0" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  },
  {
    type: "QR_CODE",
    label: "QRコード決済",
    brands: QR_BRANDS,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1" />
      </svg>
    ),
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>("CARD_PRESENT");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      window.location.href = "/cart";
      return;
    }

    const parsedCart: CartItem[] = JSON.parse(savedCart);

    if (parsedCart.length === 0) {
      window.location.href = "/cart";
      return;
    }

    setCart(parsedCart);

    const totalPrice = parsedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotal(totalPrice);
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setStatus("注文を作成しています...");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const data = await res.json();

      console.log("Checkout Response:", data);

      if (!res.ok || !data.orderId) {
        setStatus(data.error ?? "注文の作成に失敗しました");
        return;
      }

      const orderId = data.orderId;

      setStatus("Square Terminalへ送信しています...");

      const terminalRes = await fetch("/api/terminal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount: total,
          paymentType,
        }),
      });

      const terminalData = await terminalRes.json();

      console.log("Terminal Response:", {
        status: terminalRes.status,
        body: terminalData,
      });

   if (!terminalRes.ok) {
  if (terminalRes.status === 503) {
    setStatus(
      "Square Terminalが未設定です。\n\n管理者が端末を設定後、決済できるようになります。"
    );
    return;
  }

  setStatus(
    `Terminal API エラー\n\n${
      terminalData.message ??
      terminalData.error ??
      "Unknown Error"
    }`
  );
  return;
}

// Terminal API成功時のみ実行
localStorage.removeItem("cart");
router.push("/complete");
      
    } catch (error) {
      console.error(error);
      setStatus("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-white px-3.5 py-1.5 text-[#98a1b3] shadow-[0_4px_14px_rgba(27,51,92,0.08)]">
            商品
          </span>

          <span className="text-[#98a1b3]">→</span>

          <span className="rounded-full bg-white px-3.5 py-1.5 text-[#98a1b3] shadow-[0_4px_14px_rgba(27,51,92,0.08)]">
            カート
          </span>

          <span className="text-[#98a1b3]">→</span>

          <span className="rounded-full bg-[#4fa8f0] px-3.5 py-1.5 text-white">
            お支払い
          </span>
        </div>

        <h1 className="mb-4 px-1 text-xl font-extrabold text-[#1b2333]">お支払い</h1>

        <div className="rounded-3xl bg-white p-6 shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
          <p className="text-sm text-[#6b7486]">お支払い金額</p>

          <p className="mt-1 flex items-baseline gap-1 text-[#1b2333]">
            <span className="text-xl font-bold">¥</span>
            <span className="text-4xl font-extrabold tabular-nums">
              {total.toLocaleString()}
            </span>
          </p>

          <p className="mt-1 text-xs text-[#98a1b3]">
            税込 ・ {cart.reduce((sum, item) => sum + item.quantity, 0)}点
          </p>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-6 shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
          <h2 className="mb-3 text-xs font-bold tracking-wider text-[#98a1b3]">
            購入商品
          </h2>

          {cart.length === 0 ? (
            <p className="text-[#98a1b3]">商品がありません</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between border-b border-[#eef1f6] py-2.5"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#1b2333]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#98a1b3]">
                        ¥{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-[15px] font-bold tabular-nums text-[#1b2333]">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between border-b border-[#eef1f6] py-2.5 text-sm text-[#6b7486]">
                <span>商品点数</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}点
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-3.5">
                <span className="text-[15px] font-bold text-[#1b2333]">合計</span>
                <span className="text-2xl font-extrabold tabular-nums text-[#2483d6]">
                  ¥{total.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 rounded-3xl bg-white p-6 shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
          <h2 className="mb-3 text-xs font-bold tracking-wider text-[#98a1b3]">
            お支払い方法
          </h2>

          <div className="space-y-2.5">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.type}
                type="button"
                onClick={() => setPaymentType(method.type)}
                className={`w-full rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-colors ${
                  paymentType === method.type
                    ? "border-[#4fa8f0] bg-[#edf6fe]"
                    : "border-[#e3e8f0] bg-white hover:bg-[#f4f6fa]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#2483d6] ${
                      paymentType === method.type ? "bg-white" : "bg-[#f4f6fa]"
                    }`}
                  >
                    {method.icon}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-[#1b2333]">
                    {method.label}
                  </span>
                  {paymentType === method.type && (
                    <svg className="shrink-0 text-[#2483d6]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>

                <span className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-12">
                  {method.brands.map((brand) => (
                    <BrandBadge key={brand.slug} brand={brand} />
                  ))}
                </span>

                {method.note && (
                  <span className="mt-1.5 block pl-12 text-[10px] text-[#98a1b3]">
                    {method.note}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-[#eef1f6] pt-4">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-[#98a1b3]">
              対応決済ブランド
            </h3>

            {/* Square公式のロゴ素材。改変・切り抜き不可のため原寸比のまま掲載 */}
            <div className="-mx-6 overflow-x-auto px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands/square-payment-brands.png"
                alt="対応決済ブランド一覧：VISA、Mastercard、American Express、JCB、Diners Club、Discover、UnionPay（銀聯）、交通系電子マネー（Kitaca・Suica・PASMO・TOICA・manaca・ICOCA・SUGOCA・nimoca・はやかけん）、PayPay、d払い、楽天ペイ、au PAY、メルペイ、WeChat Pay、Alipay+、iD、QUICPay+"
                className="h-40 w-auto max-w-none"
              />
            </div>

            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#98a1b3]">
              <span>横にスクロールできます</span>
              <span aria-hidden="true">→</span>
            </p>

            <p className="mt-0.5 text-[10px] text-[#98a1b3]">
              ※交通系電子マネーのうちPiTaPaは対象外です
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || total === 0}
          className={`mt-6 w-full rounded-2xl px-4 py-4 text-base font-bold text-white transition-colors ${
            loading || total === 0
              ? "cursor-not-allowed bg-[#b9c4d6]"
              : "bg-[#4fa8f0] hover:bg-[#2f93e6] active:bg-[#2f93e6]"
          }`}
        >
          {loading
            ? "通信中..."
            : `Squareで支払う（税込 ¥${total.toLocaleString()}）`}
        </button>

        <Link
          href="/cart"
          className="mt-3 block w-full rounded-2xl py-3 text-center text-sm font-semibold text-[#6b7486] hover:text-[#1b2333]"
        >
          カートへ戻る
        </Link>

        {status && (
          <div
            className={`mt-4 rounded-2xl border p-4 ${
              status.includes("未設定")
                ? "border-yellow-300 bg-yellow-50"
                : status.includes("エラー")
                ? "border-red-300 bg-red-50"
                : "border-[#d5eafc] bg-[#edf6fe]"
            }`}
          >
            <p className="text-sm font-bold text-[#1b2333]">決済ステータス</p>

            <pre className="mt-2 whitespace-pre-wrap break-all text-sm text-[#6b7486]">
              {status}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}