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
    <main className="mx-auto max-w-md pb-28">
      <img
  src={product.image}
  alt={product.name}
  className="aspect-[4/3] w-full object-cover"
/>

      <div className="space-y-4 p-6">

  <div>
    <h1 className="text-3xl font-bold">
      {product.name}
    </h1>

    <p className="mt-2 text-3xl font-bold text-green-700">
      ¥{product.price.toLocaleString()}
    </p>
  </div>

  <p className="text-lg leading-relaxed text-gray-700">
    {product.description}
  </p>

  <div className="grid grid-cols-3 gap-3">

    <div className="rounded-xl border bg-white p-3 text-center">
      <p className="text-xs text-gray-500">
        育てやすさ
      </p>

      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
  初心者向け
</span>
    </div>

    <div className="rounded-xl border bg-white p-3 text-center">
      <p className="text-xs text-gray-500">
        サイズ
      </p>

      <p className="mt-1 font-semibold">
        {product.size}
      </p>
    </div>

    <div className="rounded-xl border bg-white p-3 text-center">
      <p className="text-xs text-gray-500">
        在庫
      </p>

      <p className="mt-1 font-semibold text-green-700">
        {product.stock}鉢
      </p>
    </div>

  </div>

 <div className="rounded-xl bg-green-50 p-4">
  <p className="font-semibold text-green-700">
    初心者にもおすすめ
  </p>

  <p className="mt-1 text-sm text-gray-700">
    丈夫で育てやすく、お部屋を明るい雰囲気にしてくれます。
  </p>
</div>

  <div>
    <h2 className="text-lg font-semibold">
      育て方
    </h2>

    <p className="mt-2 leading-7 text-gray-700">
      {product.care}
    </p>
  </div>

</div>


      

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-md">
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