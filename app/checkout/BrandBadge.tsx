"use client";

import { useState } from "react";
import type { Brand } from "@/lib/payment-brands";

/**
 * 決済ブランドのバッジ。
 * brand.logo が指定されている場合のみロゴ画像を表示し、
 * 未指定または読み込み失敗時はブランドカラーの文字バッジを表示する。
 */
export default function BrandBadge({
  brand,
  size = "sm",
}: {
  brand: Brand;
  /** sm: 通常 / lg: 公式ロゴ画像が無いブランドを目立たせる用 */
  size?: "sm" | "lg";
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  const imgSize = size === "lg" ? "h-10" : "h-7";
  const badgeSize =
    size === "lg"
      ? "h-10 rounded-lg px-3.5 text-sm"
      : "h-7 rounded-md px-2 text-[11px]";

  if (brand.logo && !logoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.logo}
        alt={brand.label}
        className={`${imgSize} w-auto rounded-md bg-white object-contain`}
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return (
    <span
      style={{ backgroundColor: brand.color }}
      className={`inline-flex items-center font-semibold leading-none text-white ${badgeSize}`}
    >
      {brand.label}
    </span>
  );
}
