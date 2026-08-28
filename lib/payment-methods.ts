/**
 * 決済手段の定義
 *
 * 表示のグルーピングはアーティファクト「決済サイト 画面デザイン」③決済中 に準拠。
 * ブランド名の表記は pop_payment/SPEC.md §4「確定コピー」に合わせる。
 *
 * `PAYPAY` enum は 2024年12月に非推奨。`QR_CODE` が後継で PayPay・d払い等を包含する。
 */

export type PaymentTypeKey = "CARD_PRESENT" | "FELICA_ALL" | "QR_CODE";

/**
 * Square 側で有効化済みの paymentType（APIが受け付ける値）
 *
 * 画面から送られるのは PAYMENT_CHOICES の3種だけだが、
 * 端末側の設定変更で使える値はこれより広い。APIはこの集合で検証する。
 * `FELICA_QUICPAY` は 2026-07-31 に佐賀駅分の有効化メールを確認済み。
 */
export const ALLOWED_PAYMENT_TYPES = new Set([
  "CARD_PRESENT",
  "FELICA_ALL",
  "FELICA_ID",
  "FELICA_TRANSPORTATION_GROUP",
  "FELICA_QUICPAY",
  "QR_CODE",
]);

/**
 * お客様に選んでいただく決済区分
 *
 * ⚠ アーティファクトには選択画面が無い（端末側で選ぶ想定）が、
 *   Square Terminal API の checkout 作成には paymentType が1つ必要なため、
 *   ②ご注文の確認 に最小限の選択を置いている。要判断事項。
 */
export const PAYMENT_CHOICES: {
  key: PaymentTypeKey;
  label: string;
  sub: string;
}[] = [
  {
    key: "CARD_PRESENT",
    label: "カード・スマホ",
    sub: "クレジット／Apple Pay／Google Pay",
  },
  {
    key: "FELICA_ALL",
    label: "交通系IC・電子マネー",
    sub: "Suica／SUGOCA／iD／QUICPay+ ほか",
  },
  {
    key: "QR_CODE",
    label: "QRコード決済",
    sub: "PayPay／d払い／楽天ペイ ほか",
  },
];

/**
 * ③決済中 のブランドタイル
 *
 * アーティファクトでは分類見出しなしの一枚グリッドに、実ロゴ画像を並べる構成。
 * 画像は /public/brand/payment/ に配置（アーティファクトの添付画像を書き出したもの）。
 * ロゴが無いブランド（JCB／Diners／Discover）はテキストで表示する。
 */
export type PaymentBrandTile = { key: string; img?: string; label?: string };

export const PAYMENT_BRAND_TILES: PaymentBrandTile[] = [
  { key: "visa", img: "/brand/payment/card-visa.png" },
  { key: "mastercard", img: "/brand/payment/card-mastercard.png" },
  { key: "amex", img: "/brand/payment/card-amex.png" },
  { key: "unionpay", img: "/brand/payment/card-unionpay.png" },
  { key: "jcb", label: "JCB" },
  { key: "diners", label: "Diners" },
  { key: "discover", label: "Discover" },
  { key: "sugoca", img: "/brand/payment/ic-sugoca.png" },
  { key: "suica", img: "/brand/payment/ic-suica.png" },
  { key: "pasmo", img: "/brand/payment/ic-pasmo.png" },
  { key: "nimoca", img: "/brand/payment/ic-nimoca.png" },
  { key: "hayakaken", img: "/brand/payment/ic-hayakaken.png" },
  { key: "icoca", img: "/brand/payment/ic-icoca.png" },
  { key: "toica", img: "/brand/payment/ic-toica.png" },
  { key: "manaca", img: "/brand/payment/ic-manaca.png" },
  { key: "kitaca", img: "/brand/payment/ic-kitaca.png" },
  { key: "paypay", img: "/brand/payment/qr-paypay.png" },
  { key: "dbarai", img: "/brand/payment/qr-dbarai.png" },
  { key: "rakutenpay", img: "/brand/payment/qr-rakutenpay.png" },
  { key: "aupay", img: "/brand/payment/qr-aupay.png" },
  { key: "merpay", img: "/brand/payment/qr-merpay.png" },
  { key: "wechatpay", img: "/brand/payment/qr-wechatpay.png" },
  { key: "alipay", img: "/brand/payment/qr-alipay.png" },
  { key: "id", img: "/brand/payment/em-id.png" },
  { key: "quicpay", img: "/brand/payment/em-quicpay.png" },
];

/** SPEC §4「使えないお支払い方法」 */
export const UNAVAILABLE_PAYMENTS = ["現金", "商品券・ギフトカード"];

/** 現金不可の注記（全画面で同じ文言を使う） */
export const NO_CASH_TEXT =
  "現金でのお支払いはできません。カード・交通系IC・QRコード決済がご利用いただけます。";
