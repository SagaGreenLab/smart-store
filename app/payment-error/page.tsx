"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShopHeader, ShopFooter } from "@/components/Brand";

const LINE_URL = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL ?? "";

/**
 * ⑤ 決済エラー
 *
 * 冒頭に「代金は請求されていません」を置く。
 * 無人店では、お金が引かれたか分からない不安がいちばん先に来るため。
 */
const CAUSES = [
  "かざす時間が短かった（音が鳴るまでお待ちください）",
  "交通系ICの残高が不足していた",
  "カードが読み取り面から離れていた",
];

const MESSAGES: Record<string, string> = {
  canceled: "お支払いが取り消されました。",
  timeout: "お支払いの確認ができないまま、時間切れになりました。",
};

function ErrorInner() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "";
  const lead = MESSAGES[reason] ?? "";

  return (
    <main className="dg-wrap">
      <ShopHeader />

      <div className="dg-mt-4" style={{ display: "grid", placeItems: "center" }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" stroke="var(--warn)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="36" cy="36" r="32" />
          <path d="M36 21v18" />
          <path d="M36 49h.01" />
        </svg>
      </div>

      <h1 className="dg-h1 dg-mt-3" style={{ textAlign: "center", fontSize: 24, lineHeight: 1.5, color: "var(--warn)" }}>
        お支払いが
        <br />
        完了しませんでした
      </h1>

      <p className="dg-body center dg-mt-2" style={{ fontSize: 14 }}>
        {lead && (
          <>
            {lead}
            <br />
          </>
        )}
        代金は請求されていません。
        <br />
        もう一度お試しください。
      </p>

      <div className="dg-causes-box dg-mt-4">
        <p className="label">よくある原因</p>
        <ul>
          {CAUSES.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ul>
      </div>

      <div className="dg-mt-4">
        <Link href="/cart" className="dg-btn">
          もう一度お支払いする
        </Link>
      </div>

      {LINE_URL && (
        <div className="dg-mt-2">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="dg-btn-outline"
          >
            LINEで相談する
          </a>
        </div>
      )}

      <p className="dg-caption">
        くり返し失敗するときは、別のカードやお支払い
        <br />
        方法をお試しください。
      </p>

      <ShopFooter />
    </main>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <main className="dg-wrap">
          <p className="dg-body center" style={{ padding: "80px 0" }}>
            読み込んでいます…
          </p>
        </main>
      }
    >
      <ErrorInner />
    </Suspense>
  );
}
