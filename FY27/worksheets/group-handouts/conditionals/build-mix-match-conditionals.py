#!/usr/bin/env python3
"""Build the Mix & Match Conditionals book (a split-page flip book).

Unlike the pocket verb book (stepped cards stapled at the top), every inner page here is
cut across the middle and the book is stapled on the LEFT. The top half ("If...") and the
bottom half (the result) flip on their own, so students build new sentences, check
whether the colors match, and fix the verb when they don't. Every half has a box to draw
in, so mixing halves also mixes the pictures.

Print 5 sheets (letter, landscape, one-sided, color). Every cut is one straight line:
  Sheet 1 (cover + back page): cut down the middle.
  Sheets 2-5: cut down the middle, then across the middle.
Stack: cover, pages 1-8 (top pieces over top pieces, bottom over bottom), back page.
Line up the left edges and staple 4 times in the gray strip.

    python3 build-mix-match-conditionals.py
writes mix-match-conditionals.html (and .pdf if Chrome is found) next to this file.
"""
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).parent

# ---- Geometry (inches) ----
BIND = 0.5                      # gray staple strip on the left of every card
HALF = 4.25                     # each inner page is cut into two 4.25in pieces
STAPLES = (0.85, 3.4)           # staple marks inside each 4.25in piece
STAPLES_FULL = STAPLES + tuple(HALF + y for y in STAPLES)

ICONS = {
    # always true: going around and around
    "zero": '<path d="M5 12a7 7 0 0 1 12.2-4.7"/><path d="M17.5 3.5v4h-4"/><path d="M19 12a7 7 0 0 1-12.2 4.7"/><path d="M6.5 20.5v-4h4"/>',
    # real future: a calendar
    "first": '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8.5 15l2.5 2.5 4.5-5"/>',
    # imagine now: a thought cloud
    "second": '<path d="M7 16.5a4 4 0 0 1-.6-7.9A5 5 0 0 1 16 7.2a3.8 3.8 0 0 1 1.3 7.4 3 3 0 0 1-3 1.9z"/><circle cx="6" cy="20" r="1.2"/><circle cx="3.3" cy="22" r=".7"/>',
    # imagine the past: a clock turning back
    "third": '<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4"/><path d="M3.5 3.5v4h4"/><path d="M12 8v4.3l3 1.8"/>',
}


def icon(key, size=18):
    return (f'<svg class="ico" viewBox="0 0 24 24" width="{size}" height="{size}" fill="none" stroke="currentColor" '
            f'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[key]}</svg>')


TYPES = [
    {
        "key": "zero", "name": "Zero", "color": "#0f766e", "bg": "#ccfbf1", "real": True,
        "meaning": "Always true",
        "detail": "It happens <b>every time</b>. Facts, habits, and rules.",
        "if_form": "If + V1", "res_form": "V1",
        "if_text": "If I <b>drink</b> coffee at night,", "res_text": "I <b>don't sleep</b> well.",
        "res_stem": "I", "ideas": "I'm tired · it's cold · I don't eat breakfast",
        "watch": "Both verbs are V1. he / she / it + V1-s: If my son <b>gets</b> sick, I <b>stay</b> home.",
        "ask": "What do you do if…?",
    },
    {
        "key": "first", "name": "First", "color": "#1d4ed8", "bg": "#dbeafe", "real": True,
        "meaning": "Real future",
        "detail": "It <b>can really happen</b>. A plan, a promise, a warning.",
        "if_form": "If + V1", "res_form": "will + V1",
        "if_text": "If it <b>rains</b> tomorrow,", "res_text": "I <b>will take</b> the bus.",
        "res_stem": "I will", "ideas": "it's sunny this weekend · I get paid on Friday",
        "watch": "No <b>will</b> after if: <s>If it will rain</s> → If it <b>rains</b>",
        "ask": "What will you do if…?",
    },
    {
        "key": "second", "name": "Second", "color": "#6d28d9", "bg": "#ede9fe", "real": False,
        "meaning": "Imagine now",
        "detail": "<b>Not real</b>. A dream or a wish. It probably won't happen.",
        "if_form": "If + V2", "res_form": "would + V1",
        "if_text": "If I <b>won</b> the lottery,", "res_text": "I <b>would buy</b> a house.",
        "res_stem": "I would", "ideas": "I had more time · I lived near the beach · I were the boss",
        "watch": "No <b>would</b> after if: <s>If I would have a car</s> → If I <b>had</b> a car",
        "ask": "What would you do if…?",
    },
    {
        "key": "third", "name": "Third", "color": "#b45309", "bg": "#fef3c7", "real": False,
        "meaning": "Imagine the past",
        "detail": "It <b>did not happen</b>. It's too late to change it.",
        "if_form": "If + had + V3", "res_form": "would have + V3",
        "if_text": "If I <b>had left</b> home earlier,", "res_text": "I <b>would have caught</b> the bus.",
        "res_stem": "I would have", "ideas": "I had studied more · I hadn't missed the bus",
        "watch": "had + <b>V3</b>, not V2: <s>If I had went</s> → If I had <b>gone</b>",
        "ask": "What would you have done if…?",
    },
]

CSS = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000; background: #fff; font-size: 13px; line-height: 1.3;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}
  @media screen {{
    body {{ background: #e6e6e6; padding: 24px 0; }}
    .sheet {{ background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }}
  }}
  @media print {{ @page {{ size: letter landscape; margin: 0; }} }}

  .sheet {{ width: 11in; height: 8.5in; overflow: hidden; display: flex; position: relative; page-break-after: always; break-after: page; }}
  .card {{ width: 5.5in; height: 8.5in; position: relative; display: flex; flex-direction: column; }}
  .card + .card {{ border-left: 1.5px dashed #000; }}
  .card + .card::before {{ content: "\\2702  cut"; position: absolute; top: 2.2in; left: -9px; writing-mode: vertical-rl; background: #fff; font-size: 11px; padding: 4px 0; z-index: 3; }}

  /* Type colors */
  .t-zero {{ --c: #0f766e; --bg: #ccfbf1; }}
  .t-first {{ --c: #1d4ed8; --bg: #dbeafe; }}
  .t-second {{ --c: #6d28d9; --bg: #ede9fe; }}
  .t-third {{ --c: #b45309; --bg: #fef3c7; }}

  /* Staple strip on the left: nothing to read or write here */
  .bind {{ position: absolute; left: 0; top: 0; bottom: 0; width: {BIND}in; background: #f0f0f0; border-right: 1px dashed #999; z-index: 1; }}
  .bind .staple {{ position: absolute; left: 0.25in; width: 0; height: 0.42in; margin-top: -0.21in; border-left: 4px solid #000; }}
  .bind .pno {{ position: absolute; left: 0; right: 0; text-align: center; font-size: 11px; font-weight: bold; line-height: 1.1; color: #333; }}
  .bind .pno i {{ display: block; font-style: normal; font-weight: normal; font-size: 8.5px; color: #555; }}

  /* One half of an inner page */
  .piece {{ height: {HALF}in; position: relative; padding-left: {BIND}in; display: flex; flex-direction: column; }}
  .piece.top {{ padding-top: 0.3in; padding-bottom: 0.2in; }}
  .piece.bottom {{ padding-top: 0.2in; padding-bottom: 0.3in; border-top: 1.5px dashed #000; }}
  .piece.bottom::before {{ content: "\\2702  cut across"; position: absolute; top: -9px; right: 0.4in; background: #fff; font-size: 11px; padding: 0 5px; z-index: 2; }}
  .pc {{ flex: 1; min-height: 0; padding: 0 0.3in 0 0.2in; display: flex; flex-direction: column; gap: 6px; }}

  /* Colored band: the color check for mixing */
  .band {{ background: var(--c); color: #fff; border-radius: 6px; display: flex; align-items: center; gap: 7px; padding: 4px 9px; font-size: 13px; }}
  .band b {{ font-size: 15px; letter-spacing: 0.5px; }}
  .band .real {{ margin-left: auto; font-size: 10px; font-weight: bold; letter-spacing: 0.5px; border: 1.5px solid #fff; border-radius: 99px; padding: 0 7px; }}
  .band .real.no {{ background: #fff; color: var(--c); }}

  .role {{ font-size: 11px; font-weight: bold; letter-spacing: 1.5px; color: var(--c); }}
  .main {{ flex: 1; min-height: 0; display: flex; gap: 0.16in; }}
  .words {{ flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }}
  .sent {{ font-size: 26px; line-height: 1.2; }}
  .sent b {{ color: var(--c); }}
  .formula {{ align-self: flex-start; border: 2px solid var(--c); background: var(--bg); border-radius: 6px; padding: 2px 10px; font-size: 16px; font-weight: bold; }}
  .note {{ font-size: 12px; line-height: 1.3; }}
  .note b {{ color: var(--c); }}
  .draw {{ width: 1.75in; flex: none; border: 2px dashed var(--c); border-radius: 8px; position: relative; }}
  .draw span {{ position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 10px; color: #555; }}

  /* Student-written pages */
  .stem {{ font-size: 22px; font-weight: bold; color: var(--c); }}
  .wl {{ display: block; height: 0.42in; border-bottom: 1.5px solid #000; }}
  .ideas {{ font-size: 11px; color: #333; }}
  .watch {{ font-size: 11.5px; border: 1.5px dashed var(--c); border-radius: 6px; padding: 3px 8px; background: var(--bg); }}
  .watch s {{ text-decoration-thickness: 2px; }}
  .watch > b:first-child {{ color: var(--c); }}

  /* Full cards: cover and back page */
  .full {{ padding: 0.3in 0.3in 0.3in {BIND + 0.2}in; height: 100%; display: flex; flex-direction: column; gap: 9px; }}
  .eyebrow {{ font-size: 9px; letter-spacing: 2px; color: #555; }}
  .title {{ font-size: 30px; line-height: 1.05; }}
  .subtitle {{ font-size: 13px; color: #333; }}

  .split-demo {{ border: 2px solid #000; border-radius: 8px; overflow: hidden; }}
  .split-demo > div {{ display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 22px; font-weight: bold; }}
  .split-demo > div + div {{ border-top: 2px dashed #000; }}
  .split-demo span {{ font-size: 11px; font-weight: normal; color: #333; margin-left: auto; text-align: right; line-height: 1.2; }}

  .legend {{ display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }}
  .legend > div {{ border: 2px solid var(--c); border-radius: 7px; overflow: hidden; }}
  .legend .lh {{ background: var(--c); color: #fff; display: flex; align-items: center; gap: 6px; padding: 3px 8px; font-weight: bold; font-size: 14px; }}
  .legend .lb {{ padding: 3px 8px 5px; font-size: 11.5px; line-height: 1.25; }}

  .name {{ display: flex; gap: 8px; align-items: flex-end; font-size: 14px; }}
  .name .fill {{ flex: 1; border-bottom: 1.5px solid #000; height: 20px; }}

  .silly {{ font-size: 13px; margin-top: 6px; }}
  .silly .wl {{ height: 0.4in; }}
  .make {{ border-top: 1.5px solid #000; padding-top: 6px; margin-top: auto; display: flex; gap: 12px; align-items: center; }}
  .make ol {{ flex: 1; font-size: 11px; line-height: 1.3; padding-left: 16px; }}
  .make ol li + li {{ margin-top: 3px; }}
  .make svg {{ width: 1.2in; flex: none; }}

  h2 {{ font-size: 16px; border-bottom: 3px solid #000; padding-bottom: 2px; }}
  .ref {{ display: flex; flex-direction: column; gap: 5px; }}
  .ref > div {{ border: 2px solid var(--c); border-radius: 7px; overflow: hidden; }}
  .ref .rh {{ background: var(--c); color: #fff; display: flex; align-items: center; gap: 6px; padding: 2px 8px; font-size: 13px; }}
  .ref .rh b {{ font-size: 14px; }}
  .ref .rh em {{ margin-left: auto; font-style: normal; font-size: 10px; font-weight: bold; }}
  .ref .rf {{ display: flex; align-items: center; gap: 6px; padding: 4px 8px 0; font-size: 13px; font-weight: bold; }}
  .ref .rf span {{ background: var(--bg); border: 1.5px solid var(--c); border-radius: 5px; padding: 0 7px; }}
  .ref .rx {{ padding: 2px 8px 4px; font-size: 12px; }}
  .ref .rx b {{ color: var(--c); }}

  .play {{ display: flex; flex-direction: column; gap: 5px; font-size: 12px; line-height: 1.3; }}
  .play > div {{ display: flex; gap: 8px; }}
  .play i {{ font-style: normal; flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #000; color: #fff; font-weight: bold; font-size: 12px; }}
  .play s {{ text-decoration-thickness: 2px; }}
  .secret {{ border: 2px dashed #000; border-radius: 7px; padding: 5px 9px; font-size: 12px; line-height: 1.3; margin-top: auto; }}
"""


def bind(staples, label=""):
    marks = "".join(f'<span class="staple" style="top:{y}in"></span>' for y in staples)
    pno = f'<span class="pno" style="top:{(staples[0] + staples[1]) / 2 - 0.2}in">{label}</span>' if label else ""
    return f'<div class="bind">{marks}{pno}</div>'


def band(t, page):
    real = '<span class="real">REAL</span>' if t["real"] else '<span class="real no">NOT REAL</span>'
    return f'<div class="band">{icon(t["key"])}<b>{t["name"].upper()}</b> · {t["meaning"]}{real}</div>'


def piece(pos, t, page, body):
    role = "IF…" if pos == "top" else "…RESULT"
    label = f'{page}<i>{pos}</i>'
    return f"""<div class="piece {pos}">{bind(STAPLES, label)}
    <div class="pc">{band(t, page)}<div class="role">{role}</div>{body}</div></div>"""


def draw_box():
    return '<div class="draw"><span>Draw it!</span></div>'


def model_page(t, page):
    """Page A: the example sentence, printed. Students draw the pictures."""
    top = f"""<div class="main"><div class="words">
        <div class="sent">{t["if_text"]}</div><div class="formula">{t["if_form"]}</div>
        <div class="note">{t["detail"]}</div></div>{draw_box()}</div>"""
    bottom = f"""<div class="main"><div class="words">
        <div class="sent">{t["res_text"]}</div><div class="formula">{t["res_form"]}</div>
        <div class="note"><b>Ask a partner:</b> {t["ask"]}</div></div>{draw_box()}</div>"""
    return f'<div class="card t-{t["key"]}">{piece("top", t, page, top)}{piece("bottom", t, page, bottom)}</div>'


def student_page(t, page):
    """Page B: students write their own sentence on both halves."""
    top = f"""<div class="main"><div class="words">
        <div class="stem">If</div><span class="wl"></span><span class="wl"></span>
        <div class="formula">{t["if_form"]}</div></div>{draw_box()}</div>
        <div class="ideas"><b>Ideas:</b> If {t["ideas"].replace(" · ", " · If ")}…</div>"""
    bottom = f"""<div class="main"><div class="words">
        <div class="stem">{t["res_stem"]}</div><span class="wl"></span><span class="wl"></span>
        <div class="formula">{t["res_form"]}</div></div>{draw_box()}</div>
        <div class="watch"><b>Watch out!</b> {t["watch"]}</div>"""
    return f'<div class="card t-{t["key"]}">{piece("top", t, page, top)}{piece("bottom", t, page, bottom)}</div>'


ASSEMBLY_SVG = """<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect x="14" y="8" width="100" height="134" rx="3" fill="#fff" stroke="#000" stroke-width="2"/>
  <rect x="8" y="12" width="100" height="134" rx="3" fill="#fff" stroke="#000" stroke-width="2"/>
  <rect x="8" y="12" width="14" height="134" fill="#e5e5e5"/>
  <line x1="8" y1="79" x2="108" y2="79" stroke="#000" stroke-width="2" stroke-dasharray="5 4"/>
  <g stroke="#000" stroke-width="3.5"><line x1="15" y1="22" x2="15" y2="34"/><line x1="15" y1="57" x2="15" y2="69"/><line x1="15" y1="89" x2="15" y2="101"/><line x1="15" y1="124" x2="15" y2="136"/></g>
  <text x="65" y="50" text-anchor="middle" font-size="16" font-weight="bold">IF…</text>
  <text x="65" y="117" text-anchor="middle" font-size="14" font-weight="bold">…RESULT</text>
  <path d="M104 40 q14 6 6 22" fill="none" stroke="#000" stroke-width="1.5"/><path d="M106 59 l4 4 l3 -5" fill="none" stroke="#000" stroke-width="1.5"/>
</svg>"""


def cover():
    legend = "".join(
        f'<div class="t-{t["key"]}"><div class="lh">{icon(t["key"], 16)}{t["name"]}</div>'
        f'<div class="lb"><b>{t["meaning"]}</b><br>{t["if_form"]} → {t["res_form"]}</div></div>' for t in TYPES)
    return f"""<div class="card">{bind(STAPLES_FULL)}<div class="full">
    <div><div class="eyebrow">MY ENGLISH TOOLKIT</div><div class="title">Mix &amp; Match<br>Conditionals</div>
      <div class="subtitle">Flip the top. Flip the bottom. Make a new sentence!</div></div>
    <div class="split-demo"><div>If… <span>the top half:<br>the condition</span></div><div>…result. <span>the bottom half:<br>what happens</span></div></div>
    <div class="legend">{legend}</div>
    <div class="name"><b>Name:</b><span class="fill"></span></div>
    <div class="silly"><b>My silliest mix</b> (it must be correct!):<span class="wl"></span><span class="wl"></span></div>
    <div class="make">{ASSEMBLY_SVG}<ol>
      <li><b>Cut</b> every sheet down the middle. Sheets 2–5: cut <b>across</b> the middle too.</li>
      <li><b>Stack:</b> this cover, then pages 1 to 8, then the back page. Tops on tops, bottoms on bottoms.</li>
      <li><b>Line up</b> the left edges. <b>Staple</b> 4 times in the gray strip.</li>
      <li><b>Draw</b> a picture on every half. Write your own sentences on pages 2, 4, 6, and 8.</li>
    </ol></div>
  </div></div>"""


def back_page():
    ref = "".join(
        f'<div class="t-{t["key"]}"><div class="rh">{icon(t["key"], 15)}<b>{t["name"]}</b> · {t["meaning"]}'
        f'<em>{"REAL" if t["real"] else "NOT REAL"}</em></div>'
        f'<div class="rf"><span>{t["if_form"]}</span>,<span>{t["res_form"]}</span></div>'
        f'<div class="rx">{t["if_text"]} {t["res_text"]}</div></div>' for t in TYPES)
    return f"""<div class="card">{bind(STAPLES_FULL)}<div class="full">
    <h2>The 4 conditionals</h2>
    <div class="ref">{ref}</div>
    <h2>How to play</h2>
    <div class="play">
      <div><i>1</i><span><b>Mix it.</b> Flip some top halves and some bottom halves. Read your new sentence out loud.</span></div>
      <div><i>2</i><span><b>Check it.</b> Same color? Say it to a partner. Different colors? <b>The top is the boss.</b> Change the bottom verb so it matches.<br>
        <s>If I won the lottery, I will take the bus.</s> → If I won the lottery, I <b>would take</b> the bus.</span></div>
      <div><i>3</i><span><b>Cover it.</b> Cover the bottom half with your hand. Your partner reads the top and finishes the sentence.</span></div>
      <div><i>4</i><span><b>Ask it.</b> What do you do if…? · What will you do if…? · What would you do if…? · What would you have done if…?</span></div>
    </div>
    <div class="secret"><b>Secret!</b> Zero top + First bottom can be correct. Both tops use <b>If + V1</b>.<br>
      If I drink coffee at night, I will take the bus. ✓ (silly, but correct!)<br>
      <b>Comma:</b> If is first? Use a comma. If it rains<b>,</b> I take the bus.</div>
  </div></div>"""


def build():
    pages = []
    for i, t in enumerate(TYPES):
        pages.append(model_page(t, 2 * i + 1))
        pages.append(student_page(t, 2 * i + 2))
    sheets = [f'<div class="sheet">{cover()}{back_page()}</div>']
    sheets += [f'<div class="sheet">{pages[k]}{pages[k + 1]}</div>' for k in range(0, len(pages), 2)]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mix &amp; Match Conditionals</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
{"".join(sheets)}
</body>
</html>
"""


def pdf(html_path):
    chrome = shutil.which("chromium") or shutil.which("google-chrome") or "/opt/pw-browsers/chromium"
    out = html_path.with_suffix(".pdf")
    try:
        subprocess.run([chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                        "--virtual-time-budget=8000", f"--print-to-pdf={out}", html_path.resolve().as_uri()],
                       check=True, capture_output=True)
        print(f"wrote {out.name}")
    except (OSError, subprocess.CalledProcessError) as e:
        print(f"skipped PDF ({e})")


if __name__ == "__main__":
    html = HERE / "mix-match-conditionals.html"
    html.write_text(build())
    print(f"wrote {html.name}")
    pdf(html)
