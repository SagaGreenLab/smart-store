import Link from "next/link";
import { LINE_ADD_FRIEND_URL, LINE_BASIC_ID } from "@/lib/line";

/**
 * ブランド共通パーツ
 *
 * 店内の印刷物（鉢ラベル・卓上サイン・棚差しカード）と同じ語彙で組む。
 * 猫マークは青の線画、見出しには必ず小さな英文を添える。
 */

/* ---------------------------------------------------------------------------
   細線アイコン。印刷物の作図と同じ 1.5px 相当・丸端
   --------------------------------------------------------------------------- */

type IconProps = { size?: number; className?: string };

const svg = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

/** 日あたり */
export const SunIcon = ({ size = 17, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
  </svg>
);

/** 水やり */
export const DropIcon = ({ size = 17, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <path d="M12 3.5c3.2 3.6 5 6.3 5 8.8a5 5 0 0 1-10 0c0-2.5 1.8-5.2 5-8.8z" />
  </svg>
);

/** 鉢 */
export const PotIcon = ({ size = 17, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <path d="M5 8h14l-1.4 11.2a1.6 1.6 0 0 1-1.6 1.4H8a1.6 1.6 0 0 1-1.6-1.4z" />
    <path d="M4 8h16" />
    <path d="M12 8V5.5" />
  </svg>
);

/** 植物（写真が無いときのプレースホルダ・サムネイル） */
export const PlantIcon = ({ size = 28, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M39 94h42l-5 20H44z" />
    <path d="M60 94V50" />
    <path d="M60 72c-15-2-24-13-24-26 13 0 24 9 24 26z" />
    <path d="M60 62c15-2 24-13 24-26-13 0-24 9-24 26z" />
  </svg>
);

/** スマホ（買い方の手順） */
export const PhoneIcon = ({ size = 22, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
    <path d="M10 6h4M10 9.5h4M10 13h2.5" />
  </svg>
);

/** 決済端末 */
export const TerminalIcon = ({ size = 22, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <rect x="4" y="4" width="11" height="16" rx="2" />
    <path d="M4 8.5h11" />
    <path d="M7.5 12.5h4M7.5 15.5h2.5" />
    <path d="M17.8 9.4a4 4 0 0 1 0 5.2M20 7.4a7 7 0 0 1 0 9.2" />
  </svg>
);

/** 持ち帰り袋 */
export const BagIcon = ({ size = 22, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <path d="M5.5 7.5h13l-1 13h-11z" />
    <path d="M9 7.5V5a3 3 0 0 1 6 0v2.5" />
  </svg>
);

/** 注意（現金不可・エラー） */
export const WarnIcon = ({ size = 16, className }: IconProps) => (
  <svg {...svg(size, className)}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.6v5.4" />
    <path d="M12 16.4h.01" />
  </svg>
);

/* ---------------------------------------------------------------------------
   ヘッダー・フッター
   --------------------------------------------------------------------------- */

export function ShopHeader({ backHref }: { backHref?: string }) {
  return (
    <header className="dg-head">
      {backHref && (
        <Link href={backHref} className="back" aria-label="戻る">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 4.5L7.5 12l7.5 7.5" />
          </svg>
        </Link>
      )}

      <span className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mark" src="/brand/mark_blue.png" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wordmark" src="/brand/wordmark_blue.png" alt="だいいちえんげいセンター" />
      </span>

      <p className="dg-place">JR佐賀駅</p>
    </header>
  );
}

export function ShopFooter() {
  return (
    <footer className="dg-foot">
      {/* 全ページ共通のLINE相談の入口（購入後に鉢のQRから戻ってきた人向け） */}
      <a
        className="dg-foot-line"
        href={LINE_ADD_FRIEND_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <b>育て方の相談は LINE で</b>
        <span>
          友だち追加 {LINE_BASIC_ID}　<em>Ask us on LINE</em>
        </span>
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="tagline"
        src="/brand/tagline_blue.png"
        alt="FLOWERS FOR YOUR LIFE, GREEN FOR YOUR HOME."
      />
      <p>
        有限会社 第一園芸センター（佐賀市南佐賀）
        <br />
        観葉植物 ／ セルフ販売 ／ 防犯カメラ録画中
      </p>
    </footer>
  );
}

/* ---------------------------------------------------------------------------
   アイブロウ行：猫マーク＋和文＋英文
   --------------------------------------------------------------------------- */

export function Eyebrow({ ja, en }: { ja: string; en?: string }) {
  return (
    <p className="dg-eyebrow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="cat" src="/brand/mark_blue.png" alt="" aria-hidden="true" />
      <span>{ja}</span>
      {en && <span className="en">{en}</span>}
    </p>
  );
}

/* ---------------------------------------------------------------------------
   現金不可の告知
   SPEC 絶対ルール1：鉢を手に取る前に分かる位置と大きさで必ず告知する。
   --------------------------------------------------------------------------- */

export function NoCashAlert() {
  return (
    <div className="dg-alert">
      <WarnIcon className="icon" />
      <p>
        <b>現金はつかえません。</b>
        カード・交通系IC・QRコード決済・電子マネーでお支払いください。
        <span className="en">Cashless only. No cash accepted.</span>
      </p>
    </div>
  );
}
