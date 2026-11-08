import type { Metadata, Viewport } from "next";
import { Lato, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

/**
 * 和文：店内の印刷物（鉢ラベル・サイン）と同じ幾何学寄りのゴシック。
 * 細いウェイトを広い字間で置くのがこのブランドの声なので 300 を含める。
 */
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zenkaku",
});

/**
 * 欧文・数字：印刷物の英文サブと価格に合わせたヒューマニストサンス。
 * 価格は細く大きく組むので 300 が主役。
 */
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "だいいちえんげいセンター｜セルフレジ",
  description:
    "JR佐賀駅 構内の観葉植物セルフレジ。お支払いはレジ横の決済端末で行います。現金はご利用いただけません。",
  icons: { icon: "/brand/daiichi_mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#E9E6E0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${zenKaku.variable} ${lato.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
