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
  /* ---------- 2026-11 佐賀駅 追加入荷（3） ---------- */
  {
    id: "pothos-enjoy",
    name: "ポトス エンジョイ",
    latin: "Epipremnum aureum 'N'Joy'",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり",
    story:
      "白い斑がくっきり入る、小さめの葉のポトス。つるが伸びてきたら、棚の上から垂らして楽しんでください。",
    stock: 10,
    image: "/images/products/pothos-enjoy.jpg",
  },
  {
    id: "gajumaru-3480",
    name: "ガジュマル",
    latin: "Ficus microcarpa",
    price: 3480,
    potSize: "鉢植え",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。冬は控えめに",
    story:
      "ぷっくりした根がかわいい、沖縄では「精霊が宿る木」と呼ばれる縁起もの。丈夫で育てやすく、贈りものにもおすすめです。",
    stock: 10,
    image: "/images/products/gajumaru-3480.jpg",
  },
  /* ---------- 2026-11 佐賀駅 追加入荷（2） ---------- */
  {
    id: "euphorbia-obesa",
    name: "ユーフォルビア・オベサ",
    latin: "Euphorbia obesa",
    price: 1680,
    potSize: "鉢植え",
    height: "—",
    place: "明るい窓辺（日当たりが好き）",
    water: "春〜秋は土がしっかり乾いてから。冬は断水気味に",
    story:
      "まんまるの姿から「野球ボール」とも呼ばれる多肉植物。よく日に当てて、乾かし気味に育てるのがコツです。",
    stock: 15,
    image: "/images/products/euphorbia-obesa.jpg",
  },
  /* ---------- 2026-11 佐賀駅 追加入荷 ----------
   * 価格：Sサイズ 980円／Mサイズ 1,180円／アスプレニウム 2,480円／トキワシノブ 1,980円
   * 高さは未計測のため「—」。stock は入荷数。 */
  {
    id: "asplenium",
    name: "アスプレニウム エメラルドウェーブ",
    latin: "Asplenium nidus 'Emerald Wave'",
    price: 2480,
    potSize: "鉢植え",
    height: "—",
    place: "明るい日陰（強い日差しは苦手）",
    water: "土の表面が乾いたら たっぷり。ときどき葉水を",
    story:
      "波打つ葉がきれいなシダの仲間。葉に霧吹きをしてあげると、つやつやの緑が長もちします。",
    stock: 2,
    image: "/images/products/asplenium.jpg",
  },
  {
    id: "tokiwashinobu",
    name: "トキワシノブ",
    latin: "Humata tyermannii",
    price: 1980,
    potSize: "鉢植え",
    height: "—",
    place: "明るい日陰・室内向き",
    water: "土の表面が乾いたら たっぷり。葉水も好き",
    story:
      "鉢のふちからのぞく、白くふさふさした根茎が魅力のシダ。湿り気のある空気が好きです。",
    stock: 2,
    image: "/images/products/tokiwashinobu.jpg",
  },
  {
    id: "gajumaru-s",
    name: "ガジュマル",
    latin: "Ficus microcarpa",
    price: 980,
    potSize: "Sサイズ（当店で植え込み）",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。冬は控えめに",
    story:
      "ぷっくりした根がかわいい、沖縄では「精霊が宿る木」と呼ばれる縁起もの。丈夫で育てやすい一鉢です。",
    stock: 10,
    image: "/images/products/gajumaru-s.jpg",
  },
  {
    id: "pachira-s",
    name: "パキラ",
    latin: "Pachira glabra",
    price: 980,
    potSize: "Sサイズ（当店で植え込み）",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。冬は控えめに",
    story:
      "手のひらのような葉を広げる定番の観葉植物。伸びたら切り戻して、好みの形に育てられます。",
    stock: 6,
    image: "/images/products/pachira-s.jpg",
  },
  {
    id: "peperomia-s",
    name: "ペペロミア",
    latin: "Peperomia",
    price: 980,
    potSize: "Sサイズ（当店で植え込み）",
    height: "—",
    place: "明るい日陰・室内向き",
    water: "土がしっかり乾いてから",
    story:
      "肉厚の葉に水をためこむタイプ。乾かし気味に育てるのが長もちのコツです。",
    stock: 4,
    image: "/images/products/peperomia-s.jpg",
  },
  {
    id: "gajumaru-m",
    name: "ガジュマル",
    latin: "Ficus microcarpa",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。冬は控えめに",
    story:
      "ぷっくりした根がかわいい、沖縄では「精霊が宿る木」と呼ばれる縁起もの。丈夫で育てやすい一鉢です。",
    stock: 4,
    image: "/images/products/gajumaru-m.jpg",
  },
  {
    id: "sansevieria-m",
    name: "サンスベリア",
    latin: "Sansevieria trifasciata",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい場所・日陰でも可",
    water: "乾かし気味に。冬は月1回ほど",
    story:
      "水やりを忘れても平気なくらい丈夫です。すっと立つ葉が、置くだけで空気を引きしめてくれます。",
    stock: 3,
    image: "/images/products/sansevieria-m.jpg",
  },
  {
    id: "peperomia-m",
    name: "ペペロミア",
    latin: "Peperomia",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい日陰・室内向き",
    water: "土がしっかり乾いてから",
    story:
      "肉厚の葉に水をためこむタイプ。乾かし気味に育てるのが長もちのコツです。",
    stock: 4,
    image: "/images/products/peperomia-m.jpg",
  },
  {
    id: "asparagus-m",
    name: "アスパラガス",
    latin: "Asparagus setaceus",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい室内・レースカーテン越し",
    water: "土の表面が乾いたら たっぷり。乾かしすぎに注意",
    story:
      "霧のようにふわふわの葉。乾燥が苦手なので、ときどき霧吹きをしてあげると元気に育ちます。",
    stock: 3,
    image: "/images/products/asparagus-m.jpg",
  },
  {
    id: "cordyline-m",
    name: "コルジリネ",
    latin: "Cordyline fruticosa",
    price: 1180,
    potSize: "Mサイズ",
    height: "—",
    place: "明るい室内（日に当てると色が冴えます）",
    water: "土の表面が乾いたら たっぷり",
    story:
      "赤や黄色の葉色が一鉢ごとに少しずつ違います。お気に入りの色を選んでください。",
    stock: 4,
    image: "/images/products/cordyline-m.jpg",
  },
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
    image: "/images/products/hibotan.jpg",
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
    image: "/images/products/peperomia.jpg",
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
    image: "/images/products/ficus-ruby.jpg",
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
    image: "/images/products/schefflera.jpg",
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
    image: "/images/products/pachira.jpg",
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
    image: "/images/products/asparagus.jpg",
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
    image: "/images/products/cordyline.jpg",
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
    image: "/images/products/sansevieria.jpg",
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
