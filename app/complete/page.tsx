import Link from "next/link";

export default function CompletePage() {
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <h1 className="mb-4 text-3xl font-bold">
        決済が完了しました
      </h1>

      <p className="mb-8 text-gray-600">
        ご購入ありがとうございました。
      </p>

      <Link
        href="/products"
        className="inline-block rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
      >
        商品一覧へ戻る
      </Link>
    </main>
  );
}