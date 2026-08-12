"use client";

import { useState } from "react";
import type { Brand } from "@/lib/payment-brands";

/**
 * 決済ブランドのバッジ。
 * public/brands/{slug}.svg があればロゴ画像を表示し、
 * 無い場合（読み込み失敗時）はブランドカラーの文字バッジにフォールバックする。
 */
export default function BrandBadge({ brand }: { brand: Brand }) {
  const [src, setSrc] = useState(`/brands/${brand.slug}.svg`);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        style={{ backgroundColor: brand.color }}
        className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-semibold leading-none text-white"
      >
        {brand.label}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={brand.label}
      className="h-7 w-auto rounded-md bg-white object-contain"
      onError={() => {
        // .svg が無ければ .png を試し、それも無ければ文字バッジへ
        if (src.endsWith(".svg")) {
          setSrc(`/brands/${brand.slug}.png`);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
