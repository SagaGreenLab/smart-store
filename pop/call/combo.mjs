/**
 * 「お支払い方法」＋「お困りのときは、LINEでお電話ください」A5縦 1枚
 *   node pop/call/combo.mjs
 * 出力: pop/out/print/08_payment-call_A5.pdf（ベクター）
 *       pop/out/print/08_payment-call_A5.jpg（300dpi・写真プリント用）
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import QRCode from "qrcode";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");

const CALL_URL = "https://lin.ee/9FmjWlk"; // LINEコール（管理画面 → 設定 → 通話）

const here = path.dirname(fileURLToPath(import.meta.url));
const popDir = path.resolve(here, "..");
const printDir = path.join(popDir, "out/print");
const C = { ink: "#2E6CB2", qr: "#265992", ink2: "#4B81BD", ink3: "#86AAD2", rule: "#BCD0E6" };

const qr = await QRCode.toString(CALL_URL, {
  type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: C.qr, light: "#0000" },
});
const asset = (n) => "data:image/png;base64," + fs.readFileSync(path.join(popDir, "assets", n)).toString("base64");

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Source+Sans+3:wght@300;400;500&display=block" rel="stylesheet">
<style>
@page{size:148mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Zen Kaku Gothic New',sans-serif;color:${C.ink};-webkit-print-color-adjust:exact}
.en{font-family:'Source Sans 3',sans-serif;font-weight:400}
.p{width:148mm;height:210mm;padding:11mm 12mm 9mm;display:flex;flex-direction:column;background:#fff}

/* 見出し（両ブロック共通） */
.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.25mm solid ${C.ink};padding-bottom:2.6mm}
.hd h1{font-size:15pt;font-weight:500;letter-spacing:.12em;line-height:1.4}
.hd h1 .en{display:block;font-size:7.5pt;color:${C.ink3};letter-spacing:.08em;margin-top:.3mm}
.hd .m{width:12mm;height:auto}
.eyebrow{font-size:6.4pt;letter-spacing:.2em;color:${C.ink3};margin-bottom:1mm}

/* お支払い方法 */
.cols{display:grid;grid-template-columns:repeat(3,1fr);column-gap:4mm;margin-top:3.6mm}
.cols h2{font-size:7.8pt;font-weight:500;letter-spacing:.06em;padding-bottom:1mm;border-bottom:.15mm solid ${C.rule};white-space:nowrap}
.cols h2 .en{display:block;font-size:5.6pt;color:${C.ink3};letter-spacing:.02em}
.cols ul{list-style:none;margin-top:1.6mm;font-size:7pt;line-height:1.85;color:${C.ink2};white-space:nowrap}
.cols .note{font-size:5.4pt;color:${C.ink3};margin-top:.4mm}
.logos{margin-top:3.6mm}
.logos img{width:100%;display:block}
.cash{margin-top:3mm;display:flex;justify-content:space-between;align-items:baseline}
.cash b{font-size:11pt;font-weight:500;letter-spacing:.1em}
.cash span{font-size:7pt;color:${C.ink2}}

/* 区切り */
.sep{margin:6mm 0 5mm;border:0;border-top:.15mm dashed ${C.rule}}

/* LINEでお電話 */
.call{display:grid;grid-template-columns:1fr 36mm;column-gap:6mm;align-items:center;margin-top:3.6mm}
.call h2{font-size:7.8pt;font-weight:500;letter-spacing:.08em;padding-bottom:1mm;border-bottom:.15mm solid ${C.rule}}
.call h2 .en{font-size:5.6pt;color:${C.ink3};margin-left:1.6mm}
.call ul{list-style:none;margin-top:1.6mm;font-size:8pt;line-height:1.95;color:${C.ink2}}
.call li::before{content:"";display:inline-block;width:1mm;height:1mm;border-radius:50%;background:${C.rule};margin:0 1.8mm .5mm 0;vertical-align:middle}
.call .note{margin-top:2.6mm;font-size:6.4pt;line-height:1.75;color:${C.ink2};border-left:.35mm solid ${C.rule};padding-left:2.4mm}
.call .note .en{display:block;font-size:5.6pt;color:${C.ink3}}
.qrbox{display:flex;flex-direction:column;align-items:center;text-align:center}
.qrbox .qr{width:32mm;height:32mm}
.qrbox .qr svg{width:100%;height:100%;display:block}
.qrbox b{margin-top:2.2mm;font-size:8pt;font-weight:500;letter-spacing:.06em;white-space:nowrap}
.qrbox span{margin-top:.6mm;font-size:5.8pt;color:${C.ink2};white-space:nowrap}
.qrbox .en{font-size:5.6pt;color:${C.ink3};margin-top:.2mm}

footer{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end}
footer img{height:4.4mm;width:auto}
footer span{font-size:6pt;color:${C.ink3};letter-spacing:.06em}
</style></head><body>
<article class="p">

  <header class="hd">
    <h1>お支払い方法<span class="en">Payment options</span></h1>
    <img class="m" src="${asset("mark_blue.png")}" alt="">
  </header>
  <div class="cols">
    <div><h2>カード・スマホ<span class="en">Card / Smartphone</span></h2>
      <ul><li>VISA ／ Mastercard</li><li>JCB ／ AMEX</li><li>Diners ／ Discover</li><li>Apple Pay ／ Google Pay</li><li>タッチ決済</li></ul></div>
    <div><h2>交通系IC・電子マネー<span class="en">IC card / e-money</span></h2>
      <ul><li>SUGOCA ／ nimoca</li><li>はやかけん ／ Suica</li><li>PASMO ／ ICOCA</li><li>Kitaca ／ TOICA ／ manaca</li><li>iD ／ QUICPay+</li></ul>
      <p class="note">※PiTaPaはご利用いただけません</p></div>
    <div><h2>QRコード決済<span class="en">QR code</span></h2>
      <ul><li>PayPay ／ d払い</li><li>楽天ペイ ／ au PAY</li><li>メルペイ</li><li>WeChat Pay</li><li>Alipay+</li></ul></div>
  </div>
  <div class="logos"><img src="${asset("square_payment_logos.png")}" alt="Square 対応ブランド"></div>
  <p class="cash"><b>現金はつかえません</b><span class="en">No cash accepted.</span></p>

  <hr class="sep">

  <header class="hd">
    <div>
      <p class="eyebrow">LINE で お電話　｜　<span class="en">CALL US ON LINE</span></p>
      <h1>お困りのときは、<br>LINEでお電話ください。<span class="en">Need help? Call us on LINE. It's free.</span></h1>
    </div>
  </header>
  <div class="call">
    <div>
      <h2>こんなときに<span class="en">For example</span></h2>
      <ul>
        <li>お支払いの端末が動かない</li>
        <li>鉢が割れていた・傷んでいた</li>
        <li>お買いものでわからないことがある</li>
      </ul>
      <p class="note">電話に出られないときは、LINEのトークでメッセージをお送りください。本店スタッフがお返事します。
        <span class="en">If we can't answer, please send us a message on LINE.</span></p>
    </div>
    <div class="qrbox">
      <div class="qr">${qr}</div>
      <b>読みとって、LINEで通話</b>
      <span>通話料無料（LINEアプリが必要です）</span>
      <span class="en">Scan to call us on LINE</span>
    </div>
  </div>

  <footer>
    <img src="${asset("wordmark_blue.png")}" alt="だいいちえんげいセンター">
    <span>佐賀駅店　｜　本店：佐賀市南佐賀</span>
  </footer>
</article>
</body></html>`;

const htmlFile = path.join(popDir, "out/html/08_payment-call_A5.html");
fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
fs.writeFileSync(htmlFile, html);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 5 });
await page.goto("file://" + htmlFile, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(printDir, "08_payment-call_A5.pdf"), preferCSSPageSize: true, printBackground: true });
const shot = await (await page.$("article.p")).screenshot();
await browser.close();
await sharp(shot)
  .resize({ width: 1748, height: 2480, fit: "fill" }) // A5 300dpi
  .withMetadata({ density: 300 })
  .jpeg({ quality: 95 })
  .toFile(path.join(printDir, "08_payment-call_A5.jpg"));
console.log("out/print/08_payment-call_A5.pdf / .jpg");
