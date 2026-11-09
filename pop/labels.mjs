/**
 * 鉢につける販売ラベル 11パターン（形・サイズ違い）
 * L11 は画像生成案 D02（pop/codex/）を組み直した「QR＝お会計の入り口」のシール。
 *   タテ長のまま 22.5×52mm に縮め、A4に8列×5段＝40枚。ラベルの間2mm・用紙のふちに余白をとり、
 *   切り取りの点線は描かず、用紙のふちにトンボ（裁ち位置の印）だけを入れる。
 *
 * どれも「品名・価格・購入用QR」は必ず入れる。
 * 色・書体・ロゴは build.mjs の共通スタイル（看板と同じブルー1色）を使う。
 *
 * 形が四角でないもの（丸・ピック・荷札など）は、灰色の点線で切り取り線を描く。
 */

/** 切り取り線つきの台紙（四角以外の形） */
const cutShape = (w, h, d, fill = "var(--paper)") =>
  `<svg class="cut" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm" preserveAspectRatio="none"><path d="${d}" fill="${fill}" stroke="#BDBDBD" stroke-width=".18" stroke-dasharray=".8 .6"/></svg>`;

export const LABELS = [
  {
    id: "L01",
    name: "スティック型",
    size: [22, 110],
    use: "土に直接さす細長い挿しラベル。小さな3号鉢向け",
    shape: true,
  },
  { id: "L02", name: "ミニスクエア", size: [40, 40], use: "鉢の側面に貼るシール。いちばん小さく、目立たない" },
  { id: "L03", name: "まるシール", size: [50, 50], use: "鉢カバーの正面に貼る丸いシール。やわらかい印象", shape: true },
  { id: "L04", name: "荷札タグ（クラフト）", size: [48, 88], use: "穴に麻ひもを通して茎や鉢のふちに掛ける", shape: true, kraft: true },
  { id: "L05", name: "鉢まわりの帯", size: [150, 30], use: "鉢のまわりにぐるっと貼る帯。正面から全部読める" },
  { id: "L06", name: "テント型", size: [50, 100], use: "まん中で山折りし、鉢の手前に立てる（折ると50×50）" },
  { id: "L07", name: "フラッグピック", size: [50, 115], use: "旗の形に切って土にさす。棚の奥の鉢でもQRが見える", shape: true },
  { id: "L08", name: "ヨコ長スリム", size: [74, 26], use: "鉢のふちのすぐ下に貼る。値札シールの感覚で" },
  { id: "L09", name: "育て方カード", size: [55, 91], use: "「店主より」のひとことと育て方入り。ギフト向けにそのまま持ち帰り" },
  { id: "L10", name: "表組み（クラフト）", size: [50, 76], use: "品名・鉢・価格を罫線の表で。いちばん“無印らしい”形", kraft: true },
  {
    id: "L11",
    name: "お会計QRシール（D02）",
    size: [22.5, 52],
    use: "タテ長。上から品名→価格→「お会計はこちらから↓」→QR。A4に40枚、トンボで切る",
    grid: { cols: 8, rows: 5, gap: 2 },
    noCut: true,
  },
];

export const LABEL_CSS = `
.lb{position:relative;overflow:hidden;color:var(--ink);background:var(--paper)}
.lb.shp{background:none}
.lb dt svg{display:block;fill:none;stroke:var(--ink);stroke-linecap:round;stroke-linejoin:round}
.lb .price .t{font-size:5pt}
.lb .cut{position:absolute;inset:0;z-index:0}
.lb > .in{position:relative;z-index:1;width:100%;height:100%}
.lb .price{color:var(--ink-d);display:flex;align-items:baseline;justify-content:center;gap:.6mm}
.lb .price .y{font-family:var(--en)}
.lb .price .n{font-family:var(--en);line-height:1}
.lb .price .t{color:var(--ink-2)}
.lb .latin{font-family:var(--en);font-style:italic;color:var(--ink-3)}
.lb.kraft{--paper:#EEE5D5}
.lb.kraft .cut path{fill:#EEE5D5}
.lb .sample{font-size:4.2pt;margin-top:.3mm}

/* L01 スティック */
.L01 .in{display:flex;flex-direction:column;align-items:center;padding-top:3mm}
.L01 .qr{width:16mm;height:16mm}
.L01 .price{margin-top:1.6mm;flex-wrap:wrap;width:18mm}.L01 .price .t{width:100%;text-align:center}.L01 .price .n{font-size:9.5pt}.L01 .price .y{font-size:6pt}
.L01 .vt{writing-mode:vertical-rl;font-size:10pt;font-weight:500;letter-spacing:.2em;margin-top:3mm}
.L01 .mark{width:7mm;height:6.6mm;margin-top:auto;margin-bottom:23mm}

/* L02 ミニスクエア */
.L02 .in{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.6mm;border:.15mm solid var(--rule)}
.L02 .nm{font-size:7pt;font-weight:500;letter-spacing:.08em}
.L02 .qr{width:22mm;height:22mm;margin:1.4mm 0}
.L02 .price .n{font-size:9.5pt}.L02 .price .y{font-size:6pt}.L02 .price .t{font-size:4.6pt}

/* L03 まる */
.L03 .in{display:flex;flex-direction:column;align-items:center;justify-content:center}
.L03 .mark{width:6mm;height:5.6mm}
.L03 .nm{font-size:7.4pt;font-weight:500;letter-spacing:.08em;margin-top:.6mm}
.L03 .qr{width:21mm;height:21mm;margin:1.2mm 0 1mm}
.L03 .price .n{font-size:9.5pt}.L03 .price .y{font-size:6pt}.L03 .price .t{font-size:4.6pt}

/* L04 荷札タグ */
.L04 .in{display:flex;flex-direction:column;align-items:center;padding:15mm 4.4mm 3.6mm;text-align:center}
.L04 .nm{font-size:10.5pt;font-weight:500;letter-spacing:.08em}
.L04 .latin{font-size:5.4pt}
.L04 .hair{width:100%;margin:2mm 0}
.L04 .qr{width:24mm;height:24mm}
.L04 .cap{font-size:5.2pt;color:var(--ink-2);margin-top:1.4mm;letter-spacing:.06em}
.L04 .price{margin-top:2.2mm}.L04 .price .n{font-size:14pt}.L04 .price .y{font-size:8pt}.L04 .price .t{font-size:5pt}
.L04 .ft{margin-top:auto;display:flex;align-items:center;gap:1.4mm;font-size:4.6pt;color:var(--ink-3);letter-spacing:.1em}
.L04 .ft .mark{width:4.6mm;height:4.3mm}

/* L05 帯 */
.L05 .in{display:grid;grid-template-columns:9mm 1fr 36mm 21mm 21mm;column-gap:3.4mm;align-items:center;padding:0 4.4mm;border-top:.25mm solid var(--ink);border-bottom:.25mm solid var(--ink)}
.L05 .mark{width:9mm;height:8.5mm}
.L05 .nm{font-size:10pt;font-weight:500;letter-spacing:.08em;line-height:1.3}
.L05 .latin{font-size:5.4pt;display:block}
.L05 dl{display:grid;grid-template-columns:3mm 1fr;gap:.8mm 1.2mm;font-size:5.4pt;line-height:1.35;color:var(--ink-2);border-left:.15mm solid var(--rule);padding-left:3mm}
.L05 dl svg{width:3mm;height:3mm;stroke-width:1.5}
.L05 .price{flex-wrap:wrap}.L05 .price .y{font-size:8pt}.L05 .price .t{width:100%;text-align:center}.L05 .price .n{font-size:14pt}.L05 .price .t{font-size:5pt}
.L05 .qr{width:19mm;height:19mm}

/* L06 テント */
.L06 .in{display:grid;grid-template-rows:1fr 1fr}
.L06 .half{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3mm}
.L06 .back{transform:rotate(180deg);border-bottom:.15mm dashed var(--rule)}
.L06 .mark{width:9mm;height:8.5mm}
.L06 .nm{font-size:10pt;font-weight:500;letter-spacing:.08em;margin-top:1.4mm}
.L06 .latin{font-size:5.4pt}
.L06 .price{margin-top:2mm}.L06 .price .n{font-size:15pt}.L06 .price .y{font-size:8pt}.L06 .price .t{font-size:5pt}
.L06 .qr{width:27mm;height:27mm}
.L06 .cap{font-size:5.2pt;color:var(--ink-2);margin-top:1.4mm;letter-spacing:.06em}
.L06 .fold{position:absolute;left:1mm;top:50%;transform:translateY(-50%);font-size:3.8pt;color:#9A9A9A;z-index:2;background:#fff;padding:0 .6mm}

/* L07 フラッグピック */
.L07 .in{height:62mm;display:flex;flex-direction:column;align-items:center;padding:3.6mm 4mm 3mm;text-align:center}
.L07 .hd{display:flex;align-items:center;gap:1.6mm}
.L07 .mark{width:5.6mm;height:5.3mm}
.L07 .nm{font-size:9pt;font-weight:500;letter-spacing:.08em}
.L07 .qr{width:27mm;height:27mm;margin-top:2.4mm}
.L07 .price{margin-top:auto}.L07 .price .n{font-size:13pt}.L07 .price .y{font-size:7.4pt}.L07 .price .t{font-size:5pt}
.L07 .stem{position:absolute;z-index:1;left:20mm;top:64mm;width:10mm;height:38mm;display:flex;align-items:center;justify-content:center}
.L07 .stem span{writing-mode:vertical-rl;font-family:var(--en);font-size:4.4pt;letter-spacing:.24em;color:var(--ink-3)}

/* L08 ヨコ長スリム */
.L08 .in{display:grid;grid-template-columns:1fr auto 18mm;column-gap:2.6mm;align-items:center;padding:0 2.6mm 0 3.4mm;border:.15mm solid var(--rule)}
.L08 .eb{font-size:4.4pt;letter-spacing:.14em;color:var(--ink-3)}
.L08 .nm{white-space:nowrap;font-size:8.4pt;font-weight:500;letter-spacing:.06em;line-height:1.35}
.L08 .latin{font-size:4.6pt}
.L08 .price{flex-wrap:wrap;justify-content:flex-end;max-width:21mm}.L08 .price .y{font-size:7pt}.L08 .price .t{width:100%;text-align:right}.L08 .price .n{font-size:13pt}.L08 .price .t{font-size:4.4pt}
.L08 .qr{width:18mm;height:18mm}

/* L09 育て方カード */
.L09 .in{display:flex;flex-direction:column;padding:5mm 5mm 4.4mm}
.L09 .hd{display:flex;justify-content:space-between;align-items:flex-start}
.L09 .nm{font-size:11.5pt;font-weight:500;letter-spacing:.08em;line-height:1.3}
.L09 .latin{font-size:5.6pt}
.L09 .mark{width:8mm;height:7.5mm}
.L09 .owner{margin-top:3mm;background:color-mix(in srgb,var(--ink) 6%,#fff);padding:2.4mm 2.6mm;font-size:5.8pt;line-height:1.75;color:var(--ink-2)}
.L09 .owner b{display:block;font-size:4.8pt;letter-spacing:.16em;color:var(--ink-3);font-weight:500;margin-bottom:.6mm}
.L09 dl{display:grid;grid-template-columns:3.2mm 1fr;gap:1.1mm 1.4mm;font-size:5.8pt;line-height:1.35;color:var(--ink-2);margin-top:2.8mm}
.L09 dl svg{width:3.2mm;height:3.2mm;stroke-width:1.5}
.L09 .ft{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;border-top:.15mm solid var(--rule);padding-top:2.6mm}
.L09 .price{justify-content:flex-start}.L09 .price .n{font-size:15pt}.L09 .price .y{font-size:8pt}.L09 .price .t{font-size:5pt}
.L09 .qr{width:17mm;height:17mm}
.L09 .ft .cap{font-size:4.6pt;color:var(--ink-3);margin-top:.8mm}

/* L10 表組み */
.L10 .in{padding:3.4mm;display:flex;flex-direction:column}
.L10 table{width:100%;border-collapse:collapse;font-size:6pt;color:var(--ink-2)}
.L10 th,.L10 td{border:.2mm solid var(--ink);padding:1.1mm 1.4mm;text-align:left;vertical-align:middle;line-height:1.35}
.L10 th{width:11mm;font-weight:400;font-size:5pt;letter-spacing:.1em;color:var(--ink)}
.L10 td.nm{font-size:9pt;font-weight:500;color:var(--ink);letter-spacing:.06em}
.L10 td.pr{padding:1.6mm 1.4mm}
.L10 .price{justify-content:flex-start}.L10 .price .n{font-size:15pt}.L10 .price .y{font-size:8pt}.L10 .price .t{font-size:5pt}
.L10 .bt{margin-top:2.2mm;display:flex;align-items:center;gap:2.6mm}
.L10 .qr{width:18mm;height:18mm}
.L10 .bt p{font-size:5.4pt;line-height:1.6;color:var(--ink-2)}
.L10 .bt p .en{display:block;font-size:4.6pt;color:var(--ink-3)}
.L10 .bt .mark{width:6mm;height:5.6mm;margin-top:1.6mm}

/* L11 お会計QRシール（D02・タテ長 22.5×52mm）
   QRは読み取れる最小に近い 11.6mm（1マス約0.35mm）にして、そのぶん文字を大きくしている */
.L11 .in{display:flex;flex-direction:column;align-items:center;padding:2.3mm 1.4mm 1.6mm;text-align:center}
.L11 .mark{width:6.6mm;height:6.2mm}
.L11 .rule{width:100%;border-top:.15mm solid var(--ink);margin:1mm 0}
.L11 .rule.first{margin-top:1.2mm}
.L11 .nm{font-weight:500;line-height:1.2;white-space:nowrap}
.L11 .latin{line-height:1.3;white-space:nowrap;margin-top:.2mm}
.L11 .price{line-height:1;gap:.5mm}.L11 .price .n{font-size:13pt}.L11 .price .y{font-size:7pt}.L11 .price .t{font-size:4.6pt}
.L11 .go{display:flex;align-items:center;justify-content:center;gap:.5mm;font-size:5.2pt;font-weight:500;color:var(--ink-d);white-space:nowrap}
.L11 .go svg{width:2.4mm;height:2.4mm;fill:none;stroke:var(--ink-d);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.L11 .qr{width:11.6mm;height:11.6mm;margin-top:1.2mm}
.L11 .cap{font-size:4.3pt;line-height:1.35;color:var(--ink-2);margin-top:1.1mm}
.L11 .cap .en{display:block;font-family:var(--en);font-size:3.8pt;color:var(--ink-3);letter-spacing:.1em;margin-top:.2mm}
.L11 .sample{position:absolute;left:0;right:0;bottom:.3mm;margin:0;font-size:2.8pt}
`;

/** 各ラベルのHTML（商品1つぶん） */
export async function renderLabel(L, p, h) {
  const { qrSvg, productUrl, sampleNote, icon, yen, potShort } = h;
  const qr = `<div class="qr">${await qrSvg(productUrl(p.id))}</div>${sampleNote()}`;
  const price = `<p class="price"><span class="y">¥</span><span class="n">${yen(p.price)}</span><span class="t">税込</span></p>`;
  const [w, hgt] = L.size;
  const cls = `lb ${L.id}${L.kraft ? " kraft" : ""}${L.shape ? " shp" : ""}`;
  const box = (inner, cut = "") =>
    `<article class="${cls}" style="width:${w}mm;height:${hgt}mm">${cut}<div class="in">${inner}</div></article>`;
  const care = `<dt>${icon.sun}</dt><dd>${p.place}</dd><dt>${icon.drop}</dt><dd>${p.water}</dd>`;

  switch (L.id) {
    case "L01":
      return box(
        `${qr}${price}<p class="vt">${p.name}</p><i class="mark"></i>`,
        cutShape(w, hgt, `M1 1H${w - 1}V${hgt - 18}L${w / 2} ${hgt - 1}L1 ${hgt - 18}Z`),
      );
    case "L02":
      return box(`<p class="nm">${p.name}</p>${qr}${price}`);
    case "L03":
      return box(
        `<i class="mark"></i><p class="nm">${p.name}</p>${qr}${price}`,
        `<svg class="cut" viewBox="0 0 50 50" width="50mm" height="50mm"><circle cx="25" cy="25" r="24.4" fill="var(--paper)" stroke="#BDBDBD" stroke-width=".18" stroke-dasharray=".8 .6"/></svg>`,
      );
    case "L04":
      return box(
        `<p class="nm">${p.name}</p><p class="latin">${p.latin}</p><hr class="hair">${qr}<p class="cap">読みとって お会計へ</p>${price}<p class="ft"><i class="mark"></i>JR SAGA STATION</p>`,
        cutShape(w, hgt, `M9 .6H${w - 9}L${w - .6} 9V${hgt - .6}H.6V9Z`, "#EEE5D5") +
          `<svg class="cut" viewBox="0 0 ${w} ${hgt}" width="${w}mm" height="${hgt}mm" style="z-index:1"><circle cx="${w / 2}" cy="7.4" r="4.2" fill="none" stroke="var(--rule)" stroke-width=".3"/><circle cx="${w / 2}" cy="7.4" r="2.4" fill="#fff" stroke="#BDBDBD" stroke-width=".18" stroke-dasharray=".6 .5"/></svg>`,
      );
    case "L05":
      return box(
        `<i class="mark"></i><p class="nm">${p.name}<span class="latin">${p.latin}</span></p><dl>${care}</dl>${price}<div style="display:flex;flex-direction:column;align-items:center">${qr}</div>`,
      );
    case "L06":
      return box(
        `<div class="half back">${qr}<p class="cap">スマホで読みとって お会計へ</p></div>
         <div class="half"><i class="mark"></i><p class="nm">${p.name}</p><p class="latin">${p.latin}</p>${price}</div>`,
      ) .replace('<div class="in">', '<span class="fold">山折り</span><div class="in">');
    case "L07":
      return `<article class="${cls}" style="width:${w}mm;height:${hgt}mm">${cutShape(
        w,
        hgt,
        `M3.6 .6H${w - 3.6}Q${w - .6} .6 ${w - .6} 3.6V61.4Q${w - .6} 64.4 ${w - 3.6} 64.4H30V${hgt - 12}L25 ${hgt - .6}L20 ${hgt - 12}V64.4H3.6Q.6 64.4 .6 61.4V3.6Q.6 .6 3.6 .6Z`,
      )}<div class="in"><p class="hd"><i class="mark"></i><span class="nm">${p.name}</span></p>${qr}${price}</div><div class="stem"><span>JR SAGA STATION</span></div></article>`;
    case "L08":
      return box(
        `<div><p class="eb">観葉植物・${potShort(p.potSize)}鉢</p><p class="nm">${p.name}</p><p class="latin">${p.latin}</p></div>${price}<div>${qr}</div>`,
      );
    case "L09":
      return box(
        `<div class="hd"><div><p class="nm">${p.name}</p><p class="latin">${p.latin}</p></div><i class="mark"></i></div>
         <div class="owner"><b>店主より</b>${p.story}</div>
         <dl>${care}<dt>${icon.pot}</dt><dd>${p.potSize}・高さ${p.height}</dd></dl>
         <div class="ft"><div>${price}<p class="cap">読みとって お会計へ ／ Scan to buy</p></div><div>${qr}</div></div>`,
      );
    case "L10":
      return box(
        `<table>
          <tr><th>品名</th><td class="nm">${p.name}</td></tr>
          <tr><th>学名</th><td class="latin">${p.latin}</td></tr>
          <tr><th>鉢</th><td>${p.potSize}</td></tr>
          <tr><th>置き場所</th><td>${p.place}</td></tr>
          <tr><th>価格</th><td class="pr">${price}</td></tr>
        </table>
        <div class="bt"><div>${qr}</div><div><p>読みとって<br>お会計へ<span class="en">Scan to buy</span></p><i class="mark"></i></div></div>`,
      );
    case "L11": {
      // 品名・学名は幅（約19mm）に収まる大きさに自動で縮める。長い品名は「・」かスペースで2行に
      const lines = p.name.length > 9 ? p.name.split(/[・ ]/) : [p.name];
      const longest = Math.max(...lines.map((l) => l.length));
      const nmPt = Math.min(7.4, 19 / (longest * 0.3528)).toFixed(2);
      const laPt = Math.min(3.9, 19 / (p.latin.length * 0.3528 * 0.47)).toFixed(2);
      return box(
        `<i class="mark"></i>
         <hr class="rule first"><p class="nm" style="font-size:${nmPt}pt">${lines.join("<br>")}</p><p class="latin" style="font-size:${laPt}pt">${p.latin}</p>
         <hr class="rule">${price}
         <hr class="rule"><p class="go">お会計はこちらから<svg viewBox="0 0 12 12"><path d="M6 1.5v9M2.2 6.8 6 10.5l3.8-3.7"/></svg></p>
         ${qr}<p class="cap">育て方・商品詳細も<br>このページで<span class="en">Scan to pay</span></p>`,
      );
    }
  }
  throw new Error(`unknown label ${L.id}`);
}

/** A4に入るだけ面付けする列・行数 */
export const fit = ([w, h]) => ({ w, h, cols: Math.floor(194 / w), rows: Math.floor(281 / h) });
