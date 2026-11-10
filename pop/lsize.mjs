/**
 * 店内POPを L判（89×127mm・300dpi）の写真プリント用JPEGに書き出す
 *   npm run pop        ← 先に pop/out/html を作っておく
 *   node pop/lsize.mjs
 * 出力: pop/out/print/lsize/*.jpg
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";
const { chromium } = createRequire(import.meta.url)("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlDir = path.join(here, "out/html");
const outDir = path.join(here, "out/print/lsize");
fs.mkdirSync(outDir, { recursive: true });

// L判 300dpi：127mm = 1500px, 89mm = 1051px。周囲は フチなし印刷で切れても安全な余白をとる
const L = { land: [1500, 1051], port: [1051, 1500] };
const JOBS = [
  { name: "L_line-card", html: "05_cards_camera-line_91x55.html", sel: "article.line", size: L.land, fill: 0.92 },
  { name: "L_camera", html: "05_cards_camera-line_91x55.html", sel: "article.cam", size: L.land, fill: 0.92 },
  { name: "L_payment", html: "04_payment_A5.html", sel: "article.pay", size: L.land, fill: 0.96 },
  { name: "L_how-to-shop", html: "03_how-to-shop_A4.html", sel: "article.how", size: L.port, fill: 0.96 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 5 });
for (const j of JOBS) {
  await page.goto(pathToFileURL(path.join(htmlDir, j.html)).href, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: ".cell{outline:none!important}" }); // カット線を消す
  await page.evaluate(() => document.fonts.ready);
  const buf = await (await page.$(j.sel)).screenshot();
  const [W, H] = j.size;
  const card = await sharp(buf)
    .resize({ width: Math.round(W * j.fill), height: Math.round(H * j.fill), fit: "inside" })
    .toBuffer();
  const m = await sharp(card).metadata();
  const file = path.join(outDir, `${j.name}_${W > H ? "127x89" : "89x127"}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#fff" } })
    .composite([{ input: card, left: Math.round((W - m.width) / 2), top: Math.round((H - m.height) / 2) }])
    .withMetadata({ density: 300 })
    .jpeg({ quality: 95 })
    .toFile(file);
  console.log(path.relative(here, file));
}

// お買いもののしかた A5（A4版を縮小。A4→A5 は同じ比率）
const a5Dir = path.join(here, "out/print");
await page.goto(pathToFileURL(path.join(htmlDir, "03_how-to-shop_A4.html")).href, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".cell{outline:none!important}" });
await page.evaluate(() => document.fonts.ready);
const a4 = await (await page.$("article.how")).screenshot(); // A4 全面
await sharp(a4)
  .resize({ width: 1748, height: 2480, fit: "fill" }) // A5 300dpi
  .withMetadata({ density: 300 })
  .jpeg({ quality: 95 })
  .toFile(path.join(a5Dir, "03b_how-to-shop_A5.jpg"));
// PDF は A4 のレイアウトを zoom で 1/√2 にして A5 用紙へ（文字はベクターのまま）
await page.addStyleTag({ content: "@page{size:A5;margin:0} html{zoom:0.7071}" });
await page.pdf({
  path: path.join(a5Dir, "03b_how-to-shop_A5.pdf"),
  preferCSSPageSize: true,
  printBackground: true,
  pageRanges: "1",
});
console.log("out/print/03b_how-to-shop_A5.pdf / .jpg");
await browser.close();
