"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  subscribeLastOrder,
  getLastOrderSnapshot,
  getLastOrderServerSnapshot,
} from "@/lib/cart";
import { ShopHeader, ShopFooter } from "@/components/Brand";

const LINE_URL = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL ?? "";

/** ④ お支払い完了 */
export default function CompletePage() {
  const order = useSyncExternalStore(
    subscribeLastOrder,
    getLastOrderSnapshot,
    getLastOrderServerSnapshot
  );

  return (
    <main className="dg-wrap">
      <ShopHeader />

      <div className="dg-mt-4" style={{ display: "grid", placeItems: "center" }}>
        <svg width="76" height="76" viewBox="0 0 76 76" fill="none" stroke="var(--moss)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="38" cy="38" r="34" />
          <path d="M24 39.5l10 10 19-22" />
        </svg>
      </div>

      <h1 className="dg-h1 dg-mt-3" style={{ textAlign: "center", fontSize: 27, letterSpacing: ".08em" }}>
        ありがとうございました
      </h1>

      <p className="dg-body center dg-mt-2" style={{ fontSize: 14.5 }}>
        お支払いが完了しました。
        <br />
        棚から鉢をお持ちください。
      </p>

      <div className="dg-box dg-mt-4">
        <div className="row">
          <p className="k">お支払い金額</p>
          <p className="v num">¥{(order?.total ?? 0).toLocaleString()}</p>
        </div>
        <div className="div" />
        {order?.method && (
          <div className="row">
            <p className="k">お支払い方法</p>
            <p className="v">{order.method}</p>
          </div>
        )}
        {order?.orderNo && (
          <div className="row">
            <p className="k">注文番号</p>
            <p className="v" style={{ letterSpacing: ".06em" }}>{order.orderNo}</p>
          </div>
        )}
      </div>

      {order && order.items.length > 0 && (
        <p className="dg-eyebrow dg-mt-2">
          {order.items.map((i) => `${i.name} × ${i.quantity}`).join("　/　")}
        </p>
      )}

      {/* 無人店では、ここが唯一の接客チャネル */}
      <div className="dg-line dg-mt-4">
        <span className="qr">
          {LINE_URL ? "LINE公式\nアカウント" : "LINE公式\nQRコード"}
        </span>

        <span className="body">
          <b>育て方の相談、承ります</b>
          <p>
            葉の様子で困ったら、お写真を送ってください。南佐賀の店からお返事します。
          </p>
        </span>
      </div>

      {LINE_URL && (
        <div className="dg-mt-2">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="dg-btn-outline"
          >
            LINEで友だち追加する
          </a>
        </div>
      )}

      <div className="dg-mt-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="dg-btn-outline"
        >
          レシートを表示する
        </button>
      </div>

      <p className="dg-caption">
        レシート（お買い上げ票）はレジ横の端末からも発行できます。
        <br />
        袋はご自由にお使いください（無料）。
      </p>

      <div className="dg-mt-2">
        <Link href="/" className="dg-btn-text">
          商品一覧へ戻る
        </Link>
      </div>

      <ShopFooter />
    </main>
  );
}
