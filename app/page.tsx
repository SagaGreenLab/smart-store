export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        SAGA HATSU
      </h1>

      <p className="text-gray-600 mb-10">
        MINI GREEN SHOP
      </p>

      <button
        className="
          bg-green-600
          text-white
          px-10
          py-5
          rounded-2xl
          text-xl
          font-bold
        "
      >
        商品を見る
      </button>
    </main>
  );
}