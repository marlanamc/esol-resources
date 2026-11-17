#!/usr/bin/env python3
"""Whiteboard game that checks the pocket verb book: Tue 11/17/26, end of class.

5 groups, a whiteboard for EVERY student. Verb books CLOSED. Each slide: everyone
writes, "1, 2, 3, boards up!" to check, then boards down and the teacher calls on a
random person in a group (not on the slides). Next shows the answer. It gets harder, level by level:
  1 Draw it      sentence -> draw the timeline stamp
  2 Write it     stamped timeline + subject + verb -> write the sentence
  3 Flip it      make it negative or a question
  4 Time clues   same verb, new time word -> the right form + the stamp
  5 Meaning      a meaning in words -> which card + your own sentence
  Final          only a timeline -> + / - / ?
The tally sheet (all / some / few boards right) shows where the book stuck and where it did not.

Timelines, stamps, colors and "Watch out!" lines come from build-pocket-verb-book.py,
and the slide shell from build-pocket-verb-book-slides.py, so it all matches the book.

    python3 build-verb-book-board-game.py
writes verb-book-board-game-slides.html and verb-book-board-game-tally.html + .pdf.
"""
import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.dont_write_bytecode = True
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


book = load("book", "build-pocket-verb-book.py")
deck = load("deck", "build-pocket-verb-book-slides.py")
CARD = {t["name"]: (i + 1, t) for i, t in enumerate(book.TENSES)}


def tl(card_name, reveal=True, clock=None):
    """The book's timeline with this card's stamp. reveal=True: the stamp is a Next step."""
    _, t = CARD[card_name]
    marks = book.stamp(*t["stamp"])
    if clock:
        x = book.element_x(t["stamp"][1], t["stamp"][2])
        marks += (f'<line x1="{x}" y1="32" x2="{x}" y2="60" stroke="#111" stroke-width="1.5"/>'
                  f'<text x="{x}" y="26" text-anchor="middle" font-size="11">{clock}</text>')
    return book.timeline(f'<g class="step">{marks}</g>' if reveal else marks)


def tag(card_name):
    n, t = CARD[card_name]
    return f'<b>Card {n}</b> &middot; {card_name} &middot; {deck.STAMP_WORDS[t["stamp"][0]][0]}'


def watch(card_name):
    return f'<p class="watch step"><b>Watch out!</b> {book.WATCH[card_name]}</p>'


S = deck.slide  # slide(cls, label, body, zone)


def kicker(level, n, of):
    return f'<p class="kicker"><span class="badge">{level}</span> Level {level} &middot; {LEVELS[level - 1][0]} &middot; {n} of {of}</p>'


LEVELS = [
    ("Draw it", "Read the sentence. <b>Draw the timeline.</b> Put the right stamp in the right place."),
    ("Write it", "Look at the timeline. <b>Write the sentence.</b> Use the person and the verb."),
    ("Flip it", "Make it <b>negative (&minus;)</b> or a <b>question (?)</b>."),
    ("Time clues", "Look at the <b>time word</b>. Write the verb. <b>Draw the stamp.</b>"),
    ("Meaning", "Read the meaning. Write the <b>card number</b> and <b>your own sentence</b>."),
]

# Level 1: (sentence, card, clock)
L1 = [("I am walking.", "Present continuous", None),
      ("I walked to the store yesterday.", "Past simple", None),
      ("I walk to the store every day.", "Present simple", None),
      ("I have walked in the snow.", "Present perfect", None)]
# Level 2: (card, clock, subject, verb, models, check)
L2 = [("Present simple", None, "she", "cook", ["She cooks dinner every day.", "She cooks on Sundays."],
       "she &rarr; V1<b>-s</b>: cook<b>s</b>"),
      ("Past continuous", "8:00", "they", "watch TV", ["They were watching TV at 8:00 last night."],
       "they &rarr; <b>were</b> + V-ing"),
      ("Present perfect", None, "he", "eat sushi", ["He has eaten sushi.", "He has eaten sushi two times."],
       "he &rarr; <b>has</b> + V3 (eat &middot; ate &middot; <b>eaten</b>)")]
# Level 3: (sentence, make, answer, card, watch out)
L3 = [("They went to the park.", "&minus;", "They <b>didn&rsquo;t go</b> to the park.", "Past simple",
       "After didn&rsquo;t, use V1: <s>didn&rsquo;t went</s> &rarr; didn&rsquo;t go"),
      ("She works on Sundays.", "?", "<b>Does</b> she <b>work</b> on Sundays?", "Present simple",
       "The -s moves to does: <s>Does she works?</s> &rarr; Does she work?"),
      ("She has seen the ocean.", "?", "<b>Has</b> she <b>seen</b> the ocean?", "Present perfect",
       "Move <b>has</b> to the front. Keep V3: <s>Has she saw?</s> &rarr; Has she seen?")]
# Level 4: (time word in the sentence, answer, card)
L4 = [("I ___ sushi <b>yesterday</b>.", "I <b>ate</b> sushi yesterday.", "Past simple"),
      ("I ___ sushi <b>two times</b>.", "I <b>have eaten</b> sushi two times.", "Present perfect"),
      ("I ___ sushi <b>right now</b>.", "I <b>am eating</b> sushi right now.", "Present continuous")]
# Level 5: (meaning, card, models)
L5 = [("A habit. It happens again and again.", "Present simple",
       ["I drink coffee every morning.", "My son plays soccer on Saturdays."]),
      ("In the middle of an action in the past.", "Past continuous",
       ["I was cooking at 7:00 last night.", "I was driving when you called."]),
      ("Before now. You <b>don&rsquo;t</b> say when. Connected to now.", "Present perfect",
       ["I have never seen snow.", "I have lived here for 3 years."])]
FINAL = ("Present perfect", "they", "visit New York",
         ["They <b>have visited</b> New York.", "They <b>haven&rsquo;t visited</b> New York.", "<b>Have</b> they <b>visited</b> New York?"])


def zone(card_name):
    return CARD[card_name][1]["zone"]


def level_intro(k):
    name, how = LEVELS[k - 1]
    return S("steps level", f"Level {k}: {name}", f"""<p class="kicker">Level {k} of 5</p>
<h1>{name}</h1>
<p class="sub">{how}</p>""")


def build():
    slides = [
        S("title", "Title", """<p class="kicker">Tuesday &middot; Whiteboard game</p>
<h1>See the time. Build the sentence.</h1>
<p class="sub">How well do you know your pocket verb book?</p>"""),
        S("steps", "How to play", """<h2>How to play</h2>
<ol><li><b>Close</b> your verb book.</li><li><b>Everyone</b> writes on a <b>whiteboard</b>. Talk with your group.</li>
<li>Teacher says <b>&ldquo;1, 2, 3, boards up!&rdquo;</b></li><li>Right = <b>1 point</b> for your group.</li></ol>"""),
    ]

    slides.append(level_intro(1))
    for n, (sent, card, clock) in enumerate(L1, 1):
        slides.append(S("card game", f"Level 1, {n}", f"""{kicker(1, n, len(L1))}
<p class="q">{sent}</p>
<p class="task">Draw the timeline.</p>
<div class="tl">{tl(card, clock=clock)}</div>
<p class="reveal-box step">{tag(card)}</p>""", zone(card)))

    slides.append(level_intro(2))
    for n, (card, clock, subj, verb, models, check) in enumerate(L2, 1):
        ms = " &middot; ".join(models)
        slides.append(S("card game", f"Level 2, {n}", f"""{kicker(2, n, len(L2))}
<div class="tl">{tl(card, reveal=False, clock=clock)}</div>
<p class="q who"><span>{subj}</span> + <span>{verb}</span></p>
<p class="reveal-box step">{tag(card)}<br>Example: <i>{ms}</i></p>
<p class="watch step"><b>Check:</b> {check}</p>""", zone(card)))

    slides.append(level_intro(3))
    for n, (sent, make, ans, card, wo) in enumerate(L3, 1):
        word = "a question" if make == "?" else "negative"
        slides.append(S("card game", f"Level 3, {n}", f"""{kicker(3, n, len(L3))}
<p class="q">{sent}</p>
<p class="task">Make it <b class="sym">{make}</b> {word}.</p>
<p class="q ans step">{ans}</p>
<p class="watch step"><b>Watch out!</b> {wo}</p>""", zone(card)))

    slides.append(level_intro(4))
    for n, (sent, ans, card) in enumerate(L4, 1):
        slides.append(S("card game", f"Level 4, {n}", f"""{kicker(4, n, len(L4))}
<p class="q">{sent} <span class="verb">(eat)</span></p>
<p class="task">Write the verb. Draw the stamp.</p>
<div class="tl">{tl(card)}</div>
<p class="reveal-box step">{ans} &nbsp;&middot;&nbsp; {tag(card)}</p>""", zone(card)))

    slides.append(level_intro(5))
    for n, (meaning, card, models) in enumerate(L5, 1):
        slides.append(S("card game", f"Level 5, {n}", f"""{kicker(5, n, len(L5))}
<p class="q meaning">&ldquo;{meaning}&rdquo;</p>
<p class="task">Which card? Write the <b>card number</b> + <b>your own sentence</b>.</p>
<div class="tl">{tl(card)}</div>
<p class="reveal-box step">{tag(card)}<br>Different groups, different sentences: <i>{" &middot; ".join(models)}</i></p>""", zone(card)))

    card, subj, verb, rows = FINAL
    lis = "".join(f'<li class="step"><b class="sym">{s}</b> {r}</li>' for s, r in zip(("+", "&minus;", "?"), rows))
    slides += [
        S("steps level", "Final round", """<p class="kicker">Final round &middot; 3 points</p>
<h1>Only a timeline</h1>
<p class="sub">Write <b>3 sentences</b>: <b>+</b> &nbsp; <b>&minus;</b> &nbsp; <b>?</b><br>1 point for each right sentence.</p>"""),
        S("card game", "Final round", f"""<p class="kicker"><span class="badge">!</span> Final round &middot; 3 points</p>
<div class="tl">{tl(card, reveal=False)}</div>
<p class="q who"><span>{subj}</span> + <span>{verb}</span> &nbsp;&rarr;&nbsp; <b>+ &nbsp; &minus; &nbsp; ?</b></p>
<ol class="three">{lis}</ol>
{watch(card)}""", zone(card)),
        S("title", "Done", """<p class="kicker">Game over!</p>
<h1>Open your book.</h1>
<p class="sub">Which card was hard for your group? Write one more sentence on the back of that card.</p>"""),
    ]
    total = len(slides)
    slides = [s.replace('" hidden>', f' ({k + 1} of {total})" hidden>', 1).replace(" hidden>", ">", 1 if k == 0 else 0)
              for k, s in enumerate(slides)]
    extra_css = """
.game { gap: .7em; }
.q { margin: 0; font-size: 2.6em; font-weight: 700; line-height: 1.2; }
.q.ans { color: var(--c); }
.q.meaning { font-size: 2.2em; }
.q.who span { border: 4px solid var(--c); border-radius: .3em; padding: 0 .3em; background: var(--cbg); }
.q .verb { font-weight: 400; color: var(--muted); }
.task { margin: 0; font-size: 1.5em; color: var(--muted); }
.sym { color: var(--c); font-size: 1.3em; }
.game .tl { max-height: 34vh; }
.level h1 { max-width: none; }
.level .sub { max-width: 34ch; font-size: 1.6em; }
.three { margin: 0; padding-left: 0; list-style: none; font-size: 1.9em; display: grid; gap: .2em; }
.three .sym { display: inline-block; width: 1.4em; }
"""
    html = deck.TEMPLATE.replace("{SLIDES}", "\n".join(slides))
    html = html.replace("<title>Pocket Verb Book Slides</title>", "<title>Verb Book Whiteboard Game</title>")
    return html.replace("</style>", extra_css + "</style>", 1)


def tally():
    cols = ([(f"1.{n}", s.split()[2] if n > 1 else "am walking") for n, (s, *_r) in enumerate(L1, 1)]
            + [(f"2.{n}", c[3]) for n, c in enumerate(L2, 1)]
            + [("3.1", "didn&rsquo;t go"), ("3.2", "Does&hellip;?"), ("3.3", "Has&hellip;?")]
            + [(f"4.{n}", t.split("<b>")[1].split("</b>")[0]) for n, (t, *_r) in enumerate(L4, 1)]
            + [(f"5.{n}", f"card {CARD[c][0]}") for n, (_m, c, _x) in enumerate(L5, 1)])
    cols[0] = ("1.1", "am walking")
    cols[1] = ("1.2", "walked")
    cols[2] = ("1.3", "walk")
    cols[3] = ("1.4", "have walked")
    lv = [len(L1), len(L2), len(L3), len(L4), len(L5)]
    head1 = "".join(f'<th colspan="{k}" class="lv">Level {i + 1}: {LEVELS[i][0]}</th>' for i, k in enumerate(lv))
    head2 = "".join(f"<th><b>{a}</b><span>{b}</span></th>" for a, b in cols)
    rows = "".join(f'<tr><td class="g">{g}</td>' + "<td></td>" * len(cols) + '<td></td><td class="tot"></td></tr>'
                   for g in "ABCDE")
    pct = '<tr class="pct"><td class="g">How many groups got it?</td>' + "<td>/5</td>" * len(cols) + "<td>/15</td><td></td></tr>"
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Verb Book Game Tally</title>
<style>
@page {{ size: letter landscape; margin: 0.4in; }}
* {{ box-sizing: border-box; }}
body {{ font-family: "Atkinson Hyperlegible", Arial, sans-serif; color: #111; margin: 0; font-size: 13px; }}
h1 {{ font-size: 22px; margin: 0 0 2px; }}
p {{ margin: 0 0 6px; }}
table {{ width: 100%; border-collapse: collapse; table-layout: fixed; }}
th, td {{ border: 1.5px solid #111; text-align: center; padding: 3px 2px; }}
th span {{ display: block; font-weight: normal; font-size: 10px; font-style: italic; }}
th.lv {{ background: #eee; font-size: 12px; }}
td {{ height: 0.82in; }}
td.g {{ font-size: 22px; font-weight: bold; width: 1.1in; }}
tr.pct td {{ height: 0.4in; font-size: 11px; color: #555; text-align: right; vertical-align: bottom; }}
tr.pct td.g {{ font-size: 11px; text-align: left; color: #111; font-weight: bold; vertical-align: middle; }}
.fin {{ width: 0.75in; }} .tot {{ width: 0.7in; }}
.notes {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 10px; }}
.notes div {{ border: 1.5px solid #111; border-radius: 6px; padding: 5px 8px; height: 1.25in; }}
</style></head><body>
<h1>Verb Book Whiteboard Game &middot; Tally</h1>
<p>Tue 11/17/26 &middot; At &ldquo;boards up,&rdquo; mark each group: <b>&#10003;</b> all / most boards right &middot; <b>~</b> some &middot; <b>&#10007;</b> few. Circle it if the person you called got it wrong. Final round: 0&ndash;3.</p>
<table>
  <tr><th rowspan="2" class="g">Group</th>{head1}<th rowspan="2" class="fin">Final<span>+ &minus; ?</span></th><th rowspan="2" class="tot">Total</th></tr>
  <tr>{head2}</tr>
  {rows}
  {pct}
</table>
<div class="notes">
  <div><b>Strong without the book</b> (most groups &#10003;):</div>
  <div><b>Some got it</b> (lots of ~):</div>
  <div><b>Reteach</b> (most groups &#10007;). Common errors:</div>
</div>
</body></html>"""


if __name__ == "__main__":
    (HERE / "verb-book-board-game-slides.html").write_text(build())
    t = HERE / "verb-book-board-game-tally.html"
    t.write_text(tally())
    out = t.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={out}", t.resolve().as_uri()], check=True, capture_output=True)
    print(out.name, subprocess.run(["pdfinfo", str(out)], capture_output=True, text=True).stdout.split("Pages:")[1].split()[0], "page(s)")
