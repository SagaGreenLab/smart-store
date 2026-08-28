import type { Metadata, Viewport } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

/** 見出し・金額用の明朝 */
const shippori = Shippori_Mincho({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shippori",
});

/** 本文用のゴシック */
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zenkaku",
});

export const metadata: Metadata = {
  title: "だいいちえんげいセンター｜セルフレジ",
  description:
    "JR佐賀駅 構内の観葉植物セルフレジ。お支払いはレジ横の決済端末で行います。現金はご利用いただけません。",
  icons: { icon: "/brand/daiichi_mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${shippori.variable} ${zenKaku.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
