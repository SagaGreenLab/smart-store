/**
 * LINE公式アカウント用の画像を出力する
 *   npm run line
 * 出力: line/out/richmenu_2500x1686.png / .jpg（LINE管理画面にアップロード。上限1MB）
 *       line/out/line_qr_print_2000px.png（店頭POP・チラシ用の友だち追加QR）
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import fs from "node:fs";
import QRCode from "qrcode";
import sharp from "sharp";
// playwright はプロジェクト依存に入れていない（pop/build.mjs と同じ）
const { chromium } = createRequire(import.meta.url)("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const LINE_URL = "https://line.me/R/ti/p/@327quoas";

await QRCode.toFile(path.join(out, "line_qr_print_2000px.png"), LINE_URL, {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 2000,
  color: { dark: "#1E4B9C", light: "#FFFFFF" },
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2500, height: 1686 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "richmenu.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = path.join(out, "richmenu_2500x1686.png");
await page.screenshot({ path: png });
await browser.close();

await sharp(png).jpeg({ quality: 88 }).toFile(path.join(out, "richmenu_2500x1686.jpg"));
for (const f of fs.readdirSync(out)) {
  console.log(f, Math.round(fs.statSync(path.join(out, f)).size / 1024) + "KB");
}
