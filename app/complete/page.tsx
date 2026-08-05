import Link from "next/link";

export default function CompletePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#edf6fe]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2483d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-5 text-xl font-extrabold text-[#1b2333]">
          決済が完了しました
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#6b7486]">
          ご購入ありがとうございました。
        </p>

        <Link
          href="/"
          className="mt-8 block w-full rounded-2xl bg-[#4fa8f0] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#2f93e6]"
        >
          商品一覧へ戻る
        </Link>
      </div>
    </main>
  );
}