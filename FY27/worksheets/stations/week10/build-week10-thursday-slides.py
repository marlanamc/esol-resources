#!/usr/bin/env python3
"""Interactive slides for Week 10 Thursday (11/19).

Order: -ed ending sounds → what's new in the app → Week 9 top learners,
practice stars, quiz check → just / already / yet → three-person schedules.

Reuses the look and click script from the Tuesday builder, the base styles
and quiz-check image from Tuesday's deck, and the Week 9 PNGs:

  python3 build-week10-thursday-slides.py            # writes ~/Downloads/thursday-11-19-unit3-week10-slides.html

App screenshots are read from ~/Downloads/thursday-shots/ (1-map.png,
2-all-weeks.png, 3-questions.png). A missing one shows a
dashed placeholder, so re-run after adding them.

Keys: arrows / space move, F = fullscreen, #5 in the URL opens slide 5.
"""
import base64
import importlib.util
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DL = os.path.expanduser('~/Downloads')
SHOTS = os.path.join(DL, 'thursday-shots')
TUE_DECK = os.path.join(DL, 'tuesday-11-17-unit3-week10-slides.original.html')
OUT = os.path.join(DL, 'thursday-11-19-unit3-week10-slides.html')

spec = importlib.util.spec_from_file_location(
    'tue', os.path.join(HERE, '..', 'week10-modified', 'build-week10-tuesday-slides.py'))
tue = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tue)

CSS = tue.CSS + r"""
.slide .frame img.shot{width:auto;height:100%;max-height:100%;object-fit:contain;border-radius:2.4em;box-shadow:0 .6em 2.4em rgba(31,42,55,.18)}
.shotcol{flex:0 0 38%;display:flex;align-items:center;justify-content:center;min-height:0}
.ph{width:100%;height:100%;border:.4em dashed #c9ced6;border-radius:2.4em;display:flex;align-items:center;justify-content:center;text-align:center;font-size:3.2em;color:#9aa1ab;padding:1em}
.snd{font-size:9em;font-weight:900;line-height:1}
.ex{font-size:4.6em;line-height:1.45}
.ex b{color:inherit}
.big{font-size:12em;font-weight:900;line-height:1}
.div{justify-content:center;align-items:flex-start}
.div h2{font-size:14em;font-weight:900;line-height:1}
.sched{display:grid;grid-template-columns:repeat(3,1fr);gap:2.4em;flex:1}
.sched .box{display:flex;flex-direction:column;gap:.8em}
.sched h4{font-size:4.6em}
.it{font-size:3.4em;line-height:1.25;display:grid;grid-template-columns:3.6em 1.4em 1fr;gap:.3em;align-items:baseline}
.it .tm{font-weight:700;color:#6b7280}
.it .ans{grid-column:1/-1;font-size:.9em;color:#2f9e7a;font-weight:700;padding-left:.4em}
.clock{font-size:4.4em;font-weight:800;background:#1f2a37;color:#fff;border-radius:999px;padding:.15em .9em;align-self:flex-start}
.tl3{position:relative;height:22em;margin:1em 2em}
.tl3 .ax{position:absolute;left:0;right:4em;top:11em;height:.6em;background:#1f2a37;border-radius:1em}
.tl3 .ax:after{content:"";position:absolute;right:-2em;top:-1.3em;border:1.6em solid transparent;border-left:2.4em solid #1f2a37}
.tl3 .mk{position:absolute;top:7.6em;transform:translateX(-50%);text-align:center}
.tl3 .mk i{display:block;width:3.4em;height:3.4em;border-radius:50%;margin:0 auto}
.tl3 .mk span{display:block;font-size:4.2em;font-weight:900;margin-top:.5em}
.tl3 .mk small{display:block;font-size:2.6em;color:#6b7280;font-weight:600}
.tl3 .nowl{position:absolute;right:0;top:3em;font-size:3.6em;font-weight:900}
.et,.ed,.ei{display:inline-block;padding:.05em .55em;border-radius:999px;font-weight:800;white-space:nowrap}
.et{background:#2b74c4;color:#fff}.ed{background:#f2a33a;color:#1f2340}.ei{background:#6a2c91;color:#fff}
.bin.bt{background:#e3eefa}.bin.bd{background:#fdf0dc}.bin.bi{background:#efe6f5}
table.teams th.ht{background:#2b74c4}table.teams th.hd2{background:#f2a33a;color:#1f2340}table.teams th.hi{background:#6a2c91}
table.teams td{font-weight:700;font-size:3.8em;padding:.22em .5em}
table.teams th{font-size:3.6em;padding:.3em .5em}
"""


def b64(path, mime='image/png'):
    with open(path, 'rb') as f:
        return f'data:{mime};base64,' + base64.b64encode(f.read()).decode()


def frame(kicker, title, body, right='Thursday 11/19', tools=True):
    t = ('<div class="tools"><button class="tool all">Show all</button>'
         '<button class="tool rs">↺ Reset</button></div>') if tools else ''
    return (f'<section class="slide"><div class="frame">'
            f'<div class="hd"><span class="k">{kicker}</span><span class="pg">{right}</span></div>'
            f'<h3>{title}</h3>{body}{t}</div></section>')


def divider(n, title, sub):
    return (f'<section class="slide"><div class="frame div">'
            f'<div class="hd" style="width:100%"><span class="k">Part {n}</span><span class="pg">Thursday 11/19</span></div>'
            f'<h2>{title}</h2><div class="sub" style="font-size:5em">{sub}</div></div></section>')


def img_slide(src, alt):
    return f'<section class="slide"><img src="{src}" alt="{alt}"></section>'


def choice3(opts, ok):
    return '<span class="opts">' + ' / '.join(
        f'<button class="opt" data-ok="{int(k == ok)}">{o}</button>' for k, o in enumerate(opts)) + '</span>'


def shot_slide(kicker, title, fname, points):
    path = os.path.join(SHOTS, fname)
    pic = (f'<img class="shot" src="{b64(path)}" alt="{title}">' if os.path.exists(path)
           else f'<div class="ph">Screenshot coming:<br><b>{fname}</b></div>')
    lis = ''.join(f'<div class="tb">{p}</div>' for p in points)
    return frame(kicker, title,
                 f'<div class="row" style="flex:1;min-height:0"><div class="shotcol">{pic}</div>'
                 f'<div class="box" style="display:flex;flex-direction:column;justify-content:space-evenly">{lis}</div></div>',
                 tools=False)


slides = []

# ---------- Title ----------
slides.append(
    '<section class="slide"><div class="title">'
    '<div class="kicker">Unit 3 · Community Participation</div>'
    '<h1>Thursday, 11/19</h1>'
    '<div class="week">Week 10 · Just, Already, Yet</div>'
    '<div class="goals"><h2>🎯 Tonight</h2><ol>'
    '<li>I can hear, clap, and say <b>-ed</b> endings: <span class="et">/t/</span> <span class="ed">/d/</span> <span class="ei">/id/</span></li>'
    '<li>I can find the new parts of the <b>Course Map</b>.</li>'
    '<li>I can say what has <b>just</b> happened, what has <b>already</b> happened, and what has not happened <b>yet</b>.</li>'
    '</ol></div></div></section>')

# =================== PART 1: -ed sounds ===================
# Matches docs/teaching-materials/ed-endings/ed-endings-handout.html: claps,
# two questions, whisper sounds, blue /t/ · orange /d/ · purple /id/.
K1 = 'Part 1 · -ed endings · handout'
T = lambda x: f'<span class="et">{x}</span>'
D = lambda x: f'<span class="ed">{x}</span>'
I = lambda x: f'<span class="ei">{x}</span>'
TEAM = {'t': T('/t/'), 'd': D('/d/'), 'i': I('/id/')}
slides.append(divider(1, '-ed endings', 'Hear it. Clap it. Say it. 👏 &nbsp;<span class="muted">Take out your -ed handout.</span>'))

slides.append(frame(K1, 'We write -ed, but we say 3 sounds',
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1em;background:#f3eef8">'
    '<div class="tl">Question 1: Does the verb end in a <b>T</b> or <b>D</b> sound?</div>'
    f'<div class="tb"><b>YES</b> → add an <b>extra clap</b> 👏👏 {I("/id/")}</div>'
    '<div class="tb muted">want → want-id · need → need-id · decide → decide-id</div></div>'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1em">'
    '<div class="tl">Question 2: <b>NO?</b> Then no extra clap. 👏</div>'
    f'<div class="tb">Whisper sound (only air)? → {T("/t/")}</div>'
    f'<div class="tb">Everything else → {D("/d/")}</div></div></div>'
    '<div class="box tb" style="background:#fff8e6;text-align:center">Not sure? Don’t worry: just <b>don’t add a clap!</b></div>',
    tools=False))

mist = [('walk-ed', 'walkt'), ('cook-ed', 'cookt'), ('play-ed', 'playd')]
items = ''.join(f'<div class="tap box" style="text-align:center;display:flex;flex-direction:column;justify-content:center;gap:.4em">'
                f'<div class="big" style="font-size:9em"><s style="text-decoration-color:#e05252">{w}</s></div>'
                f'<div class="ans big grn" style="font-size:9em">✓ {r}</div></div>' for w, r in mist)
slides.append(frame(K1, 'The #1 mistake: an extra clap',
    f'<div class="grid3" style="flex:1">{items}</div>'
    '<div class="box tb" style="text-align:center">Only <b>T</b> or <b>D</b> verbs get the extra clap.</div>'
    '<div class="hint">Tap to hear it the right way.</div>'))

teams = [('worked', 'called', 'wanted'), ('helped', 'played', 'needed'), ('asked', 'cleaned', 'started'),
         ('cooked', 'lived', 'waited'), ('watched', 'opened', 'visited'), ('stopped', 'stayed', 'decided')]
rows = ''.join('<tr>' + ''.join(f'<td>{w}</td>' for w in r) + '</tr>' for r in teams)
slides.append(frame(K1, 'The three teams',
    '<table class="vt teams"><tr><th class="ht">/t/<small>1 clap 👏</small></th><th class="hd2">/d/<small>1 clap 👏</small></th>'
    f'<th class="hi">/id/<small>2 claps 👏👏</small></th></tr>{rows}</table>'
    '<div class="box tb" style="text-align:center">Chant it! <b>worked, helped, asked</b> / <b>called, cleaned, played</b> / <b>wanted, needed, decided</b></div>',
    tools=False))

wh = [('sss', 'kiss, dance'), ('shh', 'wash, finish'), ('ch', 'watch'), ('k', 'cook, ask, like'),
      ('p', 'help, stop'), ('f', 'laugh'), ('ks', 'fix')]
cells = ''.join(f'<div class="box" style="text-align:center;padding:1em"><div class="tl" style="color:#2b74c4">{s}</div>'
                f'<div class="tb">{w}</div></div>' for s, w in wh)
slides.append(frame(K1, f'Whisper sounds → {T("/t/")}',
    '<div class="sub">✋ Hand in front of your mouth. Only air? That’s a whisper sound.</div>'
    f'<div class="grid3" style="grid-template-columns:repeat(4,1fr);flex:1">{cells}'
    '<div class="box" style="background:#fff8e6;display:flex;flex-direction:column;justify-content:center;padding:1em">'
    '<div class="tb"><b>Sound, not letter!</b></div>'
    f'<div class="t">fix<b>ed</b> (ks) → {T("/t/")}<br>laugh<b>ed</b> (f) → {T("/t/")}<br>'
    f'clos<b>ed</b> (z) → {D("/d/")}<br>hat<b>ed</b> (t) → {I("/id/")}</div></div></div>',
    tools=False))

# A. Clap it (handout page 2, same words and order)
clap = [('helped', 't'), ('visited', 'i'), ('opened', 'd'), ('waited', 'i'), ('danced', 't'), ('lived', 'd'),
        ('painted', 'i'), ('asked', 't'), ('ended', 'i'), ('stayed', 'd'), ('fixed', 't'), ('needed', 'i')]
cells = ''.join(f'<div class="tap box" style="text-align:center;padding:.8em"><div class="tl">{w}</div>'
                f'<div class="ans tb">{"👏👏 2" if k == "i" else "👏 1"} · {TEAM[k]}</div></div>' for w, k in clap)
slides.append(frame(K1, 'A. Clap it! 1 or 2 claps?',
    '<div class="sub">Say the word. Clap it. Circle <b>1</b> or <b>2</b> on your handout.</div>'
    f'<div class="grid3" style="grid-template-columns:repeat(4,1fr);flex:1">{cells}</div>'
    '<div class="hint">Careful: count only the new clap. visit → visit-id = 2. Tap to check.</div>'))

# B. Sort it (handout words)
sort_words = [('worked', 't'), ('called', 'd'), ('started', 'i'), ('laughed', 't'), ('cleaned', 'd'), ('decided', 'i'),
              ('watched', 't'), ('played', 'd'), ('wanted', 'i'), ('washed', 't'), ('rained', 'd'), ('invited', 'i')]
chips = ''.join(f'<span class="chip" data-k="{k}">{w}</span>' for w, k in sort_words)
slides.append(frame(K1, 'B. Sort it!',
    f'<div class="chips pool">{chips}</div>'
    '<div class="row" style="flex:1">'
    f'<div class="bin bt" data-k="t"><h4>{T("/t/")}</h4><div class="chips"></div></div>'
    f'<div class="bin bd" data-k="d"><h4>{D("/d/")}</h4><div class="chips"></div></div>'
    f'<div class="bin bi" data-k="i"><h4>{I("/id/")}</h4><div class="chips"></div></div></div>'
    '<div class="hint">Tap a word, then tap its team. Say it out loud!</div>'))

# C. Listen (handout listening script)
lis = [('clean', 'cleaned', 1, 'We cleaned the kitchen.'), ('watch', 'watched', 0, 'I watch TV at night.'),
       ('want', 'wanted', 1, 'They wanted a new car.'), ('cook', 'cooked', 0, 'I cook rice for my family.'),
       ('call', 'called', 1, 'They called their sister.'), ('need', 'needed', 0, 'We need help.')]
cells = ''.join(f'<div class="tap box" style="text-align:center;padding:1em;display:flex;flex-direction:column;justify-content:center;gap:.5em"><div class="tb"><span class="n">{n}.</span>{a} · {b}</div>'
                f'<div class="ans"><div class="tl grn">{b if k else a}</div><div class="t muted">“{s}”</div></div></div>'
                for n, (a, b, k, s) in enumerate(lis, 1))
slides.append(frame(K1, 'C. Listen. Circle the word you hear.',
    '<div class="sub">Your teacher says a sentence two times. Circle the word on your handout.</div>'
    f'<div class="grid3" style="flex:1">{cells}</div>'
    '<div class="hint">Tap to show the answer after you read it.</div>'))

# This week's verbs + D. Yesterday I…
wk = [('volunteered', 'd'), ('donated', 'i'), ('helped', 't')]
cells = ''.join(f'<div class="tap box" style="text-align:center;display:flex;flex-direction:column;justify-content:center;gap:.4em">'
                f'<div class="big" style="font-size:8em">{w}</div><div class="ans tl">{"👏👏" if k == "i" else "👏"} {TEAM[k]}</div></div>'
                for w, k in wk)
slides.append(frame(K1, 'This week’s verbs',
    '<div class="sub">Clap it. Show <b>1</b> or <b>2</b> fingers. Then add it to the chart on page 1.</div>'
    f'<div class="grid3" style="flex:1">{cells}</div>'
    '<div class="hint">Tap to check.</div>'))

slides.append(frame(K1, 'D. Yesterday I…',
    '<div class="box tb" style="background:#fff8e6;text-align:center"><b>You make up the sentences.</b> It is about your life. Many answers are OK.</div>'
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tb">1. Write <b>3 sentences</b> with an -ed verb.</div>'
    f'<div class="tb">2. <u>Underline</u> the -ed verb. Write {T("t")}, {D("d")}, or {I("id")}.</div>'
    '<div class="tb">3. Read them to a partner. Your partner shows <b>1</b> or <b>2</b> fingers.</div></div>'
    '<div class="box tap" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tb muted">Tap for examples. Yours will be different!</div>'
    f'<div class="ans tb">Yesterday I <u>cooked</u> chicken. {T("t")}<br>Yesterday I <u>called</u> my mom. {D("d")}<br>'
    f'Yesterday I <u>waited</u> for the bus. {I("id")}</div></div></div>'
    '<div class="box t" style="text-align:center">📱 Practice at home: <b>-ed Sounds Game</b> in the app. A little every day!</div>',
    tools=False))

# =================== PART 2: App news ===================
K2 = 'Part 2 · What’s new in the app'
slides.append(divider(2, 'What’s new<br>in the app', 'The <b>Course Map</b> looks different. Let’s look together.'))
slides.append(shot_slide(K2, 'Map: one week at a time', '1-map.png', [
    '<b>Start here</b> = do this one next.',
    '<b>Done</b> ✓ = finished. Great!',
    '<b>Opens later</b> 🔒 = not open yet.',
    '<b>0 of 5 done</b> = your progress this week.',
    '<b>Extra</b> = more practice. Not required.',
]))
slides.append(shot_slide(K2, 'See all the weeks', '2-all-weeks.png', [
    'Tap <b>All weeks</b> to see every week.',
    '<span class="org"><b>Orange</b></span> = <b>Not finished</b>. Tap a week to go there.',
    '<b>2 left</b> = 2 activities to finish. Tap <b>✕</b> to close.',
]))
slides.append(shot_slide(K2, 'Questions for class', '3-questions.png', [
    'Go to <b>Home</b>. Scroll down → <b>Questions for class</b>.',
    'Something not clear? <b>Ask before class.</b>',
    '🔴 Red dot = your teacher answered. Tap <b>Read</b>.',
]))
slides.append(frame(K2, 'Quizzes: more tapping, less typing', tue.stack(
    '<div class="tl" style="font-weight:400">⌨️ You <b>type</b> only the verb chart (V1, V1-s, V-ing, V2, V3).</div>'
    '<div class="tl" style="font-weight:400">👆 Everything else: <b>tap</b> the answer.</div>'
    '<div class="tl" style="font-weight:400">📝 <b>Week 10 Quiz</b> opens <b>tonight at 6 PM</b>.</div>'
    '<div class="tl" style="font-weight:400">📅 Due <b>Tuesday, Nov. 24</b>.</div>', ';padding-left:5em'), tools=False))
slides.append(frame(K2, 'New extra games for Week 10',
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1em">'
    '<div class="tl org">Time Words: Which Verb?</div>'
    '<div class="tb">Look at the time word. Pick <span class="pill p-s">V2</span> or <span class="pill p-u">have / has + V3</span>.</div></div>'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1em">'
    '<div class="tl grn">Time Indicators: Past Simple vs Present Perfect</div>'
    '<div class="tb">Sort the time words into two groups.</div></div></div>'
    '<div class="box tb" style="background:#fff8e6;text-align:center">Find them on the Map, Week 10, under <b>Extra</b>.</div>',
    tools=False))

# =================== PART 3: Week 9 stars + quiz check ===================
deck = open(TUE_DECK, encoding='utf-8').read()
base_css = re.search(r'<style>(.*?)</style>', deck, re.S).group(1)
quiz = re.search(r'<section class="slide"><img src="([^"]+)" alt="Weekly quiz check[^"]*"></section>', deck)
slides.append(divider(3, 'Week 9 stars', 'For everyone who missed Tuesday 👏'))
slides.append(img_slide(b64(os.path.join(DL, 'week9-top-learners.png')), 'Top Learners Week 9'))
slides.append(img_slide(b64(os.path.join(DL, 'week9-practice-stars.png')), 'Practice Stars Week 9'))
QUIZ_PNG = os.path.join(DL, 'week10-thursday-quiz-check.png')  # fresh check; falls back to Tuesday's
if os.path.exists(QUIZ_PNG):
    slides.append(img_slide(b64(QUIZ_PNG), 'Weekly quiz check'))
elif quiz:
    slides.append(img_slide(quiz.group(1), 'Weekly quiz check'))

# =================== PART 4: Just, already, yet ===================
K4 = 'Part 4 · Just, already, yet · together'
slides.append(divider(4, 'Just, already, yet', 'All three use <span class="pill p-u">have / has + V3</span>.'))

slides.append(frame(K4, 'Three words, three times',
    '<div class="tl3"><div class="ax"></div><span class="nowl">NOW</span>'
    '<div class="mk" style="left:28%"><i style="background:#2f9e7a"></i><span class="grn">already</span><small>done before now</small></div>'
    '<div class="mk" style="left:78%"><i style="background:#c07a12"></i><span class="org">just</span><small>a moment ago</small></div></div>'
    '<div class="grid3">'
    '<div class="box"><div class="tl grn">already ✓</div><div class="tb">Rosa <b>has already signed</b> up for the food pantry. <span class="muted">(last week)</span></div></div>'
    '<div class="box"><div class="tl org">just ⚡</div><div class="tb">Rosa <b>has just picked</b> up her medicine. <span class="muted">(2 minutes ago)</span></div></div>'
    '<div class="box"><div class="tl pur">yet ⏳</div><div class="tb">Rosa <b>hasn’t gotten</b> her shift time <b>yet</b>. <span class="muted">(not done)</span></div></div></div>',
    tools=False))

slides.append(frame(K4, 'Where do they go?',
    tue.stack(
        '<div class="tl" style="font-weight:400">She <b>has</b> <span class="pill p-u">already</span> <b>signed</b> the form.</div>'
        '<div class="tl" style="font-weight:400">I <b>have</b> <span class="pill p-s">just</span> <b>arrived</b>.</div>'
        '<div class="tl" style="font-weight:400">I <b>haven’t called</b> the landlord <span class="pill p-v">yet</span>.</div>'
        '<div class="tl" style="font-weight:400"><b>Have</b> you <b>eaten</b> <span class="pill p-v">yet</span>?</div>', ';padding-left:5em')
    + '<div class="row"><div class="box tb">just / already → <b>between</b> have and V3</div>'
    '<div class="box tb" style="background:#f3efff">yet → <b>at the end</b> (no / questions)</div></div>',
    tools=False))

chk = [('She arrived two minutes ago. She has ___ arrived.', ['just', 'already', 'yet'], 0),
       ('I paid the rent on Monday. I have ___ paid it.', ['just', 'already', 'yet'], 1),
       ('Have you gotten your EBT card ___?', ['just', 'already', 'yet'], 2),
       ('He hasn’t emailed the plumber ___.', ['just', 'already', 'yet'], 2),
       ('I’m still at the bus stop. I have ___ gotten off the bus.', ['just', 'already', 'yet'], 0),
       ('“Do you need help?” “No thanks, someone has ___ helped me.”', ['just', 'already', 'yet'], 1)]
for g, grp in enumerate(tue.chunks(list(enumerate(chk, 1)), 3), 1):
    items = ''.join(
        f'<div class="q tb" style="display:flex;flex-direction:column;gap:.3em"><span><span class="n">{i}.</span>{s}</span>'
        f'<span style="margin-left:1.9em">{choice3(o, ok)}</span></div>' for i, (s, o, ok) in grp)
    slides.append(frame(K4, 'Just, already, or yet?' + tue.part(g, 2), tue.stack(items)
                        + ('<div class="hint">Tap a word. Wrong answers shake.</div>' if g == 1 else '')))

fix = [('She has yet finished her homework.', 'She <b>hasn’t finished</b> her homework <b>yet</b>.'),
       ('I have texted already my sister.', 'I <b>have already texted</b> my sister.'),
       ('Rosa just has picked up her medicine.', 'Rosa <b>has just picked</b> up her medicine.'),
       ('Have you yet returned the library books?', 'Have you <b>returned</b> the library books <b>yet</b>?')]
items = ''.join(f'<div class="tap" style="padding:.3em .6em"><div class="tb"><span class="n">{i}.</span><s style="text-decoration-color:#e05252">{w}</s></div>'
                f'<div class="ans tb grn" style="margin-left:1.9em">✓ {r}</div></div>' for i, (w, r) in enumerate(fix, 1))
slides.append(frame(K4, 'Fix the mistake', '<div class="sub">Each sentence has the word in the wrong place.</div>'
                    + tue.stack(items) + '<div class="hint">Tap to see the fix.</div>'))

# ---------- Activity: three-person schedules ----------
KA = 'Part 4 · Activity · with a partner'
people = [
    ('👩🏾 Rosa', [('9:00', True, 'volunteer at the food pantry', 'She has already volunteered at the food pantry.'),
                  ('1:55', True, 'get home', 'She has just gotten home.'),
                  ('4:00', False, 'call her sister', 'She hasn’t called her sister yet.'),
                  ('6:00', False, 'cook dinner', 'She hasn’t cooked dinner yet.')]),
    ('👨🏽 Kevin', [('8:00', True, 'open the community center', 'He has already opened the community center.'),
                   ('10:30', True, 'meet the new volunteers', 'He has already met the new volunteers.'),
                   ('1:58', True, 'finish a meeting', 'He has just finished a meeting.'),
                   ('3:00', False, 'send the schedule', 'He hasn’t sent the schedule yet.')]),
    ('👩🏿 Amara', [('7:30', True, 'take her son to soccer', 'She has already taken her son to soccer.'),
                   ('1:59', True, 'buy groceries', 'She has just bought groceries.'),
                   ('5:00', False, 'do the laundry', 'She hasn’t done the laundry yet.'),
                   ('7:00', False, 'pay the electric bill', 'She hasn’t paid the electric bill yet.')]),
]
cols = ''.join(
    f'<div class="box"><h4>{name}</h4>' + ''.join(
        f'<div class="it tap"><span class="tm">{tm}</span><span>{"✅" if done else "⬜"}</span><span>{task}</span>'
        f'<span class="ans">{ans}</span></div>' for tm, done, task, ans in items) + '</div>'
    for name, items in people)
slides.append(frame(KA, 'Saturday schedules',
    '<div class="row" style="flex:0 0 auto;align-items:center"><span class="clock" style="flex:0 0 auto">🕑 It is 2:00 PM now.</span>'
    '<div class="t" style="flex:1">A few minutes ago → <b class="org">just</b> · Earlier → <b class="grn">already</b> · ⬜ Not done → <b class="pur">yet</b></div></div>'
    f'<div class="sched">{cols}</div>'))

slides.append(frame(KA, 'Ask and write',
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tl">1. Ask your partner:</div>'
    '<div class="tb">Has Kevin <b>sent</b> the schedule <b>yet</b>?</div>'
    '<div class="tb grn">No, he hasn’t. He will send it at 3:00.</div>'
    '<div class="tb">Has Amara <b>bought</b> groceries <b>yet</b>?</div>'
    '<div class="tb grn">Yes, she has. She has <b>just</b> bought them.</div></div>'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tl">2. Write 6 sentences:</div>'
    '<div class="tb">2 with <span class="pill p-s">just</span></div>'
    '<div class="tb">2 with <span class="pill p-u">already</span></div>'
    '<div class="tb">2 with <span class="pill p-v">yet</span></div>'
    '<div class="t muted">Check: has / have + V3 · yet at the end</div></div></div>',
    tools=False))

slides.append(frame(KA, 'Your turn: your day today',
    '<div class="box tb" style="background:#fff8e6;text-align:center"><b>You make up the sentences.</b> It is about your day. Many answers are OK.</div>'
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tl" style="font-weight:400">Today, I have <b class="grn">already</b> ___.</div>'
    '<div class="tl" style="font-weight:400">I have <b class="org">just</b> ___.</div>'
    '<div class="tl" style="font-weight:400">I haven’t ___ <b class="pur">yet</b>.</div></div>'
    '<div class="box tap" style="display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tb muted">Tap for examples. Yours will be different!</div>'
    '<div class="ans tb">Today, I have already <b>worked</b> 8 hours.<br>'
    'I have just <b>eaten</b> a snack.<br>I haven’t <b>done</b> my homework yet.</div>'
    '<div class="ans tb muted">or: I have already <b>picked up</b> my kids. · I haven’t <b>called</b> my mom yet.</div></div></div>',
    tools=False))

slides.append(frame('Before Tuesday', 'Before Tuesday 📱',
    tue.stack(
        '<div class="tl" style="font-weight:400">1. Open the <b>Map</b> → Week 10 → tap <b>Start here</b>.</div>'
        '<div class="tl" style="font-weight:400">2. Read the <b>Just, Already, Yet</b> guide.</div>'
        '<div class="tl" style="font-weight:400">3. Take the <b>Week 10 Quiz</b> (opens 6 PM tonight).</div>'
        '<div class="tl" style="font-weight:400">4. Log your practice: one <span class="pill p-s">V2</span> sentence a day.</div>', ';padding-left:5em')
    + '<div class="box tb" style="text-align:center">Quiz due <b>Tuesday, Nov. 24</b>. No class Thursday, Nov. 26 🦃</div>',
    tools=False))

# ---------- assemble ----------
html = ('<!doctype html><html><head><meta charset="utf-8"><title>Thursday 11/19 · Unit 3 Week 10</title>'
        f'<style>{base_css}{CSS}</style></head><body>' + ''.join(slides)
        + '<div class="count" id="c"></div>' + tue.JS.replace('</body></html>', '') + '</body></html>')
open(OUT, 'w', encoding='utf-8').write(html)
missing = [f for f in ('1-map.png', '2-all-weeks.png', '3-questions.png')
           if not os.path.exists(os.path.join(SHOTS, f))]
print(f'{len(slides)} slides → {OUT}')
if missing:
    print('placeholders for:', ', '.join(missing))
