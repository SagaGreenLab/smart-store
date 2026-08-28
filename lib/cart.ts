/**
 * カートの保存・読み出し（localStorage）
 *
 * 画面側は useSyncExternalStore でここを購読する。
 * useEffect で読んで setState する書き方は、React が
 * 「エフェクト内の同期 setState」として警告するうえ、
 * 初回レンダーが必ず空カートになるため採らない。
 */

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
function cachedSnapshot<T>(key: string, fallback: T) {
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
      valueCache = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      valueCache = fallback;
    }

    return valueCache;
  };
}

const EMPTY_CART: CartItem[] = [];

const cartSnapshot = cachedSnapshot<CartItem[]>(KEY, EMPTY_CART);

/** クライアント用スナップショット。配列でなければ空扱い */
export function getCartSnapshot(): CartItem[] {
  const value = cartSnapshot();
  return Array.isArray(value) ? value : EMPTY_CART;
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

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
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
  null
);

/** クライアント用スナップショット */
export function getLastOrderSnapshot(): LastOrder | null {
  return lastOrderSnapshot();
}

/** SSR/初回HTML用 */
export function getLastOrderServerSnapshot(): LastOrder | null {
  return null;
}
