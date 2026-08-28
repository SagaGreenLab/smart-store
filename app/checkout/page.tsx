import { redirect } from "next/navigation";

/**
 * 旧・お支払い画面
 *
 * ご注文の確認と決済開始を /cart に統合したため、この経路は残さない。
 * 既に配布済みのQRやブックマークが /checkout を指している可能性があるので、
 * 404 にせずリダイレクトする。
 */
export default function CheckoutPage() {
  redirect("/cart");
}
