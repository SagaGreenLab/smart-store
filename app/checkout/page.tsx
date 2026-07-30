"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type PaymentType = "CARD_PRESENT" | "FELICA_ALL" | "QR_CODE";

const PAYMENT_METHODS: { type: PaymentType; label: string; icon: string }[] = [
  { type: "CARD_PRESENT", label: "クレジットカード", icon: "💳" },
  { type: "FELICA_ALL", label: "電子マネー（交通系・iD）", icon: "📱" },
  { type: "QR_CODE", label: "QRコード決済（PayPay・d払い）", icon: "📷" },
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
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="rounded-full bg-green-600 px-3 py-1 text-white">
            商品
          </span>

          <span className="text-gray-400">→</span>

          <span className="rounded-full bg-green-600 px-3 py-1 text-white">
            カート
          </span>

          <span className="text-gray-400">→</span>

          <span className="rounded-full bg-blue-600 px-3 py-1 font-semibold text-white">
            お支払い
          </span>
        </div>
      </div>
        <h1 className="mb-8 text-3xl font-bold">💳 お支払い</h1>

        <div className="rounded-2xl border p-6 shadow-sm">
          <p className="text-lg">お支払い金額</p>

          <p className="mt-4 text-4xl font-bold">
            ¥{total.toLocaleString()}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">購入商品</h2>

       {cart.length === 0 ? (
  <p className="text-gray-500">商品がありません</p>
) : (
  <>
    <ul className="space-y-3">
      {cart.map((item) => (
        <li
          key={item.id}
          className="flex justify-between border-b pb-2"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">
              ¥{item.price.toLocaleString()} × {item.quantity}
            </p>
          </div>

          <p className="font-semibold">
            ¥{(item.price * item.quantity).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
<div className="mt-4 flex justify-between text-sm text-gray-600">
  <span>商品点数</span>
  <span>
    {cart.reduce((sum, item) => sum + item.quantity, 0)}点
  </span>
</div>
    <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
      <span>合計</span>
      <span>¥{total.toLocaleString()}</span>
    </div>
    </>
)}
        </div>

        <div className="mt-6 rounded-2xl border p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">お支払い方法</h2>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.type}
                type="button"
                onClick={() => setPaymentType(method.type)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-medium ${
                  paymentType === method.type
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span>{method.label}</span>
                {paymentType === method.type && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || total === 0}
          className={`mt-8 w-full rounded-xl px-4 py-4 text-xl font-semibold text-white ${
            loading || total === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
  ? "通信中..."
  : `Squareで支払う（税込 ¥${total.toLocaleString()}）`}
        </button>

        <Link
          href="/cart"
          className="mt-4 block w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-lg font-medium hover:bg-gray-100"
        >
          カートへ戻る
        </Link>

        {status && (
          <div className={`mt-6 rounded-lg border p-4 ${
  status.includes("未設定")
    ? "border-yellow-300 bg-yellow-50"
    : status.includes("エラー")
    ? "border-red-300 bg-red-50"
    : "border-green-300 bg-green-50"
}`}>
            <p className="font-semibold">決済ステータス</p>

            <pre className="mt-2 whitespace-pre-wrap break-all text-sm">
              {status}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}