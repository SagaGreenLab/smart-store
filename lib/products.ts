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
  /* ---------- 2026-11 佐賀駅 初回入荷 ----------
   * 価格：Sサイズ（当店で植え込み）980円／Mサイズ 1,180円／Mのペペロミア 1,680円／ヒボタン 980円
   * 高さは入荷時の写真からの目安。stock は初回の陳列数。 */
  {
    id: "hibotan",
    name: "ヒボタン",
    latin: "Gymnocalycium mihanovichii",
    price: 980,
    potSize: "ミニ鉢",
    height: "約15cm",
    place: "明るい窓辺（日当たりが好き）",
    water: "土が乾いて数日たってから。冬は月1回ほど",
    story:
      "上の赤い玉がヒボタン、下の緑は台木のサボテン。接ぎ木でいっしょに育っています。よく日に当てると色が長もちします。",
    stock: 10,
  },
  {
    id: "peperomia",
    name: "ペペロミア",
    latin: "Peperomia argyreia",
    price: 1680,
    potSize: "Mサイズ",
    height: "約25cm",
    place: "明るい日陰・室内向き",
    water: "土がしっかり乾いてから",
    story:
      "スイカの皮のような葉もようから「スイカペペ」とも。葉に水をためこむので、乾かし気味が長もちのコツです。",
    stock: 4,
  },
  {
    id: "ficus-ruby",
    name: "ゴムの木 ルビー",
    latin: "Ficus elastica 'Ruby'",
    price: 1180,
    potSize: "Mサイズ",
    height: "約35cm",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり",
    story:
      "新しい葉ほどピンクが濃く出ます。明るい場所に置くと、色がきれいにのってきます。",
    stock: 4,
  },
  {
    id: "schefflera",
    name: "シェフレラ",
    latin: "Schefflera arboricola",
    price: 1180,
    potSize: "Mサイズ",
    height: "約25cm",
    place: "明るい室内・日陰でも可",
    water: "土の表面が乾いたら たっぷり",
    story:
      "とても丈夫な斑入りのカポック。多少の水やり忘れでもへこたれない、はじめての方にもおすすめの一鉢です。",
    stock: 3,
  },
  {
    id: "pachira",
    name: "パキラ",
    latin: "Pachira glabra",
    price: 1180,
    potSize: "Mサイズ",
    height: "約40cm",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。冬は控えめに",
    story:
      "ぷっくりした幹から手のひらのような葉を広げます。伸びたら切り戻して、好みの形に育てられます。",
    stock: 4,
  },
  {
    id: "asparagus",
    name: "アスパラガス",
    latin: "Asparagus setaceus",
    price: 980,
    potSize: "Sサイズ（当店で植え込み）",
    height: "約25cm",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。乾かしすぎに注意",
    story:
      "霧のようにふわふわの葉。乾燥が苦手なので、ときどき霧吹きをしてあげると元気に育ちます。",
    stock: 2,
  },
  {
    id: "cordyline",
    name: "コルジリネ",
    latin: "Cordyline fruticosa",
    price: 980,
    potSize: "Sサイズ（当店で植え込み）",
    height: "約20cm",
    place: "明るい室内（日に当てると色が冴えます）",
    water: "土の表面が乾いたら たっぷり",
    story:
      "赤や黄色の葉色が一鉢ごとに少しずつ違います。お気に入りの色を選んでください。",
    stock: 4,
  },
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
