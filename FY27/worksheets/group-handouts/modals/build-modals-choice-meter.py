#!/usr/bin/env python3
"""Build the Modals Choice Meter: a stand-up accordion book + situation cards to sort.

Different from the pocket verb book (stapled flip cards) and the conditionals book
(split pages): nothing is stapled. Two landscape sheets are taped end to end into one
long strip of 8 tall panels and folded zigzag, so the book stands up on the desk.
The panels run from green (you choose) to red (no choice), the same "How much choice
do you have?" line as the can-should-must phrase bank. Each panel has a word bank to build examples. Sheet 3 is 16 situation cards:
students stand the book up, put each card in front of the right panel, and say the
sentence ("You must wear a seatbelt.").

    python3 build-modals-choice-meter.py
writes modals-choice-meter.html (3 student sheets) and modals-choice-meter-key.html
(1 teacher page), plus PDFs if Chrome is found.
"""
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).parent

GREEN = ("#15803d", "#dcfce7", "YOU CHOOSE")
YELLOW = ("#a16207", "#fef9c3", "GOOD IDEA?")
RED = ("#b91c1c", "#fee2e2", "NO CHOICE")

# Panels 2-8, left to right: most choice to no choice
PANELS = [
    {"word": "can", "level": GREEN, "lights": 1,
     "meaning": "It's possible. It's OK. I am able.",
     "examples": ["I <b>can</b> speak Spanish.", "You <b>can</b> park here after 6."],
     "forms": "<b>?</b> <b>Can</b> I sit here?",
     "card_id": "can",
     "who": "I · My son · We", "do": "speak 2 languages · drive · cook rice · fix a phone", "when": "at work · on the weekend · very well", "ask": "Can you ___?"},
    {"word": "may", "level": GREEN, "lights": 1,
     "meaning": "Polite: Is it OK? Use it with a teacher, a boss, or a doctor.",
     "examples": ["<b>May</b> I leave early today?", "Yes, you <b>may</b>."],
     "forms": "<b>may</b> is more polite than <b>can</b>.",
     "card_id": "may",
     "who": "I · we · my son", "do": "leave early · ask a question · come in · use your pen", "when": "today · now · please", "ask": "May I ___?"},
    {"word": "don't have to", "level": GREEN, "lights": 1,
     "meaning": "Not needed. You choose. It's OK to do it, and OK not to do it.",
     "examples": ["I <b>don't have to</b> work on Sunday.", "She <b>doesn't have to</b> pay for the bus."],
     "forms": "he / she / it: <b>doesn't have to</b>",
     "card_id": "dont",
     "who": "I · My wife (doesn't) · We", "do": "work · cook · pay · wake up early", "when": "on Sunday · today · for the bus", "ask": "Do you have to ___?"},
    {"word": "should<br>shouldn't", "level": YELLOW, "lights": 2,
     "meaning": "Advice. <b>should</b> = a good idea. <b>shouldn't</b> = a bad idea.",
     "examples": ["You <b>should</b> see a doctor.", "You <b>shouldn't</b> click strange links."],
     "forms": "<b>?</b> <b>Should</b> I call back?",
     "card_id": "should",
     "who": "You · My friend · Kids", "do": "drink water · sleep 8 hours · click strange links · call the doctor", "when": "every day · at night · if you feel sick", "ask": "What should I do if ___?"},
    {"word": "have to<br>has to", "level": RED, "lights": 3,
     "meaning": "Required. Your job, your school, or your landlord says so.",
     "examples": ["I <b>have to</b> wear a uniform.", "He <b>has to</b> pay rent on the 1st."],
     "forms": "<b>?</b> <b>Do</b> I <b>have to</b> sign here?",
     "card_id": "have",
     "who": "I · My husband (has to) · We", "do": "wear a uniform · pay rent · take medicine · clock in", "when": "every day · on the 1st · at 8:00", "ask": "Do you have to ___ at work?"},
    {"word": "must", "level": RED, "lights": 3,
     "meaning": "A strong rule. Often the law or a safety rule.",
     "examples": ["You <b>must</b> wear a seatbelt.", "Workers <b>must</b> wash their hands."],
     "forms": "Signs and forms use <b>must</b>.",
     "card_id": "must",
     "who": "You · Drivers · Workers · Tenants", "do": "wear a seatbelt · wash your hands · stop at a red light · show your ID", "when": "in the car · at work · at the bank", "ask": "What must you do at work?"},
    {"word": "must not<br>can't", "level": RED, "lights": 3,
     "meaning": "Never do it. It's not allowed.",
     "examples": ["You <b>must not</b> smoke here.", "You <b>can't</b> park here."],
     "forms": "",
     "watch": "<b>must not</b> ≠ <b>don't have to</b><br>must not = NO! · don't have to = you choose",
     "card_id": "not",
     "who": "You · Kids · Tenants", "do": "smoke · park · text and drive · have a pet", "when": "here · in the hospital · in the building", "ask": "What can't you do at work?"},
]

# Situation cards: (text, panel it best fits, other answers that also work)
CARDS = [
    ("wear a seatbelt in the car", "must", "have to"),
    ("smoke in the hospital", "must not / can't", ""),
    ("pay rent on the 1st of the month", "have to", "must"),
    ("see a doctor if your cough doesn't stop", "should", ""),
    ("eat a lot of sugar", "shouldn't", ""),
    ("work on Sunday<br><i>(Your job is Monday–Friday.)</i>", "don't have to", ""),
    ("bring lunch<br><i>(Lunch is free at work today.)</i>", "don't have to", ""),
    ("ask the teacher: leave class early", "May I…?", "Can I…?"),
    ("speak two languages", "can", ""),
    ("wear a uniform at work", "have to", "must"),
    ("have a dog<br><i>(The lease says: No pets.)</i>", "can't / must not", ""),
    ("show your ID at the bank", "have to", "must"),
    ("drink more water", "should", ""),
    ("share your PIN with a stranger", "must not / shouldn't", ""),
    ("", "", ""),
    ("", "", ""),
]

CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #000; background: #fff;
         font-size: 12px; line-height: 1.3; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; }
                  .sheet { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter landscape; margin: 0; } }
  .sheet { width: 11in; height: 8.5in; overflow: hidden; display: flex; position: relative; page-break-after: always; break-after: page; }

  /* Accordion panels: 4 per sheet, folded zigzag on the dashed lines */
  .panel { width: 2.75in; height: 8.5in; flex: none; position: relative; padding: 0.3in 0.16in 0.3in; display: flex; flex-direction: column; gap: 7px; }
  .panel + .panel { border-left: 1.5px dashed #000; }
  .panel + .panel::before { content: "fold"; position: absolute; top: 4.1in; left: -13px; writing-mode: vertical-rl; background: #fff; font-size: 10px; padding: 3px 0; color: #333; }
  .panel:first-child { padding-left: 0.3in; }
  .panel:last-child { padding-right: 0.3in; }
  .edge-note { position: absolute; top: 0.08in; font-size: 9px; color: #444; }

  .lvl { --c: #000; --bg: #fff; }
  .light { background: var(--c); color: #fff; border-radius: 7px; padding: 5px 8px; display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: bold; letter-spacing: 0.8px; }
  .light .dots { display: flex; gap: 3px; margin-left: auto; }
  .light .dots span { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid #fff; }
  .light .dots span.on { background: #fff; }
  .word { font-size: 34px; font-weight: bold; color: var(--c); line-height: 1.02; min-height: 0.75in; display: flex; align-items: flex-end; }
  .word.small { font-size: 27px; }
  .meaning { background: var(--bg); border: 2px solid var(--c); border-radius: 7px; padding: 5px 8px; font-size: 13px; line-height: 1.3; }
  .examples { display: flex; flex-direction: column; gap: 3px; font-size: 13px; }
  .examples div::before { content: "▸ "; color: var(--c); }
  .examples b, .forms b, .meaning b { color: var(--c); }
  .forms { font-size: 12px; color: #222; }
  .watch { border: 1.5px dashed var(--c); border-radius: 6px; padding: 4px 7px; font-size: 11.5px; background: var(--bg); }
  .mine { font-size: 12px; font-weight: bold; margin-top: 2px; }
  .wl { display: block; height: 0.36in; border-bottom: 1.5px solid #000; flex: none; }
  .build { flex: none; border: 2px solid var(--c); border-radius: 8px; padding: 5px 8px; display: flex; flex-direction: column; gap: 4px; font-size: 12px; line-height: 1.3; }
  .build h4 { font-size: 12px; color: var(--c); }
  .build .row { border-top: 1px solid #ccc; padding-top: 3px; }
  .build .row b { display: block; font-size: 10px; letter-spacing: 1px; color: #444; }
  .build .row.modal span { font-weight: bold; color: var(--c); }
  .build .tip { font-size: 10.5px; color: #333; border-top: 1px solid #ccc; padding-top: 3px; }
  .ask { font-size: 12px; } .ask b { color: var(--c); }
  .cards-here { border-top: 3px solid var(--c); padding-top: 3px; text-align: center; font-size: 11px; font-weight: bold; color: var(--c); }

  /* Cover panel */
  .eyebrow { font-size: 9px; letter-spacing: 2px; color: #555; }
  .title { font-size: 30px; line-height: 1.02; }
  .subtitle { font-size: 13px; }
  .meter { display: flex; flex-direction: column; gap: 4px; }
  .meter > div { border-radius: 6px; padding: 4px 8px; color: #fff; font-weight: bold; font-size: 12px; letter-spacing: 0.5px; background: var(--c); }
  .meter span { display: block; font-weight: normal; font-size: 12px; letter-spacing: 0; }
  .meter-arrow { font-size: 10px; color: #444; text-align: center; }
  .rule { border: 2px solid #000; border-radius: 7px; padding: 5px 8px; font-size: 12px; line-height: 1.35; }
  .rule h3 { font-size: 13px; margin-bottom: 2px; }
  .rule s { text-decoration-thickness: 2px; }
  .name { font-size: 13px; font-weight: bold; }
  .make { font-size: 10.5px; line-height: 1.3; margin-top: auto; border-top: 1.5px solid #000; padding-top: 4px; }
  .make ol { padding-left: 14px; }

  /* Situation cards: 4 x 4, cut on the solid lines */
  .cards { display: grid; grid-template-columns: repeat(4, 2.75in); grid-template-rows: repeat(4, 2.125in); }
  .card { border-right: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 0.3in 0.25in 0.15in; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; position: relative; }
  .card:nth-child(4n) { border-right: none; }
  .card:nth-child(n+13) { border-bottom: none; padding-bottom: 0.3in; }
  .card .t { font-size: 17px; font-weight: bold; line-height: 1.2; }
  .card .t i { font-weight: normal; font-size: 12px; font-style: normal; color: #333; }
  .card .n { position: absolute; top: 0.12in; left: 0.15in; font-size: 9px; color: #666; }
  .card:nth-child(4n+1) .n { left: 0.3in; }
  .card:nth-child(-n+4) .n { top: 0.3in; }
  .card .who { font-size: 11px; color: #444; }
  .card .wl { width: 100%; height: 0.32in; }
  .card .cut { position: absolute; right: 4px; bottom: 2px; font-size: 9px; }

  /* Teacher key (portrait) */
  .key { width: 8.5in; height: 11in; padding: 0.5in 0.55in; display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
  @media print { .key-doc { } }
  .key h1 { font-size: 22px; }
  .key h2 { font-size: 16px; border-bottom: 2px solid #000; padding-bottom: 2px; margin-top: 4px; }
  .key table { border-collapse: collapse; width: 100%; }
  .key td, .key th { border: 1px solid #000; padding: 3px 7px; text-align: left; font-size: 12.5px; }
  .key th { background: #eee; }
  .key ol { padding-left: 20px; display: flex; flex-direction: column; gap: 5px; }
"""


def lights(level, n):
    dots = "".join(f'<span class="{"on" if i < n else ""}"></span>' for i in range(3))
    return f'<div class="light">{level[2]}<span class="dots">{dots}</span></div>'


def style(level):
    return f'style="--c:{level[0]};--bg:{level[1]}"'


def plain(word):
    return word.replace("<br>", " / ")


def panel(p):
    lv = p["level"]
    small = " small" if "<br>" in p["word"] or len(p["word"]) > 8 else ""
    ex = "".join(f"<div>{e}</div>" for e in p["examples"])
    forms = f'<div class="forms">{p["forms"]}</div>' if p["forms"] else ""
    watch = f'<div class="watch">{p["watch"]}</div>' if p.get("watch") else ""
    return f"""<div class="panel lvl" {style(lv)}>
    {lights(lv, p["lights"])}
    <div class="word{small}">{p["word"]}</div>
    <div class="meaning">{p["meaning"]}</div>
    <div class="examples">{ex}</div>
    {forms}{watch}
    <div class="build"><h4>Build an example</h4>
      <div class="row"><b>WHO?</b>{p["who"]}</div>
      <div class="row modal"><b>MODAL</b><span>{plain(p["word"])}</span></div>
      <div class="row"><b>DO WHAT? (V1)</b>{p["do"]}</div>
      <div class="row"><b>WHERE? WHEN?</b>{p["when"]}</div>
      <div class="tip">Pick one from each row. Change words to make it true for you.</div></div>
    <div class="mine">My sentences:</div><span class="wl"></span><span class="wl"></span><span class="wl"></span>
    <div class="ask" style="margin-top:8px"><b>Ask a partner:</b> {p["ask"]}</div><div class="mine" style="font-weight:normal">My partner said:</div><span class="wl"></span>
    <div class="cards-here">▼ cards here ▼</div>
  </div>"""


def cover():
    meter = "".join(f'<div style="--c:{c}">{label}<span>{words}</span></div>' for c, label, words in [
        (GREEN[0], "YOU CHOOSE", "can · may · don't have to"),
        (YELLOW[0], "GOOD IDEA?", "should · shouldn't"),
        (RED[0], "NO CHOICE", "have to · must · must not · can't"),
    ])
    return f"""<div class="panel">
    <div><div class="eyebrow">MY ENGLISH TOOLKIT</div><div class="title">The<br>Choice<br>Meter</div></div>
    <div class="subtitle"><b>Modals:</b> How much choice do you have?</div>
    <div class="meter">{meter}</div>
    <div class="rule"><h3>Modal + V1</h3>No <b>to</b>. No <b>-s</b>.<br>She <b>can</b> drive.<br><s>She can to drive.</s> <s>She cans drive.</s><br>
      <b>Only</b> have to changes:<br>I <b>have to</b> · she <b>has to</b></div>
    <div class="rule"><h3>Questions: the modal goes first</h3><span style="font-size:10.5px">(have to uses <b>do</b>)</span><br><b>Can</b> I park here?<br><b>May</b> I come in?<br><b>Should</b> I call back?<br><b>Do</b> I <b>have to</b> pay now?<br><s>Do you can help me?</s></div>
    <div class="name">Name:<span class="wl"></span></div>
    <div class="make"><b>Make it:</b><ol><li>Tape sheet 2 to the right side of sheet 1 (on the back).</li>
      <li>Fold on every dashed line: in, out, in, out.</li><li>Stand it up. Sort the cards!</li></ol></div>
  </div>"""


def sheet(panels, note_left="", note_right=""):
    return f'<div class="sheet">{"".join(panels)}{note_left}{note_right}</div>'


def build_student():
    ps = [cover()] + [panel(p) for p in PANELS]
    s1 = sheet(ps[:4], note_right='<span class="edge-note" style="right:0.3in">sheet 1 · tape sheet 2 here →</span>')
    s2 = sheet(ps[4:], note_left='<span class="edge-note" style="left:0.3in">← sheet 2 · tape to sheet 1</span>')
    cards = []
    for i, (text, _, _) in enumerate(CARDS):
        if text:
            body = f'<div class="t">{text}</div><div class="who">Who? I · you · he · she · we · they</div>'
        else:
            body = '<div class="t">Your own:</div><span class="wl"></span><span class="wl"></span>'
        cards.append(f'<div class="card"><span class="n">{i + 1}</span>{body}</div>')
    s3 = f'<div class="sheet"><div class="cards">{"".join(cards)}</div></div>'
    return doc("Modals Choice Meter", s1 + s2 + s3)


def build_key():
    rows = "".join(f"<tr><td>{i + 1}</td><td>{t.replace('<br>', ' ').replace('<i>', '').replace('</i>', '')}</td><td><b>{a}</b></td><td>{b}</td></tr>"
                   for i, (t, a, b) in enumerate(CARDS) if t)
    return doc("Modals Choice Meter Key", f"""<div class="key">
  <h1>The Choice Meter · Teacher Page</h1>
  <p>Print the 3 student sheets <b>landscape, one-sided, in color</b>. Sheets 1–2 are the accordion; sheet 3 is the cards (one cutter pass: 3 cuts each way).</p>
  <h2>Put it together (about 5 minutes)</h2>
  <ol><li>Lay sheet 1 and sheet 2 face up, side by side. Put tape on the back where they meet. The panels go cover, can, may, don't have to, should, have to, must, must not.</li>
    <li>Fold on every dashed line, zigzag (in, out, in, out). It stands up like a fence.</li>
    <li>Cut out the 16 cards. Write a name or initials on the back.</li></ol>
  <h2>Games</h2>
  <ol><li><b>Sort it.</b> Stand the book up. Put each card in front of a panel and say the sentence: <i>You must wear a seatbelt.</i> Pick a subject for each card: I, you, she…</li>
    <li><b>Argue it.</b> Partners compare. Different panel? Explain why. Some cards fit two panels (see the right column), and that's good talk.</li>
    <li><b>Blank cards.</b> Each student writes a rule from their own life: work, home, the clinic, their country. The partner sorts it.</li>
    <li><b>True or false?</b> Use the "Build an example" box on each panel. Write one true sentence and one false sentence about you. Your partner guesses: <i>I have to wear a uniform. False!</i></li></ol>
  <h2>Card answers</h2>
  <table><tr><th>#</th><th>Card</th><th>Best panel</th><th>Also OK</th></tr>{rows}</table>
  <p><b>Talk point:</b> card 14 (share your PIN) is <b>must not</b> as a bank rule and <b>shouldn't</b> as advice. Both are fine. <b>don't have to</b> is wrong, and that is the big mix-up to watch for.</p>
</div>""", key=True)


def doc(title, body, key=False):
    page = "@page { size: letter portrait; margin: 0; }" if key else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>{CSS}
  @media print {{ {page} }}
  {".key { background: #fff; margin: 0 auto; }" if key else ""}</style>
</head>
<body>
{body}
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
    for name, html in [("modals-choice-meter.html", build_student()), ("modals-choice-meter-key.html", build_key())]:
        path = HERE / name
        path.write_text(html)
        print(f"wrote {name}")
        pdf(path)
