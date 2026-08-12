/**
 * 決済ブランド定義
 *
 * slug  : 識別子
 * label : バッジに表示する文字
 * color : バッジ背景色（各社のブランドカラー）
 * logo  : （任意）public/ 配下のロゴ画像パス。指定した場合のみ画像表示になる。
 *         未指定＝カラーバッジ表示。存在しないパスを指定すると
 *         読み込み失敗までの間に壊れた画像が出るため、必ず実在するファイルだけ指定すること。
 *
 * 個別ロゴを追加する手順は public/brands/README.md を参照。
 */

export type PaymentTypeKey = "CARD_PRESENT" | "FELICA_ALL" | "QR_CODE";

export type Brand = {
  slug: string;
  label: string;
  color: string;
  logo?: string;
};

export const CARD_BRANDS: Brand[] = [
  { slug: "visa", label: "VISA", color: "#1a1f71" },
  { slug: "mastercard", label: "Mastercard", color: "#cc0000" },
  { slug: "amex", label: "American Express", color: "#006fcf" },
  { slug: "jcb", label: "JCB", color: "#0b4ea2" },
  { slug: "diners", label: "Diners Club", color: "#0079be" },
  { slug: "discover", label: "Discover", color: "#e35205" },
  { slug: "apple-pay", label: "Apple Pay", color: "#1b2333" },
  { slug: "contactless", label: "タッチ決済", color: "#5f6c7f" },
];

export const EMONEY_BRANDS: Brand[] = [
  { slug: "id", label: "iD", color: "#d97706" },
  { slug: "quicpay", label: "QUICPay+", color: "#0068b7" },
  { slug: "suica", label: "Suica", color: "#1f8a3d" },
  { slug: "sugoca", label: "SUGOCA", color: "#c8006b" },
  { slug: "nimoca", label: "nimoca", color: "#0079b8" },
  { slug: "hayakaken", label: "はやかけん", color: "#0090b3" },
  { slug: "pasmo", label: "PASMO", color: "#c4006b" },
  { slug: "icoca", label: "ICOCA", color: "#0086c9" },
  { slug: "kitaca", label: "Kitaca", color: "#6d9c15" },
  { slug: "toica", label: "TOICA", color: "#0083c4" },
  { slug: "manaca", label: "manaca", color: "#3d4451" },
];

export const QR_BRANDS: Brand[] = [
  { slug: "paypay", label: "PayPay", color: "#e60028" },
  { slug: "dbarai", label: "d払い", color: "#cc0033" },
  { slug: "rakuten-pay", label: "楽天ペイ", color: "#bf0000" },
  { slug: "au-pay", label: "au PAY", color: "#dd4f05" },
  { slug: "merpay", label: "メルペイ", color: "#e0000f" },
  { slug: "wechat-pay", label: "WeChat Pay", color: "#0a9e08" },
  { slug: "alipay", label: "Alipay+", color: "#1677ff" },
];
