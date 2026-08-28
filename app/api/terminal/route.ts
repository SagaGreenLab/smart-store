import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { describeError, missingEnv, squareClient, toMoney } from "@/lib/square";
import { ALLOWED_PAYMENT_TYPES, type PaymentTypeKey } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

/** deadlineDuration は既定・最大とも5分。/payment のポーリング上限と揃えている */
const DEADLINE = "PT5M";

/**
 * POST /api/terminal   body: { orderId, amount, paymentType }
 *
 * レジ横の Square ターミナルに金額を表示させ、checkoutId を返す。
 *
 * 重要：このAPIが成功しても決済は**まだ終わっていない**（status は PENDING）。
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

  let body: { orderId?: string; amount?: number; paymentType?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const { orderId } = body;
  const amount = Number(body.amount);
  const paymentType = body.paymentType;

  if (!orderId) {
    return NextResponse.json({ error: "orderId が必要です。" }, { status: 400 });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "金額が正しくありません。" },
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

  try {
    const response = await squareClient.terminal.checkouts.create({
      idempotencyKey: randomUUID(),
      checkout: {
        amountMoney: toMoney(amount),
        orderId,
        referenceId: orderId,
        deviceOptions: {
          deviceId: process.env.SQUARE_DEVICE_ID!,
        },
        // 無人店なので、端末側の確認画面はできるだけ短くする
        paymentType: paymentType as PaymentTypeKey,
        deadlineDuration: DEADLINE,
      },
    });

    const checkout = response.checkout;

    if (!checkout?.id) {
      console.error("Terminal API: checkout の作成に失敗（idが無い）", response);
      return NextResponse.json(
        { error: "決済端末の応答が取得できませんでした。" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutId: checkout.id,
      status: checkout.status ?? "PENDING",
    });
  } catch (error) {
    console.error("Terminal API Error:", describeError(error));

    return NextResponse.json(
      { error: "決済端末とうまく通信できませんでした。" },
      { status: 500 }
    );
  }
}
