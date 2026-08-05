import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  care: string;
  size: string;
  stock: number;
  image: string;
};

const products: Record<string, Product> = {
  monstera: {
    id: "monstera",
    name: "モンステラ",
    price: 1980,
    description: "初心者にも人気の育てやすい観葉植物です。",
    care: "明るい日陰で管理し、土が乾いたら水やり。",
    size: "4号鉢",
    stock: 5,
    image: "https://placehold.co/600x600?text=Monstera",
  },
  sansevieria: {
    id: "sansevieria",
    name: "サンスベリア",
    price: 2480,
    description: "乾燥に強く、お部屋のインテリアにも最適です。",
    care: "乾燥気味に管理してください。",
    size: "5号鉢",
    stock: 3,
    image: "https://placehold.co/600x600?text=Sansevieria",
  },
  pothos: {
    id: "pothos",
    name: "ポトス",
    price: 980,
    description: "丈夫で育てやすく、初心者にもおすすめ。",
    care: "レースカーテン越しの光がおすすめ。",
    size: "3号鉢",
    stock: 8,
    image: "https://placehold.co/600x600?text=Pothos",
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products[id];

  if (!product) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-xl font-bold">商品が見つかりません</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-4 pb-32">
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      <div className="mt-4 space-y-5 rounded-3xl bg-white p-6 shadow-[0_8px_28px_rgba(27,51,92,0.08)]">
        <div>
          <h1 className="text-xl font-bold text-[#1b2333]">{product.name}</h1>

          <p className="mt-1 flex items-baseline gap-1 text-[#1b2333]">
            <span className="text-xl font-bold">¥</span>
            <span className="text-4xl font-extrabold tabular-nums">
              {product.price.toLocaleString()}
            </span>
          </p>

          <p className="mt-1 text-xs text-[#98a1b3]">税込 ・ {product.size}</p>
        </div>

        <p className="text-sm leading-relaxed text-[#6b7486]">
          {product.description}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-[#f4f6fa] p-3 text-center">
            <p className="text-[11px] text-[#98a1b3]">育てやすさ</p>
            <p className="mt-1 text-sm font-bold text-[#2483d6]">初心者向け</p>
          </div>

          <div className="rounded-2xl bg-[#f4f6fa] p-3 text-center">
            <p className="text-[11px] text-[#98a1b3]">サイズ</p>
            <p className="mt-1 text-sm font-bold text-[#1b2333]">
              {product.size}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f6fa] p-3 text-center">
            <p className="text-[11px] text-[#98a1b3]">在庫</p>
            <p className="mt-1 text-sm font-bold text-[#2483d6]">
              {product.stock}鉢
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#d5eafc] bg-[#edf6fe] p-4">
          <p className="text-[13px] font-bold text-[#2483d6]">
            初心者にもおすすめ
          </p>

          <p className="mt-1 text-[13px] leading-relaxed text-[#6b7486]">
            丈夫で育てやすく、お部屋を明るい雰囲気にしてくれます。
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-wider text-[#98a1b3]">
            育て方
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-[#1b2333]">
            {product.care}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 p-4 shadow-[0_-4px_20px_rgba(27,51,92,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="shrink-0 text-xs leading-tight text-[#6b7486]">
            税込
            <span className="block text-sm font-bold text-[#2483d6]">
              ¥{product.price.toLocaleString()}
            </span>
          </div>

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
          />
        </div>
      </div>
    </main>
  );
}