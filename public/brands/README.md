# 決済ブランドロゴの置き場所

## 1. 公式ロゴ一覧画像（掲載中）

`square-payment-brands.png` — Square公式のデジタル素材（PNG / 4097×1211）。
チェックアウト画面の「対応決済ブランド」欄に、原寸比のまま掲載しています。

- 出典: [Squareのデジタル素材をダウンロードする](https://squareup.com/help/jp/ja/article/8592-download-square-digital-materials)
  の「7つのクレジットカードブランド、電子マネー、QRコード決済アプリ」
- 収録ブランド: VISA / Mastercard / American Express / JCB / Diners Club /
  Discover / UnionPay（銀聯）/ 交通系電子マネー9種 / PayPay / d払い / 楽天ペイ /
  au PAY / メルペイ / WeChat Pay / Alipay+ / iD / QUICPay+

### 利用上の制約（Squareの規定）

- Square加盟店であること・該当ブランドを取り扱っていることを示す目的でのみ利用可
- **デザイン・縦横比・色・文字の変更、反転、他ロゴとの組み合わせ、特殊効果や
  アニメーションの追加は不可**（＝この画像を切り抜いて個別ロゴにするのはNG）
- この画像は画面表示用。印刷物には「Square 加盟店専用 印刷用ロゴ用紙」（PDF）を使うこと

取扱ブランドが変わった場合は、上記ページから該当する組み合わせの画像を
再ダウンロードして差し替えてください。

## 2. ブランド個別バッジ（決済方法ボタン内）

決済方法の選択ボタン内では、ブランドカラーの文字バッジを表示しています
（定義は `lib/payment-brands.ts`）。

ブランド単体の公式ロゴを各社から正規に入手できた場合のみ、
このフォルダに `{slug}.svg`（または `.png`）を置くと自動でロゴ画像に切り替わります。
ファイルが無いブランドは文字バッジのままなので、1つずつ追加してOKです。

### ファイル名一覧

| slug | ブランド |
| --- | --- |
| `visa` | VISA |
| `mastercard` | Mastercard |
| `amex` | American Express |
| `jcb` | JCB |
| `diners` | Diners Club |
| `discover` | Discover |
| `apple-pay` | Apple Pay |
| `contactless` | タッチ決済（NFCマーク） |
| `id` | iD |
| `quicpay` | QUICPay+ |
| `suica` | Suica |
| `sugoca` | SUGOCA |
| `nimoca` | nimoca |
| `hayakaken` | はやかけん |
| `pasmo` | PASMO |
| `icoca` | ICOCA |
| `kitaca` | Kitaca |
| `toica` | TOICA |
| `manaca` | manaca |
| `paypay` | PayPay |
| `dbarai` | d払い |
| `rakuten-pay` | 楽天ペイ |
| `au-pay` | au PAY |
| `merpay` | メルペイ |
| `wechat-pay` | WeChat Pay |
| `alipay` | Alipay+ |

推奨仕様: SVG（PNGなら高さ56px以上・背景透過）。表示は高さ28pxに自動リサイズされます。
