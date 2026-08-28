import { notFound } from "next/navigation";
import { PRODUCTS, findProduct } from "@/lib/products";
import { ShopHeader, ShopFooter } from "@/components/Brand";
import AddToCartButton from "./AddToCartButton";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

/** ① 商品ページ（商品QRの着地点） */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) notFound();

  return (
    <main className="dg-wrap">
      <ShopHeader backHref="/" />

      <div className="dg-photo">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder">
            <svg width="112" height="112" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M39 94h42l-5 20H44z" />
              <path d="M60 94V50" />
              <path d="M60 72c-15-2-24-13-24-26 13 0 24 9 24 26z" />
              <path d="M60 62c15-2 24-13 24-26-13 0-24 9-24 26z" />
              <path d="M60 88c-11-1-17-9-17-18 10 0 17 7 17 18z" />
            </svg>
            <span>商品写真</span>
          </div>
        )}
      </div>

      <div className="dg-mt-4">
        <h1 className="dg-h1" style={{ fontSize: 26 }}>{product.name}</h1>
        <p className="dg-latin">{product.latin}</p>

        <p className="dg-price hero dg-mt-3">
          <span className="n">¥{product.price.toLocaleString()}</span>
          <span className="tax">税込</span>
        </p>
      </div>

      <dl className="dg-dl dg-mt-3">
        <div>
          <dt>鉢サイズ</dt>
          <dd>{product.potSize}</dd>
        </div>
        <div>
          <dt>高さ</dt>
          <dd>{product.height}</dd>
        </div>
        <div>
          <dt>置き場所</dt>
          <dd>{product.place}</dd>
        </div>
        <div>
          <dt>水やり</dt>
          <dd>{product.water}</dd>
        </div>
      </dl>

      <div className="dg-owner dg-mt-3">
        <p className="label">店主より</p>
        <p>{product.story}</p>
      </div>

      <p className="dg-eyebrow dg-mt-2">この鉢の在庫 のこり{product.stock}点</p>

      <div className="dg-mt-3">
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={product.price}
        />
      </div>

      <ShopFooter />
    </main>
  );
}
