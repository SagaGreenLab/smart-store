import Link from "next/link";
import { NO_CASH_TEXT } from "@/lib/payment-methods";

/**
 * ブランド共通パーツ
 * マーク（猫＋ひまわりの線画）と手書き和文ロゴタイプを横並びに。
 * 主役は商品と金額なので、ヘッダーは徹底して静かに置く。
 */

export function ShopHeader({ backHref }: { backHref?: string }) {
  return (
    <header className="dg-head">
      {backHref && (
        <Link href={backHref} className="back" aria-label="戻る">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 4.5L7.5 12l7.5 7.5" />
          </svg>
        </Link>
      )}

      <span className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mark" src="/brand/daiichi_mark.png" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wordmark" src="/brand/daiichi_wordmark.png" alt="だいいちえんげいセンター" />
      </span>

      <p className="dg-place">佐賀駅構内</p>
    </header>
  );
}

export function ShopFooter() {
  return (
    <footer className="dg-foot">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="tagline"
        src="/brand/daiichi_tagline.png"
        alt="FLOWERS FOR YOUR LIFE, GREEN FOR YOUR HOME."
      />
      <p>
        有限会社 第一園芸センター（佐賀市南佐賀）
        <br />
        観葉植物 ／ セルフレジ ／ 防犯カメラ録画中
      </p>
    </footer>
  );
}

const WarnIcon = ({ size = 17 }: { size?: number }) => (
  <svg
    className="icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.6v5.2" />
    <path d="M12 16.3h.01" />
  </svg>
);

/**
 * 現金不可の告知（枠あり）
 * SPEC 絶対ルール1：鉢を手に取る前に分かる位置と大きさで必ず告知する。
 */
export function NoCashAlert({ children }: { children?: React.ReactNode }) {
  return (
    <div className="dg-alert">
      <WarnIcon />
      <p>{children ?? <><b>現金はご利用いただけません。</b>カード・交通系IC・QRコード決済・電子マネーでのお支払いとなります。</>}</p>
    </div>
  );
}

/** 現金不可の注記（枠なし・ボタン直下用） */
export function NoCashNote() {
  return (
    <p className="dg-note">
      <WarnIcon size={13} />
      <span>{NO_CASH_TEXT}</span>
    </p>
  );
}
