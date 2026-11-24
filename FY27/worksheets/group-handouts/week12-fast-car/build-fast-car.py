#!/usr/bin/env python3
"""Week 12 bonus lesson: "Fast Car" by Tracy Chapman (1988).

A fall grammar review built around the song's story: past, now, and future plans,
plus a budget (week 12 = Spending + Budgeting).

  fast-car-worksheet.html/.pdf   2 sheets, print double-sided (4 sides)
  fast-car-key.html/.pdf         same pages, answers filled in

No lyrics are printed (copyright). Play the official video and show the lyrics
from a licensed site. Every sentence here is our own retelling of the story.

    python3 build-fast-car.py
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
WORDS = [  # (word, meaning)
    ("a convenience store", "a small store open late (snacks, drinks)"),
    ("a checkout girl", "a cashier at a supermarket"),
    ("a shelter", "a free place to sleep for people with no home"),
    ("get promoted", "get a better job at the same company"),
    ("the suburbs", "quiet towns outside a big city"),
    ("quit school", "stop going to school"),
    ("a bottle", "here: alcohol, drinking too much"),
    ("make a decision", "choose"),
]

# Part 1 / Part 2: check the words you hear, one list per half. (word, in that half?)
# Cut the song after the first chorus. Checked against the lyrics Marlana pasted 2026-11-24.
LISTEN_A = [("car", True), ("bus", False), ("plan", True), ("money", True), ("store", True),
            ("city", True), ("train", False), ("jobs", True), ("school", True)]
LISTEN_B = [("job", True), ("market", True), ("phone", False), ("shelter", True), ("house", True),
            ("bar", True), ("doctor", False), ("bills", True), ("kids", True)]

# Part 2: her story. (sentence with <u>verb</u>, when, verb form)
STORY = [
    ("Her mother <u>left</u> a long time ago.", "Past", "V2"),
    ("She <u>works</u> at a convenience store.", "Now", "V1-s"),
    ("She <u>quit</u> school.", "Past", "V2"),
    ("He <u>will find</u> a job.", "Future", "will + V1"),
    ("They <u>were driving</u> fast in his car.", "Past", "were + V-ing"),
    ("They <u>live</u> in a shelter.", "Now", "V1"),
    ("She <u>will get</u> promoted.", "Future", "will + V1"),
    ("She <u>felt</u> happy in the car.", "Past", "V2"),
    ("Her father <u>drinks</u> too much.", "Now", "V1-s"),
    ("They <u>will buy</u> a big house.", "Future", "will + V1"),
]
FORMS = ["V1", "V1-s", "V2", "was/were + V-ing", "will + V1"]

# Part 3: fix the mistake. (wrong, right, rule)
FIX = [
    ("Her father <u>drink</u> too much.", "Her father <b>drinks</b> too much.", "he / she / it + V1-s"),
    ("They <u>was</u> driving in his car.", "They <b>were</b> driving in his car.", "they + were"),
    ("He will <u>finds</u> a job.", "He will <b>find</b> a job.", "will + V1"),
    ("She <u>have</u> a plan.", "She <b>has</b> a plan.", "she + has"),
    ("Have you ever <u>drive</u> a fast car?", "Have you ever <b>driven</b> a fast car?", "have + V3"),
    ("She hasn't saved enough money <u>already</u>.", "She hasn't saved enough money <b>yet</b>.", "not done → yet"),
]
SONG_ENGLISH = [("I got a car.", "I <b>have</b> a car."),
                ("We gotta go.", "We <b>have to</b> go."),
                ("I ain't going.", "I'm <b>not</b> going.")]

# Part 4: her budget
PAY, HOURS, WEEKS = 15, 24, 4
COSTS = [("Food", 450), ("Gas for the car", 180), ("Phone", 60), ("Clothes + other", 150)]
GOAL = 2600  # first month rent + deposit
WEEK_PAY = PAY * HOURS
MONTH_PAY = WEEK_PAY * WEEKS
TOTAL = sum(c for _, c in COSTS)
LEFT = MONTH_PAY - TOTAL
MONTHS = -(-GOAL // LEFT)
BUDGET_Q = [
    ("How much does she earn in <b>one week</b>?", f"${PAY} × {HOURS} = <b>${WEEK_PAY:,}</b>"),
    ("How much does she earn in <b>one month</b> (4 weeks)?", f"${WEEK_PAY:,} × 4 = <b>${MONTH_PAY:,}</b>"),
    ("How much does she spend every month?", f"<b>${TOTAL:,}</b>"),
    ("How much money is left every month?", f"${MONTH_PAY:,} − ${TOTAL:,} = <b>${LEFT:,}</b>"),
    (f"She needs <b>${GOAL:,}</b> for a new apartment. How many months does she need to save?",
     f"<b>{MONTHS} months</b> (after {MONTHS - 1} months she has only ${LEFT * (MONTHS - 1):,})"),
]
ADVICE_MODELS = [
    "She should cook at home. If she stops buying snacks, she will save $50.",
    "She must work more hours. If she works 30 hours, she will earn $450 a week.",
    "She shouldn't drive so much. If she takes the bus, she will spend less on gas.",
]

# Part 3: the ending (our own retelling, not the lyrics)
ENDING = ("Years later, she has a job, and she pays all the bills. "
          "Her partner stays out late at the bar. He sees his friends more than his kids. "
          "She wanted a better life with him. At the end, she tells him: take your car and go.")
ENDING_TF = [  # (sentence, true?, correction)
    ("She pays all the bills.", True, ""),
    ("Her partner spends a lot of time with his kids.", False, "He sees his friends more than his kids."),
    ("She tells him to leave.", True, ""),
    ("She leaves with him in the fast car.", False, "She stays. He goes."),
]

# Part 4: then and now. (her parents, before: V2) -> (her life now: V1-s blank)
CYCLE = [
    ("Her father <b>drank</b> too much.", "Her partner [[drinks]] (drink) late at the bar."),
    ("Her father <b>didn't work</b>.", "Now she [[pays]] (pay) all the bills."),
    ("Her mother <b>wanted</b> more from life.", "She [[wants]] (want) a better life too."),
    ("Her mother <b>left</b>.", "She [[tells]] (tell) <b>him</b> to leave."),
]
HOPE_MODELS = ["I hope my kids will go to college.",
               "I hope my kids will speak English and Spanish.",
               "I hope my family will have an easy life."]

# Part 5: your story. Three different people, three different answers.
MY_STORY_MODELS = [
    ("Mandy", ["Five years ago, I <b>moved</b> to Boston.", "Now I <b>work</b> in a hotel.",
               "I <b>have already</b> found an apartment.", "I <b>haven't</b> bought a car <b>yet</b>.",
               "Next year, I <b>will</b> take the driving test."]),
    ("Kevin", ["Last year, I <b>started</b> a new job.", "Now I <b>work</b> at night.",
               "I <b>have already</b> opened a bank account.", "I <b>haven't</b> gotten my driver's license <b>yet</b>.",
               "Next year, I <b>will</b> start a business."]),
    ("Ana", ["In 2019, I <b>joined</b> English class.", "Now I <b>take</b> care of my grandkids.",
             "I <b>have already</b> passed my citizenship test.", "I <b>haven't</b> visited my sister <b>yet</b>.",
             "Next year, I <b>will</b> travel to Peru."]),
]
MY_STORY_FRAME = [("Last year / ___ years ago, I", "V2"), ("Now I", "V1"), ("I have already", "V3"),
                  ("I haven't", "V3 … yet"), ("Next year, I will", "V1")]

# ---------------------------------------------------------------- html
CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #000; background: #fff;
       font-size: 14px; line-height: 1.35; }
.page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column;
        overflow: hidden; page-break-after: always; break-after: page; }
@media screen { body { background: #e6e6e6; padding: 24px 0; }
  .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,.25); } }
@media print { @page { size: letter portrait; margin: 0; } }
.header-row { display: flex; justify-content: space-between; align-items: baseline;
              border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 10px; }
h1 { font-size: 26px; } h1 small { font-size: 15px; font-weight: normal; }
h2 { font-size: 17px; margin: 8px 0 4px; }
h2 .n { display: inline-block; background: #000; color: #fff; border-radius: 4px; padding: 0 7px; margin-right: 6px; }
.how { font-size: 13.5px; margin-bottom: 6px; }
.name { font-size: 14px; white-space: nowrap; }
.box { border: 1.5px solid #000; border-radius: 6px; padding: 8px 12px; margin-bottom: 8px; }
.note td, .note th { padding: 2px 8px; }
.note { border: 1.5px dashed #000; border-radius: 6px; padding: 6px 12px; font-size: 13px; margin: 10px 0 6px; }
table { width: 100%; border-collapse: collapse; }
td, th { border: 1.5px solid #000; padding: 5px 8px; vertical-align: middle; text-align: left; }
th { background: #eee; font-size: 13px; }
.words td { font-size: 13.5px; padding: 3px 8px; } .words td:nth-child(odd) { font-weight: bold; width: 22%; }
.listen { display: grid; grid-template-columns: repeat(9, 1fr); gap: 5px; }
.listen div { border: 1.5px solid #000; border-radius: 6px; padding: 7px 2px; text-align: center; font-size: 15px; white-space: nowrap; }
.listen .sq { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #000; margin-right: 4px;
              vertical-align: -2px; text-align: center; line-height: 13px; font-size: 14px; font-weight: bold; }
.forms { display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0 6px; }
.chip { border: 1.5px solid #000; border-radius: 999px; padding: 1px 10px; font-weight: bold; font-size: 13px; }
.story td { height: 25px; padding: 3px 8px; } .story td.num { width: 26px; text-align: center; font-weight: bold; }
.story td.ans { width: 21%; }
.ans-fill { font-family: "Comic Sans MS", "Bradley Hand", cursive; color: #1d4ed8; font-weight: bold; }
.blank { display: inline-block; border-bottom: 1.5px solid #000; min-width: 200px; height: 20px; }
.line { border-bottom: 1.5px solid #000; height: 26px; }
.fix td { height: 34px; } .fix td.wrong { width: 44%; }
.budget-wrap { display: flex; gap: 14px; }
.budget-wrap > div:first-child { flex: 0 0 42%; }
.budget td { padding: 4px 8px; } .budget td:last-child { text-align: right; width: 32%; }
.q { margin-bottom: 6px; } .q .blank { min-width: 120px; }
.models { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 12.5px; }
.models div { border: 1.5px solid #000; border-radius: 6px; padding: 5px 8px; }
.models b.who { display: block; margin-bottom: 2px; }
.cue { font-weight: bold; font-size: 15px; border: 2px solid #000; border-radius: 6px; padding: 3px 10px;
       display: inline-block; margin: 2px 0 6px; }
.frame td { height: 38px; } .frame td:first-child { width: 30%; font-weight: bold; }
.frame td.lab { width: 15%; text-align: center; font-size: 12.5px; }
.spacer { flex: 1; }
.foot { font-size: 11px; color: #444; text-align: right; }
"""


def fill(answer, key, width=None):
    if key:
        return f'<span class="ans-fill">{answer}</span>'
    w = f' style="min-width:{width}px"' if width else ""
    return f'<span class="blank"{w}></span>'


def header(title, sub, key):
    tag = "ANSWER KEY" if key else 'Name: <span class="blank" style="min-width:170px"></span>'
    return (f'<div class="header-row"><h1>{title} <small>{sub}</small></h1>'
            f'<span class="name">{tag}</span></div>')


def checklist(items, key):
    return "".join(f'<div><span class="sq">{"✓" if (key and yes) else ""}</span>{w}</div>' for w, yes in items)


def page1(key):
    words = "".join(
        f"<tr><td>{WORDS[i][0]}</td><td>{WORDS[i][1]}</td><td>{WORDS[i+1][0]}</td><td>{WORDS[i+1][1]}</td></tr>"
        for i in range(0, len(WORDS), 2))
    tf = "".join(
        f'<tr><td class="num" style="width:26px;text-align:center;font-weight:bold">{i}</td><td>{q}</td>'
        f'<td style="width:16%;text-align:center">{fill("True" if t else "False", key) if key else "True / False"}</td>'
        f'<td style="width:34%">{fill(c, key) if key and c else ""}</td></tr>'
        for i, (q, t, c) in enumerate(ENDING_TF, 1))
    song = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in SONG_ENGLISH)
    return f"""<div class="page">
{header("Fast Car", "· Tracy Chapman, 1988", key)}
<h2><span class="n">Words</span>Before you listen</h2>
<table class="words">{words}</table>

<h2><span class="n">1</span>The first half. Check ✓ the words you hear.</h2>
<p class="how"><b>Play 1:</b> no words on the screen. <b>7 words</b> are in the song. <b>2 words</b> are not.</p>
<div class="listen">{checklist(LISTEN_A, key)}</div>

<h2><span class="n">2</span>The second half. Check ✓ the words you hear.</h2>
<p class="how"><b>Play 3:</b> no words on the screen. <b>7 words</b> are in the song. <b>2 words</b> are not.</p>
<div class="listen">{checklist(LISTEN_B, key)}</div>
<div class="box" style="margin-top:8px"><b>The ending:</b> {ENDING}</div>
<p class="how">Circle <b>True</b> or <b>False</b>. Fix the false sentences.</p>
<table class="fix"><tr><th></th><th>Sentence</th><th style="text-align:center">True or False?</th><th>Fix it</th></tr>{tf}</table>
<div class="note"><b>Song English is not class English!</b> Singers break the rules. Listen for these:
<table style="margin-top:4px;width:70%"><tr><th>In the song</th><th>In class / at work</th></tr>{song}</table></div>
<div class="spacer"></div>
<div class="foot">Week 12 · Fast Car · Side 1</div>
</div>"""


def page_ending(key):
    def blank(t):
        return re.sub(r"\[\[(.+?)\]\]", lambda m: fill(m.group(1), key, 90) if key else '<span class="blank" style="min-width:90px"></span>', t)
    cyc = "".join(f'<tr><td class="num" style="width:26px;text-align:center;font-weight:bold">{i}</td><td>{a}</td>'
                  f'<td style="text-align:center;width:30px">➜</td><td>{blank(b)}</td></tr>'
                  for i, (a, b) in enumerate(CYCLE, 1))
    models = "".join(f"<div>{m}</div>" for m in HOPE_MODELS)
    lines = ('<div class="ans-fill" style="margin:4px 0">Answers will vary. Check: I hope + will + V1.</div>'
             if key else '<div class="line"></div>')
    talk = ('<div class="ans-fill" style="font-size:13px;margin-top:2px">Same: a man drinks too much, and she pays for everything. '
            'Different: her mother left, but she stays and tells him to go.</div>') if key else ""
    rows = "".join(
        f'<tr><td class="num">{i}</td><td>{s}</td><td class="ans">{fill(when, key, 0) if key else ""}</td>'
        f'<td class="ans">{fill(form, key, 0) if key else ""}</td></tr>'
        for i, (s, when, form) in enumerate(STORY, 1))
    forms = "".join(f'<span class="chip">{f}</span>' for f in FORMS)
    return f"""<div class="page">
{header("Fast Car", "· Her story", key)}
<h2><span class="n">3</span>Then and now: the story repeats</h2>
<div class="note" style="margin-top:0"><b>A cycle</b> = the same thing happens again and again. Parents ➜ children ➜ their children …</div>
<p class="how">Her parents (<b>V2</b>, past) ➜ her life now. Write the verb in <b>V1-s</b>.</p>
<table class="fix"><tr><th></th><th>Her parents, before</th><th></th><th>Her life now</th></tr>{cyc}</table>
<p class="how" style="margin-top:6px"><b>Talk:</b> What is the <b>same</b>? What does she do <b>differently</b>? Is her decision a good decision?</p>
{talk}
<p class="how" style="margin-top:6px"><b>Write:</b> She wants a better life. What do <b>you</b> hope?
<b>I hope my kids will …</b> &nbsp;(No kids? <b>I hope my family will …</b>) &nbsp;<span class="cue" style="font-size:13px;padding:1px 8px;margin:0">You make up the ending.</span></p>
<div class="models">{models}</div>
{lines}

<h2><span class="n">4</span>The whole song: Past, Now, or Future?</h2>
<p class="how"><b>Play 5.</b> Then read. Write <b>Past</b>, <b>Now</b>, or <b>Future</b>. Then write the verb form.</p>
<div class="forms">{forms}</div>
<table class="story"><tr><th></th><th>Sentence</th><th>Past / Now / Future</th><th>Verb form</th></tr>{rows}</table>
<div class="spacer"></div>
<div class="foot">Week 12 · Fast Car · Side 2</div>
</div>"""


def page2(key):
    fix = "".join(
        f'<tr><td class="num" style="width:26px;text-align:center;font-weight:bold">{i}</td>'
        f'<td class="wrong">{w}</td><td>{fill(r + f" <span style=\'font-weight:normal\'>({rule})</span>", key) if key else ""}</td></tr>'
        for i, (w, r, rule) in enumerate(FIX, 1))
    costs = "".join(f"<tr><td>{n}</td><td>${c:,}</td></tr>" for n, c in COSTS)
    qs = "".join(f'<div class="q">{chr(97+i)}. {q}<br>{fill(a, key, 160)}</div>'
                 for i, (q, a) in enumerate(BUDGET_Q))
    models = "".join(f'<div>{m}</div>' for m in ADVICE_MODELS)
    lines = ('<div class="ans-fill" style="margin:4px 0">Answers will vary. Check: should / must + V1; '
             'If + V1, … will + V1.</div>') if key else '<div class="line"></div><div class="line"></div>'
    return f"""<div class="page">
{header("Fast Car", "· Grammar + Money", key)}
<h2><span class="n">5</span>Fix the mistake.</h2>
<p class="how">Each sentence has <b>one</b> mistake. Write the correct sentence.</p>
<table class="fix">{fix}</table>

<h2><span class="n">6</span>Her budget</h2>
<p class="how">Imagine her life <b>today</b>. She works at a supermarket. She earns <b>${PAY} an hour</b> and works <b>{HOURS} hours a week</b>.</p>
<div class="budget-wrap"><div>
<table class="budget"><tr><th colspan="2">Her costs every month</th></tr>{costs}</table>
<p class="how" style="margin-top:6px">They live in a shelter, so she pays <b>$0</b> for rent now.</p>
</div><div>{qs}</div></div>
<p class="how" style="margin-top:4px"><b>f. Give her advice.</b> Write 2 sentences: <b>She should / must …</b> and <b>If she …, she will …</b></p>
<span class="cue">You make up the advice.</span> Three students, three different ideas:
<div class="models">{models}</div>
{lines}
<div class="spacer"></div>
<div class="foot">Week 12 · Fast Car · Side 3</div>
</div>"""


def page3(key):
    models = "".join(f'<div><b class="who">{who}</b>{"<br>".join(lines)}</div>' for who, lines in MY_STORY_MODELS)
    frame = "".join(
        f'<tr><td>{start}</td><td>{"<span class=ans-fill>Answers will vary.</span>" if key and i == 0 else ""}</td>'
        f'<td class="lab">{lab}</td></tr>' for i, (start, lab) in enumerate(MY_STORY_FRAME))
    return f"""<div class="page">
{header("Fast Car", "· Your story", key)}
<h2><span class="n">7</span>Talk with a partner.</h2>
<table class="frame" style="margin-bottom:4px">
<tr><td>Have you ever worked in a store?</td><td colspan="2">Yes, I have. I worked at … &nbsp;/&nbsp; No, I haven't.</td></tr>
<tr><td>Have you ever gotten promoted?</td><td colspan="2">Yes, I have. I became a … &nbsp;/&nbsp; No, not yet.</td></tr>
<tr><td>What will you do next year?</td><td colspan="2">Next year, I will …</td></tr>
<tr><td>Is her plan a good plan? Why?</td><td colspan="2">I think it is / isn't a good plan because …</td></tr>
</table>

<h2><span class="n">8</span>Write your story.</h2>
<p class="how">She had a plan for a new life. What is <b>your</b> story? Finish each sentence about <b>you</b>.</p>
<span class="cue">You make up the ending. It is your life, so there is no wrong story.</span>
<div class="models" style="margin-bottom:8px">{models}</div>
<table class="frame"><tr><th>Start</th><th>Your words</th><th>Verb</th></tr>{frame}</table>
<div class="note" style="margin-top:10px"><b>Check your writing:</b> ☐ V2 for the past &nbsp; ☐ have + V3 with already / yet &nbsp;
☐ will + V1 for the future &nbsp; ☐ a period at the end</div>
<div class="spacer"></div>
<div class="foot">Week 12 · Fast Car · Side 4</div>
</div>"""


def worksheet(key):
    title = "Fast Car — Answer Key" if key else "Fast Car — Worksheet"
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{FONT}'
            f'<style>{CSS}</style></head><body>{page1(key)}{page_ending(key)}{page2(key)}{page3(key)}</body></html>')


def self_check():
    for lst in (LISTEN_A, LISTEN_B):
        assert sum(1 for _, y in lst if y) == 7 and sum(1 for _, y in lst if not y) == 2
    for s, when, form in STORY:
        assert when in ("Past", "Now", "Future") and form.replace("were", "was/were").split(" + ")[0]
    assert LEFT * MONTHS >= GOAL > LEFT * (MONTHS - 1)
    print(f"budget: week ${WEEK_PAY}, month ${MONTH_PAY}, costs ${TOTAL}, left ${LEFT}, {MONTHS} months")


def to_pdf(html_path, expect):
    pdf = html_path.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000",
                    f"--print-to-pdf={pdf}", html_path.resolve().as_uri()], check=True, capture_output=True)
    n = re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1)
    print(f"{pdf.name}: {n} pages{'' if int(n) == expect else f'  <-- expected {expect}'}")


if __name__ == "__main__":
    self_check()
    for name, key in (("fast-car-worksheet", False), ("fast-car-key", True)):
        out = HERE / f"{name}.html"
        out.write_text(worksheet(key))
        to_pdf(out, 4)
