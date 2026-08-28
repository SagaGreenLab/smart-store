import { SquareClient, SquareEnvironment } from "square";

/**
 * Square クライアントの共通定義
 *
 * 各APIルートで個別に new すると環境変数の読み違いが起きるため、ここに一本化する。
 */

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

/**
 * 通貨は日本円固定。
 * JPY は補助単位を持たないため、Square に渡す金額は「円」そのまま
 * （USD のようにセントへ換算しない）。
 */
export const CURRENCY = "JPY" as const;

/** Square に渡す金額は bigint。円はそのまま整数で渡す */
export function toMoney(yen: number) {
  return { amount: BigInt(Math.round(yen)), currency: CURRENCY };
}

/**
 * 必須の環境変数が揃っているか調べる。
 * 無人店では「原因の分からないエラー」が最も困るので、
 * 何が足りないかを名指しで返す。
 */
export function missingEnv(...keys: string[]) {
  return keys.filter((k) => !process.env[k]);
}

/** Square SDK の例外からログ用の文字列を作る */
export function describeError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
