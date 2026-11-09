"""pop/codex/C*.png を1枚の一覧画像（番号・名前・想定サイズ付き）にまとめる。

  python3 pop/codex/contact_sheet.py     ->  pop/codex/00_一覧.png（C01〜C12）
  python3 pop/codex/contact_sheet.py D   ->  pop/codex/00_一覧_決済導線版.png（D01〜）
"""

import sys

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from generate import OUT, fname, load_patterns

BLUE = (46, 108, 178)
GRAY = (110, 110, 110)
BG = (234, 230, 223)
FONT = "/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf"


def font(size):
    for f in [FONT, "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"]:
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def main():
    series = (sys.argv[1:] or ["C"])[0]
    _, pats = load_patterns()
    items = [p for p in pats if p["id"].startswith(series) and fname(p).exists()]
    cols, tw, th, cap, pad = 3, 720, 480, 74, 36
    rows = (len(items) + cols - 1) // cols
    W = pad + cols * (tw + pad)
    H = 130 + rows * (th + cap + pad)
    sheet = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(sheet)
    title = "鉢ラベル案（Codex / gpt-image）" if series == "C" else "鉢ラベル 決済導線版（QR＝お会計の入り口）"
    d.text((pad, 40), f"だいいちえんげいセンター 佐賀駅　{title}", fill=BLUE, font=font(40))
    for i, p in enumerate(items):
        x = pad + (i % cols) * (tw + pad)
        y = 130 + (i // cols) * (th + cap + pad)
        im = Image.open(fname(p)).convert("RGB")
        im.thumbnail((tw, th))
        sheet.paste(im, (x, y))
        d.text((x, y + th + 12), p["id"], fill=BLUE, font=font(30))
        d.text((x + 72, y + th + 12), p["name"], fill=(40, 40, 40), font=font(30))
        d.text((x + 72, y + th + 48), f"想定 {p['size']}", fill=GRAY, font=font(22))
    dst = OUT / ("00_一覧.png" if series == "C" else "00_一覧_決済導線版.png")
    sheet.save(dst, optimize=True)
    print(dst, sheet.size, len(items), "案")


if __name__ == "__main__":
    main()
