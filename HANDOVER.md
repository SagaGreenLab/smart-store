# SAGA GREEN Smart Store 引き継ぎ（2026-07-26更新）

## プロジェクト概要
- 佐賀駅構内の無人植物販売システム（MVP）。30秒以内で決済完了が目標
- フロー：NFC/QR → /products/[id] → Cart → Checkout → Square Terminal API → Complete
- 技術：Next.js App Router / TypeScript / Supabase / Square SDK v40 / Vercel
- 開発ルール：MVPを壊さない。原因 → 確認 → 修正（差分のみ）→ 動作確認

## 解決済み（前回チャットで完了）
1. **Terminalペアリング成功**
   - デバイスコード入力画面は「ログイン」タップ後の画面下部「端末コードを使う」にある（サインアウト直後の画面には無い）
   - デバイスコードは発行後5分で失効。VS Codeターミナルからcurlで発行→即入力で成功
   - status: PAIRED / device_id: 613CS145C5000447
2. **checkout 401エラー解決**
   - 原因：app/api/checkout/route.ts が SquareEnvironment.Sandbox 固定だった
   - 修正：SQUARE_ENVIRONMENT による切り替え式に変更（他ルートと同じ形）
   - 動作確認済み：Terminalに決済画面が表示された
3. **決済方法選択を実装**
   - /api/terminal が paymentType を受け取る（CARD_PRESENT / FELICA_ALL / PAYPAY のみ許可、不正値はカードにフォールバック）
   - checkoutページに「お支払い方法」選択UI追加

## 環境変数（.env.local）
- SQUARE_ENVIRONMENT=production
- SQUARE_ACCESS_TOKEN=（.env.local参照。チャットに貼らない）
- SQUARE_LOCATION_ID=LP11636DM3X9J（=「佐賀駅」店舗。確認済み）
- SQUARE_DEVICE_ID=613CS145C5000447

## 店舗情報（Locations API確認済み）
- L0QW32MB1R7ZR: daiichi_engei_center
- LP11636DM3X9J: 佐賀駅（無人店舗。売上はここに計上される）★使用中
- L51Z3TWXMPTWX: 有限会社 第一園芸センター

## 残タスク
1. ✅ 佐賀駅店舗の決済審査完了（2026年8月時点・全ブランド利用可）
   - CARD_PRESENT: VISA / Mastercard / American Express / JCB / Diners Club / Discover / Apple Pay / タッチ決済
   - FELICA_ALL: iD / QUICPay+ / 交通系IC（Suica・SUGOCA・nimoca・はやかけん・PASMO・ICOCA・Kitaca・TOICA・manaca）※PiTaPa除く
     - QUICPay は 7/31 有効化 → FELICA_QUICPAY もallowlistに追加済み
   - QR_CODE: PayPay / d払い / 楽天ペイ / au PAY / メルペイ / WeChat Pay / Alipay+
   - 上記ブランドは checkout ページにバッジ表示済み（app/checkout/page.tsx の PAYMENT_METHODS）
   - 未実施: FELICA_ALL / QR_CODE で各ブランド1回ずつテスト決済して確認
2. 📝 Vercel本番デプロイ時：環境変数4点（上記）を設定してRedeploy
3. （任意）device.code.paired / terminal.checkout.updated のWebhook実装（現在はポーリングなし・レスポンス確認のみ）

## 注意事項
- .env.local変更後は開発サーバー再起動が必須
- Sandboxで発行したデバイスコードは実機に使えない（本番トークンで発行）
- 日本のTerminal checkoutは1回につき決済方法1種類。tip関連フィールドは送らない（allow_tipping: false設定済み）
- 動作確認のcurlは、npm run devとは別のターミナルタブで実行する
