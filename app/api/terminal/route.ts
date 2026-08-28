import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { describeError, missingEnv, squareClient, toMoney } from "@/lib/square";
import { ALLOWED_PAYMENT_TYPES, type PaymentTypeKey } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

/** deadlineDuration は既定・最大とも5分。/payment のポーリング上限と揃えている */
const DEADLINE = "PT5M";

/**
 * POST /api/terminal   body: { orderId, paymentType }
 *
 * レジ横の Square ターミナルに金額を表示させ、checkoutId を返す。
 *
 * 【重要】金額はクライアントから受け取らない。
 * orderId で Square から注文を引き直し、その合計を端末に出す。
 * 客が送ってきた金額を信じると、注文と違う額を請求してしまう。
 *
 * このAPIが成功しても決済は**まだ終わっていない**（status は PENDING）。
 * 実際の支払いは客が端末にカードをかざした時点で成立するため、
 * 呼び出し側は /api/terminal/status を COMPLETED になるまでポーリングすること。
 */
export async function POST(req: NextRequest) {
  const missing = missingEnv("SQUARE_ACCESS_TOKEN", "SQUARE_DEVICE_ID");

  if (missing.length > 0) {
    console.error("Terminal API: 環境変数が未設定:", missing.join(", "));
    // 画面側はこの 503 を「端末が準備中」と案内する
    return NextResponse.json(
      { error: "決済端末が準備中です。" },
      { status: 503 }
    );
  }

  try {
    let body: { orderId?: string; paymentType?: string };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "リクエストが不正です。" },
        { status: 400 }
      );
    }

    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const paymentType = body.paymentType;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId が必要です。" },
        { status: 400 }
      );
    }

    // 不正値を CARD_PRESENT にフォールバックさせない。
    // 客がQRを選んだのにカード用の画面が出ると、無人店では説明する人がいない。
    if (!paymentType || !ALLOWED_PAYMENT_TYPES.has(paymentType)) {
      return NextResponse.json(
        { error: "お支払い方法が正しくありません。" },
        { status: 400 }
      );
    }

    // 金額の正は Square 上の注文
    const orderRes = await squareClient.orders.get({ orderId });
    const order = orderRes.order;

    if (!order) {
      return NextResponse.json(
        { error: "注文が見つかりませんでした。もう一度お試しください。" },
        { status: 404 }
      );
    }

    const amount = Number(order.totalMoney?.amount ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      console.error(`Terminal API: 注文の金額が不正 orderId=${orderId} amount=${amount}`);
      return NextResponse.json(
        { error: "金額の確認ができませんでした。もう一度お試しください。" },
        { status: 409 }
      );
    }

    const response = await squareClient.terminal.checkouts.create({
      idempotencyKey: randomUUID(),
      checkout: {
        amountMoney: toMoney(amount),
        orderId,
        referenceId: orderId,
        deviceOptions: {
          deviceId: process.env.SQUARE_DEVICE_ID!,
        },
        paymentType: paymentType as PaymentTypeKey,
        deadlineDuration: DEADLINE,
      },
    });

    const checkout = response.checkout;

    if (!checkout?.id) {
      console.error("Terminal API: checkout の作成に失敗（idが無い）");
      return NextResponse.json(
        { error: "決済端末の応答が取得できませんでした。" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutId: checkout.id,
      status: checkout.status ?? "PENDING",
      amount,
    });
  } catch (error) {
    console.error("Terminal API Error:", describeError(error));

    return NextResponse.json(
      { error: "決済端末とうまく通信できませんでした。" },
      { status: 500 }
    );
  }
}
