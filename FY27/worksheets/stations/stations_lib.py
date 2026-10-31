"""Shared pieces for the Tuesday station packets (Week 9 onward).

Each week has a build script (weekNN/build-weekN-stations.py) that writes:
  packet, packet-key, leader-guide, real-world-document, real-world-self-check
The packet and key come from the same source: write each answer once with
P.b() / P.ln() / P.circ() / P.cb(); students see a blank, the key shows it in red.
Layout and type scale copy the Week 8 packet (hand-built, in week08/).
"""
import subprocess
from pathlib import Path

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONT_LINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
             '<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">')

PACKET_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 16px;
    line-height: 1.4;
  }
  /* One .page = one portrait letter page. Print double-sided, staple top left.
     Page 1 cover; spreads 2-3 warm-up, 4-5 speak, 6-7 read,
     pages 8-9 real world; page 10 early-finisher verb charts. */
  .page {
    width: 8.5in;
    height: 11in;
    padding: 0.45in 0.55in;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  @media screen {
    body { background: #e6e6e6; padding: 24px 0; }
    .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
  }
  @media print {
    @page { size: letter portrait; margin: 0; }
  }

  /* Type scale (print floor): 28 / 22 / 18 / 16 / 14 */
  .station-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #000;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }
  .station-bar .label { font-size: 28px; font-weight: bold; letter-spacing: 1px; }
  .station-bar .label span { font-size: 16px; font-weight: normal; letter-spacing: 0; margin-left: 8px; }
  .station-bar .pg { font-size: 14px; white-space: nowrap; }
  h2 { font-size: 22px; margin-bottom: 4px; }
  h3 { font-size: 18px; margin-bottom: 4px; }
  .task { margin-bottom: 14px; }
  .how { font-size: 16px; margin-bottom: 8px; }
  .example { font-size: 16px; margin-bottom: 8px; font-style: italic; }
  .small { font-size: 14px; }
  .bank { border: 1.5px solid #000; padding: 6px 10px; margin-bottom: 8px; font-size: 16px; }
  .bank span { white-space: nowrap; margin-right: 14px; }
  ol.items { list-style: none; }
  ol.items li { font-size: 18px; margin-bottom: 9px; }
  ol.items li b.n { display: inline-block; width: 1.6em; }
  .blank { display: inline-block; border-bottom: 1.5px solid #000; min-width: 1.6in; height: 1.1em; vertical-align: bottom; }
  .blank.short { min-width: 0.6in; }
  .blank.long { min-width: 3in; }
  .line { border-bottom: 1.5px solid #000; height: 28px; }
  .line + .line { margin-top: 2px; }
  .tip { border: 1.5px dashed #000; padding: 8px 12px; font-size: 16px; }
  .bottom { margin-top: auto; }
  .pass { font-size: 14px; font-style: italic; }

  /* ---------- Cover ---------- */
  .cover-title { font-size: 40px; font-weight: bold; line-height: 1.1; }
  .cover-sub { font-size: 20px; margin-bottom: 14px; }
  .name-row { font-size: 20px; display: flex; gap: 16px; margin-bottom: 18px; }
  .name-row .blank { flex: 1; }
  table.rotation { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.rotation th, table.rotation td { border: 2px solid #000; padding: 10px 6px; text-align: center; font-size: 18px; font-weight: bold; }
  table.rotation th { font-size: 16px; }
  table.rotation td.g { font-size: 22px; width: 15%; }
  .stations { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .stations > div { border: 2px solid #000; padding: 10px 12px; }
  .stations .nm { font-size: 22px; font-weight: bold; }
  .stations .who { font-size: 16px; }
  .stations .pp { font-size: 14px; }
  ul.rules { padding-left: 1.2em; font-size: 18px; }
  ul.rules li { margin-bottom: 6px; }

  /* ---------- Warm-up ---------- */
  /* Page 3 holds Parts 4-6: tighter spacing so the paragraph lines fit */
  .wu3 .task { margin-bottom: 10px; }
  .wu3 ol.items li { margin-bottom: 6px; }
  .wu3 table.forms td { height: 36px; }
  .own { border: 1.5px dashed #000; padding: 5px 10px; font-size: 16px; margin-bottom: 8px; }
  .own .u { text-decoration: underline; font-style: italic; }
  .starters { display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; row-gap: 2px; }
  .starters span { white-space: normal; margin: 0; }
  .circ { display: inline-block; border: 1.5px solid #000; border-radius: 50%; width: 1.4em; height: 1.4em; line-height: 1.3em; text-align: center; font-style: normal; }
  table.forms { width: 100%; border-collapse: collapse; }
  table.forms th, table.forms td { border: 1.5px solid #000; padding: 6px; text-align: center; }
  table.forms th { font-size: 16px; }
  table.forms th small { display: block; font-size: 14px; font-weight: normal; }
  table.forms td { font-size: 18px; height: 44px; }
  table.forms td.base { font-weight: bold; }

  /* ---------- Speak ---------- */
  .mouths { display: flex; gap: 12px; margin-bottom: 12px; }
  .mouth { flex: 1; border: 2px solid #000; padding: 8px 12px; display: flex; gap: 12px; align-items: center; }
  .mouth svg { width: 92px; height: 92px; flex: none; }
  .mouth .big { font-size: 40px; font-weight: bold; line-height: 1; }
  .mouth p { font-size: 16px; }
  table.pairs { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.pairs td { border: 1.5px solid #000; padding: 6px 10px; font-size: 20px; text-align: center; }
  table.pairs td.n { font-size: 16px; font-weight: bold; width: 8%; }
  table.pairs td small { display: block; font-size: 14px; }
  ol.read-aloud { padding-left: 1.4em; }
  ol.read-aloud li { font-size: 20px; margin-bottom: 8px; }

  /* ---------- Read ---------- */
  .story .words { margin-bottom: 12px; line-height: 1.3; padding: 6px 12px; }
  .wgrid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 2px; margin-top: 2px; }
  .paras { counter-reset: para; }
  .paras p { counter-increment: para; position: relative; padding-left: 30px; font-size: 17px; line-height: 1.42; margin-bottom: 9px; }
  .paras p::before { content: counter(para); position: absolute; left: 0; top: 1px; width: 21px; height: 21px; border: 1.5px solid #000; border-radius: 50%; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center; }
  .words { border: 1.5px solid #000; padding: 8px 12px; font-size: 16px; }
  /* Page 7 (reading questions) is dense: tighter spacing so nothing reaches the printer margin */
  .rd .task { margin-bottom: 8px; }
  .rd ol.items li { font-size: 17px; margin-bottom: 5px; }
  .rd .line { height: 24px; }
  .rd .how { margin-bottom: 4px; }
  .key { display: flex; gap: 10px; font-size: 16px; margin-bottom: 6px; }
  .key div { border: 1.5px solid #000; padding: 4px 10px; flex: 1; }

  /* ---------- Real world questions (dense page: slightly tighter spacing) ---------- */
  .rw .task { margin-bottom: 10px; }
  .rw ol.items li { font-size: 17px; margin-bottom: 6px; }
  .rw .how { margin-bottom: 5px; }
  .rw h2 { font-size: 20px; margin-bottom: 2px; }
  table.pick { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  table.pick th { font-size: 14px; border: 1.5px solid #000; padding: 4px; }
  table.pick td { border: 1.5px solid #000; padding: 6px 8px; font-size: 16px; height: 40px; }
  table.pick td.t { width: 30%; font-weight: bold; white-space: nowrap; }
  table.pick td.c { width: 20%; text-align: center; white-space: nowrap; }
  .call { border: 1.5px solid #000; padding: 8px 14px; }
  .call p { font-size: 16px; line-height: 1.5; margin-bottom: 4px; }
  .call .blank { height: 1.2em; }
  .cb { display: inline-block; width: 16px; height: 16px; border: 1.5px solid #000; vertical-align: middle; }
  table.tf { width: 100%; border-collapse: collapse; }
  table.tf td { border: 1.5px solid #000; padding: 3px 8px; font-size: 16px; }
  table.tf td.c { width: 1in; text-align: center; font-size: 14px; white-space: nowrap; }
  table.tf th { font-size: 14px; border: 1.5px solid #000; padding: 4px; }
  .script { border: 1.5px solid #000; padding: 6px 12px; font-size: 17px; line-height: 2; }

  /* ---------- Tense charts (page 10) ---------- */
  .vc .task { margin-bottom: 10px; }
  .vc h2 { font-size: 20px; margin-bottom: 2px; }
  .vc .how { font-size: 15px; margin-bottom: 4px; }
  .vc-meta { display: flex; gap: 28px; font-size: 16px; margin-bottom: 4px; }
  table.forms5 { width: 100%; border-collapse: collapse; margin-bottom: 6px; table-layout: fixed; }
  table.forms5 th, table.forms5 td { border: 1.5px solid #000; text-align: center; padding: 2px 4px; font-size: 15px; }
  table.forms5 th { background: #eee; }
  table.forms5 td { height: 28px; }
  table.tense { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.tense.write td { height: 40px; }
  table.tense th:first-child { width: 22%; }
  table.tense th, table.tense td { border: 1.5px solid #000; padding: 2px 6px; font-size: 15px; text-align: center; height: 31px; }
  table.tense th { background: #eee; }
  table.tense td.tn { text-align: left; font-weight: bold; white-space: nowrap; }
  table.tense td { white-space: nowrap; }
  .hb.sm { width: 0.42in; }
  table.forms5 td.ex { background: #ddd; font-style: italic; }
  table.tense tr:nth-child(odd) td { background: #f5f5f5; }
  .hb { display: inline-block; width: 0.65in; border-bottom: 1.5px solid #000; height: 1em; vertical-align: baseline; }
  /* ---------- Verb charts ---------- */
  table.verbs { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.verbs th, table.verbs td { border: 1.5px solid #000; padding: 4px 6px; text-align: center; }
  table.verbs th { font-size: 16px; }
  table.verbs th small { display: block; font-size: 14px; font-weight: normal; }
  table.verbs td { font-size: 18px; height: 34px; }
  table.verbs td.base { font-weight: bold; width: 17%; }
"""

PACKET_EXTRA_CSS = """
  /* Added for Week 9+: "Bonus: Your turn" hints, can/can't rhythm boxes, flyer-style tasks */
  .ideas { font-size: 14px; font-style: italic; margin: 1px 0 0; }
  .prompt { font-size: 18px; margin-top: 6px; }
  .rhythm { display: flex; gap: 12px; margin-bottom: 10px; }
  .rhythm > div { flex: 1; border: 2px solid #000; padding: 8px 12px; }
  .rhythm .big { font-size: 26px; font-weight: bold; line-height: 1.1; margin-bottom: 4px; }
  .rhythm .beats { font-size: 22px; letter-spacing: 2px; margin: 2px 0 4px; }
  .rhythm .beats b { font-size: 30px; }
  table.who { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.who td { border: 1.5px solid #000; padding: 4px 10px; font-size: 17px; height: 38px; }
  table.who td.q { width: 31%; font-size: 16px; }
  table.pick.tall td { height: 66px; }
  ol.listen2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; }
  ol.listen2 li { display: grid; grid-template-columns: 1.6em 1fr auto; gap: 6px; font-size: 17px; }
  ol.listen2 li b.n { width: auto; }
  ol.listen2 .cc { white-space: nowrap; font-weight: bold; }
  .textbox { border: 2px solid #000; border-radius: 18px; padding: 10px 16px; font-size: 17px; line-height: 2.1; }
  .gram3 { display: flex; gap: 10px; font-size: 16px; margin-bottom: 6px; }
  .gram3 div { border: 1.5px solid #000; padding: 4px 10px; flex: 1; }
  .gline { display: flex; gap: 8px; align-items: flex-end; font-size: 17px; margin-bottom: 4px; }
  .gline b { white-space: nowrap; width: 3.2em; }
  .gline .line { flex: 1; }
"""

KEY_CSS = """
  /* ---------- Answer key overlay ---------- */
  .page { position: relative; }
  .keytag { position: absolute; top: 0.12in; left: 50%; transform: translateX(-50%); color: #c00; font-weight: bold; font-size: 14px; letter-spacing: 2px; border: 1.5px solid #c00; padding: 0 10px; }
  .ans { color: #c00; font-weight: bold; font-style: normal; }
  .blank.ans { text-align: center; padding: 0 4px; }
  .line.ans { font-size: 16px; line-height: 26px; padding-left: 4px; }
  .hitc { border: 2px solid #c00; border-radius: 12px; padding: 0 5px; color: #c00; }
  .cb.on { background: #c00; }
  .keynote { color: #c00; font-size: 15px; font-weight: bold; }
  td.ansc { color: #c00; font-weight: bold; }
  .hb.ans { color: #c00; font-weight: bold; text-align: center; width: auto; min-width: 0.65in; padding: 0 3px; }
  table.tense.write td.ansc { font-size: 13px; }
  .hb.sm.ans { min-width: 0.36in; font-size: 13px; padding: 0 1px; }
  .textbox .blank { line-height: 1.2; height: 1.25em; }
  td.ans { color: #c00; font-weight: bold; }
"""

LEADER_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 13px;
    line-height: 1.32;
  }
  /* Teacher/volunteer copy, not stapled into the packet.
     Page 1: rotation + the SPEAK leader script. Page 2: answer keys. */
  .page {
    width: 8.5in;
    height: 11in;
    padding: 0.45in 0.55in;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  @media screen {
    body { background: #e6e6e6; padding: 24px 0; }
    .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
  }
  @media print {
    @page { size: letter portrait; margin: 0; }
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid #000;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  h1 { font-size: 24px; }
  h2 { font-size: 16px; margin: 6px 0 3px; }
  .tag { font-size: 12px; white-space: nowrap; }
  table.rotation { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  table.rotation th, table.rotation td { border: 1.5px solid #000; padding: 4px 6px; text-align: center; font-size: 14px; }
  table.rotation th .time { display: block; font-weight: normal; font-size: 12px; }
  table.rotation td.g { font-weight: bold; text-align: left; }
  table.rotation td.g span { display: block; font-weight: normal; font-size: 12px; }
  table.rotation tr.who td { font-size: 13px; }
  ul.dots { padding-left: 1.1em; margin-bottom: 4px; }
  ul.dots li { margin-bottom: 3px; }
  .cols { display: flex; gap: 18px; }
  .cols > div { flex: 1; }
  table.timeline { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.timeline td { border: 1.5px solid #000; padding: 2px 7px; vertical-align: top; }
  table.timeline td:first-child { width: 22%; font-weight: bold; white-space: nowrap; }
  table.script { border-collapse: collapse; margin-bottom: 4px; }
  table.script td { border: 1.5px solid #000; padding: 3px 10px; font-size: 14px; }
  table.script td.n { font-weight: bold; }
  .recast { border: 1.5px solid #000; padding: 6px 10px; margin: 4px 0 6px; }
  ol.key { padding-left: 1.4em; margin-bottom: 4px; }
  ol.key li { margin-bottom: 2px; }
  .box { border: 1.5px solid #000; padding: 8px 12px; margin-bottom: 10px; }
  .box h2 { margin-top: 0; }
"""

SELFCHECK_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 15px;
    line-height: 1.35;
  }
  /* One landscape letter sheet = two identical half-sheet cards. Cut on the dashed line.
     Leave one card face-down on the Station 4 table. Answers for packet page 8, Parts A-C. */
  .sheet {
    width: 11in;
    height: 8.5in;
    display: flex;
    overflow: hidden;
  }
  .card {
    width: 50%;
    padding: 0.4in 0.45in;
    display: flex;
    flex-direction: column;
  }
  .card + .card { border-left: 1.5px dashed #000; }
  @media screen {
    body { background: #e6e6e6; padding: 24px 0; }
    .sheet { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
  }
  @media print {
    @page { size: letter landscape; margin: 0; }
  }

  .stop { border: 2.5px solid #000; padding: 6px 10px; text-align: center; margin-bottom: 8px; }
  .stop .big { font-size: 22px; font-weight: bold; }
  .stop .sub { font-size: 15px; }
  .title { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000; padding-bottom: 3px; margin-bottom: 6px; }
  .title h1 { font-size: 20px; }
  .title span { font-size: 12px; }
  h2 { font-size: 16px; margin: 6px 0 2px; }
  table { width: 100%; border-collapse: collapse; }
  td { border-bottom: 1px solid #bbb; padding: 2px 4px; vertical-align: top; font-size: 14px; }
  td.n { width: 1.5em; font-weight: bold; }
  td.a { font-weight: bold; white-space: nowrap; width: 33%; }
  td.why { font-size: 13px; }
  .tip { margin-top: auto; border: 1.5px dashed #000; padding: 6px 10px; font-size: 14px; }
"""


class P:
    """Answer helpers. key=False: blanks for students. key=True: answers in red."""

    def __init__(self, key):
        self.key = key

    def b(self, ans="", size=""):
        cls = f"blank {size}".strip()
        return f'<span class="{cls} ans">{ans}</span>' if self.key else f'<span class="{cls}"></span>'

    def ln(self, ans="", n=1):
        if self.key:
            return f'<div class="line ans">{ans}</div>' + '<div class="line"></div>' * (n - 1)
        return '<div class="line"></div>' * n

    def circ(self, text, on):
        return f'<span class="hitc">{text}</span>' if (self.key and on) else text

    def cb(self, on=False):
        return f'<span class="cb{" on" if (self.key and on) else ""}"></span>'

    def td(self, ans):
        return f'<td class="ansc">{ans}</td>' if self.key else "<td></td>"

    def note(self, text):
        return f'<p class="keynote">{text}</p>' if self.key else ""


def page(cls, label, sub, pg, body, key):
    tag = '<div class="keytag">ANSWER KEY</div>' if key else ""
    bar = (f'<div class="station-bar"><div class="label">{label}<span>{sub}</span></div>'
           f'<div class="pg">Page {pg}</div></div>') if label else ""
    return f'<section class="page {cls}">{tag}\n  {bar}\n{body}\n</section>\n'


def doc(title, css, body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
{FONT_LINK}
<style>{css}</style>
</head>
<body>
{body}
</body>
</html>
"""


def packet_css(key):
    return PACKET_CSS + PACKET_EXTRA_CSS + (KEY_CSS if key else "")


ROTATION = [("A", [2, 3, 4, 1]), ("B", [3, 4, 1, 2]), ("C", [4, 1, 2, 3]), ("D", [1, 2, 3, 4])]


def cover(week, date_long, stations, key, early_page=10):
    """stations: list of 4 (NAME, who, pages) in station order 1-4."""
    names = {i + 1: s[0] for i, s in enumerate(stations)}
    rows = "".join(
        f'<tr><td class="g">{g}</td>' + "".join(f"<td>{n} &middot; {names[n]}</td>" for n in order) + "</tr>"
        for g, order in ROTATION)
    boxes = "".join(
        f'<div><div class="nm">Station {i + 1}: {nm}</div><div class="who">{who}</div><div class="pp">{pp}</div></div>'
        for i, (nm, who, pp) in enumerate(stations))
    body = f"""  <div class="cover-title">Tuesday Stations</div>
  <div class="cover-sub">Week {week} &middot; {date_long} &middot; Practice day</div>
  <div class="name-row">Name: <span class="blank"></span> My group: &nbsp;A &nbsp; B &nbsp; C &nbsp; D</div>
  <table class="rotation">
    <tr><th>Group</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th></tr>
    {rows}
  </table>
  <div class="stations">{boxes}</div>
  <h2>How it works</h2>
  <ul class="rules">
    <li>Each station is <b>25 minutes</b>. Move when the timer rings.</li>
    <li><b>Late?</b> Go to <b>Station 1: WARM-UP</b>.</li>
    <li><b>Not finished?</b> That&rsquo;s OK. Move anyway. Finish at home.</li>
    <li><b>Finished early?</b> Go to the <b>verb charts</b> on page {early_page}.</li>
    <li>Keep this packet. Bring it on Thursday.</li>
  </ul>"""
    return page("", "", "", "", body, key).replace('<section class="page ">', '<section class="page">')


def forms_table(verbs, p):
    """Station 1 'Verb forms of the week' chart. verbs: list of (V1, V1-s, V-ing, V2, V3)."""
    rows = "".join(f'<tr><td class="base">{v[0]}</td>' + "".join(p.td(x) for x in v[1:]) + "</tr>" for v in verbs)
    return ('<table class="forms"><tr><th>V1<small>base</small></th><th>V1-s<small>he / she / it</small></th>'
            '<th>V-ing<small>-ing</small></th><th>V2<small>past</small></th><th>V3<small>past participle</small></th></tr>'
            + rows + "</table>")


TENSES = ["Present Simple", "Past Simple", "Future Simple", "Present Continuous",
          "Past Continuous", "Future Continuous", "Present Perfect"]


def conjugate(s, v):
    """(affirmative, negative, question) for each tense; v = (V1, V1-s, V-ing, V2, V3)."""
    third = s in ("he", "she", "it")
    S = s.capitalize()
    be, be_n, be_q = ("is", "isn&rsquo;t", "Is") if third else (("am", "am not", "Am") if s == "I" else ("are", "aren&rsquo;t", "Are"))
    was, was_n, was_q = ("was", "wasn&rsquo;t", "Was") if (third or s == "I") else ("were", "weren&rsquo;t", "Were")
    have, have_n, have_q = ("has", "hasn&rsquo;t", "Has") if third else ("have", "haven&rsquo;t", "Have")
    do_n, do_q = ("doesn&rsquo;t", "Does") if third else ("don&rsquo;t", "Do")
    v1, v1s, ving, v2, v3 = v
    return [
        (f"{s} {v1s if third else v1}", f"{s} {do_n} {v1}", f"{do_q} {s} {v1}?"),
        (f"{s} {v2}", f"{s} didn&rsquo;t {v1}", f"Did {s} {v1}?"),
        (f"{s} will {v1}", f"{s} won&rsquo;t {v1}", f"Will {s} {v1}?"),
        (f"{s} {be} {ving}", f"{s} {be_n} {ving}", f"{be_q} {s} {ving}?"),
        (f"{s} {was} {ving}", f"{s} {was_n} {ving}", f"{was_q} {s} {ving}?"),
        (f"{s} will be {ving}", f"{s} won&rsquo;t be {ving}", f"Will {s} be {ving}?"),
        (f"{s} {have} {v3}", f"{s} {have_n} {v3}", f"{have_q} {s} {v3}?"),
    ]


def helpers(s, v):
    """Chart 1 cells: the verb part is printed, students write only the helping verbs."""
    third = s in ("he", "she", "it")
    v1, v1s, ving, v2, v3 = v
    be = "is" if third else ("am" if s == "I" else "are")
    was = "was" if (third or s == "I") else "were"
    have = "has" if third else "have"
    neg = lambda w: w + "n&rsquo;t" if w not in ("am",) else "am not"
    do = "does" if third else "do"
    H = lambda x: ("H", x)
    return [
        ([f"{s} {v1s if third else v1}"], [s, H(neg(do)), v1], [H(do.capitalize()), s, v1 + "?"]),
        ([f"{s} {v2}"], [s, H("didn&rsquo;t"), v1], [H("Did"), s, v1 + "?"]),
        ([s, H("will"), v1], [s, H("won&rsquo;t"), v1], [H("Will"), s, v1 + "?"]),
        ([s, H(be), ving], [s, H(neg(be)), ving], [H(be.capitalize()), s, ving + "?"]),
        ([s, H(was), ving], [s, H(neg(was)), ving], [H(was.capitalize()), s, ving + "?"]),
        ([s, H("will"), H("be"), ving], [s, H("won&rsquo;t"), H("be"), ving], [H("Will"), s, H("be"), ving + "?"]),
        ([s, H(have), v3], [s, H(neg(have)), v3], [H(have.capitalize()), s, v3 + "?"]),
    ]


def verb_charts(pg, v1_forms, s1, v2_forms, s2, key):
    p = P(key)

    def cell(parts, sm):
        out = []
        for x in parts:
            if isinstance(x, tuple):
                cls = "hb sm" if sm else "hb"
                out.append(f'<span class="{cls} ans">{x[1]}</span>' if key else f'<span class="{cls}"></span>')
            else:
                out.append(x)
        return " ".join(out)

    rows1 = "".join(
        f'<tr><td class="tn">{t}</td>' + "".join(f"<td>{cell(c, i == 5)}</td>" for c in cells) + "</tr>"
        for i, (t, cells) in enumerate(zip(TENSES, helpers(s1, v1_forms))))
    rows2 = "".join(
        f'<tr><td class="tn">{t}</td>' + "".join(p.td(x) for x in cells) + "</tr>"
        for t, cells in zip(TENSES, conjugate(s2, v2_forms)))
    f1 = "".join(f"<td>{x}</td>" for x in v1_forms)
    f2 = f'<td class="ex">{v2_forms[0]}</td>' + "".join(p.td(x) for x in v2_forms[1:])
    body = f"""  <div class="task">
    <h2>Chart 1: Add the helping verbs</h2>
    <p class="how">Write the <b>helping verb</b> in each blank. For negatives, use the short form (<i>doesn&rsquo;t</i>, <i>isn&rsquo;t</i>&hellip;). <b>Help:</b> Grammar Companion, <b>pages 11&ndash;12</b>.</p>
    <div class="vc-meta"><span><b>Infinitive:</b> to {v1_forms[0]}</span><span><b>Subject:</b> {s1}</span></div>
    <table class="forms5"><tr><th>V1</th><th>V1-s</th><th>V-ing</th><th>V2</th><th>V3</th></tr><tr>{f1}</tr></table>
    <table class="tense"><tr><th></th><th>Affirmative</th><th>Negative</th><th>Question</th></tr>{rows1}</table>
  </div>
  <div class="task">
    <h2>Chart 2: Now you write it all</h2>
    <p class="how">Write the 5 forms of <b>{v2_forms[0]}</b>. Then fill in the chart with <b>{s2}</b>. <b>Help:</b> Grammar Companion, <b>page 9</b> (verb forms) and <b>pages 11&ndash;12</b> (tenses).</p>
    <div class="vc-meta"><span><b>Infinitive:</b> to {v2_forms[0]}</span><span><b>Subject:</b> {s2}</span></div>
    <table class="forms5"><tr><th>V1</th><th>V1-s</th><th>V-ing</th><th>V2</th><th>V3</th></tr><tr>{f2}</tr></table>
    <table class="tense write"><tr><th></th><th>Affirmative</th><th>Negative</th><th>Question</th></tr>{rows2}</table>
  </div>"""
    return page("vc", "FINISHED EARLY?", "verb charts", pg, body, key)


def pdf(html_path, pages=None):
    """Print an HTML file to a PDF next to it with headless Chrome and check the page count."""
    html_path = Path(html_path)
    out = html_path.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=8000", f"--print-to-pdf={out}", html_path.resolve().as_uri()],
                   check=True, capture_output=True)
    info = subprocess.run(["pdfinfo", str(out)], capture_output=True, text=True).stdout
    n = int(next(l.split()[-1] for l in info.splitlines() if l.startswith("Pages:")))
    flag = "" if pages is None or n == pages else f"  <-- expected {pages}"
    print(f"{out.name}: {n} pages{flag}")
    return n


def leader_top(week, date_short, stations, bullets):
    """Leader guide page 1 header, rotation table, and the 'how tonight works' bullets."""
    rows = "".join(
        f'<tr><td class="g">{g}<span>{"late arrivals" if g == "D" else "on time"}</span></td>'
        + "".join(f"<td>{n} &middot; {stations[n - 1][0]}</td>" for n in order) + "</tr>"
        for g, order in ROTATION)
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    return f"""<div class="header-row"><h1>Tuesday Stations &middot; Leader Guide</h1><span class="tag">Week {week} &middot; Tue {date_short} &middot; not for students</span></div>
  <table class="rotation">
    <tr><th>Group</th><th>Block 1<span class="time">6:00&ndash;6:25</span></th><th>Block 2<span class="time">6:27&ndash;6:52</span></th><th>Block 3<span class="time">6:54&ndash;7:19</span></th><th>Block 4<span class="time">7:21&ndash;7:46</span></th></tr>
    {rows}
    <tr class="who"><td class="g">Adults</td><td colspan="4">One adult stays at <b>Station 2 (SPEAK)</b> all night. The other <b>floats</b> between Stations 1, 3, and 4.</td></tr>
  </table>
  <ul class="dots">{lis}</ul>"""


def self_check_doc(title, card_body, stop="Finish Parts A, B, and C first.", page_ref="packet page 8"):
    """Two identical half-sheet answer cards on one landscape sheet."""
    card = f"""<div class="card">
    <div class="stop">
      <div class="big">STOP! {stop}</div>
      <div class="sub">Keep this card face-down until your group is done. Then check together.</div>
    </div>
    <div class="title"><h1>Station 4 Self-Check</h1><span>Real World &middot; {page_ref}</span></div>
    {card_body}
  </div>"""
    return doc(title, SELFCHECK_CSS, f'<div class="sheet">\n  {card}\n  {card}\n</div>')
