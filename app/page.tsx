"use client";
import { useRouter } from "next/navigation";
type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: 1, name: "モンステラ", price: 1980 },
  { id: 2, name: "サンスベリア", price: 2480 },
  { id: 3, name: "ポトス", price: 980 },
];

export default function ProductsPage() {
  const router = useRouter();
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");

    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

router.push("/cart");
  };

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between px-1 pt-1">
          <h1 className="text-xl font-extrabold text-[#1b2333]">商品一覧</h1>

          <span className="text-xs font-bold tracking-wider text-[#98a1b3]">
            MINI GREEN SHOP
          </span>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_28px_rgba(27,51,92,0.08)]"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-bold text-[#1b2333]">
                  {product.name}
                </h2>

                <p className="flex items-baseline gap-0.5 text-[#1b2333]">
                  <span className="text-sm font-bold">¥</span>
                  <span className="text-2xl font-extrabold tabular-nums">
                    {product.price.toLocaleString()}
                  </span>
                </p>
              </div>

              <p className="mt-0.5 text-right text-xs text-[#98a1b3]">税込</p>

              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full rounded-2xl bg-[#4fa8f0] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2f93e6] active:bg-[#2f93e6]"
              >
                カートに入れる
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}