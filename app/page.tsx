import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import {
  ShopHeader,
  ShopFooter,
  Eyebrow,
  NoCashAlert,
  PlantIcon,
  PhoneIcon,
  TerminalIcon,
  BagIcon,
} from "@/components/Brand";

/**
 * 商品一覧
 *
 * 鉢のQRを読まずに来た人の受け皿。卓上サインと同じ名乗りから始めて、
 * 店内の「お買いもののしかた」をそのまま載せる。無人店なので、
 * 買い方が分からないまま棚の前に立たせない。
 */

const STEPS = [
  {
    icon: <PlantIcon size={22} />,
    ja: "気に入った鉢を、えらぶ。",
    sub: "手にとって、葉の色や形をじっくり見てください。",
    en: "Pick a plant you like.",
  },
  {
    icon: <PhoneIcon />,
    ja: "鉢のQRコードを、スマホで読みとる。",
    sub: "お会計の画面がひらきます。育て方もそこに書いています。",
    en: "Scan the QR code on the pot.",
  },
  {
    icon: <TerminalIcon />,
    ja: "レジ横の端末で、お支払い。",
    sub: "カード・交通系IC・QRコード決済がつかえます。",
    en: "Pay at the terminal next to the counter.",
  },
  {
    icon: <BagIcon />,
    ja: "袋に入れて、お持ち帰り。",
    sub: "持ち帰り袋はレジ横のフックにあります。ご自由にどうぞ。",
    en: "Take a bag from the hook. It's free.",
  },
];

export default function HomePage() {
  return (
    <main className="dg-wrap">
      <ShopHeader />

      <section className="dg-card dg-mt-1" style={{ textAlign: "center", padding: "28px 18px 26px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/mark_blue.png"
          alt=""
          aria-hidden="true"
          style={{ width: 92, height: "auto", margin: "0 auto", display: "block" }}
        />

        <h1 className="dg-h1 dg-mt-3" style={{ lineHeight: 1.7 }}>
          JR佐賀駅の、
          <br />
          ちいさな植物店。
        </h1>
        <p className="dg-en center">Your little plant shop at JR Saga Station</p>

        <hr className="dg-hr" />

        <p className="dg-body center" style={{ fontSize: 13 }}>
          スタッフ不在のセルフ販売です。
          <br />
          お会計はレジ横の端末でどうぞ。
        </p>
      </section>

      <div className="dg-mt-2">
        <NoCashAlert />
      </div>

      <section className="dg-card dg-mt-2">
        <Eyebrow ja="お買いもののしかた" en="HOW TO SHOP" />

        <ol className="dg-steps dg-mt-3">
          {STEPS.map((step, i) => (
            <li key={step.ja}>
              <span className="n">{i + 1}</span>
              <span className="ic">{step.icon}</span>
              <span className="tx">
                <b>{step.ja}</b>
                <span>{step.sub}</span>
                <em>{step.en}</em>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="dg-card">
        <Eyebrow ja="きょうの鉢" en="TODAY'S PLANTS" />

        <div className="dg-list dg-mt-3">
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="dg-row">
              <span className="thumb">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" aria-hidden="true" />
                ) : (
                  <PlantIcon size={26} />
                )}
              </span>

              <span className="body">
                <b>{p.name}</b>
                <span>
                  {p.potSize.replace(/（.*）/, "")}鉢・高さ{p.height}
                </span>
              </span>

              <span className="price">¥{p.price.toLocaleString()}</span>
            </Link>
          ))}
        </div>

        <p className="dg-note">
          棚のラベルにあるQRコードからも、同じ画面がひらきます。
        </p>
      </section>

      <ShopFooter />
    </main>
  );
}
