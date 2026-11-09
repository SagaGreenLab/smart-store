# Codex（OpenAI gpt-image）用 鉢ラベル デザイン案プロンプト 12パターン

目的：`labels.mjs` の10案とは違う発想のデザイン案を、画像生成で広く出してもらう。
採用案は、文字・QRを正確に入れるため `pop/labels.mjs` に組み直して印刷データにする
（画像生成の日本語やQRはそのまま印刷に使わない）。

## 共通ルール（全プロンプトの先頭に付ける）

```
Product photography mockup of a small plant label for a Japanese houseplant shop.
Brand: "だいいちえんげいセンター", a tiny self-service plant stand inside JR Saga Station.
Visual identity: white or kraft paper, ONE ink color only — bright soft blue #2E6CB2,
thin line-art illustration of a cat holding a sunflower as the logo,
minimal MUJI-like typography, generous white space, thin hairline rules, no gradients,
no other colors except the green of the real plant. The label shows: plant name
"モンステラ", small italic Latin name "Monstera deliciosa", price "¥1,980 税込",
and a square QR code. Soft natural daylight, shallow depth of field, photorealistic.
```

## パターン

| No | 名前 | サイズ想定 | プロンプト（共通ルールの後ろに付ける） |
| --- | --- | --- | --- |
| C01 | 木札ピック | 25×90mm | `The label is printed on a thin natural wood stake (birch veneer) pushed into the soil of a 4-inch pot, blue ink silkscreen look.` |
| C02 | 透明PETシール | φ45mm | `The label is a clear transparent round sticker on a white ceramic pot, only blue ink visible, very airy.` |
| C03 | 鉢カバーの紙帯 | 40mm幅の帯 | `A wide kraft paper band wrapped around a plain pot, the band closed with a small blue sticker, label text on the front.` |
| C04 | ミニ封筒タグ | 60×40mm | `A tiny kraft envelope hung on the plant with cotton string; the envelope front shows the label, a care card peeks out.` |
| C05 | 二つ折りミニブック | 45×60mm（開くと90×60） | `A small folded booklet tag tied to the stem, cover shows the cat logo and plant name, inside page partly visible with care icons.` |
| C06 | 消しゴムはんこ風 | 50×50mm | `The label looks hand-stamped with a rubber stamp in blue ink on off-white paper, slightly imperfect stamp texture, cozy local shop feel.` |
| C07 | 鉢底ラベル＋QRピック分離 | 2点セット | `Two pieces: a small round QR pick stuck in the soil, and a slim name-and-price sticker on the pot rim, consistent design.` |
| C08 | 切符風 | 57×30mm（硬券サイズ） | `The label is designed like a vintage Japanese railway ticket (hard ticket), "JR佐賀駅" station name style, blue print on cream card, playful nod to the station.` |
| C09 | 吊りワイヤータグ | 35×70mm | `A slim tag hanging from a thin galvanized wire hook on the pot edge, matching galvanized pipe shelves behind.` |
| C10 | ポラロイド風カード | 54×86mm | `A card with a square blank photo frame area at top containing a line drawing of the plant leaf, text and QR below, like an instant photo.` |
| C11 | ナンバープレート（植物図鑑） | 70×35mm | `A museum-style specimen label: "No.012" number large, plant name, Latin name, grid lines like a botanical garden plaque.` |
| C12 | 鉢に直接スタンプ | 鉢の素焼き面 | `The label is printed directly onto a terracotta-colored pot with blue ink, like a pad-printed logo, QR on the side.` |

## 出力の頼み方（例）

- サイズ `1536x1024`、quality `high`、1プロンプトにつき1枚
- 「日本語の文字は崩れてもよい。形・素材・レイアウトの方向性が分かればよい」と添える

## 決済導線版 3パターン（D01〜D03）

C07・C09・C08 をもとに、QRコードを「決済サイトへの入り口」として主役にした案。
QRのすぐ上に「お会計はこちらから」を入れ、QRの下に「育て方・商品詳細もこのページで」を小さく添える
（決済サイトの商品ページに育て方・商品詳細も載せるため）。

| No | 名前 | サイズ想定 | プロンプト（共通ルールの後ろに付ける） |
| --- | --- | --- | --- |
| D01 | お会計QRピック＋ふちシール | ピックφ55＋シール90×20 | `Two pieces, designed as one system. (1) A round white QR pick, about 55mm, standing on a slim stake just above the leaves so it is visible from the front of the shelf. The pick is the hero and the entrance to checkout: at the top a short heading "お会計はこちらから" with a small downward arrow, a LARGE QR code filling most of the circle, and under it tiny text "育て方・商品詳細もこちら / Scan to pay". (2) A slim name-and-price sticker on the front of the pot rim with the cat logo, plant name and "¥1,980 税込", plus a tiny upward arrow pointing to the pick. The QR is clearly the most prominent element.` |
| D02 | お会計QR吊りワイヤータグ | 40×85mm | `A slim white tag hanging from a thin galvanized wire hook on the front edge of the pot, facing the customer, galvanized steel pipe shelf and reclaimed wood board behind. Top third: small cat logo, plant name, Latin name, "¥1,980 税込" separated by hairline rules. Bottom two thirds is the hero, the entrance to checkout: a heading "お会計はこちらから ↓" in blue, a LARGE QR code using the full width of the tag, and under it small text "育て方・商品詳細もこのページで / Scan to pay". The QR is clearly the most prominent element.` |
| D03 | お会計QR切符 | 80×40mm | `The label is designed like a vintage Japanese railway hard ticket on cream card with blue print, clipped with a small clip to a 13mm galvanized steel pipe rail at the front of a reclaimed wood shelf, a potted plant behind. Left part (like the ticket stub): cat logo, plant name, Latin name, "¥1,980 税込", tiny "JR佐賀駅" station-style text. A perforated dotted line separates the right part, which works like a ticket gate into checkout: a heading "お会計はこちらから" with a small arrow, a LARGE QR code, and a small caption "育て方・商品詳細も / Scan to pay". The QR side is clearly the most prominent.` |
