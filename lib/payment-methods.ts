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
 * 選択肢の中に並べるブランドの印
 *
 * 分類名（「電子マネー」など）だけだと、自分の持ち物がどれに入るのか分からない。
 * 開業前の実地で、QUICPay をお持ちの方が3択の前で迷われた。
 * 灰色10pxの補足文字では読まれないので、ロゴそのものを出して見つけてもらう。
 * img が無いブランドは name をそのまま文字で出す。
 */
export type ChoiceBrand = { key: string; name: string; img?: string };

/**
 * お客様に選んでいただく決済区分
 *
 * Square Terminal API は「カード／FeliCa／QRコード」のどれで待ち受けるかを
 * checkout 作成時に1つ指定する必要があり、端末側に委ねる値は用意されていない。
 * そのため、この3択だけは画面で聞かざるを得ない。
 *
 * ただしこの先は端末が引き受ける：
 *   FELICA_ALL → Suica / iD / QUICPay の別は端末の画面で選べる
 *   QR_CODE    → PayPay・d払い・楽天ペイ等をまとめた1枚のコードが出る
 * よって聞くべきは「何でかざすか」までで、ブランドまで選ばせる必要はない。
 *
 * 文言の注意：
 * - 「QRコード決済」とは呼ばない。客は鉢のQRを読んだ直後で、取り違える。
 * - 交通系IC は「カードでもスマホでも」と添える。iPhoneのSuicaの方が
 *   「カード・スマホ（Apple Pay）」を選ぶと、FeliCa で待ち受けないため通らない。
 */
export const PAYMENT_CHOICES: {
  key: PaymentTypeKey;
  label: string;
  sub: string;
  brands: ChoiceBrand[];
}[] = [
  {
    key: "CARD_PRESENT",
    label: "クレジットカード",
    sub: "カード本体／Apple Pay・Google Pay のカード",
    brands: [
      { key: "visa", name: "Visa", img: "/brand/payment/card-visa.png" },
      { key: "mastercard", name: "Mastercard", img: "/brand/payment/card-mastercard.png" },
      { key: "jcb", name: "JCB", img: "/brand/payment/card-jcb.svg" },
      { key: "amex", name: "American Express", img: "/brand/payment/card-amex.png" },
    ],
  },
  {
    key: "FELICA_ALL",
    label: "交通系IC・電子マネー",
    sub: "カードでもスマホでも",
    brands: [
      { key: "sugoca", name: "SUGOCA", img: "/brand/payment/ic-sugoca.png" },
      { key: "suica", name: "Suica", img: "/brand/payment/ic-suica.png" },
      { key: "id", name: "iD", img: "/brand/payment/em-id.png" },
      { key: "quicpay", name: "QUICPay+", img: "/brand/payment/em-quicpay.png" },
    ],
  },
  {
    key: "QR_CODE",
    label: "スマホのアプリ",
    sub: "レジの画面にコードが出ます",
    brands: [
      { key: "paypay", name: "PayPay", img: "/brand/payment/qr-paypay.png" },
      { key: "dbarai", name: "d払い", img: "/brand/payment/qr-dbarai.png" },
      { key: "rakutenpay", name: "楽天ペイ", img: "/brand/payment/qr-rakutenpay.png" },
      { key: "aupay", name: "au PAY", img: "/brand/payment/qr-aupay.png" },
    ],
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
