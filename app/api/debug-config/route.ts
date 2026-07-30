// app/api/debug-config/route.ts
// 開発中の設定確認用。動作確認が終わったらファイルごと削除してください。
import { NextResponse } from "next/server";

const KNOWN_LOCATIONS: Record<string, string> = {
  LP11636DM3X9J: "佐賀駅（無人店舗）← これが正",
  L0QW32MB1R7ZR: "daiichi_engei_center（本店）",
  L51Z3TWXMPTWX: "有限会社 第一園芸センター",
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const locationId = process.env.SQUARE_LOCATION_ID ?? null;
  const deviceId = process.env.SQUARE_DEVICE_ID ?? null;
  const token = process.env.SQUARE_ACCESS_TOKEN ?? null;

  return NextResponse.json({
    locationId,
    locationName: locationId
      ? (KNOWN_LOCATIONS[locationId] ?? "⚠️ 未知のロケーションID")
      : "⚠️ 未設定",
    isSagaStation: locationId === "LP11636DM3X9J",
    deviceIdConfigured: !!deviceId,
    accessTokenTail: token ? `...${token.slice(-4)}` : "⚠️ 未設定",
    environment: process.env.SQUARE_ENVIRONMENT ?? "（未設定→Sandbox扱い）",
    nodeEnv: process.env.NODE_ENV,
  });
}