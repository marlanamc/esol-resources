#!/usr/bin/env python3
"""Build a 2-page catch-up guide for students who missed the pocket verb book class.

Front: what is on every card + card 1 (Present simple). Back: cards 2 and 3 (Past
simple, Future simple). Card 4 (Present continuous) is taught in class, so the guide
stops at card 3. Answers, timelines, example sentences and "Watch out!" lines all come
from build-pocket-verb-book.py and build-pocket-verb-book-slides.py, so the guide always
matches the cards and the class slides.

    python3 build-pocket-verb-book-catch-up.py
writes pocket-verb-book-catch-up.html and .pdf next to this file (needs Google Chrome).
"""
import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.dont_write_bytecode = True
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DUE = "Thursday, November 12"


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


book = load("book", "build-pocket-verb-book.py")
slides = load("slides", "build-pocket-verb-book-slides.py")

COLORS = {"past": book.AMBER_700, "present": book.EMERALD_700, "future": book.BLUE_700}
BGS = {"past": book.AMBER_100, "present": book.EMERALD_100, "future": book.BLUE_100}


def card(i):
    t = book.TENSES[i]
    name, zone = t["name"], t["zone"]
    shape, means = slides.STAMP_WORDS[t["stamp"][0]]
    cols = [(f, reg, irr) for (f, reg), irr in zip(t["forms"], book.IRREGULAR[name])]
    rows = "".join(
        f'<tr><th>{label}</th>' + "".join(f"<td>{book.emphasize(c[k])}</td>" for c in cols) + "</tr>"
        for k, label in enumerate(("Formula", "Regular <span>e.g. work</span>", "Irregular <span>e.g. eat</span>")))
    third = (f'<p class="row"><b>he / she / it:</b> {book.emphasize(t["third"])}</p>' if t.get("third") else "")
    models = " &middot; ".join(slides.MODELS[name])
    return f"""
<section class="card" style="--c:{COLORS[zone]};--bg:{BGS[zone]}">
  <h2><span class="num">{i + 1}</span>{name}</h2>
  <div class="top">
    <div>
      <p class="row"><b>Meaning:</b> {t["use"]}</p>
      <p class="row"><b>Helpful time clues:</b> {t["words"]}</p>
      <p class="row"><b>Draw when:</b> <i>{book.PROMPTS[i]}</i><br><b>Stamp:</b> {shape}. {means}</p>
    </div>
    <div class="tl">{book.timeline(book.stamp(*t["stamp"]))}</div>
  </div>
  <table>
    <tr><th></th><th>+ Affirmative</th><th>&minus; Negative</th><th>? Question</th></tr>
    {rows}
  </table>
  {third}
  <p class="row"><b>My sentence:</b> <b>your own idea</b>, true about <b>your</b> life. Different people, different sentences: <span class="models">{models}</span></p>
  <p class="watch"><b>Watch out!</b> {book.WATCH[name]}</p>
</section>"""


STAMPS = "".join(
    f'<div class="st">{book.mini(k, z, p, x0)}<b>{title}</b><span>{sub}</span></div>'
    for k, z, p, x0, title, sub in [
        ("single-dot", "past", 40, 34, "An event", "at a point in time"),
        ("multiple-dots", "present", 50, 155, "A routine", "again and again"),
        ("solid-line", "present", 50, 155, "In progress", "in the middle of it"),
        ("arc", "past", 50, 88, "Connected to now", "before now + now"),
    ])

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
@page { size: letter; margin: 0.4in 0.5in; }
body { font-family: "Atkinson Hyperlegible", Arial, sans-serif; color: #111; font-size: 14.5px; line-height: 1.34;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { height: 10.15in; display: flex; flex-direction: column; gap: 9px; overflow: hidden; break-after: page; }
.page:last-child { break-after: auto; }
header { border-bottom: 2.5px solid #111; padding-bottom: 5px; display: flex; justify-content: space-between; align-items: end; }
header h1 { font-size: 28px; line-height: 1.1; }
header .name { font-size: 13px; }
header .name span { display: inline-block; width: 2.1in; border-bottom: 1px solid #111; }
.hello { font-size: 16px; }
.box { border: 1.5px solid #111; border-radius: 8px; padding: 7px 10px; }
.box h3 { font-size: 16px; margin-bottom: 3px; }
.todo { display: flex; gap: 18px; font-size: 16px; font-weight: bold; margin-top: 2px; }
.todo .stop { font-weight: normal; }
.cb { display: inline-block; width: 14px; height: 14px; border: 2px solid #111; border-radius: 3px; vertical-align: -2px; margin-right: 4px; }
ol.parts { padding-left: 18px; columns: 2; column-gap: 18px; }
ol.parts li { margin-bottom: 2px; }
.stamps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 3px; }
.st { display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 13px; }
.st svg { width: 96px; height: 46px; }
.st span { color: #444; }
.verbs { font-size: 14px; margin-top: 4px; }
.card { border: 2px solid var(--c); border-radius: 10px; overflow: hidden; }
.card h2 { background: var(--c); color: #fff; font-size: 20px; padding: 5px 12px; display: flex; align-items: center; gap: 8px; }
.card .num { display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #fff; color: var(--c); font-size: 15px; }
.card > *:not(h2) { margin: 6px 12px; }
.top { display: grid; grid-template-columns: 1fr 2.9in; gap: 10px; align-items: center; }
.tl svg { width: 100%; height: auto; display: block; }
.row { margin-bottom: 3px; }
table { border-collapse: collapse; width: calc(100% - 24px); font-size: 14px; }
th, td { border: 1px solid #999; padding: 4px 7px; text-align: left; vertical-align: top; }
tr:first-child th { background: var(--bg); }
th span { font-weight: normal; color: #444; font-size: 12px; display: block; }
.models { font-style: italic; }
.watch { background: #fff6d6; border-radius: 6px; padding: 3px 8px; }
.end { margin-top: auto; border: 2px dashed #111; border-radius: 8px; padding: 10px 14px; font-size: 16px; }
"""


def build():
    page1 = f"""<div class="page">
  <header><h1>Catch up: My Pocket Verb Book</h1><div class="name">Name: <span></span></div></header>
  <p class="hello">You missed the class. No problem! Use this paper to fill in <b>cards 1, 2, and 3</b>. Bring your book on <b>{DUE}</b>. In class, we start <b>card 4</b> together.</p>
  <div class="box">
    <h3>Every card has 5 parts. You write everything.</h3>
    <ol class="parts">
      <li><b>Meaning</b>: what is it for?</li>
      <li><b>Helpful time clues</b>: words like <i>yesterday</i></li>
      <li><b>Timeline</b>: draw the stamp (look at the cover)</li>
      <li><b>Chart</b>: + &minus; ? &nbsp;Pick <b>your own verbs</b>: 1 regular, 1 irregular. Our example: <i>work</i>, <i>eat</i>.</li>
      <li><b>My sentence</b>: a true sentence about <b>you</b></li>
    </ol>
    <p class="verbs"><b>The back of each card is for you:</b> more sentences, new verbs, notes in your language.</p>
    <div class="stamps">{STAMPS}</div>
    <p class="verbs"><b>Verb ideas.</b> Regular (V2 = -ed): work, cook, clean, call, watch, visit. Irregular: eat &middot; ate &middot; eaten, go &middot; went &middot; gone, drink &middot; drank &middot; drunk, buy &middot; bought &middot; bought.</p>
  </div>
  {card(0)}
  <div class="todo"><span><span class="cb"></span>Card 1</span><span><span class="cb"></span>Card 2</span><span><span class="cb"></span>Card 3</span><span class="stop">Cards 2 and 3 are on the back. &rarr;</span></div>
</div>"""
    page2 = f"""<div class="page">
  {card(1)}
  {card(2)}
  <div class="end"><b>Stop after card 3.</b> Don&rsquo;t do card 4 yet. We do <b>Present continuous</b> together in class. Bring your book on <b>{DUE}</b>!<br>Questions? Ask me before class.</div>
</div>"""
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Pocket Verb Book: Catch Up</title>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{page1}{page2}</body></html>"""


if __name__ == "__main__":
    html = HERE / "pocket-verb-book-catch-up.html"
    html.write_text(build())
    out = html.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000",
                    f"--print-to-pdf={out}", html.resolve().as_uri()], check=True, capture_output=True)
    pages = subprocess.run(["pdfinfo", str(out)], capture_output=True, text=True).stdout
    print(out.name, [l for l in pages.splitlines() if l.startswith("Pages")])
