"use client";
import { useRouter } from "next/navigation";
type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "モンステラ",
    price: 1980,
  },
  {
    id: 2,
    name: "サンスベリア",
    price: 2480,
  },
  {
    id: 3,
    name: "ポトス",
    price: 980,
  },
];

  
export default function ProductsPage() {
  const router = useRouter();
  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("cart");

    const cart = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingItem = cart.find(
      (item: any) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
console.log("カート保存完了", cart);
console.log("画面遷移します");

router.push("/cart");
    router.push("/cart");
  };

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        商品一覧
      </h1>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border p-4"
          >
            <h2 className="text-xl font-bold">
              {product.name}
            </h2>

            <p className="mt-2">
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
    </main>
  );
}