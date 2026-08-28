/**
 * カートの保存・読み出し（localStorage）
 *
 * 画面側は useSyncExternalStore でここを購読する。
 * useEffect で読んで setState する書き方は、React が
 * 「エフェクト内の同期 setState」として警告するうえ、
 * 初回レンダーが必ず空カートになるため採らない。
 */

import { findProduct } from "./products";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const KEY = "cart";
const LAST_ORDER_KEY = "lastOrder";
const PENDING_KEY = "pendingOrder";

/* ---------------------------------------------------------------------------
   外部ストアとしての購読口
   --------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

/** 同一タブでの書き換えを通知する（storage イベントは他タブにしか飛ばない） */
function notify() {
  for (const listener of listeners) listener();
}

function subscribeStorage(listener: () => void) {
  listeners.add(listener);
  // 別タブでの変更も拾う
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export const subscribeCart = subscribeStorage;
export const subscribeLastOrder = subscribeStorage;

/**
 * useSyncExternalStore の getSnapshot は「中身が変わらない限り同じ参照」を
 * 返さないと無限ループになる。生の文字列をキャッシュして、
 * 変化したときだけ parse し直す。
 */
function cachedSnapshot<T>(key: string, fallback: T, transform: (v: unknown) => T) {
  let rawCache: string | null = null;
  let valueCache: T = fallback;
  let primed = false;

  return () => {
    if (typeof window === "undefined") return fallback;

    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return fallback;
    }

    if (primed && raw === rawCache) return valueCache;

    rawCache = raw;
    primed = true;

    try {
      valueCache = raw ? transform(JSON.parse(raw)) : fallback;
    } catch {
      valueCache = fallback;
    }

    return valueCache;
  };
}

const EMPTY_CART: CartItem[] = [];

/**
 * localStorage の中身を商品マスタで洗い直す。
 *
 * 2つの理由でこれが要る。
 *
 * 1. **旧実装の残骸**。改修前の商品一覧は `id` が数値（1,2,3）だった。
 *    その頃のカートがブラウザに残っている人がいる。IDの型が違うだけで
 *    決済APIが落ちるので、ここで確実に落とす。
 * 2. **金額の出どころを固定する**。localStorage は客が書き換えられる。
 *    名前と価格は保存値を一切見ず、必ず商品マスタから引き直す。
 *    数量だけを客の入力として受け取る。
 */
function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return EMPTY_CART;

  const items: CartItem[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;

    const entry = raw as Record<string, unknown>;
    const id = String(entry.id ?? "");
    const product = findProduct(id);

    // マスタに無い＝旧IDや削除済み商品。売れないので捨てる
    if (!product) continue;

    const quantity = Math.trunc(Number(entry.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) continue;

    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: Math.min(quantity, 99),
    });
  }

  return items;
}

const cartSnapshot = cachedSnapshot<CartItem[]>(KEY, EMPTY_CART, normalizeCart);

/** クライアント用スナップショット。商品マスタで正規化済み */
export function getCartSnapshot(): CartItem[] {
  return cartSnapshot();
}

/** SSR/初回HTML用。localStorage が無いので必ず空 */
export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export type PendingOrder = {
  /** 「交通系IC・電子マネー」など、お客様が選んだ区分名 */
  method: string;
  /** Square の order ID */
  orderId: string;
};

export type LastOrder = {
  items: CartItem[];
  total: number;
  paidAt: string;
  method: string;
  /** 表示用の注文番号（SG-YYMMDD-XXXX） */
  orderNo: string;
};

export function setPendingOrder(meta: PendingOrder) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(meta));
  } catch {
    // 保存できなくても決済は続行できる
  }
}

/** Square の orderId から、お客様に見せる注文番号を作る */
export function formatOrderNo(orderId: string, date = new Date()) {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const tail = orderId.replace(/[^A-Za-z0-9]/g, "").slice(-4).toUpperCase();

  return `SG-${yy}${mm}${dd}-${tail || "0000"}`;
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    return normalizeCart(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // プライベートブラウズ等で書けない場合は黙って諦める
  }
  notify();
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = readCart();
  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  writeCart(cart);
  return cart;
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** 決済確定時：カート内容を控えてからカートを空にする */
export function commitOrder(total: number) {
  try {
    let meta: PendingOrder = { method: "", orderId: "" };

    const rawMeta = localStorage.getItem(PENDING_KEY);
    if (rawMeta) meta = JSON.parse(rawMeta) as PendingOrder;

    const order: LastOrder = {
      items: readCart(),
      total,
      paidAt: new Date().toISOString(),
      method: meta.method,
      orderNo: formatOrderNo(meta.orderId),
    };

    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    localStorage.removeItem(KEY);
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // 保存できなくても完了画面には進める
  }
  notify();
}

export function readLastOrder(): LastOrder | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    return null;
  }
}

const lastOrderSnapshot = cachedSnapshot<LastOrder | null>(
  LAST_ORDER_KEY,
  null,
  (v) => (v && typeof v === "object" ? (v as LastOrder) : null)
);

/** クライアント用スナップショット */
export function getLastOrderSnapshot(): LastOrder | null {
  return lastOrderSnapshot();
}

/** SSR/初回HTML用 */
export function getLastOrderServerSnapshot(): LastOrder | null {
  return null;
}
