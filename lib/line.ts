/**
 * LINE公式アカウント（佐賀駅店の購入後相談窓口）
 * 環境変数 NEXT_PUBLIC_LINE_ADD_FRIEND_URL があればそちらを優先する。
 */
export const LINE_BASIC_ID = "@327quoas";

export const LINE_ADD_FRIEND_URL =
  process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL ||
  `https://line.me/R/ti/p/${LINE_BASIC_ID}`;
