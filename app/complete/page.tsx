"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  subscribeLastOrder,
  getLastOrderSnapshot,
  getLastOrderServerSnapshot,
} from "@/lib/cart";
import { ShopHeader, ShopFooter } from "@/components/Brand";
import { LINE_ADD_FRIEND_URL as LINE_URL } from "@/lib/line";

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

      <section className="dg-card dg-mt-1" style={{ textAlign: "center", padding: "30px 18px 26px" }}>
        <div className="dg-result" style={{ color: "var(--ink)" }}>
          <svg width="68" height="68" viewBox="0 0 76 76" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="38" cy="38" r="34" />
            <path d="M24 39.5l10 10 19-22" />
          </svg>
        </div>

        <h1 className="dg-h1 dg-mt-3">ありがとうございました</h1>
        <p className="dg-en center">Thank you</p>

        <p className="dg-body center dg-mt-3" style={{ fontSize: 14 }}>
          お支払いが完了しました。
          <br />
          棚から鉢をお持ちください。
        </p>
      </section>

      <section className="dg-card dg-box">
        <div className="row">
          <p className="k">お支払い金額</p>
          <p className="v num">¥{(order?.total ?? 0).toLocaleString()}</p>
        </div>

        <hr className="dg-hr tight" style={{ margin: 0 }} />

        {order?.method && (
          <div className="row">
            <p className="k">お支払い方法</p>
            <p className="v">{order.method}</p>
          </div>
        )}
        {order?.orderNo && (
          <div className="row">
            <p className="k">注文番号</p>
            <p className="v code">{order.orderNo}</p>
          </div>
        )}
        {order && order.items.length > 0 && (
          <div className="row stack">
            <p className="k">お買い上げ</p>
            <p className="v">
              {order.items.map((i) => `${i.name} × ${i.quantity}`).join("、")}
            </p>
          </div>
        )}
      </section>

      {/* 無人店では、ここが唯一の接客チャネル */}
      <section className="dg-card">
        <div className="dg-line">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="qr has-img"
            aria-label="LINEで友だち追加する"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/line_qr.svg" alt="LINE友だち追加QRコード" width={76} height={76} />
          </a>

          <span className="body">
            <b>育て方に迷ったら</b>
            <p>
              葉の写真を送ってください。南佐賀の本店スタッフがお返事します。相談は無料です。
            </p>
          </span>
        </div>

        {LINE_URL && (
          <div className="dg-mt-3">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dg-btn-outline"
            >
              LINEで友だち追加する
              <small>Add us on LINE</small>
            </a>
          </div>
        )}
      </section>

      <div className="dg-mt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="dg-btn-outline"
        >
          レシートを表示する
          <small>Show receipt</small>
        </button>
      </div>

      <p className="dg-caption">
        持ち帰り袋はレジ横のフックにあります。ご自由にどうぞ。
      </p>

      <div className="dg-mt-1">
        <Link href="/" className="dg-btn-text">
          ほかの鉢を見る
        </Link>
      </div>

      <ShopFooter />
    </main>
  );
}
