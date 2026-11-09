"""鉢ラベル案を OpenAI gpt-image（Codex と同じ画像モデル）で生成する。

pop/codex-label-prompts.md の「共通ルール」と表（C01〜C12）を読み、
参照画像（既存ラベル一覧とロゴ）を添えて 1パターン1枚ずつ作る。

  python3 pop/codex/generate.py            # まだ無い案だけ作る
  python3 pop/codex/generate.py C03 C08    # 指定した案だけ作り直す

APIキーは環境のネットワークシークレットからプロキシが差し込むので、
OPENAI_API_KEY はダミー値で動く。
"""

import base64
import os
import re
import sys
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
POP = ROOT / "pop"
OUT = POP / "codex"
REFS = [
    POP / "out/preview/labels/labels_01-05.png",
    POP / "assets/lockup_blue.png",
]
# 決済導線版は、もとにした案の画像も参照に渡して雰囲気を引き継ぐ
BASE = {"D01": "C07", "D02": "C09", "D03": "C08"}
MODELS = [m for m in [os.environ.get("IMAGE_MODEL"), "gpt-image-2", "gpt-image-1.5"] if m]
QUALITY = os.environ.get("IMAGE_QUALITY", "high")

EXTRA = (
    "Use the attached reference images only for the brand look: the exact blue #2E6CB2, "
    "the thin line-art cat-with-sunflower logo, the light MUJI-like typography and hairline rules. "
    "Do NOT copy the reference layouts; make the new label format described above. "
    "One label design per image, shown as a real product photo in a calm shop setting. "
    "Japanese text and the QR code may be imperfect; shape, material and layout direction matter most."
)


def load_patterns():
    md = (POP / "codex-label-prompts.md").read_text(encoding="utf-8")
    common = re.search(r"## 共通ルール.*?```\n(.*?)```", md, re.S).group(1).strip()
    rows = re.findall(r"^\| ([CD]\d\d) \| (.+?) \| (.+?) \| `(.+?)` \|$", md, re.M)
    return common, [dict(id=i, name=n.strip(), size=s.strip(), prompt=p) for i, n, s, p in rows]


def fname(p):
    return OUT / f"{p['id']}_{p['name']}.png"


def main():
    os.environ.setdefault("OPENAI_API_KEY", "proxy-injected")
    client = OpenAI(max_retries=0, timeout=600)
    common, pats = load_patterns()
    want = set(sys.argv[1:])
    OUT.mkdir(parents=True, exist_ok=True)
    for p in pats:
        dst = fname(p)
        if want and p["id"] not in want:
            continue
        if not want and dst.exists():
            print("skip", dst.name)
            continue
        files = []
        prompt = f"{common}\n\n{p['prompt']}\nIntended real size: {p['size']}.\n\n{EXTRA}"
        for model in MODELS:
            try:
                refs = REFS + sorted(OUT.glob(f"{BASE[p['id']]}_*.png")) if p["id"] in BASE else REFS
                files = [open(r, "rb") for r in refs]
                # 高画質は時間がかかり、待つだけだと途中の中継で切られるので
                # ストリーミングで途中経過を受け取りながら待つ
                stream = client.images.edit(
                    model=model, image=files, prompt=prompt,
                    size="1536x1024", quality=QUALITY, n=1,
                    stream=True, partial_images=2,
                )
                b64 = None
                for ev in stream:
                    if ev.type.endswith("completed"):
                        b64 = ev.b64_json
                if not b64:
                    raise RuntimeError("no image in stream")
                dst.write_bytes(base64.b64decode(b64))
                print("ok  ", dst.name, f"({model})", flush=True)
                break
            except Exception as e:  # モデル名が使えないときは次を試す
                print("fail", p["id"], model, str(e)[:200])
            finally:
                for f in files:
                    f.close()


if __name__ == "__main__":
    main()
