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
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold">
          🌿 商品一覧
        </h1>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {product.name}
              </h2>

              <p className="mt-2 text-lg text-gray-600">
                ¥{product.price.toLocaleString()}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
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