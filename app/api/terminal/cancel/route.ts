import { NextRequest, NextResponse } from "next/server";
import { describeError, squareClient } from "@/lib/square";

export const dynamic = "force-dynamic";

/**
 * POST /api/terminal/cancel  body: { checkoutId }
 *
 * お客様が「支払いをやめる」を押したとき、ターミナル側の待機を解除する。
 * これが無いと端末に金額が出しっぱなしになり、次のお客様が誤って払ってしまう。
 */
export async function POST(req: NextRequest) {
  try {
    const { checkoutId } = await req.json();

    if (!checkoutId) {
      return NextResponse.json(
        { success: false, error: "checkoutId is required" },
        { status: 400 }
      );
    }

    const response = await squareClient.terminal.checkouts.cancel({ checkoutId });

    return NextResponse.json({
      success: true,
      status: response.checkout?.status ?? "CANCELED",
    });
  } catch (error) {
    console.error("Terminal Cancel API Error:", describeError(error));

    return NextResponse.json(
      { success: false, error: "決済の取り消しに失敗しました。" },
      { status: 500 }
    );
  }
}
