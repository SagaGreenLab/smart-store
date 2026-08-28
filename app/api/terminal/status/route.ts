import { NextRequest, NextResponse } from "next/server";
import { describeError, squareClient } from "@/lib/square";

// ポーリング用。キャッシュされると永遠に PENDING のままになるので必ず動的実行
export const dynamic = "force-dynamic";

/**
 * GET /api/terminal/status?checkoutId=xxxx
 *
 * Square Terminal の checkout ステータスを返す。
 * status: PENDING | IN_PROGRESS | CANCEL_REQUESTED | CANCELED | COMPLETED
 */
export async function GET(req: NextRequest) {
  const checkoutId = req.nextUrl.searchParams.get("checkoutId");

  if (!checkoutId) {
    return NextResponse.json(
      { success: false, error: "checkoutId is required" },
      { status: 400 }
    );
  }

  try {
    const response = await squareClient.terminal.checkouts.get({ checkoutId });
    const checkout = response.checkout;

    return NextResponse.json({
      success: true,
      status: checkout?.status ?? "UNKNOWN",
      cancelReason: checkout?.cancelReason ?? null,
      paymentIds: checkout?.paymentIds ?? [],
    });
  } catch (error) {
    console.error("Terminal Status API Error:", describeError(error));

    return NextResponse.json(
      { success: false, error: "決済状況の確認に失敗しました。" },
      { status: 500 }
    );
  }
}
