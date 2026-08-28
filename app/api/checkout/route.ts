import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  CURRENCY,
  describeError,
  missingEnv,
  squareClient,
  toMoney,
} from "@/lib/square";

export const dynamic = "force-dynamic";

type IncomingItem = {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

/**
 * POST /api/checkout   body: { amount, items? }
 *
 * Square に Order を作り、orderId を返す。
 * ここではまだ決済しない。決済は次の /api/terminal → ターミナル実機で行われる。
 *
 * items を受け取れるようにしてあるのは、Square 側の売上に品名を残すため。
 * 無人店では手元に伝票が残らないので、Order の明細が唯一の記録になる。
 */
export async function POST(req: NextRequest) {
  const missing = missingEnv("SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID");

  if (missing.length > 0) {
    console.error("Checkout API: 環境変数が未設定:", missing.join(", "));
    return NextResponse.json(
      { error: "決済の設定が未完了です。店舗にお問い合わせください。" },
      { status: 503 }
    );
  }

  let body: { amount?: number; items?: IncomingItem[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const amount = Number(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "金額が正しくありません。" },
      { status: 400 }
    );
  }

  // 明細があればそのまま、無ければ合計1行だけの注文にする
  const items = Array.isArray(body.items) ? body.items : [];

  const lineItems = items.length
    ? items.map((item) => ({
        name: item.name?.slice(0, 512) || "商品",
        quantity: String(Math.max(1, Math.trunc(Number(item.quantity) || 1))),
        basePriceMoney: toMoney(Number(item.price) || 0),
        ...(item.id ? { note: item.id.slice(0, 500) } : {}),
      }))
    : [
        {
          name: "お買い上げ",
          quantity: "1",
          basePriceMoney: toMoney(amount),
        },
      ];

  try {
    const response = await squareClient.orders.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems,
        state: "OPEN",
      },
    });

    const order = response.order;

    if (!order?.id) {
      console.error("Checkout API: Order の作成に失敗（idが無い）", response);
      return NextResponse.json(
        { error: "注文の作成に失敗しました。もう一度お試しください。" },
        { status: 502 }
      );
    }

    const total = Number(order.totalMoney?.amount ?? 0);

    // 明細から計算した合計と画面の金額がずれていたら止める。
    // ここを通すと「表示と違う額が端末に出る」ことになり、無人店では取り返しがつかない。
    if (items.length > 0 && total !== Math.round(amount)) {
      console.error(
        `Checkout API: 金額不一致 画面=${amount} / Order=${total}。注文を破棄する`
      );
      return NextResponse.json(
        { error: "金額の確認ができませんでした。もう一度お試しください。" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: total || Math.round(amount),
      currency: CURRENCY,
    });
  } catch (error) {
    console.error("Checkout API Error:", describeError(error));

    return NextResponse.json(
      { error: "注文の作成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
