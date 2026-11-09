/**
 * 佐賀駅 無人店舗｜店内POP・プライスカード・鉢用QRタグ 生成スクリプト
 *
 *   npm run pop
 *
 * 商品データは lib/products.ts（決済サイトと同じもの）をそのまま読む。
 * 出力: pop/out/print/*.pdf（印刷用・実寸）, pop/out/preview/*.png（確認用）
 *
 * デザインの方針は pop/README.md を参照。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import QRCode from "qrcode";
import sharp from "sharp";
import { createRequire } from "node:module";
import { LABELS, LABEL_CSS, renderLabel, fit } from "./labels.mjs";
// playwright はプロジェクト依存に入れていない（ローカルの npx playwright / グローバル導入を利用）
const { chromium } = createRequire(import.meta.url)("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
// 色違いを試すとき: npm run pop -- --color "#2E6CB2" --out out_bright
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const outDir = path.join(here, arg("--out") || "out");
const printDir = path.join(outDir, "print");
const previewDir = path.join(outDir, "preview");
const htmlDir = path.join(outDir, "html");
for (const d of [printDir, previewDir, htmlDir]) fs.mkdirSync(path.join(d, "labels"), { recursive: true });

const config = JSON.parse(fs.readFileSync(path.join(here, "config.json"), "utf8"));
const BASE_URL = (config.baseUrl || "").replace(/\/$/, "");
const LINE_URL = config.lineUrl || "";

/* ---------- 商品データ（lib/products.ts を変換して読み込む） ---------- */
async function loadProducts() {
  const src = fs.readFileSync(path.join(root, "lib/products.ts"), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const tmp = path.join(outDir, ".products.mjs");
  fs.writeFileSync(tmp, js);
  const mod = await import(pathToFileURL(tmp).href + "?t=" + Date.now());
  fs.rmSync(tmp);
  return mod.PRODUCTS;
}

/* ---------- QR ---------- */
/* ---------- 色（config.json の color から濃淡を作る） ---------- */
const INK = (arg("--color") || config.color || "#2E6CB2").toUpperCase();
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
/** t=1 で元の色、t<1 で白に寄せる、t>1 で黒に寄せる */
const shade = (t) => toHex(hex(INK).map((v) => (t <= 1 ? 255 - (255 - v) * t : v * (2 - t))));
const QR_COLOR = shade(1.18); // 本体色より少し深く。読み取り安定のため
async function qrSvg(url) {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: QR_COLOR, light: "#0000" },
  });
}
const productUrl = (id) => `${BASE_URL || "https://example.com"}/products/${id}`;
const sampleNote = (isSet) => (isSet ? "" : `<span class="sample">見本・URL未設定</span>`);

/* ---------- 線画アイコン（猫ロゴの線に合わせた丸い線） ---------- */
const icon = {
  sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>`,
  drop: `<svg viewBox="0 0 24 24"><path d="M12 3.2c3.6 4.6 6.1 7.7 6.1 10.8a6.1 6.1 0 0 1-12.2 0c0-3.1 2.5-6.2 6.1-10.8z"/></svg>`,
  pot: `<svg viewBox="0 0 120 120"><path d="M39 94h42l-5 20H44z"/><path d="M60 94V50"/><path d="M60 72c-15-2-24-13-24-26 13 0 24 9 24 26z"/><path d="M60 62c15-2 24-13 24-26-13 0-24 9-24 26z"/><path d="M60 88c-11-1-17-9-17-18 10 0 17 7 17 18z"/></svg>`,
  phone: `<svg viewBox="0 0 120 120"><rect x="36" y="12" width="48" height="96" rx="8"/><path d="M54 100h12"/><rect x="47" y="36" width="10" height="10"/><rect x="63" y="36" width="10" height="10"/><rect x="47" y="52" width="10" height="10"/><path d="M63 52h4M71 52v4M63 60h10M67 56v6"/><path d="M42 76h36"/><path d="M42 84h24"/></svg>`,
  terminal: `<svg viewBox="0 0 120 120"><rect x="30" y="34" width="44" height="72" rx="7"/><rect x="38" y="44" width="28" height="22" rx="2"/><path d="M40 78h24M40 88h16"/><path d="M84 40c5 5 5 15 0 20"/><path d="M92 33c9 9 9 25 0 34"/><path d="M100 26c13 13 13 35 0 48"/></svg>`,
  bag: `<svg viewBox="0 0 120 120"><path d="M28 44h64l-6 62H34z"/><path d="M46 52V36a14 14 0 0 1 28 0v16"/></svg>`,
  camera: `<svg viewBox="0 0 120 120"><path d="M18 40l62-14 6 26-62 14z"/><circle cx="76" cy="44" r="5"/><path d="M50 61l6 18"/><path d="M34 86h30"/><path d="M56 79v7"/><path d="M90 38l14-4M92 48l14 2"/></svg>`,
  chat: `<svg viewBox="0 0 120 120"><path d="M22 30h76a8 8 0 0 1 8 8v38a8 8 0 0 1-8 8H58l-20 16V84H22a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z"/><path d="M60 72V50"/><path d="M60 60c-8-1-13-7-13-14 7 0 13 5 13 14z"/><path d="M60 56c8-1 13-7 13-14-7 0-13 5-13 14z"/></svg>`,
};

/* ---------- 共通スタイル ---------- */
const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;1,400&display=block" rel="stylesheet">`;
// ロゴは「形（透明度）」だけ使い、色は本体色で塗り直した PNG を data URI で埋め込む。
// CSS の mask で塗ると、PDF を印刷したときに画像のふちに細い線（四角い枠）が出るため使わない。
async function tintedAsset(n) {
  const { data, info } = await sharp(path.join(here, "assets", n)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const [r, g, b] = hex(INK);
  for (let i = 0; i < data.length; i += 4) [data[i], data[i + 1], data[i + 2]] = [r, g, b];
  const png = await sharp(data, { raw: info }).png().toBuffer();
  return "data:image/png;base64," + png.toString("base64");
}
const LOGO = {
  mark: await tintedAsset("mark_blue.png"),
  wordmark: await tintedAsset("wordmark_blue.png"),
  lockup: await tintedAsset("lockup_blue.png"),
};

const BASE_CSS = `
:root{
  --ink:${INK};       /* 本体色（config.json の color） */
  --ink-d:${shade(1.08)}; /* 価格 */
  --ink-2:${shade(0.86)}; /* 本文 */
  --ink-3:${shade(0.58)}; /* ラベル・英字 */
  --rule:${shade(0.32)};  /* 罫線 */
  --paper:#FFFFFF;
  --kraft:#F5F2EC;    /* 下地を感じる面（ごく薄く） */
  --jp:'Zen Kaku Gothic New','Hiragino Sans',sans-serif;
  --en:'Source Sans 3','Helvetica Neue',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:var(--jp);color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;font-feature-settings:"palt" 1}
.en{font-family:var(--en);letter-spacing:.02em}
svg.i, .ic svg{fill:none;stroke:var(--ink);stroke-linecap:round;stroke-linejoin:round}
.qr svg{display:block;width:100%;height:100%}
.sample{display:block;font-size:5pt;color:#C2410C;letter-spacing:.05em;text-align:center;margin-top:.6mm}
/* ロゴは本体色で塗り直した画像（色を変えてもロゴが追従する） */
.mark,.wordmark,.lockup{display:block;background:var(--src) center/contain no-repeat}
.mark{--src:url(${LOGO.mark})}
.wordmark{--src:url(${LOGO.wordmark})}
.lockup{--src:url(${LOGO.lockup})}
.mark,.wordmark,.lockup,.qr,.ic{flex:none}
.rule{border:0;border-top:.25mm solid var(--ink);opacity:.9}
.hair{border:0;border-top:.15mm solid var(--rule)}
@page{size:A4;margin:0}
.sheet{width:210mm;height:297mm;display:grid;align-content:center;justify-content:center;page-break-after:always;overflow:hidden}
.sheet:last-child{page-break-after:auto}
.sheet{position:relative}
.crop{position:absolute;inset:0;fill:none;stroke:#8A8A8A;stroke-width:.12}
.cell{outline:.1mm dashed #D9D9D9;outline-offset:0;background:var(--paper);overflow:hidden;position:relative}
`;

/** トンボ：用紙のふちに、ラベルの裁ち位置を示す短い線だけを描く（ラベルの上には描かない） */
function cropMarks({ w, h, cols, rows, gap = 0 }) {
  const W = 210, H = 297, len = 3.5, off = 1.5;
  const x0 = (W - (cols * w + (cols - 1) * gap)) / 2;
  const y0 = (H - (rows * h + (rows - 1) * gap)) / 2;
  const xs = Array.from({ length: cols }, (_, c) => [x0 + c * (w + gap), x0 + c * (w + gap) + w]).flat();
  const ys = Array.from({ length: rows }, (_, r) => [y0 + r * (h + gap), y0 + r * (h + gap) + h]).flat();
  const l = [
    ...xs.flatMap((x) => [[x, y0 - off - len, x, y0 - off], [x, H - y0 + off, x, H - y0 + off + len]]),
    ...ys.flatMap((y) => [[x0 - off - len, y, x0 - off, y], [W - x0 + off, y, W - x0 + off + len, y]]),
  ];
  return `<svg class="crop" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">${l
    .map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`)
    .join("")}</svg>`;
}

function sheets(cells, { w, h, cols, rows, gap = 0, crop = false }) {
  const per = cols * rows;
  const pages = [];
  for (let i = 0; i < cells.length; i += per) {
    const chunk = cells.slice(i, i + per);
    while (chunk.length < per) chunk.push(`<div class="cell blank" style="outline:none"></div>`);
    pages.push(
      `<section class="sheet" style="grid-template-columns:repeat(${cols},${w}mm);grid-auto-rows:${h}mm;gap:${gap}mm">${crop ? cropMarks({ w, h, cols, rows, gap }) : ""}${chunk
        .map((c) => (c.startsWith('<div class="cell') ? c : `<div class="cell">${c}</div>`))
        .join("")}</section>`,
    );
  }
  return pages.join("");
}

const doc = (title, css, body, page = "A4") =>
  `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>${title}</title>${FONT_LINK}<style>${BASE_CSS}@page{size:${page};margin:0}${css}</style></head><body>${body}</body></html>`;

const yen = (n) => n.toLocaleString("ja-JP");
const potShort = (s) => s.replace(/（.*?）/, "");

/* =====================================================================
   1. プライスカード 91×55mm（棚の前桟・落下防止バーにクリップ）
   ===================================================================== */
const PRICE_CSS = `
.pc{width:91mm;height:55mm;padding:4.6mm 5mm 4.2mm 5.4mm;display:grid;grid-template-columns:1fr 21mm;column-gap:4.2mm}
.pc .l{display:flex;flex-direction:column;min-width:0}
.pc .eyebrow{font-size:5.6pt;letter-spacing:.14em;color:var(--ink-3);display:flex;gap:2mm;align-items:center}
.pc .eyebrow .m{width:3.6mm;height:3.4mm}
.pc .name{font-size:12.5pt;font-weight:500;letter-spacing:.06em;line-height:1.25;margin-top:1.6mm}
.pc .latin{font-size:6pt;font-style:italic;color:var(--ink-3);margin-top:.3mm}
.pc .hair{margin:2.2mm 0 1.6mm}
.pc dl{display:grid;grid-template-columns:3.2mm 1fr;row-gap:1mm;column-gap:1.4mm;font-size:6.2pt;line-height:1.35;color:var(--ink-2)}
.pc dl .ic svg{width:3.2mm;height:3.2mm;stroke-width:1.5;margin-top:.1mm}
.pc .price{margin-top:auto;display:flex;align-items:baseline;gap:1.2mm;color:var(--ink-d)}
.pc .price .y{font-family:var(--en);font-weight:400;font-size:11pt}
.pc .price .n{font-family:var(--en);font-weight:400;font-size:23pt;line-height:1;letter-spacing:.01em}
.pc .price .t{font-size:6pt;color:var(--ink-2)}
.pc .r{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;border-left:.15mm solid var(--rule);padding-left:3.6mm;margin-left:-.2mm}
.pc .qr{width:17.5mm;height:17.5mm}
.pc .cap{font-size:5.4pt;line-height:1.45;text-align:center;color:var(--ink-2);margin-top:1.6mm;letter-spacing:.04em}
.pc .cap .en{display:block;font-size:4.8pt;color:var(--ink-3)}
.pc .pot{font-size:5.6pt;letter-spacing:.1em;color:var(--ink-2);margin-bottom:auto;text-align:center;border:.15mm solid var(--rule);border-radius:1mm;padding:.5mm 1.6mm}
`;
async function priceCard(p) {
  return `<article class="pc">
  <div class="l">
    <p class="eyebrow"><i class="mark m"></i>観葉植物　<span class="en">FOLIAGE PLANT</span></p>
    <h2 class="name">${p.name}</h2>
    <p class="latin en">${p.latin}</p>
    <hr class="hair">
    <dl>
      <dt class="ic">${icon.sun}</dt><dd>${p.place}</dd>
      <dt class="ic">${icon.drop}</dt><dd>${p.water}</dd>
    </dl>
    <p class="price"><span class="y">¥</span><span class="n">${yen(p.price)}</span><span class="t">税込</span></p>
  </div>
  <div class="r">
    <p class="pot">${potShort(p.potSize)}鉢</p>
    <div class="qr">${await qrSvg(productUrl(p.id))}</div>
    <p class="cap">読みとって<br>お会計へ<span class="en">Scan to buy</span></p>
    ${sampleNote(!!BASE_URL)}
  </div>
</article>`;
}

/* =====================================================================
   2. 鉢用QRタグ 40×70mm（カードホルダーピックに差す／穴をあけて麻ひもで掛ける）
   ===================================================================== */
const TAG_CSS = `
.tg{width:40mm;height:70mm;padding:3.6mm 3.6mm 3mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.tg .m{width:6.4mm;height:6mm}
.tg .name{font-size:9pt;font-weight:500;letter-spacing:.06em;line-height:1.3;margin-top:1.4mm}
.tg .latin{font-size:5pt;font-style:italic;color:var(--ink-3)}
.tg .qr{width:25mm;height:25mm;margin-top:2.6mm}
.tg .cap{font-size:5.6pt;line-height:1.5;color:var(--ink-2);margin-top:2mm;letter-spacing:.04em}
.tg .cap .en{display:block;font-size:4.8pt;color:var(--ink-3)}
.tg .price{margin-top:auto;color:var(--ink-d);display:flex;align-items:baseline;gap:.8mm;border-top:.15mm solid var(--rule);width:100%;justify-content:center;padding-top:1.6mm}
.tg .price .n{font-family:var(--en);font-size:13pt;line-height:1}
.tg .price .y{font-family:var(--en);font-size:7.5pt}
.tg .price .t{font-size:5pt;color:var(--ink-2)}
`;
async function potTag(p) {
  return `<article class="tg">
  <i class="mark m"></i>
  <h3 class="name">${p.name}</h3>
  <p class="latin en">${p.latin}</p>
  <div class="qr">${await qrSvg(productUrl(p.id))}</div>
  ${sampleNote(!!BASE_URL)}
  <p class="cap">スマホで読みとって<br>お会計へおすすみください<span class="en">Scan with your phone to buy</span></p>
  <p class="price"><span class="y">¥</span><span class="n">${yen(p.price)}</span><span class="t">税込</span></p>
</article>`;
}

/* =====================================================================
   3. お買いもののしかた A4（什器② 背板・会計台の上）
   ===================================================================== */
const HOW_CSS = `
.how{width:210mm;height:297mm;padding:17mm 22mm 14mm;display:flex;flex-direction:column;align-items:center;background:#fff}
.how .lockup{width:64mm;height:43mm}
.how .ttl{margin-top:7mm;text-align:center}
.how .ttl h1{font-size:25pt;font-weight:500;letter-spacing:.16em}
.how .ttl p{font-size:11pt;color:var(--ink-3);margin-top:1mm;letter-spacing:.08em}
.how .rule{width:100%;margin:8mm 0 3mm}
.how ol{list-style:none;width:100%}
.how li{display:grid;grid-template-columns:12mm 30mm 1fr;align-items:center;column-gap:6mm;padding:5mm 0;border-bottom:.15mm solid var(--rule)}
.how li:last-child{border-bottom:0}
.how .no{font-family:var(--en);font-weight:300;font-size:30pt;line-height:1;text-align:center;color:var(--ink)}
.how .ic svg{width:30mm;height:30mm;stroke-width:2.6}
.how h2{font-size:16pt;font-weight:500;letter-spacing:.08em;line-height:1.4}
.how .d{font-size:9.5pt;color:var(--ink-2);margin-top:1.2mm;line-height:1.6;letter-spacing:.03em}
.how .e{font-size:9pt;color:var(--ink-3);margin-top:1mm}
.how .foot{margin-top:auto;width:100%;border-top:.25mm solid var(--ink);padding-top:5mm;display:flex;justify-content:space-between;align-items:flex-end}
.how .foot .cash{font-size:14pt;font-weight:500;letter-spacing:.06em}
.how .foot .cash small{display:block;font-size:9pt;font-weight:400;color:var(--ink-2);margin-top:.6mm}
.how .foot .cash .en{display:block;font-size:9pt;color:var(--ink-3);font-weight:400}
.how .foot .rec{font-size:7.5pt;color:var(--ink-3);text-align:right;line-height:1.6}
`;
const howTo = () => `<article class="how">
  <i class="lockup"></i>
  <div class="ttl"><h1>お買いもののしかた</h1><p class="en">How to shop</p></div>
  <hr class="rule">
  <ol>
    <li><span class="no">1</span><span class="ic">${icon.pot}</span>
      <div><h2>気に入った鉢を、えらぶ。</h2><p class="d">手にとって、葉の色や形をじっくり見てください。</p><p class="e en">Pick a plant you like.</p></div></li>
    <li><span class="no">2</span><span class="ic">${icon.phone}</span>
      <div><h2>鉢のQRコードを、スマホで読みとる。</h2><p class="d">お会計の画面がひらきます。育て方もそこに書いています。</p><p class="e en">Scan the QR code on the pot with your phone.</p></div></li>
    <li><span class="no">3</span><span class="ic">${icon.terminal}</span>
      <div><h2>レジ横の端末で、お支払い。</h2><p class="d">カード・交通系IC・QRコード決済がつかえます。</p><p class="e en">Pay at the terminal next to the counter.</p></div></li>
    <li><span class="no">4</span><span class="ic">${icon.bag}</span>
      <div><h2>袋に入れて、お持ち帰り。</h2><p class="d">持ち帰り袋はレジ横のフックにあります。ご自由にどうぞ。</p><p class="e en">Take a bag from the hook. It's free.</p></div></li>
  </ol>
  <div class="foot">
    <p class="cash">お会計はキャッシュレスで！<small>現金はつかえません</small><span class="en">Cashless only, please!</span></p>
    <p class="rec">防犯カメラで録画しています<br><span class="en">This area is monitored by camera.</span></p>
  </div>
</article>`;

/* =====================================================================
   4. お支払い方法 A5横（決済端末のそば）
   ※ 印刷物に決済ロゴ画像は使わない（Square規定：印刷はSquare公式の
     「加盟店専用 印刷用ロゴ用紙」を使用）。下部にステッカー貼付スペースを確保。
   ===================================================================== */
const PAY_CSS = `
.pay{width:210mm;height:148mm;padding:13mm 15mm 11mm;display:flex;flex-direction:column;background:#fff}
.pay header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.25mm solid var(--ink);padding-bottom:4mm}
.pay h1{font-size:20pt;font-weight:500;letter-spacing:.14em}
.pay h1 .en{display:block;font-size:9.5pt;color:var(--ink-3);font-weight:400;letter-spacing:.08em;margin-top:.6mm}
.pay header .m{width:16mm;height:15mm}
.pay .grid{display:grid;grid-template-columns:repeat(3,1fr);column-gap:7mm;margin-top:6mm}
.pay .col h2{font-size:10.5pt;font-weight:500;letter-spacing:.08em;padding-bottom:1.6mm;border-bottom:.15mm solid var(--rule)}
.pay .col h2 .en{display:block;font-size:7pt;color:var(--ink-3);font-weight:400}
.pay .col ul{list-style:none;margin-top:2.4mm;font-size:9.6pt;line-height:1.9;color:var(--ink-2)}
.pay .col .note{font-size:6.6pt;color:var(--ink-3);margin-top:1mm;line-height:1.5}
.pay .logos{margin-top:auto;height:24mm;border:.15mm dashed var(--rule);border-radius:1.5mm;display:flex;align-items:center;justify-content:center;font-size:7pt;color:var(--ink-3);letter-spacing:.06em}
.pay .cash{margin-top:4mm;display:flex;justify-content:space-between;align-items:baseline}
.pay .cash b{font-size:13pt;font-weight:500;letter-spacing:.08em;color:var(--ink)}
.pay .cash span{font-size:8pt;color:var(--ink-2)}
`;
const payPop = () => `<article class="pay">
  <header><h1>お支払い方法<span class="en">Payment options</span></h1><i class="mark m"></i></header>
  <div class="grid">
    <div class="col"><h2>カード・スマホ<span class="en">Card / Smartphone</span></h2>
      <ul><li>VISA ／ Mastercard</li><li>JCB ／ American Express</li><li>Diners Club ／ Discover</li><li>Apple Pay ／ Google Pay</li><li>タッチ決済</li></ul></div>
    <div class="col"><h2>交通系IC・電子マネー<span class="en">IC card / e-money</span></h2>
      <ul><li>SUGOCA ／ nimoca ／ はやかけん</li><li>Suica ／ PASMO ／ ICOCA</li><li>Kitaca ／ TOICA ／ manaca</li><li>iD ／ QUICPay+</li></ul>
      <p class="note">※PiTaPaはご利用いただけません</p></div>
    <div class="col"><h2>QRコード決済<span class="en">QR code</span></h2>
      <ul><li>PayPay ／ d払い</li><li>楽天ペイ ／ au PAY</li><li>メルペイ</li><li>WeChat Pay ／ Alipay+</li></ul></div>
  </div>
  <div class="logos">Square 公式「加盟店専用 印刷用ロゴ」をここに貼ってください</div>
  <p class="cash"><b>現金はつかえません</b><span class="en">No cash accepted.</span></p>
</article>`;

/* =====================================================================
   5. 小さなカード類 91×55mm
      a) 防犯カメラ　b) LINE相談　（同じ名刺サイズで面付け）
   ===================================================================== */
const SMALL_CSS = `
.sm{width:91mm;height:55mm;padding:5mm 6mm;display:flex;flex-direction:column}
.sm .ic svg{stroke-width:2.6}
.cam{flex-direction:row;align-items:center;gap:5mm}
.cam .ic svg{width:22mm;height:22mm}
.cam h2{font-size:12pt;font-weight:500;letter-spacing:.1em;line-height:1.5}
.cam p{font-size:6.6pt;color:var(--ink-2);line-height:1.7;margin-top:1.4mm}
.cam .en{display:block;font-size:6.2pt;color:var(--ink-3);margin-top:.8mm}
.line{display:grid;grid-template-columns:1fr 22mm;column-gap:4.4mm;padding:4.8mm 5mm 4.4mm 5.6mm}
.line .l{display:flex;flex-direction:column}
.line .eyebrow{font-size:5.6pt;letter-spacing:.14em;color:var(--ink-3)}
.line h2{font-size:11pt;font-weight:500;letter-spacing:.06em;line-height:1.45;margin-top:1.2mm}
.line p{font-size:6.2pt;color:var(--ink-2);line-height:1.7;margin-top:1.6mm}
.line .wm{margin-top:auto;width:30mm;height:5.4mm;background-position:left center}
.line .r{display:flex;flex-direction:column;align-items:center;justify-content:center}
.line .qr{width:20mm;height:20mm}
.line .ph{width:20mm;height:20mm;border:.2mm dashed var(--rule);display:flex;align-items:center;justify-content:center;text-align:center;font-size:5pt;color:var(--ink-3);line-height:1.5}
.line .cap{font-size:5.2pt;color:var(--ink-2);margin-top:1.4mm;text-align:center}
`;
const camCard = () => `<article class="sm cam">
  <span class="ic">${icon.camera}</span>
  <div><h2>防犯カメラで<br>録画しています</h2>
  <p>無人のお店です。みなさまに気持ちよく<br>ご利用いただくため、ご協力ください。</p>
  <span class="en">This area is monitored by camera.</span></div>
</article>`;
async function lineCard() {
  const qr = LINE_URL
    ? `<div class="qr">${await qrSvg(LINE_URL)}</div>`
    : `<div class="ph">LINE<br>友だち追加QR<br>（config.json）</div>`;
  return `<article class="sm line">
  <div class="l">
    <p class="eyebrow">LINE で 育て方相談</p>
    <h2>育て方に迷ったら、<br>LINEで聞いてください。</h2>
    <p>葉の写真を送ってもらえれば、園芸店のスタッフがお返事します。相談は無料です。</p>
    <i class="wordmark wm"></i>
  </div>
  <div class="r">${qr}<p class="cap">友だち追加はこちら</p></div>
</article>`;
}

/* =====================================================================
   6. 棚の帯POP 180×42mm（前桟の落下防止バーに沿わせる）
   ===================================================================== */
const STRIP_CSS = `
.st{width:180mm;height:32mm;padding:0 8mm;display:grid;grid-template-columns:76mm 1fr 10mm;align-items:center;column-gap:6mm}
.st h2{white-space:nowrap;font-size:14pt;font-weight:500;letter-spacing:.1em;line-height:1.3}
.st h2 .en{display:block;font-size:7pt;color:var(--ink-3);font-weight:400;letter-spacing:.06em;margin-top:.8mm}
.st p{font-size:8pt;color:var(--ink-2);line-height:1.75;letter-spacing:.03em;border-left:.15mm solid var(--rule);padding-left:6mm}
.st .m{width:10mm;height:9.4mm;opacity:.9}
`;
const STRIPS = [
  ["はじめての一鉢に。", "For your first plant", "水やりを少しくらい忘れても、元気に育ってくれる鉢を集めました。"],
  ["日あたり少なめでも。", "Fine in low light", "北向きの部屋や玄関、オフィスの机でも育てやすい鉢です。"],
  ["お水は10日に1回。", "Water once every 10 days", "ズボラさんの味方です。土がしっかり乾いてから、たっぷりと。"],
  ["前の列は、毎週入れかわり。", "New plants every week", "通勤の行き帰りに、のぞいてみてください。月・水・金に入荷します。"],
  ["贈りものにも。", "Makes a lovely gift", "小さな鉢は、手みやげにちょうどいい大きさです。袋はレジ横にあります。"],
  ["元気がないときは、ご相談を。", "Ask us anytime", "LINEで葉の写真を送ってください。南佐賀の本店スタッフがお返事します。"],
];
const strip = ([jp, en, body]) =>
  `<article class="st"><h2>${jp}<span class="en">${en}</span></h2><p>${body}</p><i class="mark m"></i></article>`;

/* =====================================================================
   出力
   ===================================================================== */
const PRINT_JOBS = [];
const PREVIEWS = [];

async function main() {
  const products = await loadProducts();
  const css = PRICE_CSS + TAG_CSS + HOW_CSS + PAY_CSS + SMALL_CSS + STRIP_CSS;

  const priceCells = await Promise.all(products.map(priceCard));
  const tagCells = [];
  for (const p of products) {
    const t = await potTag(p);
    for (let i = 0; i < Math.max(1, p.stock); i++) tagCells.push(t); // 在庫数ぶん面付け
  }
  const line = await lineCard();

  const files = {
    "01_price-cards_91x55": sheets(priceCells, { w: 91, h: 55, cols: 2, rows: 5 }),
    "02_pot-qr-tags_40x70": sheets(tagCells, { w: 40, h: 70, cols: 4, rows: 4 }),
    "03_how-to-shop_A4": howTo(),
    "04_payment_A5": payPop(),
    "05_cards_camera-line_91x55": sheets(
      [camCard(), camCard(), line, line, line, line, line, line, line, line],
      { w: 91, h: 55, cols: 2, rows: 5 },
    ),
    "06_shelf-strips_180x32": sheets(STRIPS.map(strip), { w: 180, h: 32, cols: 1, rows: 8 }),
  };
  const pageSize = { "03_how-to-shop_A4": "A4", "04_payment_A5": "210mm 148mm" };

  for (const [name, body] of Object.entries(files)) {
    const html = doc(name, css, body, pageSize[name] || "A4");
    const f = path.join(htmlDir, `${name}.html`);
    fs.writeFileSync(f, html);
    PRINT_JOBS.push({ name, file: f });
  }

  /* 確認用：1点ずつを灰色の台紙にのせたPNG */
  const pv = (title, inner, w) =>
    doc(
      title,
      css +
        `body{background:#E9E6E0;padding:10mm;display:flex;gap:8mm;flex-wrap:wrap;align-items:flex-start;width:${w}mm}
         .card{background:#fff;box-shadow:0 1mm 4mm rgba(0,0,0,.12)}`,
      inner,
    );
  PREVIEWS.push(
    ["01_price-cards", pv("price", priceCells.map((c) => `<div class="card">${c}</div>`).join(""), 222)],
    ["02_pot-qr-tags", pv("tags", products.map((_, i) => `<div class="card">${tagCells[products.slice(0, i).reduce((a, p) => a + Math.max(1, p.stock), 0)]}</div>`).join(""), 222)],
    ["03_how-to-shop", pv("how", `<div class="card">${howTo()}</div>`, 230)],
    ["04_payment", pv("pay", `<div class="card">${payPop()}</div>`, 230)],
    ["05_cards", pv("cards", `<div class="card">${camCard()}</div><div class="card">${line}</div>`, 222)],
    ["06_shelf-strips", pv("strips", STRIPS.map((s) => `<div class="card">${strip(s)}</div>`).join(""), 200)],
  );

  /* ---------- 鉢ラベル 10パターン ---------- */
  const helpers = { qrSvg, productUrl, sampleNote: () => sampleNote(!!BASE_URL), icon, yen, potShort };
  const labelCss = css + LABEL_CSS;
  const sample = products.find((p) => p.id === "monstera") || products[0];
  const tiles = [];
  for (const L of LABELS) {
    const one = await Promise.all(products.map((p) => renderLabel(L, p, helpers)));
    const f = L.grid ? { w: L.size[0], h: L.size[1], crop: true, ...L.grid } : fit(L.size);
    // L11 は config.json の l11Sheets（シート名: { 商品ID: 枚数 }）があれば、シートごとにその順と枚数で面付けする
    const plans = L.id === "L11" && config.l11Sheets && Object.keys(config.l11Sheets).length ? Object.entries(config.l11Sheets) : [["", null]];
    for (const [sheetName, plan] of plans) {
      // 同じ商品を別の位置にもう一度並べたいときは "商品ID#メモ"（例: "pachira-s#予備"）と書く
      const pid = (key) => key.split("#")[0];
      if (plan) for (const key of Object.keys(plan)) if (!products.some((p) => p.id === pid(key))) throw new Error(`l11Sheets.${sheetName}: 商品ID "${pid(key)}" が lib/products.ts にない`);
      const picked = plan
        ? Object.entries(plan).flatMap(([key, n]) => Array(n).fill(one[products.findIndex((p) => p.id === pid(key))]))
        : Array.from({ length: f.cols * f.rows }, (_, i) => one[i % one.length]);
      const cells = picked.map((c) =>
        L.shape || L.noCut ? `<div class="cell" style="outline:none;background:none">${c}</div>` : c,
      );
      const name = `labels/${L.id}_${L.size.join("x")}${sheetName ? `_${sheetName}` : ""}`;
      const file = path.join(htmlDir, `${name}.html`);
      fs.writeFileSync(file, doc(`${L.id} ${L.name} ${sheetName}`, labelCss, sheets(cells, f)));
      PRINT_JOBS.push({ name, file });
    }
    tiles.push(
      `<figure class="tile"><div class="stage">${await renderLabel(L, sample, helpers)}</div>
        <figcaption><b>${L.id.replace("L", "")}</b>${L.name}<span class="sz">${L.size[0]}×${L.size[1]}mm${L.grid ? `・A4に${L.grid.cols * L.grid.rows}枚` : ""}</span><span class="use">${L.use}</span></figcaption></figure>`,
    );
  }
  const overview = (title, list) =>
    doc(
      title,
      labelCss +
        `body{background:#E9E6E0;padding:9mm;width:206mm;display:flex;flex-wrap:wrap;gap:9mm 7mm;align-items:flex-start}
         .tile{display:flex;flex-direction:column;gap:3mm}
         .stage{filter:drop-shadow(0 .6mm 1.6mm rgba(0,0,0,.14))}
         .stage .cut path,.stage .cut circle{stroke:none}
         figcaption{font-size:7.4pt;color:#3A3A3A;line-height:1.5;max-width:62mm}
         figcaption b{font-family:var(--en);font-weight:600;color:var(--ink);margin-right:1.6mm;font-size:9pt}
         figcaption .sz{display:inline-block;margin-left:1.6mm;color:#777;font-family:var(--en)}
         figcaption .use{display:block;color:#666;font-size:6.6pt}`,
      list.join(""),
    );
  PREVIEWS.push(
    ["labels/labels_01-05", overview("labels A", tiles.slice(0, 5))],
    ["labels/labels_06-10", overview("labels B", tiles.slice(5, 10))],
    ["labels/labels_11", overview("labels C", tiles.slice(10))],
  );

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const { name, file } of PRINT_JOBS) {
    await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(printDir, `${name}.pdf`), preferCSSPageSize: true, printBackground: true });
  }
  for (const [name, html] of PREVIEWS) {
    const f = path.join(htmlDir, `_preview_${name.replace("/", "_")}.html`);
    fs.writeFileSync(f, html);
    await page.goto(pathToFileURL(f).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator("body").screenshot({ path: path.join(previewDir, `${name}.png`) });
  }
  await browser.close();
  console.log(`done → ${path.relative(root, outDir)}  (color: ${INK} / baseUrl: ${BASE_URL || "未設定・見本"})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
