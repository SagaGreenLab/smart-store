"use client";

import { useState } from "react";
import type { Brand } from "@/lib/payment-brands";

/**
 * 決済ブランドのバッジ。
 * brand.logo が指定されている場合のみロゴ画像を表示し、
 * 未指定または読み込み失敗時はブランドカラーの文字バッジを表示する。
 */
export default function BrandBadge({ brand }: { brand: Brand }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (brand.logo && !logoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.logo}
        alt={brand.label}
        className="h-7 w-auto rounded-md bg-white object-contain"
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return (
    <span
      style={{ backgroundColor: brand.color }}
      className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-semibold leading-none text-white"
    >
      {brand.label}
    </span>
  );
}
