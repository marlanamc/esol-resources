#!/usr/bin/env python3
"""Week 10 (Thursday Nov 19): Just, Already, Yet: the day before Thanksgiving with Mandy and Kevin.

One data set drives everything, so the slides always match the worksheet and key:
  just-already-yet-worksheet.html/.pdf   schedule card (p1) + worksheet (p2-5)
  just-already-yet-key.html/.pdf         same pages, answers filled in
  just-already-yet-slides.html/.pdf      click-through follow-along slides

Print: page 1 single-sided (the schedule card stays on the desk),
pages 2-5 double-sided (2 sheets).

    python3 build-just-already-yet.py
Needs Google Chrome (for the PDFs) and pdfinfo.
"""
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">')

# ---------------------------------------------------------------- data
# (clock label, minutes after midnight, V1 phrase, V3 phrase)
PEOPLE = {
    "Mandy": {"he": "she", "job": "Family dinner at her house tomorrow!", "events": [
        ("6:30 AM", 390, "wake up", "woken up"),
        ("7:00 AM", 420, "make breakfast", "made breakfast"),
        ("7:45 AM", 465, "take the kids to school", "taken the kids to school"),
        ("9:00 AM", 540, "start work", "started work"),
        ("12:00 PM", 720, "eat lunch", "eaten lunch"),
        ("1:30 PM", 810, "call her sister about tomorrow", "called her sister"),
        ("3:00 PM", 900, "finish work", "finished work"),
        ("4:00 PM", 960, "buy the turkey", "bought the turkey"),
        ("5:30 PM", 1050, "clean the house", "cleaned the house"),
        ("7:00 PM", 1140, "make the pie", "made the pie"),
        ("8:00 PM", 1200, "set the table", "set the table"),
        ("10:30 PM", 1350, "go to bed", "gone to bed"),
    ]},
    "Kevin": {"he": "he", "job": "Turkey day at the food pantry. Visits his mom tomorrow.", "events": [
        ("8:00 AM", 480, "wake up", "woken up"),
        ("8:30 AM", 510, "go for a walk", "gone for a walk"),
        ("9:30 AM", 570, "eat breakfast", "eaten breakfast"),
        ("11:00 AM", 660, "buy a bus ticket to his mom's", "bought a bus ticket"),
        ("12:30 PM", 750, "take the bus to work", "taken the bus to work"),
        ("1:00 PM", 780, "start work", "started work"),
        ("5:00 PM", 1020, "hand out turkeys at the pantry", "handed out the turkeys"),
        ("9:00 PM", 1260, "finish work", "finished work"),
        ("10:00 PM", 1320, "get home", "gotten home"),
        ("10:30 PM", 1350, "pack his bag", "packed his bag"),
        ("11:30 PM", 1410, "go to bed", "gone to bed"),
    ]},
}
JUST_WINDOW = 15  # minutes: "a few minutes ago"

IRREGULAR = [("wake up", "woken up"), ("make", "made"), ("take", "taken"), ("eat", "eaten"),
             ("go", "gone"), ("get", "gotten"), ("buy", "bought"), ("set", "set")]
REGULAR = ["called", "started", "finished", "cleaned", "handed out", "packed"]


def status(minute, now):
    if minute > now:
        return "yet"
    return "just" if now - minute <= JUST_WINDOW else "already"


# Part A: four times. Each line is (template, answer-parts). [[x]] = a blank whose answer is x.
PART_A = [
    {"clock": "7:05 AM", "now": 425, "win": (360, 480), "title": "Let's do it together.",
     "how": "Fill in: <b>already</b> · <b>just</b> · <b>yet</b> · <b>hasn't</b>",
     "lines": ["Mandy has [[already]] woken up.",
               "Mandy has [[just]] made breakfast.",
               "Mandy hasn't taken the kids to school [[yet]].",
               "Kevin [[hasn't]] woken up [[yet]]."]},
    {"clock": "1:05 PM", "now": 785, "win": (720, 840), "title": "Finish the sentence.",
     "how": "Write the <b>V3</b> + the rest. Look at the schedule card.",
     "lines": ["Kevin has just [[started work]].",
               "Kevin has already [[taken the bus to work]].",
               "Mandy has already [[eaten lunch]].",
               "Mandy hasn't [[called her sister]] yet."],
     "also": "Line 2: also OK: bought a bus ticket, eaten breakfast, gone for a walk. Line 3: also OK: started work, made breakfast …"},
    {"clock": "4:05 PM", "now": 965, "win": (900, 1080), "title": "Write the whole sentence.",
     "how": "Use the word in the box.",
     "free": [("Mandy", "JUST", "Mandy has just bought the turkey."),
              ("Mandy", "YET", "Mandy hasn't cleaned the house yet."),
              ("Mandy", "ALREADY", "Mandy has already finished work."),
              ("Kevin", "YET", "Kevin hasn't handed out the turkeys yet.")]},
    {"clock": "10:05 PM", "now": 1325, "win": (1200, 1380), "title": "Your choice.",
     "how": "Write 3 sentences: one with <b>already</b>, one with <b>just</b>, one with <b>yet</b>.",
     "open": ["Kevin has just gotten home.",
              "Mandy has already set the table.",
              "Kevin hasn't packed his bag yet."]},
]

# Part B: 9:05 PM questions. (question, yes?, full answer)
PART_B_TIME = ("9:05 PM", 1265)
PART_B_WIN = (1200, 1380)
PART_B = [
    ("Has Mandy set the table yet?", True, "She has already set the table."),
    ("Has Kevin finished work yet?", True, "He has just finished work."),
    ("Has Kevin gotten home yet?", False, "He hasn't gotten home yet."),
    ("Has Mandy gone to bed yet?", False, "She hasn't gone to bed yet."),
]
PART_B_OWN = ("Has Kevin packed his bag yet?", "No, not yet. He hasn't packed his bag yet.")

# Part C: one mistake each. (wrong, right, what to look for)
PART_C = [
    ("Kevin has eaten <u>already</u> breakfast.", "Kevin has <b>already eaten</b> breakfast.", "ALREADY goes after has, before V3."),
    ("Mandy <u>just has</u> bought the turkey.", "Mandy <b>has just</b> bought the turkey.", "has comes first, then JUST."),
    ("Mandy <u>has</u> cleaned the house <u>yet</u>.", "Mandy has <b>already</b> cleaned the house.", "No YET in a + sentence. (Or the question: Has Mandy cleaned the house yet?)"),
    ("Kevin hasn't <u>went</u> to bed yet.", "Kevin hasn't <b>gone</b> to bed yet.", "went is V2. We need V3: gone."),
    ("Have you <u>finish</u> your holiday shopping yet?", "Have you <b>finished</b> your holiday shopping yet?", "have + V3: finished."),
]

# Part D: interview
PART_D = ["made plans for the holiday weekend", "bought food for the holiday", "talked to your family this week",
          "had coffee or tea today", "finished this week's Course Map"]
PART_D_MODELS = [  # three different people, three different answers
    ("My partner has already made plans for Thursday.", "She hasn't bought the food yet.", "I have just finished Part C."),
    ("Ana has already called her mom this week.", "She hasn't finished the Course Map yet.", "I have just written my first sentence."),
    ("My partner has already had two coffees today.", "He hasn't made plans for the weekend yet.", "I have just sat down with my partner."),
]

# Part E: my day. Model answers for the key (many answers are OK).
PART_E_MODELS = ["I have already eaten breakfast.", "I have just finished Part D.", "I haven't cooked dinner yet."]

RULES = [  # (word, chips, meaning, example)
    ("ALREADY", ["Mandy", "has", "*already", "V3"], "Done. It happened <b>before now</b>.", "Mandy has <b>already</b> eaten lunch."),
    ("JUST", ["Kevin", "has", "*just", "V3"], "Done <b>a few minutes ago</b>. Very close to now.", "Kevin has <b>just</b> started work."),
    ("YET", ["Mandy", "hasn't", "V3", "…", "*yet"], "<b>Not done</b>, but we expect it later.", "Mandy hasn't made the pie <b>yet</b>."),
]
YET_Q = ["Has", "Mandy", "V3", "…", "*yet?"]


# ---------------------------------------------------------------- shared helpers
def chips(parts, cls="chip"):
    out = []
    for p in parts:
        if p.startswith("*"):
            out.append(f'<span class="{cls} hot">{p[1:].upper() if p[1:].rstrip("?") else p[1:]}</span>')
        else:
            out.append(f'<span class="{cls}{" v3" if p == "V3" else ""}">{p}</span>')
    return f'<span class="formula">{"".join(out)}</span>'


def blanks(text, key, width=None):
    """[[x]] -> a write-in blank (worksheet) or the answer (key)."""
    def rep(m):
        a = m.group(1)
        w = width or max(0.75, len(a) * 0.11 + 0.3)
        if key:
            return f'<span class="ans" style="min-width:{w:.2f}in">{a}</span>'
        return f'<span class="blank" style="width:{w:.2f}in"></span>'
    return re.sub(r"\[\[(.+?)\]\]", rep, text)


def sentence(name, ev, now):
    st = status(ev[1], now)
    if st == "yet":
        return st, f"{name} hasn't {ev[3]} <b>yet</b>."
    return st, f"{name} has <b>{st}</b> {ev[3]}."


# ---------------------------------------------------------------- worksheet time lines
TL_W, TL_X0, TL_X1 = 700, 92, 682  # SVG width in CSS px; the axis runs X0..X1


def clock_label(m):
    h = (m // 60) % 24
    return f"{h % 12 or 12}{':%02d' % (m % 60) if m % 60 else ''} {'AM' if h < 12 else 'PM'}"


# Printed pages are black on white; slides follow the deck's theme (light/dark) and color the words.
PRINT_INK = {"ink": "#000", "paper": "#fff", "grid": "#999", "now": "#000"}
SLIDE_INK = {"ink": "currentColor", "paper": "var(--bg)", "grid": "var(--muted)", "now": "var(--bad)"}
HALO = 'stroke="{paper}" stroke-width="4" stroke-linejoin="round" paint-order="stroke"'


def tl_frame(start, end, height, track_ys, names, ink, label_every=60, minor=30):
    """Hour labels, light hour grid, half-hour ticks and one arrow line per track."""
    x = lambda m: TL_X0 + (m - start) * (TL_X1 - 20 - TL_X0) / (end - start)
    out = []
    for m in range(start, end + 1, minor):
        tick = 7 if m % 60 == 0 else 4
        if m % 60 == 0:
            if (m - start) % label_every == 0:
                label = "midnight" if m == 1440 else clock_label(m)
                lx = min(x(m), TL_W - len(label) * 3.6 - 2)
                out.append(f'<text x="{lx:.1f}" y="31" text-anchor="middle" font-size="12" font-weight="700">{label}</text>')
            out.append(f'<line x1="{x(m):.1f}" y1="36" x2="{x(m):.1f}" y2="{height - 4}" stroke="{ink["grid"]}" stroke-width="1" stroke-dasharray="2 3"/>')
        for y in track_ys:
            out.append(f'<line x1="{x(m):.1f}" y1="{y - tick}" x2="{x(m):.1f}" y2="{y + tick}" stroke="{ink["ink"]}" stroke-width="1.5"/>')
    for y, name in zip(track_ys, names):
        out.append(f'<text x="0" y="{y + 5}" font-size="15" font-weight="700">{name}</text>')
        out.append(f'<line x1="{TL_X0 - 8}" y1="{y}" x2="{TL_X1 + 6}" y2="{y}" stroke="{ink["ink"]}" stroke-width="2.5"/>'
                   f'<polygon points="{TL_X1 + 6},{y - 6} {TL_X1 + 16},{y} {TL_X1 + 6},{y + 6}"/>')
    return x, out


def tl_now(x, now, height, ink, label="NOW"):
    """The NOW line, as the key shows it."""
    w = 14 + len(label) * 9
    return (f'<line x1="{x(now):.1f}" y1="38" x2="{x(now):.1f}" y2="{height - 2}" stroke="{ink["now"]}" stroke-width="4"/>'
            f'<rect x="{x(now) - w / 2:.1f}" y="0" width="{w}" height="19" rx="3" fill="{ink["now"]}"/>'
            f'<text x="{x(now):.1f}" y="14.5" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">{label}</text>')


def tl_svg(height, label, out, ink):
    return (f'<svg class="tl" viewBox="0 0 {TL_W} {height}" role="img" aria-label="{label}" fill="{ink["ink"]}" '
            f'font-family="Atkinson Hyperlegible, Arial, sans-serif">{"".join(out)}</svg>')


def day_timeline(start, end, now=None, key=False, slide=False, clock=""):
    """Mandy and Kevin's events between start and end (minutes).
    Worksheet: students draw the NOW line; the key shows it.
    Slide: the NOW line appears on the first Next, and the dots turn already / just / yet colors."""
    ink = SLIDE_INK if slide else PRINT_INK
    halo = HALO.format(**ink)
    track_ys, height = (72, 134), 162
    x, out = tl_frame(start, end, height, track_ys, list(PEOPLE), ink)
    reveal = []
    if now is not None and (key or slide):
        reveal.append(tl_now(x, now, height, ink, f"NOW · {clock}" if slide else "NOW"))
    labels = []
    for y, (name, p) in zip(track_ys, PEOPLE.items()):
        evs = [e for e in p["events"] if start <= e[1] <= end]
        for i, (_, m, v1, _) in enumerate(evs):
            w = len(v1) * 7.7
            tx = min(max(x(m), w / 2 + 2), TL_W - w / 2 - 2)
            ty = y - 13 if i % 2 == 0 else y + 23
            out.append(f'<circle cx="{x(m):.1f}" cy="{y}" r="6"/>')
            labels.append(f'<text x="{tx:.1f}" y="{ty}" text-anchor="middle" font-size="15" {halo}>{v1}</text>')
            if slide and now is not None:
                st = status(m, now)
                dot = (f'<circle cx="{x(m):.1f}" cy="{y}" r="8" fill="var(--bg)" stroke="var(--yet)" stroke-width="3" stroke-dasharray="4 3"/>'
                       if st == "yet" else f'<circle cx="{x(m):.1f}" cy="{y}" r="8" fill="var(--{st})"/>')
                reveal.append(dot)
    if slide:
        out.append(f'<g class="step" data-group="now">{"".join(reveal)}</g>')
    else:
        out += reveal
    out += labels
    return tl_svg(height, f"Time line for Mandy and Kevin, {clock_label(start)} to {clock_label(end)}", out, ink)


MY_DAY_MODEL = [(420, "eat breakfast"), (600, "come to class"), (690, "Part D"), (1080, "cook dinner")]
MY_DAY_NOW = 705


def blank_timeline(key=False, slide=False):
    """Part E: an empty 6 AM to midnight line for the student's own day. Key and slide: one sample day."""
    ink = SLIDE_INK if slide else PRINT_INK
    halo = HALO.format(**ink)
    height, y = 190, 112
    x, out = tl_frame(360, 1440, height, [y], ["Me"], ink, label_every=120, minor=60)
    if key or slide:
        g = ' class="step"' if slide else ""
        for i, (m, v1) in enumerate(MY_DAY_MODEL):
            out.append(f'<g{g}><circle cx="{x(m):.1f}" cy="{y}" r="6"/><text x="{x(m):.1f}" y="{y - 14 if i % 2 == 0 else y + 26}" '
                       f'text-anchor="middle" font-size="13" font-style="italic" {halo}>{v1}</text></g>')
        out.append(f'<g{g}>{tl_now(x, MY_DAY_NOW, height, ink)}</g>')
    return tl_svg(height, "An empty time line for my day", out, ink)


# ---------------------------------------------------------------- worksheet
WS_CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #000; background: #fff; font-size: 14px; line-height: 1.35; }
.page { width: 8.5in; height: 11in; padding: 0.4in 0.45in; display: flex; flex-direction: column; overflow: hidden; break-after: page; }
@media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,.25); } }
@media print { @page { size: letter portrait; margin: 0; } }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1 { font-size: 22px; }
h2 { font-size: 18px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.small { font-size: 11px; }
.name-row { display: flex; gap: 18px; align-items: flex-end; font-size: 18px; font-weight: bold; margin-bottom: 8px; }
.name-row .fill { flex: 1; border-bottom: 2px solid #000; height: 26px; }
.name-row .fill.date { flex: none; width: 1.3in; }
.title-row { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 9px; }
.title-row .sub { font-size: 14px; font-style: italic; }
.key-flag { background: #000; color: #fff; padding: 1px 8px; font-size: 14px; font-weight: bold; }
.box { border: 2px solid #000; padding: 6px 11px 8px; margin-bottom: 8px; }
.formula { display: inline-flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.chip { border: 1.5px solid #000; padding: 1px 7px; font-size: 14px; white-space: nowrap; }
.chip.hot { background: #000; color: #fff; font-weight: bold; }
.chip.v3 { border-style: dashed; font-weight: bold; }
.rules { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-bottom: 8px; }
.rule { border: 1.5px solid #000; padding: 5px 8px; display: flex; flex-direction: column; gap: 4px; }
.rule-name { font-size: 18px; font-weight: bold; }
.rule .ex { font-style: italic; }
.rule .q { border-top: 1.5px dashed #000; padding-top: 4px; }
.how { display: flex; gap: 10px; align-items: stretch; margin-bottom: 8px; }
.how ol { list-style: none; display: grid; grid-template-rows: repeat(3, 1fr); gap: 5px; flex: none; width: 2.35in; }
.how li { border: 1.5px solid #000; padding: 2px 8px; display: flex; gap: 7px; align-items: center; }
.bigtl { flex: 1; border: 1.5px solid #000; padding: 4px 10px; display: flex; align-items: center; }
.bigtl svg { width: 100%; height: auto; display: block; }
svg.tl { width: 100%; height: auto; display: block; margin: 2px 0 4px; }
.tl-hint { font-size: 13px; font-style: italic; }
.how li b.n { flex: none; width: 22px; height: 22px; border-radius: 50%; background: #000; color: #fff; display: grid; place-items: center; }
.scheds { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; align-items: stretch; }
.sched > table { flex: 1; }
.sched { border: 2px solid #000; display: flex; flex-direction: column; }
.sched h3 { font-size: 18px; padding: 3px 9px; border-bottom: 2px solid #000; }
.sched h3 span { display: block; font-size: 14px; font-weight: normal; font-style: italic; }
.sched table { width: 100%; border-collapse: collapse; flex: 1; height: 100%; }
.sched td { border-bottom: 1px solid #000; padding: 0 9px; font-size: 16px; height: auto; }
.sched tr:last-child td { border-bottom: none; }
.sched td.t { width: 1in; font-weight: bold; white-space: nowrap; border-right: 1.5px solid #000; }
.v3box { border: 2px solid #000; padding: 5px 10px; margin-top: 8px; display: flex; gap: 14px; align-items: center; }
.v3box .lbl { font-weight: bold; font-size: 14px; white-space: nowrap; }
.v3grid { display: grid; grid-template-columns: repeat(4, max-content); gap: 1px 16px; font-size: 14px; white-space: nowrap; }
.v3grid b { font-weight: bold; }
.reg { font-size: 14px; border-left: 1.5px solid #000; padding-left: 12px; }
.part { border: 2px solid #000; padding: 5px 11px 6px; margin-bottom: 7px; }
.clock { display: inline-block; border: 2px solid #000; border-radius: 6px; padding: 0 7px; font-size: 18px; font-weight: bold; }
.hint { font-size: 14px; margin-bottom: 2px; }
.lines { list-style: none; counter-reset: l; }
.lines li { counter-increment: l; display: flex; align-items: flex-end; gap: 6px; min-height: 34px; font-size: 16px; padding-bottom: 3px; flex-wrap: wrap; }
.lines li::before { content: counter(l) "."; font-weight: bold; width: 18px; flex: none; }
.blank { display: inline-block; border-bottom: 1.5px solid #000; height: 24px; }
.ans { display: inline-block; border-bottom: 1.5px solid #000; font-weight: bold; font-style: italic; text-align: center; padding: 0 4px; }
.fill { flex: 1; border-bottom: 1.5px solid #000; min-height: 26px; font-style: italic; font-weight: bold; padding: 0 4px; }
.word { flex: none; width: 1.5in; display: flex; gap: 4px; align-items: center; font-weight: bold; }
.also { font-size: 11px; font-style: italic; margin-top: 2px; }
.qa li { flex-direction: column; align-items: stretch; gap: 3px; }
.qa li { position: relative; padding-left: 24px; }
.qa li::before { position: absolute; left: 0; top: 2px; }
.qa .qrow { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
.qa .q { font-weight: bold; min-width: 3.1in; }
.choice { border: 1.5px solid #000; border-radius: 14px; padding: 0 9px; font-size: 14px; }
.choice.on { outline: 2.5px solid #000; outline-offset: 2px; font-weight: bold; }
.qa .fill { min-height: 22px; }
.qa li { min-height: 0; }
.wrong { flex: 0 0 3.35in; font-size: 15px; }
.wrong u { text-decoration-thickness: 2px; }
.why2 { font-size: 10px; font-weight: normal; }
.why { font-size: 11px; font-style: italic; flex-basis: 100%; margin-left: 24px; margin-top: -2px; }
table.interview { width: 100%; border-collapse: collapse; font-size: 14px; }
table.interview th, table.interview td { border: 1.5px solid #000; padding: 2px 7px; text-align: left; height: 29px; }
table.interview th { height: auto; }
table.interview td.c { width: 1.15in; text-align: center; }
.own { border: 1.5px dashed #000; padding: 3px 8px; margin: 4px 0; font-size: 14px; }
.own-lines li::before { content: none; }
.own-lines li { gap: 6px; }
.starter { flex: none; font-weight: bold; }
.check { border: 1.5px dashed #000; padding: 5px 9px; font-size: 14px; margin-top: auto; margin-bottom: 0; }
.cb { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #000; vertical-align: -2px; margin-right: 4px; }
.check span { margin-right: 12px; white-space: nowrap; display: inline-block; }
.foot { font-size: 11px; text-align: right; margin-top: 4px; }
.page.spread .part { margin-bottom: 14px; }
"""


def ws_rules():
    out = []
    for word, parts, meaning, ex in RULES:
        q = ""
        if word == "YET":
            q = f'<div class="q"><b>Question:</b> {chips(YET_Q)}</div>'
        out.append(f'<div class="rule"><div class="rule-name">{word}</div>{chips(parts)}'
                   f'<div>{meaning}</div><div class="ex">{ex}</div>{q}</div>')
    return f'<div class="rules">{"".join(out)}</div>'


def ws_sched(name):
    p = PEOPLE[name]
    rows = "".join(f'<tr><td class="t">{c}</td><td>{v1}</td></tr>' for c, _, v1, _ in p["events"])
    return f'<div class="sched"><h3>{name}\'s Wednesday <span>{p["job"]}</span></h3><table>{rows}</table></div>'


def page_card(key):
    flag = ' <span class="key-flag">KEY</span>' if key else ""
    irr = "".join(f"<span>{a} → <b>{b}</b></span>" for a, b in IRREGULAR)
    return f"""<section class="page">
<div class="name-row">Name: <span class="fill"></span> Date: <span class="fill date"></span></div>
<div class="title-row"><h1>Just, Already, Yet: The Day Before Thanksgiving{flag}</h1><span class="sub">Schedule card · keep it on your desk</span></div>
{ws_rules()}
<div class="how"><div class="bigtl">{timeline_svg(printed=True)}</div><ol>
<li><b class="n">1</b><span>Find the <b>time</b>.</span></li>
<li><b class="n">2</b><span>Draw a <b>NOW line</b>.</span></li>
<li><b class="n">3</b><span><b>Before</b> NOW = done. <b>After</b> NOW = not yet.</span></li>
</ol></div>
<div class="scheds">{ws_sched("Mandy")}{ws_sched("Kevin")}</div>
<div class="v3box"><span class="lbl">V1 → V3</span><div class="v3grid">{irr}</div>
<div class="reg"><b>Regular:</b> V1 + ed<br>{", ".join(REGULAR)}</div></div>
</section>"""


def part_a(key):
    out = []
    for n, item in enumerate(PART_A, 1):
        tl_hint = f'<p class="tl-hint">✎ Draw the NOW line at <b>{item["clock"]}</b>. Then write.</p>'
        head = (f'<h2>A{n}. <span class="clock">{item["clock"]}</span> {item["title"]}</h2>{tl_hint}'
                f'{day_timeline(*item["win"], now=item["now"], key=key)}<p class="hint">{item["how"]}</p>')
        if "lines" in item:
            body = "".join(f"<li>{blanks(t, key, 0.95 if n == 1 else 2.4)}</li>" for t in item["lines"])
        elif "free" in item:
            body = "".join(f'<li><span class="word">{who} {chips(["*" + w.lower()])}</span>'
                           f'<span class="fill">{ans if key else ""}</span></li>' for who, w, ans in item["free"])
        else:
            body = "".join(f'<li><span class="fill">{m if key else ""}</span></li>' for m in item["open"])
        also = f'<p class="also">{item["also"]}</p>' if key and item.get("also") else ""
        if key and "open" in item:
            also = '<p class="also">Many answers are OK. Check: the right time, have/has + V3, the word in the right place.</p>'
        out.append(f'<div class="part">{head}<ol class="lines">{body}</ol>{also}</div>')
    return out


def part_b(key):
    clock, _ = PART_B_TIME
    items = []
    for q, yes, full in PART_B:
        pr = "she" if "Mandy" in q else "he"
        on_y = " on" if key and yes else ""
        on_n = " on" if key and not yes else ""
        items.append(f'<li><div class="qrow"><span class="q">{q}</span>'
                     f'<span class="choice{on_y}">Yes, {pr} has.</span><span class="choice{on_n}">No, not yet.</span></div>'
                     f'<span class="fill">{full if key else ""}</span></li>')
    own_q, own_a = PART_B_OWN
    items.append(f'<li><div class="qrow"><span class="q">Your question: Has ______ ______ yet?</span></div>'
                 f'<span class="fill">{own_q + " " + own_a if key else ""}</span></li>')
    now = PART_B_TIME[1]
    return (f'<div class="part"><h2>B. <span class="clock">{clock}</span> Ask and answer.</h2>'
            f'<p class="tl-hint">✎ Draw the NOW line at <b>{clock}</b>. Then answer.</p>{day_timeline(*PART_B_WIN, now=now, key=key)}'
            f'<p class="hint">Circle the short answer. Then write a full sentence. Last line: write your own question and ask a partner.</p>'
            f'<ol class="lines qa">{"".join(items)}</ol></div>')


def part_c(key):
    items = "".join(f'<li><span class="wrong">{w}</span><span class="fill">{r if key else ""}</span></li>'
                    for w, r, why in PART_C)
    return (f'<div class="part"><h2>C. Fix the mistake.</h2>'
            f'<p class="hint">Each sentence has <b>1 mistake</b>. Write it correctly.</p><ol class="lines">{items}</ol></div>')


def part_d(key):
    rows = "".join(f'<tr><td>Have you {q} yet?</td><td class="c">Yes, I have.</td><td class="c">No, not yet.</td></tr>' for q in PART_D)
    rows += '<tr><td>Have you ____________________________ yet?</td><td class="c">Yes, I have.</td><td class="c">No, not yet.</td></tr>'
    m = PART_D_MODELS[0]
    starters = [("My partner has already", m[0].replace("My partner has already ", "")),
                ("My partner hasn't", m[1].replace("She hasn't ", "")),
                ("I have just", m[2].replace("I have just ", ""))]
    lines = "".join(f'<li><span class="starter">{s}</span><span class="fill">{a if key else ""}</span></li>' for s, a in starters)
    note = '<p class="also">Many answers are OK. Check have/has + V3 and the word position.</p>' if key else ""
    return f"""<div class="part"><h2>D. Talk about today.</h2>
<p class="hint">Ask a partner. Put a <b>✓</b> next to their answer. Then ask: <i>"What else have you done today?"</i></p>
<table class="interview"><tr><th>Question</th><th class="c">✓</th><th class="c">✓</th></tr>{rows}</table>
<p class="own"><b>You make up the ending.</b> Your sentences will be different from your classmates'.</p>
<ol class="lines own-lines">{lines}</ol>{note}</div>"""


def part_e(key):
    starters = [("I have already", "already"), ("I have just", "just"), ("I haven't", "yet")]
    lines = "".join(f'<li><span class="starter">{st}</span><span class="fill">{PART_E_MODELS[i].replace(st + " ", "") if key else ""}</span></li>'
                    for i, (st, _) in enumerate(starters))
    note = '<p class="also">Many answers are OK. Check: the dots are before or after NOW, have/has + V3.</p>' if key else ""
    return f"""<div class="part"><h2>E. My day.</h2>
<p class="hint">Put <b>4 things</b> you do today on the time line: a dot + the words. Then draw the <b>NOW</b> line.</p>
{blank_timeline(key)}
<p class="own"><b>You make up the ending.</b> Your day is different from your classmates' day.</p>
<ol class="lines own-lines">{lines}</ol>{note}</div>"""


def checklist():
    return ('<div class="check"><b>Check your writing:</b> '
            '<span><span class="cb"></span>have / has + <b>V3</b></span>'
            '<span><span class="cb"></span>has <b>already</b> V3 · has <b>just</b> V3</span>'
            '<span><span class="cb"></span><b>yet</b> at the end</span>'
            '<span><span class="cb"></span>no <b>yet</b> in a + sentence</span></div>')


def worksheet(key):
    flag = ' <span class="key-flag">KEY</span>' if key else ""
    a = part_a(key)
    p2 = f"""<section class="page">
<div class="title-row"><h1>Part A: What time is it?{flag}</h1><span class="sub">Use your schedule card and the time lines.</span></div>
{a[0]}
{a[1]}
<p class="foot" style="margin-top:auto">Turn over for A3 →</p>
</section>"""
    p3 = f"""<section class="page">
{a[2]}
{a[3]}
{checklist()}
<p class="foot">Next page: Part B →</p>
</section>"""
    p4 = f"""<section class="page spread">
{part_b(key)}
{part_c(key)}
</section>"""
    p5 = f"""<section class="page spread">
{part_d(key)}
{part_e(key)}
</section>"""
    title = "Just, Already, Yet: Answer Key" if key else "Just, Already, Yet: Worksheet"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>{title}</title>
{FONT}
<style>{WS_CSS}</style></head>
<body>
{page_card(key)}
{p2}
{p3}
{p4}
{p5}
</body></html>"""


# ---------------------------------------------------------------- slides
def sl_sched(name, now=None, step=True, clock=""):
    """Schedule card on a slide. With a time: a NOW line and already/just/yet tags appear on the first Next."""
    p = PEOPLE[name]
    rows, placed = [], False
    g = ' class="step" data-group="now"' if step else ""
    for c, m, v1, _ in p["events"]:
        if now is not None and not placed and m > now:
            rows.append(f'<li class="nowline"><span{g}>NOW · {clock}</span></li>')
            placed = True
        tag = ""
        cls = ""
        if now is not None:
            st = status(m, now)
            cls = f' class="{st}"'
            tag = f'<em class="tag {"step" if step else "on"}" data-group="now">{st}</em>'
        rows.append(f"<li{cls}><time>{c}</time><span>{v1}</span>{tag}</li>")
    if now is not None and not placed:
        rows.append(f'<li class="nowline"><span{g}>NOW · {clock}</span></li>')
    return f'<div class="ss"><h3>{name}</h3><ol>{"".join(rows)}</ol></div>'


def slide(cls, label, body):
    return f'<section class="slide {cls}" aria-roledescription="slide" aria-label="{label}" hidden>\n{body}\n</section>'


def sl_chips(parts):
    return chips(parts)


def rule_slide():
    cards = []
    for word, parts, meaning, ex in RULES:
        q = f'<p class="q"><b>Question:</b> {chips(YET_Q)}</p>' if word == "YET" else ""
        cards.append(f'<div class="rc step w-{word.lower()}"><h3>{word}</h3>{chips(parts)}<p>{meaning}</p><p class="ex">{ex}</p>{q}</div>')
    return slide("plain", "The three words", f"""<p class="kicker">Schedule card · top</p>
<h2>Where does the word go?</h2>
<div class="rcs">{"".join(cards)}</div>""")


def timeline_svg(printed=False):
    """The big-idea time line. printed=True: black and white, no click-through steps (schedule card)."""
    svg = timeline_svg_slide()
    if printed:
        svg = re.sub(r"var\(--\w+\)", "#000", svg).replace('<g class="step">', "<g>")
    return svg


def timeline_svg_slide():
    return """<svg viewBox="0 0 1000 260" role="img" aria-label="A time line. Earlier today: already. A few minutes ago: just. Now. Later: not yet." font-family="Atkinson Hyperlegible, Arial, sans-serif">
  <line x1="40" y1="130" x2="950" y2="130" stroke="currentColor" stroke-width="6"/>
  <polygon points="950,115 985,130 950,145" fill="currentColor"/>
  <line x1="640" y1="60" x2="640" y2="200" stroke="currentColor" stroke-width="8"/>
  <text x="640" y="44" text-anchor="middle" font-size="34" font-weight="700" fill="currentColor">NOW</text>
  <g class="step"><circle cx="220" cy="130" r="20" fill="var(--already)"/>
    <text x="220" y="200" text-anchor="middle" font-size="34" font-weight="700" fill="var(--already)">ALREADY</text>
    <text x="220" y="238" text-anchor="middle" font-size="24" fill="currentColor">earlier · done</text></g>
  <g class="step"><circle cx="575" cy="130" r="20" fill="var(--just)"/>
    <text x="545" y="200" text-anchor="middle" font-size="34" font-weight="700" fill="var(--just)">JUST</text>
    <text x="545" y="238" text-anchor="middle" font-size="24" fill="currentColor">a few minutes ago</text></g>
  <g class="step"><circle cx="840" cy="130" r="20" fill="none" stroke="var(--yet)" stroke-width="6" stroke-dasharray="7 6"/>
    <text x="840" y="200" text-anchor="middle" font-size="34" font-weight="700" fill="var(--yet)">not … YET</text>
    <text x="840" y="238" text-anchor="middle" font-size="24" fill="currentColor">later · we expect it</text></g>
</svg>"""


def time_slide(n, item):
    now = item["now"]
    if "lines" in item:  # model answers come straight from the worksheet key
        models = [re.sub(r"\[\[(.+?)\]\]", r"<b>\1</b>", t) for t in item["lines"]]
    elif "free" in item:
        models = [a for _, _, a in item["free"]]
    else:
        models = item["open"]
    cls = {"already": "already", "just": "just", "yet": "yet", "hasn't": "yet"}
    models = [re.sub(r"\b(already|just|yet|hasn't)\b", lambda w: f'<b class="k-{cls[w.group(1)]}">{w.group(1)}</b>',
                     re.sub(r"</?b>", "", m)) for m in models]
    lis = "".join(f'<li class="step">{m}</li>' for m in models)
    extra = ""
    if "open" in item:
        extra = '<p class="step note">Different sentences are OK. Check the time!</p>'
    if "also" in item:
        extra = '<p class="step note">Line 2 and 3: more answers are OK. Look before the NOW line.</p>'
    task = re.sub(r"</?b>", "", item["how"])
    return slide("tslide", f"Part A{n}: {item['clock']}", f"""<p class="kicker">Worksheet · Part A{n}</p>
<div class="thead"><span class="bigclock">{item["clock"]}</span><h2>{item["title"]}</h2></div>
<div class="tlbox">{day_timeline(*item["win"], now=now, slide=True, clock=item["clock"])}</div>
<div class="answers"><p class="hint">{task}</p><ol class="models">{lis}</ol>{extra}</div>""")


def build_slides():
    irr = "".join(f'<li><span>{a}</span><b class="step">{b}</b></li>' for a, b in IRREGULAR)
    s = [
        slide("title", "Title", """<p class="kicker">Week 10 · Thursday</p>
<h1>Just, Already, Yet</h1>
<p class="sub">The day before Thanksgiving. What have Mandy and Kevin done? What haven't they done yet?</p>"""),
        slide("steps", "You need", """<h2>You need</h2>
<ol><li><span><b>The schedule card</b> (page 1)</span></li><li><span><b>The worksheet</b> (Parts A to E)</span></li><li><span><b>A pencil</b></span></li></ol>"""),
        slide("plain", "Time line", f"""<p class="kicker">The big idea</p>
<h2>Where is it on the time line?</h2>
<div class="tlwrap">{timeline_svg()}</div>
<p class="step big-text">All three use <b>have / has + V3</b>.</p>"""),
        rule_slide(),
        slide("plain", "V1 to V3", f"""<p class="kicker">Schedule card · bottom</p>
<h2>V1 → V3</h2>
<p class="hint">Say the V3 before you click.</p>
<ul class="v3list">{irr}</ul>
<p class="step big-text"><b>Regular:</b> V1 + ed → {", ".join(REGULAR)}</p>"""),
        slide("plain", "Meet Mandy and Kevin", f"""<p class="kicker">Schedule card · middle</p>
<h2>Wednesday, November 25</h2>
<p class="hint">The day before Thanksgiving. Mandy: family dinner at her house tomorrow. Kevin: turkey day at the food pantry, then a trip to his mom's.</p>
<div class="scheds wide">{sl_sched("Mandy")}{sl_sched("Kevin")}</div>"""),
        slide("steps", "How it works", """<h2>How it works</h2>
<ol><li><span>Find the <b>time</b>.</span></li><li><span>Draw a <b>NOW line</b> on the time line.</span></li><li><span><b>Before</b> NOW = done → <b>already</b> or <b>just</b>.</span></li><li><span><b>After</b> NOW = not done → <b>yet</b>.</span></li></ol>"""),
    ]
    for n, item in enumerate(PART_A, 1):
        s.append(time_slide(n, item))

    clock, now = PART_B_TIME
    qa = []
    for q, yes, full in PART_B:
        pr = "she" if "Mandy" in q else "he"
        short = f"Yes, {pr} has." if yes else "No, not yet."
        qa.append(f'<li><span class="qq">{q}</span><span class="step"><b class="{"y" if yes else "n"}">{short}</b> {full}</span></li>')
    s += [
        slide("plain", "Part B: short answers", """<p class="kicker">Worksheet · Part B</p>
<h2>Short answers</h2>
<div class="shorts">
  <div><p class="qq">Has Mandy eaten lunch yet?</p><p class="step"><b class="y">Yes, she has.</b> She has already eaten lunch.</p></div>
  <div><p class="qq">Has Kevin gone to bed yet?</p><p class="step"><b class="n">No, not yet.</b> He hasn't gone to bed yet.</p><p class="step small-note">Also OK: <b>No, he hasn't.</b></p></div>
</div>
<p class="step watch"><b>Watch out!</b> <s>Yes, she did.</s> → <b>Yes, she has.</b> The question has <b>has</b>, so the answer has <b>has</b>.</p>"""),
        slide("tslide", f"Part B: {clock}", f"""<p class="kicker">Worksheet · Part B</p>
<div class="thead"><span class="bigclock">{clock}</span><h2>Ask and answer.</h2></div>
<div class="tlbox">{day_timeline(*PART_B_WIN, now=now, slide=True, clock=clock)}</div>
<div class="answers"><ol class="qa">{"".join(qa)}</ol>
<p class="step note">Line 5: write <b>your</b> question. Ask a partner.</p></div>"""),
    ]
    fixes = "".join(f'<li><span class="bad">{w}</span><span class="step good">{r}</span><span class="step why">{why}</span></li>'
                    for w, r, why in PART_C)
    s.append(slide("plain", "Part C", f"""<p class="kicker">Worksheet · Part C</p>
<h2>Fix the mistake.</h2>
<p class="hint">Each sentence has 1 mistake. Find it with a partner.</p>
<ol class="fixes">{fixes}</ol>"""))
    rows = "".join(f"<li>Have you <b>{q}</b> yet?</li>" for q in PART_D)
    s.append(slide("plain", "Part D: talk", f"""<p class="kicker">Worksheet · Part D</p>
<h2>Talk about today.</h2>
<div class="two">
  <ol class="dq">{rows}<li>Have you <b>______</b> yet? <i>(your idea)</i></li></ol>
  <div class="replies">
    <p class="bubble"><b class="y">Yes, I have.</b><br>We're going to my cousin's house.</p>
    <p class="bubble"><b class="n">No, not yet.</b><br>I'll do it tonight.</p>
    <p class="step big-text">Then ask: <b>“What else have you done today?”</b></p>
  </div>
</div>"""))
    cols = "".join(f'<div class="mset step"><p>{a}</p><p>{b}</p><p>{c}</p></div>' for a, b, c in PART_D_MODELS)
    s.append(slide("plain", "Part D: write", f"""<p class="kicker">Worksheet · Part D</p>
<h2>You make up the ending.</h2>
<p class="own"><b>Use your own ideas.</b> Write about your partner and you. Different people, different sentences:</p>
<div class="msets">{cols}</div>"""))
    e_lines = "".join(f'<li class="step">{m}</li>' for m in PART_E_MODELS)
    s.append(slide("plain", "Part E: my day", f"""<p class="kicker">Worksheet · Part E</p>
<h2>My day.</h2>
<p class="hint">Put 4 things you do today on the time line. Draw the NOW line. Here is one example day:</p>
<div class="tlbox">{blank_timeline(slide=True)}</div>
<ol class="models">{e_lines}</ol>
<p class="step own"><b>You make up the ending.</b> Your day is different from your classmates' day.</p>"""))
    checks = ("<li><span>have / has + <b>V3</b></span></li><li><span>has <b>already</b> V3 · has <b>just</b> V3</span></li>"
              "<li><span><b>yet</b> at the end</span></li><li><span>no <b>yet</b> in a + sentence</span></li>")
    s += [
        slide("steps", "Check your writing", f"""<h2>Check your writing.</h2><ol class="ticks">{checks}</ol>"""),
        slide("title", "Done", """<p class="kicker">Finished!</p>
<h1>Are you ready for the holiday?</h1>
<p class="sub">Tell a partner one thing you have already done and one thing you haven't done yet.</p>"""),
    ]
    total = len(s)
    s = [x.replace('" hidden>', f' ({k + 1} of {total})" hidden>', 1) for k, x in enumerate(s)]
    s[0] = s[0].replace(" hidden>", ">", 1)
    return SLIDES_TEMPLATE.replace("{FONT}", FONT).replace("{SLIDES}", "\n".join(s))


SLIDES_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Just, Already, Yet: Slides</title>
{FONT}
<style>
:root {
  --bg: #fffdf8; --panel: #ffffff; --ink: #141414; --muted: #333333; --line: #141414;
  --bad: #a3122a; --good: #175c31;
  --already: #047857; --just: #b45309; --yet: #1d4ed8;
  --already-bg: #d1fae5; --just-bg: #fef3c7; --yet-bg: #dbeafe;
  --scale: 1; --fs: calc(3.1vmin * var(--scale));
}
:root[data-theme="dark"] {
  --bg: #121212; --panel: #1e1e1e; --ink: #f7f5ef; --muted: #e2ded4; --line: #f7f5ef;
  --bad: #ff9aa8; --good: #8fe0a8;
  --already: #6ee7b7; --just: #fcd34d; --yet: #93c5fd;
  --already-bg: #0b3326; --just-bg: #3a2a08; --yet-bg: #10254a;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { background: var(--bg); color: var(--ink); font-family: 'Atkinson Hyperlegible', Arial, sans-serif; font-size: var(--fs); line-height: 1.35; overflow: hidden; }
b { font-weight: 700; }
.slide { position: absolute; inset: 0 0 calc(var(--fs) * 2.6) 0; padding: 3.5vmin 5vmin 2vmin; display: flex; flex-direction: column; gap: .45em; overflow: auto; }
.slide[hidden] { display: none; }
.step { visibility: hidden; }
.step.on { visibility: visible; }
.kicker { margin: 0; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; font-size: .9em; color: var(--muted); }
h1 { font-size: 3.2em; line-height: 1.1; margin: .2em 0 .3em; max-width: 18ch; }
h2 { font-size: 2.1em; margin: 0; line-height: 1.15; }
h3 { margin: 0; }
.sub { font-size: 1.3em; margin: 0; color: var(--muted); max-width: 34ch; }
.title, .steps { justify-content: center; align-items: center; text-align: center; }
.hint { margin: 0; font-size: 1.15em; color: var(--muted); }
.big-text { margin: 0; font-size: 1.4em; }
.note { margin: .3em 0 0; font-size: 1.1em; color: var(--muted); }
.steps ol { list-style: none; counter-reset: s; padding: 0; margin: .4em 0 0; display: grid; gap: .55em; text-align: left; font-size: 1.45em; }
.steps li > span { display: block; }
.steps li { counter-increment: s; display: flex; align-items: center; gap: .7em; border: 3px solid var(--line); border-radius: .4em; padding: .4em .8em; background: var(--panel); }
.steps li::before { content: counter(s); flex: none; width: 1.8em; height: 1.8em; border-radius: 50%; background: var(--ink); color: var(--bg); font-weight: 700; display: grid; place-items: center; }
.steps .ticks li::before { content: "✓"; }

/* chips: same look as the printed card */
.formula { display: inline-flex; gap: .25em; flex-wrap: wrap; align-items: center; }
.chip { border: 2px solid var(--line); padding: .05em .45em; white-space: nowrap; background: var(--panel); }
.chip.hot { background: var(--ink); color: var(--bg); font-weight: 700; }
.chip.v3 { border-style: dashed; font-weight: 700; }

.tlwrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; color: var(--ink); }
.tlwrap svg { width: 100%; max-height: 100%; }

.rcs { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5vmin; align-content: center; }
.rc { border: 3px solid var(--line); border-top: .5em solid var(--c); border-radius: .4em; padding: .6em .8em; background: var(--panel); display: flex; flex-direction: column; gap: .5em; font-size: 1.05em; }
.rc .chip { padding: .05em .3em; }
.rc h3 { font-size: 1.6em; color: var(--c); }
.rc p { margin: 0; }
.rc .ex { font-style: italic; }
.rc .q { border-top: 2px dashed var(--line); padding-top: .5em; }
.w-already { --c: var(--already); } .w-just { --c: var(--just); } .w-yet { --c: var(--yet); }

.v3list { list-style: none; margin: .3em 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2vmin; flex: 1; align-content: center; }
.v3list li { border: 3px solid var(--line); border-radius: .4em; padding: .5em .7em; background: var(--panel); font-size: 1.4em; display: flex; flex-direction: column; }
.v3list b { color: var(--already); }

/* schedules */
.scheds { display: grid; grid-template-columns: 1fr 1fr; gap: 2vmin; min-height: 0; }
.scheds.wide { flex: 1; font-size: 1.15em; }
.ss { border: 3px solid var(--line); border-radius: .3em; background: var(--panel); display: flex; flex-direction: column; min-height: 0; }
.ss h3 { font-size: 1.15em; padding: .15em .5em; border-bottom: 3px solid var(--line); }
.ss ol { list-style: none; margin: 0; padding: 0; flex: 1; display: flex; flex-direction: column; }
.ss li { display: flex; align-items: center; gap: .5em; padding: .1em .5em; border-bottom: 1px solid var(--line); font-size: .78em; flex: 1; position: relative; }
.ss li:last-child { border-bottom: none; }
.ss time { font-weight: 700; width: 5.2em; flex: none; white-space: nowrap; }
.ss .tag { margin-left: auto; font-style: normal; font-weight: 700; font-size: .85em; text-transform: uppercase; letter-spacing: .03em; }
.ss li.already:has(.tag.on) { background: var(--already-bg); } .ss li.already .tag { color: var(--already); }
.ss li.just:has(.tag.on) { background: var(--just-bg); } .ss li.just .tag { color: var(--just); }
.ss li.yet:has(.tag.on) { color: var(--muted); } .ss li.yet .tag { color: var(--yet); }
.ss li.yet .tag::before { content: "not "; }
.ss li.nowline { flex: none; padding: 0; border: none; }
.ss li.nowline span { display: block; width: 100%; background: var(--bad); color: #fff; font-weight: 700; padding: .05em .5em; letter-spacing: .04em; }
.ss .tag { white-space: nowrap; }
.tslide .ss li { font-size: .74em; padding: .05em .45em; }
.tslide .ss time { width: 4.9em; }

.tlbox { flex: 1.25; min-height: 0; display: flex; align-items: center; justify-content: center; color: var(--ink); }
.tlbox svg { width: 100%; height: 100%; max-height: 100%; }
.tslide .answers { flex: 1; }
.tslide .models, .tslide .qa { grid-template-columns: 1fr 1fr; column-gap: 2em; }
.thead { display: flex; align-items: center; gap: .6em; }
.bigclock { font-size: 1.9em; font-weight: 700; border: 4px solid var(--line); border-radius: .25em; padding: 0 .35em; background: var(--panel); }
.tgrid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1.7fr 1fr; gap: 2.5vmin; }
.answers { display: flex; flex-direction: column; gap: .3em; }
.models, .qa { margin: 0; padding-left: 1.4em; font-size: 1.25em; display: grid; gap: .45em; grid-auto-flow: column; grid-template-rows: repeat(2, auto); }
.k-already { color: var(--already); } .k-just { color: var(--just); } .k-yet { color: var(--yet); }
.qa li { display: flex; flex-direction: column; }
.qq { font-weight: 700; }
.y { color: var(--already); } .n { color: var(--yet); }

.shorts { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 3vmin; align-content: center; font-size: 1.35em; }
.shorts > div { border: 3px solid var(--line); border-radius: .4em; padding: .6em .9em; background: var(--panel); }
.shorts p { margin: 0 0 .4em; }
.small-note { font-size: .8em; color: var(--muted); }
.watch { margin: 0; font-size: 1.25em; border: 3px dashed var(--bad); border-radius: .4em; padding: .3em .7em; }
s { text-decoration-thickness: .12em; text-decoration-color: var(--bad); }

.fixes { margin: 0; padding-left: 1.4em; font-size: 1.25em; display: grid; gap: .45em; flex: 1; align-content: center; }
.fixes li { display: grid; grid-template-columns: 1fr 1fr; column-gap: 1.2em; }
.fixes .bad u { text-decoration-color: var(--bad); text-decoration-thickness: .12em; }
.fixes .good b { color: var(--good); }
.fixes .why { grid-column: 2; font-size: .75em; color: var(--muted); }

.two { flex: 1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 3vmin; align-items: center; }
.dq { margin: 0; padding-left: 1.4em; font-size: 1.3em; display: grid; gap: .35em; }
.replies { display: flex; flex-direction: column; gap: .6em; }
.bubble { margin: 0; font-size: 1.3em; border: 3px solid var(--line); border-radius: .8em; padding: .4em .8em; background: var(--panel); }
.own { margin: 0; font-size: 1.3em; }
.msets { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5vmin; align-content: center; }
.mset { border: 3px solid var(--line); border-radius: .4em; padding: .5em .8em; background: var(--panel); font-size: 1.15em; }
.mset p { margin: 0 0 .5em; }

.bar { position: fixed; left: 0; right: 0; bottom: 0; height: calc(var(--fs) * 2.6); display: flex; align-items: center; gap: .5em; padding: 0 3vmin; border-top: 2px solid var(--line); background: var(--bg); font-size: calc(2.4vmin * var(--scale)); }
.bar .count { margin-right: auto; font-weight: 700; }
.bar button { font: inherit; font-weight: 700; min-height: 44px; min-width: 44px; padding: .25em .8em; border: 3px solid var(--line); border-radius: .4em; background: var(--panel); color: var(--ink); cursor: pointer; }
.bar .next { background: var(--ink); color: var(--bg); }
.progress { position: fixed; top: 0; left: 0; width: 100%; height: 6px; background: var(--ink); transform-origin: left; transform: scaleX(0); transition: transform .2s; }
button:focus-visible { outline: 5px solid var(--ink); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { .progress { transition: none; } }
@media (max-width: 700px) { :root { --fs: calc(4vmin * var(--scale)); } .tgrid, .rcs, .two, .msets { grid-template-columns: 1fr; } }
@media print {
  @page { size: 13.333in 7.5in; margin: 0; }
  :root { --fs: 22px; }
  body { overflow: visible; height: auto; }
  .bar, .progress { display: none; }
  .slide, .slide[hidden] { display: flex; position: relative; inset: auto; width: 13.333in; height: 7.5in; overflow: hidden; break-after: page; }
  .step { visibility: visible; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
</head>
<body>
<div class="progress" aria-hidden="true"></div>
<main id="deck">
{SLIDES}
</main>
<nav class="bar" aria-label="Slide controls">
  <span class="count" aria-hidden="true"></span>
  <button type="button" data-act="smaller" aria-label="Make text smaller">A−</button>
  <button type="button" data-act="bigger" aria-label="Make text bigger">A+</button>
  <button type="button" data-act="theme" aria-label="Switch light or dark colors">Dark</button>
  <button type="button" data-act="full" aria-label="Full screen">Full screen</button>
  <button type="button" data-act="prev" aria-label="Previous slide">◀ Back</button>
  <button type="button" data-act="next" class="next" aria-label="Next">Next ▶</button>
</nav>
<script>
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const count = document.querySelector('.count');
  const bar = document.querySelector('.progress');
  const root = document.documentElement;
  const store = (k, v) => { try { if (v !== undefined) localStorage.setItem(k, v); return localStorage.getItem(k); } catch (e) { return null; } };
  let i = Math.min(Math.max(parseInt(location.hash.slice(1), 10) - 1 || 0, 0), slides.length - 1);
  let scale = parseFloat(store('jay-scale')) || 1;
  const applyScale = () => root.style.setProperty('--scale', scale);
  const themeBtn = document.querySelector('[data-act="theme"]');
  const setTheme = t => { root.dataset.theme = t; themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark'; store('jay-theme', t); };
  setTheme(store('jay-theme') || 'light');
  applyScale();
  const steps = s => [...s.querySelectorAll('.step')];
  function show(n, revealAll) {
    i = Math.min(Math.max(n, 0), slides.length - 1);
    slides.forEach((s, k) => s.hidden = k !== i);
    steps(slides[i]).forEach(el => el.classList.toggle('on', !!revealAll));
    count.textContent = (i + 1) + ' / ' + slides.length;
    bar.style.transform = 'scaleX(' + ((i + 1) / slides.length) + ')';
    history.replaceState(null, '', '#' + (i + 1));
  }
  function next() {
    const hidden = steps(slides[i]).find(el => !el.classList.contains('on'));
    if (!hidden) return show(i + 1);
    const g = hidden.dataset.group;
    (g ? steps(slides[i]).filter(el => el.dataset.group === g) : [hidden]).forEach(el => el.classList.add('on'));
  }
  const act = {
    next, prev: () => show(i - 1, true),
    bigger: () => { scale = Math.min(1.6, +(scale + .1).toFixed(1)); applyScale(); store('jay-scale', scale); },
    smaller: () => { scale = Math.max(.7, +(scale - .1).toFixed(1)); applyScale(); store('jay-scale', scale); },
    theme: () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'),
    full: () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(),
  };
  document.querySelector('.bar').addEventListener('click', e => { const b = e.target.closest('button'); if (b) act[b.dataset.act](); });
  document.addEventListener('keydown', e => {
    const k = e.key;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k) && !e.target.closest('button')) { e.preventDefault(); act.next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); act.prev(); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(slides.length - 1, true);
    else if (k === 'f' || k === 'F') act.full();
    else if (k === '+' || k === '=') act.bigger();
    else if (k === '-') act.smaller();
    else if (k === 'd' || k === 'D') act.theme();
  });
  show(i);
})();
</script>
</body>
</html>
"""


# ---------------------------------------------------------------- checks + output
def self_check():
    """The answers written in the data must agree with the schedules."""
    def find(name, v3):
        return next(e for e in PEOPLE[name]["events"] if e[3].split()[0] == v3.split()[0] and v3 in e[3])
    for item in PART_A[:3]:
        now = item["now"]
        texts = [re.sub(r"\[\[(.+?)\]\]", r"\1", t) for t in item.get("lines", [])] + [a for *_, a in item.get("free", [])]
        for t in texts:
            name = t.split()[0]
            for ev in PEOPLE[name]["events"]:
                if ev[3] in t:
                    st = status(ev[1], now)
                    word = "yet" if "yet" in t else ("just" if " just " in t else "already")
                    assert st == word, f"{item['clock']}: '{t}' but schedule says {st}"
    for t in PART_A[3]["open"] + [a for *_, a in PART_B]:
        pass
    now = PART_B_TIME[1]
    for q, yes, _ in PART_B:
        name = q.split()[1]
        ev = next(e for e in PEOPLE[name]["events"] if e[3] in q)
        assert (status(ev[1], now) != "yet") == yes, q
    # every event an answer depends on must be on that part's time line
    for item in PART_A[:3]:
        lo, hi = item["win"]
        texts = [re.sub(r"\[\[(.+?)\]\]", r"\1", t) for t in item.get("lines", [])] + [a for *_, a in item.get("free", [])]
        for t in texts:
            for ev in PEOPLE[t.split()[0]]["events"]:
                if ev[3] in t:
                    assert lo <= ev[1] <= hi, f"{item['clock']}: '{ev[2]}' is off the time line"
        assert lo < item["now"] < hi
    for q, *_ in PART_B + [PART_B_OWN]:
        ev = next(e for e in PEOPLE[q.split()[1]]["events"] if e[3] in q)
        assert PART_B_WIN[0] <= ev[1] <= PART_B_WIN[1], f"Part B: '{ev[2]}' is off the time line"
    print("answers match the schedules")


def to_pdf(html_path, expect):
    pdf = html_path.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000",
                    f"--print-to-pdf={pdf}", html_path.resolve().as_uri()], check=True, capture_output=True)
    n = re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1)
    print(f"{pdf.name}: {n} pages{'' if int(n) == expect else f'  <-- expected {expect}'}")


if __name__ == "__main__":
    self_check()
    for name, key in (("just-already-yet-worksheet", False), ("just-already-yet-key", True)):
        out = HERE / f"{name}.html"
        out.write_text(worksheet(key))
        to_pdf(out, 5)
    out = HERE / "just-already-yet-slides.html"
    html = build_slides()
    out.write_text(html)
    to_pdf(out, html.count('class="slide '))
