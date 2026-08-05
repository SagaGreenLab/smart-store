import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

// 有効な payment_type（"PAYPAY" は非推奨。QR_CODE が PayPay・d払い等をカバー）
const ALLOWED_PAYMENT_TYPES = new Set([
  "CARD_PRESENT",
  "FELICA_ALL",
  "FELICA_ID",
  "FELICA_TRANSPORTATION_GROUP",
  "FELICA_QUICPAY", // 2026-07-31 QUICPay有効化メール確認済み（佐賀駅）
  "QR_CODE",
]);

export async function POST(req: NextRequest) {
  const deviceId = process.env.SQUARE_DEVICE_ID;

  if (!deviceId) {
    return Response.json(
      {
        success: false,
        code: "DEVICE_ID_NOT_CONFIGURED",
        message:
          "Square Terminalは未設定です。実機到着後にSQUARE_DEVICE_IDを設定してください。",
      },
      { status: 503 }
    );
  }

  try {
    const { orderId, amount, paymentType } = await req.json();

    // 許可された決済方法のみ受け付け（不正値はカードにフォールバック）
    const resolvedPaymentType = ALLOWED_PAYMENT_TYPES.has(paymentType)
      ? paymentType
      : "CARD_PRESENT";

    const response = await client.terminal.checkouts.create({
      idempotencyKey: randomUUID(),
      checkout: {
        orderId,
        amountMoney: {
          amount: BigInt(amount),
          currency: "JPY",
        },
        paymentType: resolvedPaymentType,
        deviceOptions: {
          deviceId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      status: response.checkout?.status ?? "PENDING",
      checkoutId: response.checkout?.id,
    });
  } catch (error) {
    console.error("Terminal API Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}