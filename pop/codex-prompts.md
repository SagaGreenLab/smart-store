# Codex 用 画像生成プロンプト（設置イメージ）

POP本体は文字の正確さが必要なので `npm run pop` で作ります（AI画像生成は日本語が崩れるため）。
Codex では **売り場の設置イメージ写真** を作るのに使ってください。
`pop/out/preview/*.png` と看板の写真を参照画像として一緒に渡すと、デザインがぶれません。

---

## 1. 売り場全景

```
Photorealistic photo of a small unmanned houseplant stand in a Japanese train station
under-track arcade. Width 2.7m, depth 0.8m alcove. Two open shelving units made of
galvanized steel pipes and reclaimed scaffold-board wood, off-white matte back panels.
Left: a small checkout counter (600mm wide) with a white Square terminal on top,
an A4 white sign with blue line-art "how to shop" steps on the back panel above it.
Right: stepped shelves with about 40 small potted foliage plants (pothos, monstera,
sansevieria, everfresh) in 3–4 inch pots. Small white price cards with thin blue
typography clipped to the front rails. A white standing sign with a blue line drawing
of a cat holding a sunflower near the entrance. Calm, minimal, MUJI-like store
atmosphere, soft warm lighting, lots of white space, plants are the only color.
```

## 2. プライスカードのアップ

```
Close-up photo of a white 91x55mm price card clipped to a galvanized steel pipe rail
on a reclaimed wood shelf, a monstera in a 4-inch pot behind it, shallow depth of field.
The card has thin blue typography, a small QR code on the right, minimal Japanese
retail design similar to MUJI. Natural soft light.
```

## 3. 鉢のQRタグ

```
Close-up photo of a small white tag (40x70mm) on a clear plastic card-holder pick,
stuck into the soil of a pothos plant in a simple pot. The tag shows a tiny blue
line-art cat logo, a plant name, and a blue QR code. A hand holding a smartphone is
scanning it. Minimal, bright, clean, MUJI-like.
```
