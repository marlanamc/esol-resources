#!/usr/bin/env python3
"""Build the pocket verb flip book (student fill-in + teacher key).

Each letter sheet holds two half-page cards. Students cut the cards apart, cut
off the gray in the bottom tab strip, stack them in order and staple at the top.
Every tense card keeps one tab at a different spot, so all 7 tabs show at once.

    python3 build-pocket-verb-book.py
writes pocket-verb-book.html and pocket-verb-book-key.html next to this file.
"""
import math
from pathlib import Path

HERE = Path(__file__).parent

# Timeline marks for the key. The timeline is a 760 x 70 SVG, NOW is at x=380.
def x_mark(x, size=9):
    return (f'<path d="M{x-size},{31-size} L{x+size},{31+size} M{x+size},{31-size} L{x-size},{31+size}" '
            f'stroke="#000" stroke-width="3" fill="none"/>')

def wave(x1, x2):
    pts = [f"{x:.0f},{26 - 7 * math.sin((x - x1) / 7):.1f}" for x in range(x1, x2 + 1, 2)]
    return f'<polyline points="{" ".join(pts)}" stroke="#000" stroke-width="3" fill="none"/>'

def tick(x, label):
    return (f'<line x1="{x}" y1="8" x2="{x}" y2="40" stroke="#000" stroke-width="2"/>'
            f'<text x="{x}" y="7" font-size="12" text-anchor="middle" font-weight="bold">{label}</text>')

TENSES = [
    {
        "tab": "Present<br>simple", "name": "Present simple",
        "use": "Habits, routines, and facts.",
        "words": "every day · usually · always · on Mondays",
        "marks": "".join(x_mark(x) for x in (120, 250, 380, 510, 640)),
        "forms": [
            ("subject + V1", "I work at a hotel."),
            ("subject + don't + V1", "I don't work on Sunday."),
            ("Do + subject + V1?", "Do you work on Sunday?"),
        ],
        "third": "She works. · She doesn't work. · Does she work?",
    },
    {
        "tab": "Past<br>simple", "name": "Past simple",
        "use": "Finished actions in the past.",
        "words": "yesterday · last week · 2 days ago · in 2020",
        "marks": x_mark(190),
        "forms": [
            ("subject + V2", "I worked yesterday."),
            ("subject + didn't + V1", "I didn't work yesterday."),
            ("Did + subject + V1?", "Did you work yesterday?"),
        ],
    },
    {
        "tab": "Future<br>simple", "name": "Future simple",
        "use": "Plans, promises, and guesses about the future.",
        "words": "tomorrow · next week · later · soon",
        "marks": x_mark(570),
        "forms": [
            ("subject + will + V1", "I will work tomorrow."),
            ("subject + won't + V1", "I won't work tomorrow."),
            ("Will + subject + V1?", "Will you work tomorrow?"),
        ],
    },
    {
        "tab": "Present<br>continuous", "name": "Present continuous",
        "use": "Happening right now. In the middle of the action.",
        "words": "now · right now · today · at the moment",
        "marks": wave(330, 430),
        "forms": [
            ("subject + am / is / are + V-ing", "I am working now."),
            ("subject + am / is / are + not + V-ing", "I am not working now."),
            ("Am / Is / Are + subject + V-ing?", "Are you working now?"),
        ],
    },
    {
        "tab": "Past<br>continuous", "name": "Past continuous",
        "use": "In the middle of an action in the past.",
        "words": "at 8:00 last night · when you called · all day yesterday",
        "marks": wave(110, 270) + tick(190, "8:00"),
        "forms": [
            ("subject + was / were + V-ing", "I was working at 8:00 last night."),
            ("subject + wasn't / weren't + V-ing", "I wasn't working at 8:00."),
            ("Was / Were + subject + V-ing?", "Were you working at 8:00?"),
        ],
    },
    {
        "tab": "Future<br>continuous", "name": "Future continuous",
        "use": "In the middle of an action in the future.",
        "words": "at 8:00 tomorrow · this time next week · all day tomorrow",
        "marks": wave(490, 650) + tick(570, "8:00"),
        "forms": [
            ("subject + will be + V-ing", "I will be working at 8:00 tomorrow."),
            ("subject + won't be + V-ing", "I won't be working at 8:00."),
            ("Will + subject + be + V-ing?", "Will you be working at 8:00?"),
        ],
    },
    {
        "tab": "Present<br>perfect", "name": "Present perfect",
        "use": "From the past up to now. Life experience.",
        "words": "ever · never · already · for 3 years · since 2023",
        "marks": ('<circle cx="160" cy="31" r="6" fill="#000"/>'
                  '<line x1="160" y1="31" x2="368" y2="31" stroke="#000" stroke-width="6"/>'
                  '<path d="M366,21 L382,31 L366,41 Z" fill="#000"/>'),
        "forms": [
            ("subject + have / has + V3", "I have worked here for 3 years."),
            ("subject + haven't / hasn't + V3", "I haven't worked at night."),
            ("Have / Has + subject + V3?", "Have you ever worked at night?"),
        ],
        "third": "She has worked. · She hasn't worked. · Has she worked?",
    },
]

CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 14px;
    line-height: 1.3;
  }

  /* One .sheet = one letter page holding two half-page cards (8.5in x 5.5in). */
  .sheet { width: 8.5in; height: 11in; overflow: hidden; page-break-after: always; break-after: page; }
  .card { width: 8.5in; height: 5.5in; display: flex; flex-direction: column; position: relative; }
  .card + .card { border-top: 1.5px dashed #000; }
  .card + .card::before { content: "\\2702  cut"; position: absolute; top: -9px; left: 0.15in; background: #fff; font-size: 11px; padding: 0 4px; }

  @media screen {
    body { background: #e6e6e6; padding: 24px 0; }
    .sheet { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
  }
  @media print {
    @page { size: letter portrait; margin: 0; }
  }

  .gray {
    background: repeating-linear-gradient(45deg, #e4e4e4 0 6px, #c8c8c8 6px 7px);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* Type scale: 22 / 18 / 14 / 11 */
  .body { flex: 1; padding: 0.3in 0.4in 0.12in; display: flex; flex-direction: column; gap: 6px; }

  .staple { position: absolute; top: 0.08in; font-size: 11px; display: flex; align-items: center; gap: 4px; }
  .staple i { display: inline-block; width: 0.35in; height: 0; border-top: 3px solid #000; }
  .staple.l { left: 0.4in; }
  .staple.r { right: 0.4in; }

  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; border-bottom: 2px solid #000; padding-bottom: 3px; }
  .head h1 { font-size: 22px; white-space: nowrap; }
  .head .use { font-size: 14px; text-align: right; }
  .head .use b { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }

  .words { display: flex; gap: 8px; align-items: flex-end; font-size: 14px; }
  .words b { white-space: nowrap; }
  .words .fill { flex: 1; border-bottom: 1.5px solid #000; min-height: 20px; }

  .timeline { border: 1.5px solid #000; padding: 2px 8px 0; }
  .timeline .label { font-size: 11px; font-weight: bold; }
  .timeline svg { display: block; width: 100%; height: auto; }

  .forms { display: grid; grid-template-columns: 30px 1fr 1.25fr; border: 1.5px solid #000; flex: 1; }
  .forms > div { padding: 2px 7px; display: flex; align-items: flex-end; }
  .forms .h { font-size: 11px; font-weight: bold; border-bottom: 1.5px solid #000; padding: 2px 7px; align-items: center; }
  .forms .sym { justify-content: center; align-items: center; font-size: 22px; font-weight: bold; }
  .forms .row + .row, .forms .sym.n, .forms .sym.q { border-top: 1.5px solid #000; }
  .forms > div:not(:nth-child(3n+1)) { border-left: 1.5px solid #000; }
  .forms .write { flex: 1; border-bottom: 1px dotted #000; min-height: 22px; padding-bottom: 1px; }
  .forms .r2, .forms .r3 { border-top: 1.5px solid #000; }

  .third { display: flex; gap: 8px; align-items: flex-end; font-size: 14px; }
  .third b { white-space: nowrap; }
  .third .fill { flex: 1; border-bottom: 1.5px solid #000; min-height: 20px; }

  /* Teacher key: the filled-in answers */
  .ans { font-style: italic; font-weight: bold; }

  /* Bottom tab strip: keep the white tab, cut off the gray */
  .tabs { height: 0.55in; display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1.5px dashed #000; }
  .tabs > div { display: flex; align-items: center; justify-content: center; text-align: center; font-size: 14px; font-weight: bold; line-height: 1.1; }
  .tabs .keep { background: #fff; border: 2px dashed #000; border-top: none; }
  .tabs.all { display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }

  /* Cover */
  .cover h1 { font-size: 22px; }
  .cover .name-row { display: flex; gap: 10px; align-items: flex-end; font-size: 18px; font-weight: bold; }
  .cover .name-row .fill { flex: 1; border-bottom: 2px solid #000; height: 24px; }
  .calm { border: 2px dashed #000; padding: 5px 10px; font-size: 14px; }
  .calm b { font-size: 18px; }
  .ideas { display: grid; grid-template-columns: repeat(4, 1fr); border: 1.5px solid #000; font-size: 14px; }
  .ideas > div { padding: 4px 7px; }
  .ideas > div + div { border-left: 1.5px solid #000; }
  .ideas u, .help { font-weight: bold; text-decoration: underline; text-decoration-thickness: 2px; }
  .cover .two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cover .box { border: 1.5px solid #000; padding: 4px 9px; font-size: 14px; }
  .cover .box b.t { display: block; font-size: 14px; }
  .cover ol { padding-left: 18px; }
"""

TIMELINE_BASE = (
    '<line x1="20" y1="31" x2="735" y2="31" stroke="#000" stroke-width="2"/>'
    '<path d="M732,24 L746,31 L732,38 Z" fill="#000"/>'
    '<line x1="380" y1="4" x2="380" y2="50" stroke="#000" stroke-width="2" stroke-dasharray="4 3"/>'
    '<text x="110" y="64" font-size="13" text-anchor="middle" font-weight="bold">PAST</text>'
    '<text x="380" y="64" font-size="13" text-anchor="middle" font-weight="bold">NOW</text>'
    '<text x="650" y="64" font-size="13" text-anchor="middle" font-weight="bold">FUTURE</text>'
)


def tabs(keep_index):
    cells = []
    for i, t in enumerate(TENSES):
        if i == keep_index:
            cells.append(f'<div class="keep">{t["tab"]}</div>')
        else:
            cells.append('<div class="gray"></div>')
    return f'<div class="tabs">{"".join(cells)}</div>'


def fill(text, key):
    return f'<span class="ans">{text}</span>' if key else ""


def tense_card(i, t, key):
    marks = t["marks"] if key else ""
    rows = []
    for n, (sym, cls) in enumerate((("+", "a"), ("−", "n"), ("?", "q"))):
        formula, example = t["forms"][n]
        r = f" r{n+1}" if n else ""
        rows.append(
            f'<div class="sym {cls}{r}">{sym}</div>'
            f'<div class="{r.strip()}"><span class="write">{fill(formula, key)}</span></div>'
            f'<div class="{r.strip()}"><span class="write">{fill(example, key)}</span></div>'
        )
    third = ""
    if t.get("third"):
        third = f'<div class="third"><b>he / she / it:</b><span class="fill">{fill(t["third"], key)}</span></div>'
    return f"""
<section class="card">
  <span class="staple l"><i></i> staple</span><span class="staple r">staple <i></i></span>
  <div class="body">
    <div class="head"><h1>{i + 1}. {t["name"]}</h1><span class="use"><b>Use it for:</b> {t["use"]}</span></div>
    <div class="words"><b>Time words:</b><span class="fill">{fill(t["words"], key)}</span></div>
    <div class="timeline"><span class="label">Draw it:</span>
      <svg viewBox="0 0 760 70" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif">{TIMELINE_BASE}{marks}</svg>
    </div>
    <div class="forms">
      <div class="h"></div><div class="h">Formula</div><div class="h">My example</div>
      {"".join(rows)}
    </div>
    {third}
  </div>
  {tabs(i)}
</section>"""


COVER = """
<section class="card cover">
  <span class="staple l"><i></i> staple</span><span class="staple r">staple <i></i></span>
  <div class="body">
    <div class="head"><h1>My Pocket Verb Book</h1><span class="use">7 tenses · flip to the tab you need</span></div>
    <div class="name-row">Name: <span class="fill"></span></div>
    <div class="calm"><b>This book is a helper.</b> You don't need to memorize it. Keep it in your pocket or bag. Look at it anytime. Mistakes are OK. People understand you.</div>
    <div class="ideas">
      <div><b>1. Find the helper.</b><br>I <u>am</u> working.</div>
      <div><b>2. − Add <i>not</i>.</b><br>I <u>am</u> not working.</div>
      <div><b>3. ? Move it to the front.</b><br><u>Are</u> you working?</div>
      <div><b>No helper?</b> Use <u>do / does / did</u>.<br>I <u>don't</u> work. <u>Do</u> you work?</div>
    </div>
    <div class="two">
      <div class="box"><b class="t">Verb key</b>V1 = work · V1-s = works<br>V2 = worked · V3 = worked<br>V-ing = working</div>
      <div class="box"><b class="t">Stuck? Say this:</b>"Wait, let me think." · "How do I say...?"<br>"Sorry, I mean..." · "Can you say that again?"</div>
    </div>
    <div class="box" style="border:1.5px solid #000;padding:4px 9px;font-size:14px">
      <b>How to make it:</b> 1. Cut on the long dashed lines. &nbsp;2. Cut off all the gray. &nbsp;3. Put the pages in order: cover, 1, 2, 3... &nbsp;4. Staple at the top.
    </div>
  </div>
  <div class="tabs all gray">cut off this gray strip</div>
</section>"""


def build(key):
    cards = [COVER] + [tense_card(i, t, key) for i, t in enumerate(TENSES)]
    sheets = "".join(f'<div class="sheet">{cards[k]}{cards[k + 1]}</div>' for k in range(0, len(cards), 2))
    title = "Pocket Verb Book Key" if key else "Pocket Verb Book"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
{sheets}
</body>
</html>
"""


if __name__ == "__main__":
    (HERE / "pocket-verb-book.html").write_text(build(key=False))
    (HERE / "pocket-verb-book-key.html").write_text(build(key=True))
