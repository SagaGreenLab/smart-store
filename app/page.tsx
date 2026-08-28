import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ShopHeader, ShopFooter, NoCashAlert } from "@/components/Brand";

/**
 * 商品一覧
 *
 * アーティファクトには無い画面。商品QRを読まずに来た人と、
 * 棚から選び直したい人の受け皿として置いている。
 */
export default function HomePage() {
  return (
    <main className="dg-wrap">
      <ShopHeader />

      <h1 className="dg-h1">帰り道に、みどりを一鉢。</h1>

      <p className="dg-body dg-mt-2" style={{ fontSize: 12.5 }}>
        棚の値札にあるQRコードを読み取ると、その鉢のページが開きます。
        お支払いはレジ横の決済端末で。
      </p>

      <div className="dg-mt-3">
        <NoCashAlert />
      </div>

      <p className="dg-eyebrow dg-mt-4">きょうの鉢</p>

      <div className="dg-mt-1" style={{ borderTop: "1px solid var(--rule)" }}>
        {PRODUCTS.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="dg-item"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="thumb" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="var(--moss-soft)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M39 94h42l-5 20H44z" />
                <path d="M60 94V50" />
                <path d="M60 72c-15-2-24-13-24-26 13 0 24 9 24 26z" />
                <path d="M60 62c15-2 24-13 24-26-13 0-24 9-24 26z" />
              </svg>
            </span>

            <span className="body">
              <b>{p.name}</b>
              <span className="spec">
                {p.potSize} ／ 高さ {p.height}
              </span>
            </span>

            <span className="dg-price sm">
              <span className="n">¥{p.price.toLocaleString()}</span>
            </span>
          </Link>
        ))}
      </div>

      <ShopFooter />
    </main>
  );
}
