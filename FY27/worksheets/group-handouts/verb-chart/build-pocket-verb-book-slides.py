#!/usr/bin/env python3
"""Build the click-through slides for making and filling in the pocket verb book.

Reads the card data straight from build-pocket-verb-book.py, so the answers on the
slides always match the teacher key. Pictures of the real pages come from
pocket-verb-book.pdf (build that first).

Next / Space / right arrow shows the next answer on a slide, then the next slide.

    python3 build-pocket-verb-book-slides.py
writes pocket-verb-book-slides.html next to this file. Needs pdftoppm and Pillow.
"""
import base64
import importlib.util
import io
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
sys.dont_write_bytecode = True  # no __pycache__ in the handouts folder
spec = importlib.util.spec_from_file_location("book", HERE / "build-pocket-verb-book.py")
book = importlib.util.module_from_spec(spec)
spec.loader.exec_module(book)

# The cover stamp each card uses, in the words printed on the cover
STAMP_WORDS = {
    "single-dot": ("one dot", "An event at a point in time."),
    "multiple-dots": ("many dots", "A routine. It happens again and again."),
    "solid-line": ("a line", "In progress. We are in the middle of it."),
    "arc": ("a dot + an arc to NOW", "Connected to now. It started before now and connects to now."),
}

# Three different "my sentence" models per card, so learners see there is no one answer
MODELS = {
    "Present simple": ("I <b>drink</b> coffee every morning.", "My son <b>plays</b> soccer on Saturdays.", "I <b>don't watch</b> TV at night."),
    "Past simple": ("I <b>visited</b> my sister last weekend.", "I <b>moved</b> here in 2019.", "I <b>didn't sleep</b> well last night."),
    "Future simple": ("I <b>will call</b> my mom tonight.", "It <b>will be</b> cold tomorrow.", "I <b>won't be</b> late."),
    "Present continuous": ("I <b>am sitting</b> in English class now.", "My daughter <b>is sleeping</b> right now.", "We <b>are learning</b> verbs today."),
    "Past continuous": ("I <b>was cooking</b> at 7:00 last night.", "I <b>was driving</b> when you called.", "My kids <b>were sleeping</b> at 10:00."),
    "Future continuous": ("I <b>will be working</b> at 9:00 tomorrow.", "This time next week, I <b>will be traveling</b>.", "I <b>will be sleeping</b> at midnight."),
    "Present perfect": ("I <b>have lived</b> here for 3 years.", "I <b>have never seen</b> snow.", "I <b>have already eaten</b> lunch."),
}

# "Which card?" review at the end: (sentence, card number)
REVIEW = [
    ("She is cooking right now.", 4),
    ("We visited my aunt last Sunday.", 2),
    ("I have lived here since 2022.", 7),
    ("At 9:00 tomorrow, I will be sleeping.", 6),
    ("He takes the bus every day.", 1),
    ("They were watching TV when I called.", 5),
    ("I think it will rain tomorrow.", 3),
]


def page_images():
    """Render the student book and cut out the pictures the build steps need."""
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-r", "110", "-png", "-f", "1", "-l", "1",
                        str(HERE / "pocket-verb-book.pdf"), f"{tmp}/p"], check=True)
        page = Image.open(next(Path(tmp).glob("p*.png"))).convert("RGB")
    w, h = page.size
    half = h // 2
    crops = {
        "tabs": page.crop((0, h - int(h * 0.075), w, h)),
        "staple": page.crop((0, half, w, half + int(h * 0.075))),
        "card": page.crop((0, half, w, h)),
    }
    out = {}
    for name, im in crops.items():
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=82, optimize=True)
        out[name] = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    return out


def stamped_timeline(i, t):
    marks = book.stamp(*t["stamp"])
    if i in (4, 5):
        x = book.element_x(t["stamp"][1], t["stamp"][2])
        marks += (f'<line x1="{x}" y1="32" x2="{x}" y2="60" stroke="#111" stroke-width="1.5"/>'
                  f'<text x="{x}" y="26" text-anchor="middle" font-size="11">8:00</text>')
    # Empty timeline with the answer layered on top as a reveal step
    svg = book.timeline(f'<g class="step">{marks}</g>')
    return svg


def tabs_svg():
    """The finished book from the front: cover on top, all 7 tabs showing underneath."""
    colors = {"past": book.AMBER_700, "present": book.EMERALD_700, "future": book.BLUE_700}
    cells = []
    tw = 100
    for k, t in enumerate(book.TENSES):
        x = k * tw
        label = t["tab"].split("<br>")
        if t["zone"] == "perfect":
            fill = (f'<rect x="{x + 3}" y="250" width="{(tw - 6) / 2}" height="64" fill="{book.AMBER_700}"/>'
                    f'<rect x="{x + 3 + (tw - 6) / 2}" y="250" width="{(tw - 6) / 2}" height="64" fill="{book.EMERALD_700}"/>')
        else:
            fill = f'<rect x="{x + 3}" y="250" width="{tw - 6}" height="64" fill="{colors[t["zone"]]}"/>'
        cells.append(fill + f'<text x="{x + tw / 2}" y="277" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">{label[0]}</text>'
                     f'<text x="{x + tw / 2}" y="296" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">{label[1]}</text>')
    return f"""<svg viewBox="-10 -10 720 340" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif" role="img" aria-label="The finished book: the cover on top and 7 colored tabs in a row at the bottom">
      <rect x="0" y="0" width="700" height="250" fill="#fff" stroke="#141414" stroke-width="3"/>
      <rect x="110" y="-6" width="40" height="12" fill="#141414"/><rect x="550" y="-6" width="40" height="12" fill="#141414"/>
      <text x="350" y="110" text-anchor="middle" font-size="34" font-weight="700" fill="#141414">See the time.</text>
      <text x="350" y="152" text-anchor="middle" font-size="34" font-weight="700" fill="#141414">Build the sentence.</text>
      <text x="350" y="205" text-anchor="middle" font-size="18" fill="#444">Name: ______________</text>
      {"".join(cells)}
    </svg>"""


def piles():
    """The 8 piles on the table, in the order students pick them up."""
    names = ["Cover"] + [f"{k + 1}<small>{t['name']}</small>" for k, t in enumerate(book.TENSES)]
    zones = [""] + [t["zone"] for t in book.TENSES]
    return "".join(f'<div class="pile z-{z}">{n}</div>' if z else f'<div class="pile">{n}</div>' for n, z in zip(names, zones))


def slide(cls, label, body, zone=""):
    z = f" z-{zone}" if zone else ""
    return f'<section class="slide {cls}{z}" aria-roledescription="slide" aria-label="{label}" hidden>\n{body}\n</section>'


def tense_slides(i, t):
    n, name, zone = i + 1, t["name"], t["zone"]
    kicker = f'<p class="kicker"><span class="badge">{n}</span> Card {n} · {name}</p>'
    out = []

    out.append(slide("card", f"Card {n}: meaning", f"""{kicker}
<h2>What does it mean?</h2>
<p class="hint">Look at the cover: <b>What do you want to say?</b> Then write on your card.</p>
<div class="fillrows">
  <div class="fillrow"><b>Meaning:</b><span class="line"><span class="step ans">{t["use"]}</span></span></div>
  <div class="fillrow"><b>Helpful time clues:</b><span class="line"><span class="step ans">{t["words"]}</span></span></div>
</div>""", zone))

    kind = t["stamp"][0]
    shape, means = STAMP_WORDS[kind]
    out.append(slide("card", f"Card {n}: timeline", f"""{kicker}
<h2>Draw the stamp.</h2>
<p class="draw"><b>Draw when:</b> {book.PROMPTS[i]}</p>
<div class="tl">{stamped_timeline(i, t)}</div>
<p class="explain">Explain it to a partner: <b>Where</b> is it? <b>Is it a dot, many dots, or a line?</b></p>
<p class="step reveal-box"><b>Answer:</b> {shape}. {means}</p>""", zone))

    # + / − / ? go across, like the verb charts; each Next shows one whole column
    columns = [(f, reg, irr) for (f, reg), irr in zip(t["forms"], book.IRREGULAR[name])]
    labels = ("Formula", "Regular <span>example: work</span>", "Irregular <span>example: eat</span>")
    rows = []
    for k, label in enumerate(labels):
        rows.append(f'<tr><th class="rl">{label}</th>' + "".join(
            f'<td><span class="step" data-group="{g}">{book.emphasize(col[k])}</span></td>'
            for g, col in zip(("a", "n", "q"), columns)) + "</tr>")
    third = ""
    if t.get("third"):
        third = f'<div class="fillrow small"><b>he / she / it:</b><span class="line"><span class="step ans">{book.emphasize(t["third"])}</span></span></div>'
    out.append(slide("card", f"Card {n}: forms", f"""{kicker}
<h2>Fill in the chart.</h2>
<p class="hint"><b>Choose your own verbs:</b> one regular, one irregular. Write all 3 columns, then check the formula. Our example uses <i>work</i> and <i>eat</i>.</p>
<table class="forms">
  <thead><tr><th></th><th><b class="s">+</b> Affirmative</th><th><b class="s">−</b> Negative</th><th><b class="s">?</b> Question</th></tr></thead>
  <tbody>{"".join(rows)}</tbody>
</table>
{third}""", zone))

    models = "".join(f"<li>{m}</li>" for m in MODELS[name])
    out.append(slide("card", f"Card {n}: my sentence", f"""{kicker}
<h2>My sentence</h2>
<p class="own"><b>Use your own idea.</b> Write a true sentence about <b>your</b> life with {name.lower()}.</p>
<div class="step"><p class="hint">Different people, different sentences:</p><ul class="models">{models}</ul></div>
<p class="step partner">Tell a partner. Point to your timeline.</p>
<p class="watch"><b>Watch out!</b> {book.WATCH[name]}</p>""", zone))
    return out


def build():
    img = page_images()
    cover_stamps = "".join(
        f'<div class="st">{book.mini(k, z, p, x0)}<b>{title}</b><span>{sub}</span></div>'
        for k, z, p, x0, title, sub in [
            ("single-dot", "past", 40, 34, "An event", "at a point in time"),
            ("multiple-dots", "present", 50, 155, "A routine", "again and again"),
            ("solid-line", "present", 50, 155, "In progress", "in the middle of it"),
            ("arc", "past", 50, 88, "Connected to now", "before now + now"),
        ])
    slides = [
        slide("title", "Title", """<p class="kicker">Thursday · Make it, then fill it in</p>
<h1>My Pocket Verb Book</h1>
<p class="sub">7 verb tenses. One small book. You write it.</p>"""),
        slide("steps", "You need", """<h2>You need</h2>
<ol><li><b>8 cards</b> (cover + 1 to 7)</li><li><b>Scissors</b></li><li><b>A pencil</b></li><li><b>A stapler</b> (we share)</li></ol>"""),
        slide("build", "Step 1: take your cards", f"""<p class="kicker">Make the book · Step 1</p>
<h2>Take one card from each pile.</h2>
<p class="big-text">Go in order: <b>Cover, 1, 2, 3, 4, 5, 6, 7</b>.</p>
<div class="piles">{piles()}</div>
<p class="step big-text">Check: Do you have <b>8 cards</b>? The cover is on top.</p>"""),
        slide("build", "Step 2: tabs", f"""<p class="kicker">Make the book · Step 2</p>
<h2>Cut off the striped parts.</h2>
<img class="pic wide" src="{img["tabs"]}" alt="The bottom strip of card 1: one green tab and six striped parts">
<p class="big-text">Keep the <b>colored tab</b>. Cut off the <b>stripes</b> ✂.</p>
<p class="step warn"><b>Careful!</b> Don't cut off your colored tab. Every card has its tab in a different place.</p>"""),
        slide("build", "Step 3: check", f"""<p class="kicker">Make the book · Step 3</p>
<h2>Check your book.</h2>
<div class="svgbox">{tabs_svg()}</div>
<p class="step big-text">Can you see <b>all 7 tabs</b>? If not, check the order.</p>"""),
        slide("build", "Step 4: staple", f"""<p class="kicker">Make the book · Step 4</p>
<h2>Staple at the top.</h2>
<img class="pic wide" src="{img["staple"]}" alt="The top of a card with two staple marks, one on the left and one on the right">
<p class="big-text"><b>2 staples</b>: one on the left, one on the right.</p>
<p class="step big-text">Write your <b>name</b> on the cover.</p>"""),
        slide("cover-tour", "The cover", f"""<p class="kicker">The cover</p>
<h2>Four stamps</h2>
<div class="stamps">{cover_stamps}</div>
<p class="step big-text">Which stamp is <b>“I eat breakfast every day”</b>? <span class="step ans">→ A routine</span></p>
<p class="step big-text">Which stamp is <b>“I am eating now”</b>? <span class="step ans">→ In progress</span></p>"""),
        slide("build", "Parts of a card", f"""<p class="kicker">Every card is the same</p>
<h2>You write everything.</h2>
<div class="pic-row"><img class="pic" src="{img["card"]}" alt="Card 1, Present simple, with empty lines, an empty timeline and an empty chart">
<ol class="parts"><li><b>Meaning</b></li><li><b>Time clues</b></li><li><b>Timeline</b> – draw the stamp</li><li><b>Chart</b> – + − ?</li><li><b>My sentence</b></li></ol></div>"""),
    ]
    for i, t in enumerate(book.TENSES):
        slides += tense_slides(i, t)
    review = "".join(f'<li><span>{s}</span><b class="step">Card {c}</b></li>' for s, c in REVIEW)
    slides += [
        slide("steps backside", "The back is for you", """<p class="kicker">Turn a card over</p>
<h2>The back is for you.</h2>
<p class="sub">Write anything that helps <b>you</b>. For example:</p>
<ol><li><b>More sentences</b> about your life</li><li><b>New verbs</b> – go · went · gone</li><li><b>Notes in your language</b></li></ol>"""),
        slide("review", "Which card?", f"""<p class="kicker">Use your book</p>
<h2>Which card?</h2>
<p class="hint">Find the card. Show your partner the tab.</p>
<ol class="which">{review}</ol>"""),
        slide("title", "Done", """<p class="kicker">Finished!</p>
<h1>Keep it in your pocket.</h1>
<p class="sub">Not sure which tense? Open your book. Look at the timeline.</p>"""),
    ]
    total = len(slides)
    slides = [s.replace('" hidden>', f' ({k + 1} of {total})" hidden>', 1).replace(" hidden>", ">", 1 if k == 0 else 0)
              for k, s in enumerate(slides)]
    return TEMPLATE.replace("{SLIDES}", "\n".join(slides))


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pocket Verb Book Slides</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #fffdf8; --panel: #ffffff; --ink: #141414; --muted: #333333;
  --accent: #141414; --accent-ink: #ffffff; --line: #141414;
  --bad: #a3122a; --good: #175c31;
  --past: #b45309; --present: #047857; --future: #1d4ed8;
  --past-bg: #fef3c7; --present-bg: #d1fae5; --future-bg: #dbeafe;
  --scale: 1;
  --fs: calc(3.1vmin * var(--scale));
}
:root[data-theme="dark"] {
  --bg: #121212; --panel: #1e1e1e; --ink: #f7f5ef; --muted: #e2ded4; --line: #f7f5ef;
  --accent: #f7f5ef; --accent-ink: #141414; --bad: #ff9aa8; --good: #8fe0a8;
  --past: #fcd34d; --present: #6ee7b7; --future: #93c5fd;
  --past-bg: #3a2a08; --present-bg: #0b3326; --future-bg: #10254a;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { background: var(--bg); color: var(--ink); font-family: 'Atkinson Hyperlegible', Arial, sans-serif; font-size: var(--fs); line-height: 1.35; overflow: hidden; }
b { font-weight: 700; }

.slide { position: absolute; inset: 0 0 calc(var(--fs) * 2.6) 0; padding: 4vmin 6vmin 2vmin; display: flex; flex-direction: column; gap: .5em; overflow: auto; }
.slide[hidden] { display: none; }
.z-past { --c: var(--past); --cbg: var(--past-bg); }
.z-present { --c: var(--present); --cbg: var(--present-bg); }
.z-future { --c: var(--future); --cbg: var(--future-bg); }
.z-perfect { --c: var(--past); --cbg: var(--past-bg); }

.step { visibility: hidden; }
.step.on { visibility: visible; }

.kicker { margin: 0; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; font-size: 1em; color: var(--c, var(--muted)); display: flex; align-items: center; gap: .5em; }
.badge { display: inline-grid; place-items: center; width: 1.7em; height: 1.7em; border-radius: 50%; background: var(--c); color: var(--bg); }
.z-perfect .badge { background: var(--past); position: relative; z-index: 0; overflow: hidden; }
.z-perfect .badge::before { content: ""; position: absolute; top: 0; right: 0; bottom: 0; width: 50%; background: var(--present); z-index: -1; }
h1 { font-size: 3.2em; line-height: 1.1; margin: .2em 0 .3em; max-width: 18ch; }
h2 { font-size: 2.2em; margin: 0 0 .2em; line-height: 1.15; }
.card h2 { border-bottom: .14em solid var(--c); padding-bottom: .15em; }
.sub { font-size: 1.3em; margin: 0; color: var(--muted); max-width: 32ch; }
.title, .steps { justify-content: center; align-items: center; text-align: center; }
.hint { margin: 0; font-size: 1.2em; color: var(--muted); }
.big-text { margin: 0; font-size: 1.5em; }
.ans { color: var(--c, var(--good)); font-weight: 700; }

.backside .sub { margin-bottom: .8em; max-width: none; }
.steps ol { list-style: none; counter-reset: s; padding: 0; margin: 0; display: grid; gap: .6em; text-align: left; font-size: 1.5em; }
.steps li { counter-increment: s; display: flex; align-items: center; gap: .7em; border: 3px solid var(--line); border-radius: .4em; padding: .45em .8em; background: var(--panel); }
.steps li::before { content: counter(s); flex: none; width: 1.8em; height: 1.8em; border-radius: 50%; background: var(--accent); color: var(--accent-ink); font-weight: 700; display: grid; place-items: center; }

.pic { display: block; background: #fff; border: 3px solid #141414; border-radius: .3em; max-width: 100%; }
.pic.wide { width: 100%; }
.pic-row { flex: 1; min-height: 0; display: flex; gap: 4vmin; align-items: center; }
.pic-row .pic { max-height: 100%; width: auto; min-width: 0; flex: 0 1 auto; max-width: 58%; }
.pic-row .pic.tall { max-width: 40%; }
.pic-text { font-size: 1.5em; }
.pic-text p { margin: 0 0 .6em; }
.warn { margin: 0; font-size: 1.3em; border-left: .3em solid var(--bad); padding: .2em .6em; background: var(--panel); }
.svgbox { flex: 1; min-height: 0; display: flex; justify-content: center; }
.svgbox svg { height: 100%; max-width: 100%; }
.piles { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.5vmin 3vmin; align-content: center; padding-right: 1em; }
.pile { aspect-ratio: 8.5 / 5.5; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 1.6em; font-weight: 700; line-height: 1.1; background: #fff; color: #141414; border: 3px solid #141414; border-top: .5em solid var(--c, #141414); border-radius: .2em; box-shadow: .25em .25em 0 #bbb, .5em .5em 0 #ddd; }
.pile small { display: block; font-size: .5em; font-weight: 400; margin-top: .2em; }
.parts { font-size: 1.5em; margin: 0; padding-left: 1.3em; display: grid; gap: .35em; }

.stamps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2vmin; background: #fff; color: #141414; border: 3px solid #141414; border-radius: .4em; padding: 1em .5em; margin-bottom: .4em; }
.st { display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 1.1em; }
.st svg { width: 100%; height: 3.2em; }
.st span { color: #444; font-size: .85em; }

.fillrows { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 1.2em; }
.fillrow { display: flex; gap: .6em; align-items: flex-end; font-size: 1.6em; }
.fillrow b { white-space: nowrap; }
.fillrow .line { flex: 1; border-bottom: 4px solid var(--line); min-height: 1.4em; padding: 0 .2em; }
.fillrow.small { font-size: 1.3em; }

.draw { margin: 0; font-size: 1.5em; }
.tl { flex: 1; min-height: 0; background: #fff; border: 3px solid #141414; border-radius: .4em; padding: .5em; display: flex; justify-content: center; }
.tl svg { height: 100%; width: 100%; }
.explain { margin: 0; font-size: 1.25em; }
.reveal-box { margin: 0; font-size: 1.4em; border-left: .3em solid var(--c); background: var(--cbg); padding: .25em .7em; border-radius: .2em; }

.forms { width: 100%; border-collapse: collapse; font-size: 1.3em; background: var(--panel); margin-top: .3em; }
.forms th, .forms td { border: 3px solid var(--line); padding: .45em .6em; text-align: left; height: 2.6em; }
.forms thead th { background: var(--cbg); font-size: .8em; height: auto; }
.forms thead th span { font-weight: 400; }
.forms thead th { font-size: 1em; }
.forms .s { color: var(--c); font-size: 1.3em; margin-right: .2em; }
.forms .rl { width: 8.5em; font-size: .8em; background: var(--cbg); line-height: 1.2; }
.forms .rl span { display: block; font-weight: 400; }
.forms td b { color: var(--c); white-space: nowrap; }

.own { margin: 0; font-size: 1.5em; }
.models { margin: .2em 0 0; padding-left: 1.2em; font-size: 1.4em; display: grid; gap: .2em; }
.models b { font-weight: 800; }
.partner { margin: 0; font-size: 1.5em; font-weight: 700; }
.watch { margin: auto 0 0; font-size: 1.3em; border: 3px dashed var(--c); border-radius: .4em; padding: .3em .7em; background: var(--cbg); }
.watch b { color: var(--c); }
s { text-decoration-thickness: .1em; text-decoration-color: var(--bad); }

.which { margin: 0; padding-left: 1.5em; font-size: 1.4em; display: grid; gap: .3em; }
.which li span { display: inline-block; min-width: 19em; }
.which li b { color: var(--good); }

.bar { position: fixed; left: 0; right: 0; bottom: 0; height: calc(var(--fs) * 2.6); display: flex; align-items: center; gap: .5em; padding: 0 3vmin; border-top: 2px solid var(--line); background: var(--bg); font-size: calc(2.4vmin * var(--scale)); }
.bar .count { margin-right: auto; font-weight: 700; }
.bar button { font: inherit; font-weight: 700; min-height: 44px; min-width: 44px; padding: .25em .8em; border: 3px solid var(--line); border-radius: .4em; background: var(--panel); color: var(--ink); cursor: pointer; }
.bar .next { background: var(--ink); color: var(--bg); }
.progress { position: fixed; top: 0; left: 0; width: 100%; height: 6px; background: var(--ink); transform-origin: left; transform: scaleX(0); transition: transform .2s; }
button:focus-visible { outline: 5px solid var(--ink); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) { .progress { transition: none; } }
@media (max-width: 700px) { :root { --fs: calc(4vmin * var(--scale)); } .pic-row { flex-direction: column; } .pic-row .pic { max-width: 100%; } }

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
  const store = (k, v) => { try { v === undefined ? null : localStorage.setItem(k, v); return localStorage.getItem(k); } catch (e) { return null; } };
  let i = Math.min(Math.max(parseInt(location.hash.slice(1), 10) - 1 || 0, 0), slides.length - 1);
  let scale = parseFloat(store('verbbook-scale')) || 1;
  const applyScale = () => root.style.setProperty('--scale', scale);
  const themeBtn = document.querySelector('[data-act="theme"]');
  const setTheme = t => { root.dataset.theme = t; themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark'; store('verbbook-theme', t); };
  setTheme(store('verbbook-theme') || 'light');
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
    bigger: () => { scale = Math.min(1.6, +(scale + .1).toFixed(1)); applyScale(); store('verbbook-scale', scale); },
    smaller: () => { scale = Math.max(.7, +(scale - .1).toFixed(1)); applyScale(); store('verbbook-scale', scale); },
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


if __name__ == "__main__":
    (HERE / "pocket-verb-book-slides.html").write_text(build())
