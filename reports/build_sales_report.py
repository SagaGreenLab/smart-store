import html
G="#2f7d3a"; GL="#cfe5d2"; INK="#1f2a22"; SUB="#5b625c"; MUTE="#8a908b"; GRID="#e6e8e4"
def hbar(rows,w=640,lab=150,rowh=34,fmt=lambda v:f"{v:,}円",hi=None):
    mx=max(v for _,v,_ in rows); h=rowh*len(rows)+10; bw=w-lab-110
    s=[f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img">']
    for i,(n,v,note) in enumerate(rows):
        y=i*rowh+6; L=max(4,bw*v/mx); c=G if (hi is None or i in hi) else "#7fae86"
        s.append(f'<text x="{lab-10}" y="{y+18}" text-anchor="end" font-size="14" fill="{INK}">{html.escape(n)}</text>')
        s.append(f'<path d="M{lab},{y+4} h{L-4} a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-{L-4} z" fill="{c}"/>')
        s.append(f'<text x="{lab+L+8}" y="{y+18}" font-size="13" fill="{INK}" font-weight="600">{fmt(v)}</text><text x="{lab+L+8+len(fmt(v))*7.6+6}" y="{y+18}" font-size="12" fill="{MUTE}">{note}</text>')
    s.append(f'<line x1="{lab}" y1="2" x2="{lab}" y2="{h-2}" stroke="#b9bdb8"/></svg>')
    return "".join(s)
def vbar(rows,w=640,h=230,fmt=lambda v:f"{v:,}",unit="円",hi=()):
    mx=max(v for _,v,_ in rows) or 1; n=len(rows); pad=40; ch=h-60; slot=(w-pad*2)/n; bw=min(56,slot*0.55)
    s=[f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img">']
    for k in range(0,5):
        y=20+ch*k/4; s.append(f'<line x1="{pad}" y1="{y}" x2="{w-pad}" y2="{y}" stroke="{GRID}"/>')
    for i,(lb,v,sub) in enumerate(rows):
        x=pad+slot*i+(slot-bw)/2; bh=ch*v/mx; y=20+ch-bh; c=G if i in hi else "#8fbf96"
        if v>0: s.append(f'<path d="M{x},{20+ch} v-{bh-4} a4,4 0 0 1 4,-4 h{bw-8} a4,4 0 0 1 4,4 v{bh-4} z" fill="{c}"/>')
        s.append(f'<text x="{x+bw/2}" y="{y-6}" text-anchor="middle" font-size="12" fill="{INK}" font-weight="600">{fmt(v)}{unit}</text>')
        s.append(f'<text x="{x+bw/2}" y="{20+ch+18}" text-anchor="middle" font-size="13" fill="{INK}">{lb}</text>')
        s.append(f'<text x="{x+bw/2}" y="{20+ch+34}" text-anchor="middle" font-size="11" fill="{MUTE}">{sub}</text>')
    s.append(f'<line x1="{pad}" y1="{20+ch}" x2="{w-pad}" y2="{20+ch}" stroke="#9aa09b"/></svg>')
    return "".join(s)
def stack(parts,w=640):
    tot=sum(v for _,v,_ in parts); x=0; s=[f'<svg width="{w}" height="78" viewBox="0 0 {w} 78" role="img">']
    for i,(n,v,c) in enumerate(parts):
        L=w*v/tot; s.append(f'<rect x="{x+(1 if i else 0)}" y="6" width="{L-2}" height="30" rx="4" fill="{c}"/>')
        lx=[0,250,430][i]; s.append(f'<rect x="{lx+2}" y="50" width="12" height="12" rx="3" fill="{c}"/><text x="{lx+20}" y="61" font-size="13" fill="{INK}">{n} {v}件（{v/tot:.0%}）</text>')
        x+=L
    s.append("</svg>"); return "".join(s)

items=[("ペペロミア",7680,"6点"),("ヒボタン",5880,"6点"),("ガジュマル",4320,"4点"),("パキラ",2940,"3点"),("ゴムの木 ルビー",1180,"1点"),("サンスベリア",1180,"1点"),("アスパラガス",980,"1点")]
hours=[("6-9時",0,"0件"),("9-12時",1960,"1件"),("12-15時",5300,"5件"),("15-18時",7260,"6件"),("18-21時",7480,"6件"),("21-23時",2160,"2件")]
days=[("11/9 月",1180,"1件"),("11/10 火",3340,"3件"),("11/11 水",7260,"7件"),("11/12 木",5800,"4件"),("11/13 金",2940,"2件"),("11/14 土",3640,"3件")]
prices=[("980円",14,"64%"),("1,180円",6,"27%"),("1,680円",2,"9%")]
log=[("11/9 月","22:48","ゴムの木 ルビー（M）","1,180"),("11/10 火","15:48","ガジュマル（M）","1,180"),("","17:35","ペペロミア（M）","1,180"),("","17:37","ヒボタン","980"),
("11/11 水","12:37","サンスベリア（M）","1,180"),("","12:44","ガジュマル（S）","980"),("","13:28","ペペロミア（M）","1,180"),("","14:46","パキラ（S）","980"),("","15:27","ヒボタン","980"),("","18:19","パキラ（S）","980"),("","21:25","ヒボタン","980"),
("11/12 木","10:46","ヒボタン ×2","1,960"),("","18:43","ガジュマル（M）","1,180"),("","19:43","パキラ（S）","980"),("","20:42","ペペロミア（L）","1,680"),
("11/13 金","16:43","ペペロミア（S）＋ヒボタン","1,960"),("","20:35","ガジュマル（S）","980"),("11/14 土","12:30","ペペロミア（S）","980"),("","17:16","アスパラガス","980"),("","18:14","ペペロミア（L）","1,680")]
logrows="".join(f"<tr><td>{d}</td><td>{t}</td><td>{n}</td><td class=r>{a}円</td></tr>" for d,t,n,a in log)
itemrows="".join(f"<tr><td>{n}</td><td class=r>{q}</td><td class=r>{v:,}円</td><td class=r>{v/24160:.0%}</td></tr>" for n,v,q in items)
page=lambda body,no:f'<section class="page">{body}<div class="foot">だいいちえんげいセンター 佐賀駅店　売上レポート（2026年11月9日〜14日）<span>{no} / 5</span></div></section>'
P1=f'''<div class="kicker">SAGA GREEN 佐賀駅 無人植物ショップ</div>
<h1>はじめの6日間<br>売上レポート</h1>
<div class="period">集計期間：2026年11月9日（月）〜14日（土）／ Square決済データより</div>
<div class="tiles">
 <div class="tile"><div class="tl">売上合計</div><div class="tv">24,160<small>円</small></div></div>
 <div class="tile"><div class="tl">お買い上げ件数</div><div class="tv">20<small>件</small></div></div>
 <div class="tile"><div class="tl">販売点数</div><div class="tv">22<small>点</small></div></div>
 <div class="tile"><div class="tl">1件あたり</div><div class="tv">1,208<small>円</small></div></div>
</div>
<div class="msg"><h3>応援してくださる皆さまへ</h3>
<p>佐賀駅構内に、セルフで植物を買える小さなお店がオープンしました。店員はいませんが、棚のQRコードからスマホやカードで、30秒ほどでお会計ができる仕組みです。</p>
<p>はじめの6日間で、<b>20組のお客さまが植物を連れて帰ってくださいました</b>。通勤や通学の帰り道、出張の合間など、駅を行き交う方の毎日に、少しだけ緑をお届けできたことをうれしく思っています。いつも応援いただき、本当にありがとうございます。</p></div>
<div class="hl"><h3>6日間のポイント</h3><ul>
<li><b>人気No.1はペペロミア</b>。S・M・Lのどのサイズも売れています</li>
<li><b>980円の商品が販売点数の64%</b>。駅で気軽に買える価格が好評です</li>
<li><b>12時〜21時に売上の85%</b>。特に夕方から夜の帰り道に多く買われています</li></ul></div>
<div class="msg"><h3>お店のご案内</h3><ul>
<li><b>場所</b>：JR佐賀駅 構内</li>
<li><b>営業時間</b>：6:30〜23:00（無人・セルフ販売）</li>
<li><b>お支払い</b>：QR決済（PayPayなど）／クレジットカード／交通系IC など</li>
<li><b>植物の育て方</b>：各商品のQRコードから、育て方のページをご覧いただけます</li>
<li><b>運営</b>：だいいちえんげいセンター（佐賀市南佐賀）</li></ul></div>'''
P2=f'''<h2>どんな植物が選ばれた？</h2><p class="lead">商品別の売上です。上位3品（ペペロミア・ヒボタン・ガジュマル）で売上の74%になりました。</p>
<div class="chart"><div class="ct">商品別の売上（6日間）</div>{hbar(items,hi={0,1,2})}</div>
<table><thead><tr><th>商品</th><th class=r>販売点数</th><th class=r>売上</th><th class=r>構成比</th></tr></thead><tbody>{itemrows}<tr class=tot><td>合計</td><td class=r>22</td><td class=r>24,160円</td><td class=r>100%</td></tr></tbody></table>
<div class="chart"><div class="ct">価格帯別の販売点数</div>{hbar(prices,lab=110,fmt=lambda v:f"{v}点",hi={0})}</div>
<p class="note">ヒボタンは2個まとめてのお買い上げもあり、色違いで選ぶ楽しさが伝わっているようです。</p>'''
P3=f'''<h2>いつ買われている？</h2><p class="lead">時間帯別・日別の売上です。駅の営業時間（6:30〜23:00）のうち、お昼すぎから夜にかけて多く買われています。</p>
<div class="chart"><div class="ct">時間帯別の売上</div>{vbar(hours,hi=(3,4))}</div>
<p class="note">朝の通勤時間（6〜9時）はまだ0件。朝に見かけた方が、帰りに立ち寄ってくださるような工夫を考えています。</p>
<div class="chart"><div class="ct">日別の売上</div>{vbar(days,hi=(2,))}</div>
<div class="chart"><div class="ct">お支払い方法（件数）</div>{stack([("QR決済（PayPayなど）",13,"#2a78d6"),("クレジットカード",4,"#eb6834"),("交通系IC など",3,"#1baf7a")])}</div>'''
P4=f'''<h2>お買い上げの記録</h2><p class="lead">6日間の全20件です（時刻はお会計の時刻）。</p>
<table class="log"><thead><tr><th>日付</th><th>時刻</th><th>商品</th><th class=r>金額</th></tr></thead><tbody>{logrows}</tbody></table>
<div class="hl"><h3>これからの取り組み</h3><ul>
<li><b>夕方までの品出し</b>：人気の3品と980円の商品を、15時以降も切らさないようにします</li>
<li><b>帰り道に寄ってもらうPOP</b>：「23時まで買えます。帰りにどうぞ」で朝の通勤の方にも声をかけます</li>
<li><b>ヒボタンの色違いセット</b>：並べて飾る楽しさを提案します</li>
<li><b>品ぞろえの見直し</b>：データを2〜4週間ためて、喜ばれる植物を増やしていきます</li></ul></div>
<p class="thanks">駅で植物を見かけたら、ぜひ手に取ってみてください。<br>これからも、だいいちえんげいセンターをよろしくお願いいたします。🌿</p>'''

planbars=[("損益分岐点",78000,"1日2.1個"),("保守的シナリオ",108000,"1日3個"),("実績ペース",120800,"1日3.7個"),("現実的シナリオ（出店申込書）",252000,"1日7個")]
P5=f'''<h2>当初の計画とくらべると</h2><p class="lead">2026年3月に作成した出店計画書（JR九州ビルマネジメント様へご提案）の試算と、6日間の実績を月30日に換算した数字をくらべました。</p>
<div class="chart"><div class="ct">月の売上：計画と実績ペース</div>{hbar(planbars,lab=210,hi={2})}</div>
<table><thead><tr><th>項目</th><th class=r>計画</th><th class=r>実績ペース</th><th class=r>達成度</th></tr></thead><tbody>
<tr><td>損益分岐点（月）</td><td class=r>78,000円</td><td class=r>120,800円</td><td class=r>155%</td></tr>
<tr><td>保守的シナリオ（1日3個）</td><td class=r>108,000円</td><td class=r>120,800円</td><td class=r>112%</td></tr>
<tr><td>現実的シナリオ（1日7個・出店申込書の見込額）</td><td class=r>252,000円</td><td class=r>120,800円</td><td class=r>48%</td></tr>
<tr><td>楽観的シナリオ（1日15個）</td><td class=r>540,000円</td><td class=r>120,800円</td><td class=r>22%</td></tr>
<tr><td>1件あたりの金額</td><td class=r>1,200円</td><td class=r>1,208円</td><td class=r>101%</td></tr>
<tr><td>1日の販売個数</td><td class=r>7個（現実的）</td><td class=r>3.7個</td><td class=r>52%</td></tr></tbody></table>
<table><thead><tr><th>実績ペースでの月の収支（計画書と同じ前提）</th><th class=r>金額</th></tr></thead><tbody>
<tr><td>売上</td><td class=r>120,800円</td></tr>
<tr><td>原価（30%）・決済手数料（3.5%）・ロス引当（5%）</td><td class=r>▲46,508円</td></tr>
<tr><td>固定費（家賃30,000円・システム・交通費）</td><td class=r>▲48,000円</td></tr>
<tr class=tot><td>営業利益（利益率22%）</td><td class=r>約26,300円</td></tr></tbody></table>
<div class="hl"><h3>まとめ</h3><ul>
<li><b>黒字ラインは開店直後からクリア</b>。1件あたりの金額も計画どおりで、計画の前提は実績と合っています</li>
<li>計画との差は<b>「1日に何個売れるか」</b>。出店申込書の見込額に届くには、1日3.7個を<b>7〜8個（約2倍）</b>にすることが目標です</li>
<li>そのために、帰り道の来店を促すPOP、Lサイズやセット商品の提案、計画にあったドライフラワーの追加に取り組みます</li></ul></div>
<p class="note">※ 開店から6日間（11/9〜14）の実績を30日に換算した参考値です。11/9は夜の1件のみ。システム利用料は計画書の前提（月8,000円）のまま計算しています。</p>'''
CSS=f'''@page{{size:A4;margin:0}}*{{box-sizing:border-box}}body{{margin:0;font-family:"IPAPGothic","IPAGothic",sans-serif;color:{INK};background:#fff}}
.page{{width:210mm;height:297mm;padding:16mm 16mm 14mm;position:relative;page-break-after:always;overflow:hidden}}
.kicker{{color:{G};font-weight:700;font-size:14px;letter-spacing:.08em}}h1{{font-size:38px;line-height:1.3;margin:8px 0 6px;color:{G}}}
.period{{color:{SUB};font-size:13px;margin-bottom:20px}}h2{{font-size:24px;color:{G};margin:0 0 6px;border-left:6px solid {G};padding-left:10px}}
.lead{{color:{SUB};font-size:13.5px;margin:0 0 12px}}
.tiles{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}}.tile{{background:#f2f7f2;border-radius:12px;padding:14px}}
.tl{{font-size:12px;color:{SUB}}}.tv{{font-size:28px;font-weight:700;margin-top:4px}}.tv small{{font-size:14px;margin-left:2px}}
.msg,.hl{{border-radius:12px;padding:14px 18px;margin-bottom:14px}}.msg{{background:#fbf8f0}}.hl{{background:#f2f7f2}}
h3{{margin:0 0 8px;font-size:16px;color:{G}}}p,li{{font-size:13.5px;line-height:1.8}}p{{margin:0 0 6px}}ul{{margin:0;padding-left:20px}}
.chart{{border:1px solid {GRID};border-radius:12px;padding:10px 12px;margin-bottom:12px}}.ct{{font-size:13px;font-weight:700;margin-bottom:4px}}
table{{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:12px}}th{{text-align:left;color:{SUB};font-weight:600;border-bottom:1.5px solid #9aa09b;padding:5px 6px}}
td{{border-bottom:1px solid {GRID};padding:5px 6px}}.r{{text-align:right}}tr.tot td{{font-weight:700;border-top:1.5px solid #9aa09b}}
.log td,.log th{{padding:3.5px 6px;font-size:12px}}.note{{font-size:12.5px;color:{SUB}}}
.thanks{{text-align:center;color:{G};font-weight:700;margin-top:10px}}
.foot{{position:absolute;bottom:8mm;left:16mm;right:16mm;font-size:10px;color:{MUTE};border-top:1px solid {GRID};padding-top:4px}}.foot span{{float:right}}'''
open("reports/report.html","w").write(f'<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>佐賀駅店 売上レポート</title><style>{CSS}</style></head><body>{page(P1,1)}{page(P2,2)}{page(P3,3)}{page(P5,4)}{page(P4,5)}</body></html>')
