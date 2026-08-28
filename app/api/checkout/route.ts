import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  CURRENCY,
  describeError,
  missingEnv,
  squareClient,
  toMoney,
} from "@/lib/square";
import { findProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

/** 1回の会計で受け付ける最大点数。無人店の棚に対して十分な上限 */
const MAX_LINE_ITEMS = 20;
const MAX_QUANTITY = 99;

/**
 * POST /api/checkout   body: { items: [{ id, quantity }] }
 *
 * Square に Order を作り、orderId と**サーバーが計算した金額**を返す。
 * ここではまだ決済しない。決済は次の /api/terminal → ターミナル実機で行われる。
 *
 * 【重要】価格はクライアントから受け取らない。
 * 受け取るのは「どの商品を何個」だけで、単価も合計も商品マスタから引き直す。
 * localStorage も HTTP ボディも客が書き換えられるため、
 * 送られてきた金額を信じると1円で決済できてしまう。
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

  try {
    let body: { items?: unknown };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "リクエストが不正です。" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "カートが空です。" },
        { status: 400 }
      );
    }

    if (body.items.length > MAX_LINE_ITEMS) {
      return NextResponse.json(
        { error: "一度にお会計できる点数を超えています。" },
        { status: 400 }
      );
    }

    // 商品マスタで引き直す。id は数値で来ても String() で受ける
    // （改修前の商品一覧は id が数値だった。その頃のカートが残っている端末がある）
    const lineItems = [];
    let total = 0;

    for (const raw of body.items) {
      if (!raw || typeof raw !== "object") continue;

      const entry = raw as Record<string, unknown>;
      const id = String(entry.id ?? "");
      const product = findProduct(id);

      if (!product) {
        return NextResponse.json(
          { error: "取り扱いのない商品が含まれています。カートを空にしてお試しください。" },
          { status: 400 }
        );
      }

      const quantity = Math.trunc(Number(entry.quantity));

      if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return NextResponse.json(
          { error: "数量が正しくありません。" },
          { status: 400 }
        );
      }

      total += product.price * quantity;

      lineItems.push({
        name: product.name,
        quantity: String(quantity),
        basePriceMoney: toMoney(product.price),
        note: product.id,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "カートが空です。" }, { status: 400 });
    }

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
      console.error("Checkout API: Order の作成に失敗（idが無い）");
      return NextResponse.json(
        { error: "注文の作成に失敗しました。もう一度お試しください。" },
        { status: 502 }
      );
    }

    const squareTotal = Number(order.totalMoney?.amount ?? 0);

    // Square 側の計算（税設定など）と食い違ったら止める。
    // 表示と違う額が端末に出るのは無人店では取り返しがつかない。
    if (squareTotal !== total) {
      console.error(
        `Checkout API: 金額不一致 マスタ=${total} / Order=${squareTotal}`
      );
      return NextResponse.json(
        { error: "金額の確認ができませんでした。もう一度お試しください。" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: squareTotal,
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
