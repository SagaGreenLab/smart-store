import { notFound } from "next/navigation";
import { PRODUCTS, findProduct } from "@/lib/products";
import {
  ShopHeader,
  ShopFooter,
  Eyebrow,
  SunIcon,
  DropIcon,
  PotIcon,
  PlantIcon,
} from "@/components/Brand";
import AddToCartButton from "./AddToCartButton";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

/**
 * ① 商品ページ（商品QRの着地点）
 *
 * 鉢に付いているラベルと同じ並びにする。棚で見たものがそのまま画面に出るほうが、
 * 無人店では「これで合っている」と伝わる。
 */
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

      <article className="dg-card flush">
        <div className="dg-photo">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="placeholder">
              <PlantIcon size={88} />
              <span>商品写真</span>
            </div>
          )}
        </div>

        <div style={{ padding: "18px 18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Eyebrow ja="観葉植物" en="FOLIAGE PLANT" />
            <span className="dg-pill">{product.potSize.replace(/（.*）/, "")}鉢</span>
          </div>

          <h1 className="dg-h1 lg dg-mt-3">{product.name}</h1>
          <p className="dg-sci">{product.latin}</p>

          <hr className="dg-hr" />

          <ul className="dg-specs">
            <li>
              <SunIcon className="ic" />
              <span>{product.place}</span>
            </li>
            <li>
              <DropIcon className="ic" />
              <span>{product.water}</span>
            </li>
            <li>
              <PotIcon className="ic" />
              <span>
                {product.potSize}・高さ {product.height}
              </span>
            </li>
          </ul>

          <p className="dg-price dg-mt-4">
            <span className="n">¥{product.price.toLocaleString()}</span>
            <span className="tax">税込</span>
          </p>
        </div>
      </article>

      <section className="dg-card dg-owner">
        <Eyebrow ja="店主より" en="FROM THE GROWER" />
        <p className="dg-mt-2">{product.story}</p>
      </section>

      <div className="dg-mt-4">
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
      </div>

      <ShopFooter />
    </main>
  );
}
