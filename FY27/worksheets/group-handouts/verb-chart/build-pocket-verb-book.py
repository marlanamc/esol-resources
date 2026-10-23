#!/usr/bin/env python3
"""Build the pocket verb flip book (student fill-in + teacher key).

Each letter sheet holds two half-page cards. Students cut the cards apart, cut
off the gray in the bottom tab strip, stack them in order and staple at the top.
Every tense card keeps one tab at a different spot, so all 7 tabs show at once.

The timelines copy the Timeline Tenses game (TimelineCanvas.tsx and
TimelineElement.tsx): same 400 x 80 canvas, zones, colors and stamps, with each
tense's stamp taken from src/data/timeline-learn-tenses.ts. Students get the
empty canvas and draw the stamp; the key shows it.

    python3 build-pocket-verb-book.py
writes pocket-verb-book.html and pocket-verb-book-key.html next to this file.
"""
from pathlib import Path

HERE = Path(__file__).parent

# Tailwind colors used by the game
AMBER_100, AMBER_600, AMBER_700, AMBER_800 = "#fef3c7", "#d97706", "#b45309", "#92400e"
EMERALD_100, EMERALD_500, EMERALD_600, EMERALD_700 = "#d1fae5", "#10b981", "#059669", "#047857"
BLUE_100, BLUE_600, BLUE_700 = "#dbeafe", "#2563eb", "#1d4ed8"
SLATE_300 = "#cbd5e1"

ZONE = {
    "past": (AMBER_600, AMBER_700),
    "present": (EMERALD_600, EMERALD_700),
    "future": (BLUE_600, BLUE_700),
}

# Game geometry (timelineTensesUtils.ts / TimelineCanvas.tsx)
WIDTH, NOW_X, AXIS_Y = 400, 200, 50
PAST_START, PAST_END, FUTURE_START, FUTURE_END = 20, 168, 206, 380


def element_x(zone, position):
    if zone == "present":
        return NOW_X
    if zone == "future":
        return FUTURE_START + position / 100 * (FUTURE_END - FUTURE_START)
    return PAST_START + position / 100 * (PAST_END - PAST_START)


def stamp(kind, zone, position):
    fill, stroke = ZONE[zone]
    x, y = element_x(zone, position), AXIS_Y
    if kind == "single-dot":
        return f'<circle cx="{x:.1f}" cy="{y}" r="8" fill="{fill}"/>'
    if kind == "multiple-dots":
        return (f'<circle cx="{x - 20:.1f}" cy="{y}" r="5" fill="{fill}" opacity="0.7"/>'
                f'<circle cx="{x:.1f}" cy="{y}" r="6" fill="{fill}"/>'
                f'<circle cx="{x + 20:.1f}" cy="{y}" r="5" fill="{fill}" opacity="0.7"/>')
    if kind == "solid-line":
        return (f'<line x1="{x - 30:.1f}" y1="{y}" x2="{x + 30:.1f}" y2="{y}" stroke="{stroke}" '
                f'stroke-width="8" stroke-linecap="round" stroke-dasharray="8 6"/>')
    if kind == "arc":
        mid, h = (x + NOW_X) / 2, min(30, abs(NOW_X - x) / 4)
        return (f'<circle cx="{x:.1f}" cy="{y}" r="6" fill="{fill}"/>'
                f'<path d="M {x:.1f} {y} Q {mid:.1f} {y - h:.1f} {NOW_X} {y}" fill="none" stroke="{stroke}" stroke-width="4"/>'
                f'<circle cx="{NOW_X}" cy="{y}" r="7" fill="{EMERALD_600}"/>')
    raise ValueError(kind)


def timeline(marks=""):
    past_label_x = (PAST_START + NOW_X - 6) / 2
    future_label_x = (FUTURE_START + FUTURE_END) / 2
    return f"""<svg viewBox="0 0 {WIDTH} 80" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif">
        <rect x="{PAST_START - 4}" y="12" width="{NOW_X - PAST_START - 6}" height="56" rx="12" fill="{AMBER_100}"/>
        <rect x="{FUTURE_START - 4}" y="12" width="{FUTURE_END - FUTURE_START + 8}" height="56" rx="12" fill="{BLUE_100}"/>
        <rect x="{NOW_X - 14}" y="12" width="32" height="56" rx="10" fill="{EMERALD_100}"/>
        <line x1="10" y1="{AXIS_Y}" x2="{WIDTH - 10}" y2="{AXIS_Y}" stroke="{SLATE_300}" stroke-width="4" stroke-linecap="round"/>
        <line x1="{NOW_X}" y1="{AXIS_Y - 20}" x2="{NOW_X}" y2="{AXIS_Y + 20}" stroke="{EMERALD_500}" stroke-width="4" stroke-linecap="round"/>
        <text x="{past_label_x}" y="76" text-anchor="middle" fill="{AMBER_800}" font-size="12" font-weight="700">PAST</text>
        <text x="{NOW_X}" y="10" text-anchor="middle" fill="{EMERALD_700}" font-size="10" font-weight="800">NOW</text>
        <text x="{future_label_x}" y="76" text-anchor="middle" fill="{BLUE_700}" font-size="12" font-weight="700">FUTURE</text>
        {marks}
      </svg>"""


TENSES = [
    {
        "tab": "Present<br>simple", "name": "Present simple", "zone": "present",
        "use": "Habits, routines, and facts.",
        "words": "every day · usually · always · on Mondays",
        "stamp": ("multiple-dots", "present", 50),
        "forms": [
            ("subject + V1", "I work at a hotel."),
            ("subject + don't + V1", "I don't work on Sunday."),
            ("Do + subject + V1?", "Do you work on Sunday?"),
        ],
        "third": "She works. · She doesn't work. · Does she work?",
    },
    {
        "tab": "Past<br>simple", "name": "Past simple", "zone": "past",
        "use": "Finished actions in the past.",
        "words": "yesterday · last week · 2 days ago · in 2020",
        "stamp": ("single-dot", "past", 40),
        "forms": [
            ("subject + V2", "I <b>worked</b> yesterday."),
            ("subject + didn't + V1", "I didn't work yesterday."),
            ("Did + subject + V1?", "Did you work yesterday?"),
        ],
    },
    {
        "tab": "Future<br>simple", "name": "Future simple", "zone": "future",
        "use": "Plans, promises, and guesses about the future.",
        "words": "tomorrow · next week · later · soon",
        "stamp": ("single-dot", "future", 50),
        "forms": [
            ("subject + will + V1", "I will work tomorrow."),
            ("subject + won't + V1", "I won't work tomorrow."),
            ("Will + subject + V1?", "Will you work tomorrow?"),
        ],
    },
    {
        "tab": "Present<br>continuous", "name": "Present continuous", "zone": "present",
        "use": "Happening right now. In the middle of the action.",
        "words": "now · right now · today · at the moment",
        "stamp": ("solid-line", "present", 50),
        "forms": [
            ("subject + am / is / are + V-ing", "I am working now."),
            ("subject + am / is / are + not + V-ing", "I am not working now."),
            ("Am / Is / Are + subject + V-ing?", "Are you working now?"),
        ],
    },
    {
        "tab": "Past<br>continuous", "name": "Past continuous", "zone": "past",
        "use": "In the middle of an action in the past.",
        "words": "at 8:00 last night · when you called · all day yesterday",
        "stamp": ("solid-line", "past", 30),
        "forms": [
            ("subject + was / were + V-ing", "I was working at 8:00."),
            ("subject + wasn't / weren't + V-ing", "I wasn't working at 8:00."),
            ("Was / Were + subject + V-ing?", "Were you working at 8:00?"),
        ],
    },
    {
        "tab": "Future<br>continuous", "name": "Future continuous", "zone": "future",
        "use": "In the middle of an action in the future.",
        "words": "at 8:00 tomorrow · this time next week · all day tomorrow",
        "stamp": ("solid-line", "future", 60),
        "forms": [
            ("subject + will be + V-ing", "I will be working at 8:00."),
            ("subject + won't be + V-ing", "I won't be working at 8:00."),
            ("Will + subject + be + V-ing?", "Will you be working at 8:00?"),
        ],
    },
    {
        "tab": "Present<br>perfect", "name": "Present perfect", "zone": "perfect",
        "use": "From the past up to now. Life experience.",
        "words": "ever · never · already · for 3 years · since 2023",
        "stamp": ("arc", "past", 50),
        "forms": [
            ("subject + have / has + V3", "I have <b>worked</b> at night."),
            ("subject + haven't / hasn't + V3", "I haven't worked at night."),
            ("Have / Has + subject + V3?", "Have you ever worked at night?"),
        ],
        "third": "She has worked. · She hasn't worked. · Has she worked?",
    },
]

# Irregular examples (eat · ate · eaten), one per + / - / ? row
IRREGULAR = {
    "Present simple": ("I eat breakfast at 7.", "I don't eat meat.", "Do you eat meat?"),
    "Past simple": ("I <b>ate</b> breakfast.", "I didn't eat breakfast.", "Did you eat breakfast?"),
    "Future simple": ("I will eat later.", "I won't eat later.", "Will you eat later?"),
    "Present continuous": ("I am eating now.", "I am not eating now.", "Are you eating now?"),
    "Past continuous": ("I was eating at 8:00.", "I wasn't eating at 8:00.", "Were you eating at 8:00?"),
    "Future continuous": ("I will be eating at 8:00.", "I won't be eating at 8:00.", "Will you be eating at 8:00?"),
    "Present perfect": ("I have <b>eaten</b> sushi.", "I haven't <b>eaten</b> sushi.", "Have you ever <b>eaten</b> sushi?"),
}

# One common mistake per card, printed on both versions
WATCH = {
    "Present simple": "No am / is / are with V1: <s>I am work.</s> → I work.",
    "Past simple": "After did, use V1: <s>Did you went?</s> → Did you go?",
    "Future simple": "No -s after will: <s>She will works.</s> → She will work.",
    "Present continuous": "Don't forget am / is / are: <s>I working.</s> → I am working.",
    "Past continuous": "I / he / she / it + was · you / we / they + were",
    "Future continuous": "Don't forget be: <s>I will working.</s> → I will be working.",
    "Present perfect": "Use V3, not V2: <s>I have ate.</s> → I have eaten.",
}

CSS = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  :root {{
    --past: {AMBER_700}; --past-bg: {AMBER_100};
    --present: {EMERALD_700}; --present-bg: {EMERALD_100};
    --future: {BLUE_700}; --future-bg: {BLUE_100};
  }}

  body {{
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 14px;
    line-height: 1.3;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}

  /* One .sheet = one letter page holding two half-page cards (8.5in x 5.5in). */
  .sheet {{ width: 8.5in; height: 11in; overflow: hidden; page-break-after: always; break-after: page; }}
  .card {{ width: 8.5in; height: 5.5in; display: flex; flex-direction: column; position: relative; }}
  .card + .card {{ border-top: 1.5px dashed #000; }}
  .card + .card::before {{ content: "\\2702  cut"; position: absolute; top: -9px; left: 0.15in; background: #fff; font-size: 11px; padding: 0 4px; }}

  /* Zone color per card: past = amber, present = green, future = blue, perfect = amber to green */
  .z-past {{ --c: var(--past); --bg: var(--past-bg); --band: var(--past); }}
  .z-present {{ --c: var(--present); --bg: var(--present-bg); --band: var(--present); }}
  .z-future {{ --c: var(--future); --bg: var(--future-bg); --band: var(--future); }}
  .z-perfect {{ --c: var(--past); --bg: var(--past-bg); --band: linear-gradient(90deg, var(--past) 50%, var(--present) 50%); }}

  @media screen {{
    body {{ background: #e6e6e6; padding: 24px 0; }}
    .sheet {{ background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }}
  }}
  @media print {{
    @page {{ size: letter portrait; margin: 0; }}
  }}

  .gray {{ background: repeating-linear-gradient(45deg, #e4e4e4 0 6px, #c8c8c8 6px 7px); }}

  /* Type scale: 22 / 18 / 14 / 11 */
  .body {{ flex: 1; padding: 0.34in 0.55in 0.16in; display: flex; flex-direction: column; gap: 10px; }}
  .cover .body {{ gap: 7px; padding-top: 0.3in; }}

  .staple {{ position: absolute; top: 0.08in; font-size: 11px; display: flex; align-items: center; gap: 4px; }}
  .staple i {{ display: inline-block; width: 0.35in; height: 0; border-top: 3px solid #000; }}
  .staple.l {{ left: 0.55in; }}
  .staple.r {{ right: 0.55in; }}

  .head {{ display: flex; justify-content: space-between; align-items: baseline; gap: 12px; border-bottom: 4px solid var(--c, #000); padding-bottom: 3px; }}
  .head h1 {{ font-size: 22px; white-space: nowrap; color: var(--c, #000); }}
  .head .use {{ font-size: 14px; text-align: right; }}
  .head .use b {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }}

  .words {{ display: flex; gap: 8px; align-items: flex-end; font-size: 14px; }}
  .words b {{ white-space: nowrap; }}
  .words .fill {{ flex: 1; border-bottom: 1.5px solid #000; min-height: 20px; }}

  .timeline {{ display: flex; align-items: center; gap: 10px; border: 1.5px solid #000; border-radius: 6px; padding: 2px 8px; }}
  .timeline .label {{ font-size: 11px; font-weight: bold; width: 0.9in; flex: none; }}
  .timeline .label span {{ display: block; font-weight: normal; font-style: italic; }}
  .timeline svg {{ display: block; flex: 1; height: 1.05in; }}

  .forms {{ display: grid; grid-template-columns: 26px 1.2fr 1fr 1fr; grid-auto-rows: minmax(0.34in, auto); border: 1.5px solid #000; border-radius: 6px; overflow: hidden; }}
  .forms > div {{ padding: 2px 7px; display: flex; align-items: center; }}
  .forms .h {{ font-size: 11px; font-weight: bold; border-bottom: 1.5px solid #000; padding: 2px 7px; align-items: center; background: var(--bg, #fff); min-height: 0; }}
  .forms .h span {{ font-weight: normal; margin-left: 4px; }}
  .forms .sym {{ justify-content: center; align-items: center; font-size: 18px; font-weight: bold; color: var(--c, #000); background: var(--bg, #fff); }}
  .forms > div:not(:nth-child(4n+1)) {{ border-left: 1.5px solid #000; }}
  .forms .write {{ flex: 1; font-size: 14px; }}
  .forms .write b {{ text-decoration: underline; }}
  .forms .r2, .forms .r3 {{ border-top: 1.5px solid #000; }}

  .third {{ display: flex; gap: 8px; align-items: flex-end; font-size: 14px; }}
  .third b {{ white-space: nowrap; }}
  .third .fill {{ flex: 1; border-bottom: 1.5px solid #000; min-height: 20px; }}

  .watch {{ font-size: 14px; border: 1.5px dashed var(--c, #000); border-radius: 6px; padding: 3px 9px; background: var(--bg, #fff); }}
  .watch b {{ color: var(--c, #000); }}
  .watch s {{ text-decoration-thickness: 2px; }}

  /* Teacher key: the filled-in answers */
  .ans {{ font-style: italic; font-weight: bold; color: var(--c, #000); }}

  /* Bottom tab strip: keep the colored tab, cut off the gray */
  .tabs {{ height: 0.55in; display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1.5px dashed #000; }}
  .tabs > div {{ display: flex; align-items: center; justify-content: center; text-align: center; font-size: 14px; font-weight: bold; line-height: 1.1; }}
  .tabs .keep {{ background: var(--band); color: #fff; border: 2px dashed #000; border-top: none; }}
  .tabs.all {{ display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }}

  /* Cover */
  .cover h1 {{ font-size: 22px; }}
  .cover .name-row {{ display: flex; gap: 10px; align-items: flex-end; font-size: 18px; font-weight: bold; }}
  .cover .name-row .fill {{ flex: 1; border-bottom: 2px solid #000; height: 24px; }}
  .calm {{ border: 2px dashed #000; padding: 5px 10px; font-size: 14px; }}
  .calm b {{ font-size: 18px; }}
  .ideas {{ display: grid; grid-template-columns: repeat(4, 1fr); border: 1.5px solid #000; font-size: 14px; }}
  .ideas > div {{ padding: 4px 7px; }}
  .ideas > div + div {{ border-left: 1.5px solid #000; }}
  .ideas u {{ font-weight: bold; text-decoration: underline; text-decoration-thickness: 2px; }}
  .cover .box {{ border: 1.5px solid #000; padding: 4px 9px; font-size: 14px; }}
  .cover .box b.t {{ display: block; font-size: 14px; }}
  .cover .two {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }}

  .stamps {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }}
  .stamps > div {{ display: flex; align-items: center; gap: 6px; font-size: 14px; }}
  .stamps svg {{ width: 0.7in; height: 0.3in; flex: none; }}
  .colors {{ display: flex; gap: 12px; font-size: 14px; margin-top: 3px; }}
  .colors span {{ display: inline-flex; align-items: center; gap: 4px; }}
  .colors i {{ display: inline-block; width: 14px; height: 14px; border-radius: 3px; }}
"""


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
    marks = stamp(*t["stamp"]) if key else ""
    rows = []
    for n, (sym, cls) in enumerate((("+", "a"), ("−", "n"), ("?", "q"))):
        formula, regular = t["forms"][n]
        irregular = IRREGULAR[t["name"]][n]
        r = f"r{n+1}" if n else ""
        rows.append(
            f'<div class="sym {cls} {r}">{sym}</div>'
            f'<div class="{r}"><span class="write">{fill(formula, key)}</span></div>'
            f'<div class="{r}"><span class="write">{fill(regular, key)}</span></div>'
            f'<div class="{r}"><span class="write">{fill(irregular, key)}</span></div>'
        )
    third = ""
    if t.get("third"):
        third = f'<div class="third"><b>he / she / it:</b><span class="fill">{fill(t["third"], key)}</span></div>'
    return f"""
<section class="card z-{t["zone"]}">
  <span class="staple l"><i></i> staple</span><span class="staple r">staple <i></i></span>
  <div class="body">
    <div class="head"><h1>{i + 1}. {t["name"]}</h1><span class="use"><b>Use it for:</b> {t["use"]}</span></div>
    <div class="words"><b>Time words:</b><span class="fill">{fill(t["words"], key)}</span></div>
    <div class="timeline"><span class="label">Draw it:<span>Draw the stamp from Timeline Tenses.</span></span>
      {timeline(marks)}
    </div>
    <div class="forms">
      <div class="h"></div><div class="h">Formula</div><div class="h">Regular <span>work · worked · worked</span></div><div class="h">Irregular <span>eat · ate · eaten</span></div>
      {"".join(rows)}
    </div>
    {third}
    <div class="third"><b>My sentence:</b><span class="fill"></span></div>
    <div class="watch"><b>Watch out!</b> {WATCH[t["name"]]}</div>
  </div>
  {tabs(i)}
</section>"""


def mini(kind, zone, position, x0):
    """A cropped stamp for the cover legend."""
    return (f'<svg viewBox="{x0} 30 90 40" xmlns="http://www.w3.org/2000/svg">'
            f'<line x1="{x0}" y1="{AXIS_Y}" x2="{x0 + 90}" y2="{AXIS_Y}" stroke="{SLATE_300}" stroke-width="4"/>'
            f'{stamp(kind, zone, position)}</svg>')


COVER = f"""
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
    <div class="box">
      <b class="t">Timeline stamps</b>
      <div class="stamps">
        <div>{mini("single-dot", "past", 40, 34)} one time</div>
        <div>{mini("multiple-dots", "present", 50, 155)} again and again</div>
        <div>{mini("solid-line", "present", 50, 155)} in the middle</div>
        <div>{mini("arc", "past", 50, 88)} past up to now</div>
      </div>
      <div class="colors">
        <span><i style="background:{AMBER_600}"></i> past</span>
        <span><i style="background:{EMERALD_600}"></i> present</span>
        <span><i style="background:{BLUE_600}"></i> future</span>
      </div>
    </div>
    <div class="two">
      <div class="box"><b class="t">Verb key: V1 · V2 · V3</b>Regular: work · worked · worked<br>Irregular: eat · ate · eaten · V-ing = working</div>
      <div class="box"><b class="t">Stuck? Say this:</b>"Wait, let me think." · "How do I say...?"<br>"Sorry, I mean..." · "Can you say that again?"</div>
    </div>
    <div class="box">
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
