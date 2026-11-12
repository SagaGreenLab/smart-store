/**
 * 「LINEでお電話ください」掲示物（LINEコールのQR）
 *   node pop/call/build.mjs
 * 出力: pop/out/print/07_line-call_A5.pdf（A5横・ベクター）
 *       pop/out/print/lsize/L_line-call_127x89.jpg（L判・300dpi）
 * URL は LINE Official Account Manager → 設定 → 通話 →「LINEコールを宣伝」のもの
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import QRCode from "qrcode";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");

const CALL_URL = "https://lin.ee/9FmjWlk";

const here = path.dirname(fileURLToPath(import.meta.url));
const popDir = path.resolve(here, "..");
const printDir = path.join(popDir, "out/print");
fs.mkdirSync(path.join(printDir, "lsize"), { recursive: true });

// 色は pop/config.json の color（#2E6CB2）から作った濃淡と同じ
const C = { ink: "#2E6CB2", qr: "#265992", ink2: "#4B81BD", ink3: "#86AAD2", rule: "#BCD0E6" };

const qr = await QRCode.toString(CALL_URL, {
  type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: C.qr, light: "#0000" },
});
const asset = (n) => "data:image/png;base64," + fs.readFileSync(path.join(popDir, "assets", n)).toString("base64");

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Source+Sans+3:wght@300;400;500&display=block" rel="stylesheet">
<style>
@page{size:210mm 148mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Zen Kaku Gothic New',sans-serif;color:${C.ink};-webkit-print-color-adjust:exact}
.p{width:210mm;height:148mm;padding:13mm 15mm 11mm;display:flex;flex-direction:column;background:#fff}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.25mm solid ${C.ink};padding-bottom:4mm}
.eyebrow{font-size:8pt;letter-spacing:.2em;color:${C.ink3}}
h1{margin-top:2mm;font-size:19pt;font-weight:500;letter-spacing:.1em;line-height:1.45}
h1 .en{display:block;font-family:'Source Sans 3',sans-serif;font-weight:400;font-size:9.5pt;letter-spacing:.06em;color:${C.ink3};margin-top:.6mm}
header img{width:16mm;height:auto}
.main{flex:1;display:grid;grid-template-columns:1fr 58mm;column-gap:10mm;align-items:center;margin-top:5mm}
.main h2{font-size:9.5pt;font-weight:500;letter-spacing:.1em;padding-bottom:1.6mm;border-bottom:.15mm solid ${C.rule}}
.main h2 .en{font-family:'Source Sans 3',sans-serif;font-weight:400;font-size:7pt;color:${C.ink3};margin-left:2mm;letter-spacing:.04em}
ul{list-style:none;margin-top:2.4mm;font-size:10.5pt;line-height:2;color:${C.ink2}}
li::before{content:"";display:inline-block;width:1.2mm;height:1.2mm;border-radius:50%;background:${C.rule};margin:0 2.4mm .6mm 0;vertical-align:middle}
.note{margin-top:4mm;font-size:8pt;line-height:1.8;color:${C.ink2};border-left:.4mm solid ${C.rule};padding-left:3mm}
.note .en{display:block;font-family:'Source Sans 3',sans-serif;font-size:7pt;color:${C.ink3}}
.qrbox{display:flex;flex-direction:column;align-items:center;text-align:center}
.qrbox .qr{width:46mm;height:46mm}
.qrbox .qr svg{width:100%;height:100%;display:block}
.qrbox b{margin-top:3mm;font-size:10.5pt;font-weight:500;letter-spacing:.08em;line-height:1.5}
.qrbox span{margin-top:.8mm;font-size:7.5pt;color:${C.ink2};letter-spacing:.04em}
.qrbox em{font-style:normal;font-family:'Source Sans 3',sans-serif;font-size:7pt;color:${C.ink3};margin-top:.4mm}
footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:3mm}
footer img{height:5.4mm;width:auto}
footer span{font-size:7pt;color:${C.ink3};letter-spacing:.06em}
</style></head><body>
<article class="p">
  <header>
    <div>
      <p class="eyebrow">LINE で お電話　｜　CALL US ON LINE</p>
      <h1>お困りのときは、<br>LINEでお電話ください。<span class="en">Need help? Call us on LINE. It's free.</span></h1>
    </div>
    <img src="${asset("mark_blue.png")}" alt="">
  </header>
  <div class="main">
    <div>
      <h2>こんなときに<span class="en">For example</span></h2>
      <ul>
        <li>お支払いの端末が動かない</li>
        <li>鉢が割れていた・傷んでいた</li>
        <li>お買いものでわからないことがある</li>
      </ul>
      <p class="note">
        電話に出られないときは、LINEのトークでメッセージをお送りください。本店スタッフがお返事します。
        <span class="en">If we can't answer, please send us a message on LINE.</span>
      </p>
    </div>
    <div class="qrbox">
      <div class="qr">${qr}</div>
      <b>読みとって、LINEで通話</b>
      <span>通話料は無料です（LINEアプリが必要です）</span>
      <em>Scan to call us on LINE</em>
    </div>
  </div>
  <footer>
    <img src="${asset("wordmark_blue.png")}" alt="だいいちえんげいセンター">
    <span>佐賀駅店　｜　本店：佐賀市南佐賀</span>
  </footer>
</article>
</body></html>`;

const htmlFile = path.join(popDir, "out/html/07_line-call_A5.html");
fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
fs.writeFileSync(htmlFile, html);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 5 });
await page.goto("file://" + htmlFile, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(printDir, "07_line-call_A5.pdf"), preferCSSPageSize: true, printBackground: true });

// L判 300dpi（横 1500×1051）。A5横とほぼ同じ比率なので少し余白をとって中央に
const shot = await (await page.$("article.p")).screenshot();
await browser.close();
const W = 1500, H = 1051;
const card = await sharp(shot).resize({ width: Math.round(W * 0.96), height: Math.round(H * 0.96), fit: "inside" }).toBuffer();
const m = await sharp(card).metadata();
await sharp({ create: { width: W, height: H, channels: 3, background: "#fff" } })
  .composite([{ input: card, left: Math.round((W - m.width) / 2), top: Math.round((H - m.height) / 2) }])
  .withMetadata({ density: 300 })
  .jpeg({ quality: 95 })
  .toFile(path.join(printDir, "lsize/L_line-call_127x89.jpg"));
console.log("out/print/07_line-call_A5.pdf / lsize/L_line-call_127x89.jpg");
