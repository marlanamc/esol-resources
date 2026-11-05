#!/usr/bin/env python3
"""Build the pocket verb flip book (student fill-in + teacher key).

Each landscape letter sheet holds two 5.5in-wide cards. The teacher cuts the sheets in
half on the dashed line (paper cutter) and gives each student a set of 8 cards. Students
cut off the striped part on the thick line, stack the cards (cover, then 1-7) and staple
twice in the gray strip at the top. Every card is 0.4in longer
than the one in front of it, so its colored bottom bar is its tab and all 7 tabs show
at once. Every cut is one straight line, so a class set can go through a paper cutter.

The timelines copy the Timeline Tenses game (TimelineCanvas.tsx and
TimelineElement.tsx): same 400 x 80 canvas, zones, colors and stamps, with each
tense's stamp taken from src/data/timeline-learn-tenses.ts. Students get the
empty canvas and a sentence to map, and write everything else; the key shows all answers.

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
        "use": "Predictions, promises, and decisions made now.",
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
        "use": "Before now, connected to now.",
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
    "Present simple": "For this action: <s>I am work.</s> → I work.",
    "Past simple": "After did, use V1: <s>Did you went?</s> → Did you go?",
    "Future simple": "No -s after will: <s>She will works.</s> → She will work.",
    "Present continuous": "Don't forget am / is / are: <s>I working.</s> → I am working.",
    "Past continuous": "I / he / she / it + was · you / we / they + were",
    "Future continuous": "Don't forget be: <s>I will working.</s> → I will be working.",
    "Present perfect": "Use V3, not V2: <s>I have ate.</s> → I have eaten.",
}

PROMPTS = [
    "I eat breakfast every day.", "I ate breakfast yesterday.",
    "I will eat breakfast tomorrow.", "I am eating breakfast now.",
    "I was eating at 8:00 last night.", "I will be eating at 8:00 tomorrow.",
    "I have eaten sushi before. The exact time is not given.",
]


def emphasize(text):
    import re
    text = re.sub(r"</?b>", "", text)
    pattern = r"\b(?:haven't|hasn't|wasn't|weren't|doesn't|don't|didn't|won't|have|has|was|were|does|do|did|will|am|is|are|be|not|working|worked|works|work|eating|eaten|ate|eat|V-ing|V1|V2|V3)\b"
    return re.sub(pattern, lambda m: "<b>" + m.group() + "</b>", text, flags=re.I)


# ---- Stepped layout (inches) ----
# Each landscape letter sheet holds two 5.5in-wide cards. Card k (0 = cover, 1-7 = tenses)
# is STEP shorter than the card behind it, so the bottom STEP of every tense card shows
# under the card in front of it. TALLEST stays clear of the printer's bottom margin.
STEP, TALLEST, BIND = 0.4, 8.3, 0.5
STAPLE_X, STAPLE_Y = (0.9, 4.6), 0.22   # centers of the 2 staple marks


def card_height(k):
    return round(TALLEST - (7 - k) * STEP, 2)


CSS = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  :root {{
    --past: {AMBER_700}; --past-bg: {AMBER_100};
    --present: {EMERALD_700}; --present-bg: {EMERALD_100};
    --future: {BLUE_700}; --future-bg: {BLUE_100};
  }}

  body {{
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000; background: #fff; font-size: 13px; line-height: 1.3;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}

  /* One .sheet = one landscape letter page holding two 5.5in-wide cards side by side */
  .sheet {{ width: 11in; height: 8.5in; overflow: hidden; display: flex; position: relative; page-break-after: always; break-after: page; }}
  .half {{ width: 5.5in; height: 8.5in; display: flex; flex-direction: column; position: relative; }}
  .half + .half {{ border-left: 1.5px dashed #000; }}
  .half + .half::before {{ content: "\\2702  cut"; position: absolute; top: 3.6in; left: -9px; writing-mode: vertical-rl; background: #fff; font-size: 11px; padding: 4px 0; z-index: 2; }}
  .card {{ width: 5.5in; display: flex; flex-direction: column; flex: none; position: relative; overflow: hidden; }}

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
    @page {{ size: letter landscape; margin: 0; }}
  }}

  /* Staple strip at the top: the cards bend here, so nothing to read or write */
  .bind {{ height: {BIND}in; flex: none; position: relative; border-bottom: 1px dashed #999; background: #f2f2f2; }}
  .bind .staple {{ position: absolute; top: {STAPLE_Y}in; width: 0.45in; height: 0; margin-left: -0.225in; border-top: 4px solid #000; }}
  .bind .note {{ position: absolute; left: 0; right: 0; top: {STAPLE_Y - 0.06}in; text-align: center; font-size: 10px; color: #555; }}

  .body {{ flex: 1; min-height: 0; padding: 0.1in 0.3in 0.08in; display: flex; flex-direction: column; gap: 4px; }}

  /* Bottom tab: the part that shows when the book is closed */
  .tab {{ height: {STEP}in; flex: none; background: var(--band); color: #fff; display: flex; align-items: center; gap: 8px; padding: 0 0.3in; font-size: 16px; font-weight: bold; }}
  .tab i {{ font-style: normal; display: inline-grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #fff; color: var(--c); font-size: 13px; }}

  /* Striped part below the card: cut it off along the thick line */
  .waste {{ flex: 1; position: relative; overflow: hidden; border-top: 3px solid #000; display: grid; place-items: center; }}
  .waste > svg {{ position: absolute; inset: 0; width: 100%; height: 100%; }}
  .waste span {{ position: relative; z-index: 1; background: #fff; border: 1.5px solid #111; padding: 2px 12px; font-size: 13px; font-weight: bold; }}
  .waste .sheet-no {{ position: absolute; left: 0.3in; bottom: 0.12in; font-size: 11px; padding: 1px 8px; }}
  .waste.thin span {{ font-size: 10px; padding: 0 8px; }}

  .head {{ border-bottom: 4px solid var(--c); padding-bottom: 2px; }}
  .head h1 {{ font-size: 21px; color: var(--c); line-height: 1.1; }}

  .meaning {{ border: 2px solid var(--c); border-radius: 7px; background: var(--bg); padding: 3px 9px 5px; }}
  .meaning b {{ font-size: 12px; color: var(--c); }}
  .meaning .ln {{ display: block; height: 19px; border-bottom: 1.5px solid #000; }}
  .meaning .ans {{ display: block; font-size: 14px; padding-top: 3px; }}

  .line {{ display: flex; gap: 6px; align-items: flex-end; font-size: 12px; }}
  .line b {{ white-space: nowrap; }}
  .line .fill {{ flex: 1; border-bottom: 1.5px solid #000; min-height: 19px; }}
  .draw-prompt {{ font-size: 12px; }}
  .perfect-note {{ font-size: 11px; }}

  .timeline {{ border: 1.5px solid #000; border-radius: 6px; padding: 1px 6px 0; position: relative; }}
  .timeline .label {{ position: absolute; top: 3px; left: 7px; font-size: 10px; font-weight: bold; line-height: 1.15; }}
  .timeline .label span {{ display: block; font-weight: normal; font-style: italic; }}
  .timeline svg {{ display: block; width: 100%; height: 0.72in; }}

  .forms {{ display: grid; grid-template-columns: 0.72in 1fr 1fr 1fr; grid-template-rows: auto; grid-auto-rows: minmax(0.39in, auto); border: 1.5px solid #000; border-radius: 6px; overflow: hidden; }}
  .forms > div {{ padding: 2px 5px; display: flex; align-items: center; }}
  .forms > div:not(:nth-child(4n+1)) {{ border-left: 1.5px solid #000; }}
  .forms .h {{ font-size: 11px; font-weight: bold; border-bottom: 1.5px solid #000; background: var(--bg); padding: 2px 5px; }}
  .forms .h .s {{ font-size: 15px; color: var(--c); margin-right: 4px; }}
  .forms .rl {{ flex-direction: column; align-items: flex-start; justify-content: center; font-size: 11px; font-weight: bold; line-height: 1.15; background: var(--bg); }}
  .forms .rl span {{ font-weight: normal; font-size: 9px; }}
  .forms .rl .vline {{ display: block; width: 100%; height: 12px; border-bottom: 1px solid #000; }}
  .forms .r2, .forms .r3 {{ border-top: 1.5px solid #000; }}
  .forms .write {{ flex: 1; font-size: 11px; line-height: 1.2; }}
  .forms .write b {{ font-weight: 700; }}

  .watch {{ font-size: 12px; border: 1.5px dashed var(--c); border-radius: 6px; padding: 3px 8px; background: var(--bg); }}
  .watch b {{ color: var(--c); }}
  .watch s {{ text-decoration-thickness: 2px; }}

  /* Longer cards: the rest of the space is lines for more examples */
  .more {{ flex: 1; min-height: 0; display: flex; flex-direction: column; font-size: 12px; overflow: hidden; }}
  .more .lines {{ flex: 1; background: repeating-linear-gradient(#fff 0 24px, #555 24px 25px); }}

  /* Teacher key: the filled-in answers */
  .ans {{ font-style: normal; font-weight: normal; color: #000; }}
  .ans b {{ color: var(--c, #000); }}

  /* Cover */
  .cover .body {{ gap: 7px; }}
  .eyebrow {{ font-size: 9px; letter-spacing: 2px; color: #555; }}
  .cover h1 {{ font-size: 24px; line-height: 1.05; }}
  .subtitle {{ font-size: 12px; color: #333; }}
  .stamp-guide {{ display: grid; grid-template-columns: repeat(4, 1fr); border-top: 2px solid #111; border-bottom: 1px solid #aaa; padding: 3px 0 4px; }}
  .stamp-guide > div {{ display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 10px; line-height: 1.15; }}
  .stamp-guide svg {{ width: 0.95in; height: 0.33in; }}
  .stamp-guide span {{ font-size: 9px; color: #444; }}
  .chooser > b, .verb-guide > b {{ font-size: 12px; }}
  .choose-grid {{ border-top: 1.5px solid #111; margin-top: 2px; }}
  .choose-grid > div {{ display: flex; justify-content: space-between; align-items: center; gap: 8px; border-bottom: 1px solid #bbb; padding: 2px 0; font-size: 11px; line-height: 1.2; }}
  .choose-grid strong {{ white-space: nowrap; display: inline-flex; align-items: center; gap: 5px; }}
  .choose-grid i {{ font-style: normal; display: inline-grid; place-items: center; width: 15px; height: 15px; border-radius: 50%; color: #fff; font-size: 10px; background: var(--dot); position: relative; z-index: 0; overflow: hidden; }}
  .choose-grid .present {{ --dot: {EMERALD_700}; }}
  .choose-grid .past, .choose-grid .perfect {{ --dot: {AMBER_700}; }}
  .choose-grid .future {{ --dot: {BLUE_700}; }}
  .choose-grid .perfect i::before {{ content: ""; position: absolute; top: 0; right: 0; bottom: 0; width: 50%; background: {EMERALD_700}; z-index: -1; }}
  .verb-guide > div {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 2px; }}
  .verb-guide span {{ font-size: 10px; line-height: 1.2; }}
  .verb-guide span b {{ display: block; font-size: 9px; }}
  .cover-bottom {{ display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; margin-top: auto; gap: 10px; }}
  .cover-bottom .fill {{ flex: 1; border-bottom: 1.5px solid #000; height: 18px; }}
  .assembly {{ font-size: 9.5px; color: #333; line-height: 1.25; border-top: 1px solid #bbb; padding-top: 3px; }}
"""


# Diagonal cut-off stripes, drawn as plain SVG lines: some PDF viewers can't show CSS gradient patterns.
STRIPES = ('<svg viewBox="0 0 1000 300" preserveAspectRatio="xMinYMin slice" aria-hidden="true">'
           + "".join(f'<line x1="{x}" y1="300" x2="{x + 300}" y2="0" stroke="#111" stroke-width="1.5"/>' for x in range(-300, 1000, 16))
           + "</svg>")

BIND_STRIP = ('<div class="bind">' + "".join(f'<span class="staple" style="left:{x}in"></span>' for x in STAPLE_X)
              + '<span class="note">staple here · don\'t write here</span></div>')


def tab(i, t):
    return f'<div class="tab"><i>{i + 1}</i>{t["name"]}</div>'


def fill(text, key):
    return f'<span class="ans">{text}</span>' if key else ""


def tense_card(i, t, key):
    marks = stamp(*t["stamp"]) if key else ""
    if key and i in (4, 5):
        x = element_x(t["stamp"][1], t["stamp"][2])
        marks += f'<line x1="{x}" y1="32" x2="{x}" y2="60" stroke="#111" stroke-width="1.5"/><text x="{x}" y="26" text-anchor="middle" font-size="11">8:00</text>'
    note = ('<div class="perfect-note"><b>Experience:</b> I have eaten sushi. <b>Still true:</b> I have worked here for three years.</div>' if i == 6 else '')
    # Same direction as the verb charts: + / − / ? go across, one column each
    columns = [(f, reg, irr) for (f, reg), irr in zip(t["forms"], IRREGULAR[t["name"]])]
    # Students pick their own verbs; the key shows work / eat as one example
    if key:
        labels = ("Formula", "Regular <span>e.g. work</span>", "Irregular <span>e.g. eat</span>")
    else:
        labels = ("Formula", 'Regular <i class="vline"></i>', 'Irregular <i class="vline"></i>')
    rows = []
    for n, label in enumerate(labels):
        r = f"r{n+1}" if n else ""
        rows.append(f'<div class="rl {r}">{label}</div>' + "".join(
            f'<div class="{r}"><span class="write">{fill(emphasize(col[n]), key)}</span></div>' for col in columns))
    third = ""
    if t.get("third"):
        third = f'<div class="line"><b>he / she / it:</b><span class="fill">{fill(emphasize(t["third"]), key)}</span></div>'
    meaning = fill(t["use"], key) if key else '<span class="ln"></span><span class="ln"></span>'
    return f"""
<section class="card z-{t["zone"]}" style="height:{card_height(i + 1)}in">
  {BIND_STRIP}
  <div class="body">
    <div class="head"><h1>{i + 1}. {t["name"]}</h1></div>
    <div class="meaning"><b>Meaning: what is it for?</b>{meaning}</div>
    <div class="line"><b>Helpful time clues:</b><span class="fill">{fill(t["words"], key)}</span></div>
    <div class="draw-prompt"><b>Draw when:</b> {PROMPTS[i]}</div>
    <div class="timeline"><span class="label">Timeline<span>Draw the stamp.</span></span>
      {timeline(marks)}
    </div>
{note}
    <div class="forms">
      <div class="h"></div><div class="h"><b class="s">+</b>Affirm.</div><div class="h"><b class="s">−</b>Negative</div><div class="h"><b class="s">?</b>Question</div>
      {"".join(rows)}
    </div>
    {third}
    <div class="line"><b>My sentence:</b><span class="fill"></span></div>
    <div class="watch"><b>Watch out!</b> {WATCH[t["name"]]}</div>
    <div class="more"><b>More examples:</b><div class="lines"></div></div>
  </div>
  {tab(i, t)}
</section>"""


def mini(kind, zone, position, x0):
    """A cropped stamp for the cover legend."""
    return (f'<svg viewBox="{x0} 18 {130 if kind == "arc" else 90} 48" xmlns="http://www.w3.org/2000/svg">'
            f'<line x1="{x0}" y1="{AXIS_Y}" x2="{x0 + (130 if kind == "arc" else 90)}" y2="{AXIS_Y}" stroke="{SLATE_300}" stroke-width="4"/>'
            f'{stamp(kind, zone, position)}</svg>')


COVER = f"""
<section class="card cover" style="height:{card_height(0)}in">
  {BIND_STRIP}
  <div class="body">
    <div class="cover-heading"><div class="eyebrow">MY ENGLISH TOOLKIT</div><h1>See the time.<br>Build the sentence.</h1><div class="subtitle">A flip book for 7 verb tenses</div></div>
    <div class="stamp-guide">
      <div>{mini("single-dot", "past", 40, 34)}<b>An event</b><span>at a point in time</span></div>
      <div>{mini("multiple-dots", "present", 50, 155)}<b>A routine</b><span>again and again</span></div>
      <div>{mini("solid-line", "present", 50, 155)}<b>In progress</b><span>in the middle of it</span></div>
      <div>{mini("arc", "past", 50, 88)}<b>Connected to now</b><span>before now + now</span></div>
    </div>
    <div class="chooser"><b>What do you want to say?</b><div class="choose-grid">
      <div class="present"><span>Usually / a fact</span><strong><i>1</i>Present simple</strong></div>
      <div class="past"><span>Finished in the past</span><strong><i>2</i>Past simple</strong></div>
      <div class="future"><span>A prediction or promise</span><strong><i>3</i>Future simple</strong></div>
      <div class="present"><span>Happening now</span><strong><i>4</i>Present continuous</strong></div>
      <div class="past"><span>In progress in the past</span><strong><i>5</i>Past continuous</strong></div>
      <div class="future"><span>In progress in the future</span><strong><i>6</i>Future continuous</strong></div>
      <div class="perfect"><span>Before now, connected to now</span><strong><i>7</i>Present perfect</strong></div>
    </div></div>
    <div class="verb-guide"><b>Know your verb forms</b><div><span><b>V1 · base</b>work / eat</span><span><b>V1-s · he/she/it</b>works / eats</span><span><b>V-ing</b>working / eating</span><span><b>V2 · past</b>worked / ate</span><span><b>V3 · past part.</b>worked / eaten</span></div></div>
    <div class="cover-bottom"><b>Name:</b><span class="fill"></span></div>
    <div class="assembly"><b>Make it:</b> 1. Cut off the striped part on every card. Cut on the thick line. 2. Stack: cover on top, then 1 to 7. Line up the tops. 3. Staple twice at the top.</div>
  </div>
</section>"""


def half(card, k):
    """One 5.5in x 8.5in half of a sheet: the card on top, the striped cut-off part below.
    The left half also names the sheet, so the 4 piles are easy to tell apart."""
    waste_h = 8.5 - card_height(k)
    thin = " thin" if waste_h < 0.5 else ""
    sheet = f'<span class="sheet-no">Sheet {k // 2 + 1} of 4</span>' if k % 2 == 0 else ""
    return f'<div class="half">{card}<div class="waste{thin}">{STRIPES}<span>✂ cut off</span>{sheet}</div></div>'


def build(key):
    cards = [COVER] + [tense_card(i, t, key) for i, t in enumerate(TENSES)]
    sheets = "".join(f'<div class="sheet">{half(cards[k], k)}{half(cards[k + 1], k + 1)}</div>'
                     for k in range(0, len(cards), 2))
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
