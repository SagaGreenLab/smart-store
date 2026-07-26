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
      {
        status: 503,
      }
    );
  }

  // ← この下に今ある処理が続く
  try {
    
    const { orderId, amount, paymentType } = await req.json();

    // 許可された決済方法のみ受け付け（不正値はカードにフォールバック）
    const resolvedPaymentType =
      paymentType === "FELICA_ALL" || paymentType === "PAYPAY"
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