/**
 * 商品マスタ
 *
 * 項目立てはアーティファクト①商品ページに準拠：
 *   学名 ／ 鉢サイズ ／ 高さ ／ 置き場所 ／ 水やり ／ ひとこと
 *
 * 商品QRの遷移先は /products/<id>。id はスマレジ商品コードと対応させる前提
 * （SPEC T-5 は未確定のため、当面このスラッグを唯一の識別子として扱う）。
 */

export type Product = {
  id: string;
  name: string;
  latin: string;
  price: number;
  potSize: string;
  height: string;
  place: string;
  water: string;
  /** 育て方のひとこと。無人店ではこれが接客の代わりになる */
  story: string;
  stock: number;
  image?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "everfresh",
    name: "エバーフレッシュ",
    latin: "Cojoba arborea",
    price: 2800,
    potSize: "4号（直径12cm）",
    height: "約41cm",
    place: "明るい日陰・室内向き",
    water: "土の表面が乾いたら たっぷり",
    story:
      "夜になると葉を閉じて眠ります。日中の明るい窓辺に置いてあげると、朝きちんと開いてご挨拶を。",
    stock: 4,
  },
  {
    id: "monstera",
    name: "モンステラ",
    latin: "Monstera deliciosa",
    price: 1980,
    potSize: "4号（直径12cm）",
    height: "約38cm",
    place: "レースカーテン越しの光",
    water: "土の表面が乾いたら たっぷり",
    story:
      "大きな切れ込みの入った葉が一枚増えるたび、部屋の景色が変わります。育てやすさは折り紙つき。",
    stock: 5,
    image: "/images/monstera.jpg",
  },
  {
    id: "sansevieria",
    name: "サンスベリア",
    latin: "Sansevieria trifasciata",
    price: 1600,
    potSize: "3号（直径9cm）",
    height: "約25cm",
    place: "明るい場所・日陰でも可",
    water: "乾かし気味に。冬は月1回ほど",
    story:
      "水やりを忘れても平気なくらい丈夫です。すっと立つ葉が、置くだけで空気を引きしめてくれます。",
    stock: 3,
  },
  {
    id: "pothos",
    name: "ポトス",
    latin: "Epipremnum aureum",
    price: 980,
    potSize: "3号（直径9cm）",
    height: "約20cm",
    place: "レースカーテン越しの光",
    water: "土の表面が乾いたら たっぷり",
    story:
      "はじめての一鉢に。つるが伸びてきたら、棚の上から垂らして楽しんでください。",
    stock: 8,
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
