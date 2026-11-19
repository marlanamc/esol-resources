#!/usr/bin/env python3
"""Interactive slides for the Week 10 modified Tuesday packet (11/17).

Prepends packet slides to the existing Tuesday deck. Reads the untouched
backup so re-running never stacks duplicate slides:

  python3 build-week10-tuesday-slides.py \
      ~/Downloads/tuesday-11-17-unit3-week10-slides.original.html \
      ~/Downloads/tuesday-11-17-unit3-week10-slides.html

Keys: arrows / space move, F = fullscreen, #5 in the URL opens slide 5.
Interactive bits (buttons, blanks, chips) never advance the slide.
"""
import re
import sys

CSS = r"""
.frame{--u:min(.521vw,.926vh);width:min(100vw,177.78vh);height:min(100vh,56.25vw);font-size:min(.521vw,.926vh);
 background:radial-gradient(circle at 15% 10%,#fff6dc 0,transparent 40%),radial-gradient(circle at 90% 95%,#dff3ec 0,transparent 45%),#fbf8f1;
 padding:4.6em 10em 6.5em;display:flex;flex-direction:column;gap:3.2em;position:relative;cursor:default}
.hd{display:flex;justify-content:space-between;align-items:baseline}
.hd .k{font-size:2.8em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c07a12}
.hd .pg{font-size:2.6em;font-weight:600;color:#8a8f98}
.frame h3{font-size:7.4em;font-weight:800;line-height:1.05}
.frame h3 small{font-size:.55em;font-weight:600;color:#2f9e7a;margin-left:.4em}
.sub{font-size:3.6em;line-height:1.3;color:#3b4654}
.box{background:#fff;border-radius:calc(var(--u)*2.4);padding:calc(var(--u)*2.4) calc(var(--u)*3);box-shadow:0 .4em 1.8em rgba(31,42,55,.08)}
.row{display:flex;gap:3em}.row>*{flex:1}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1.8em 3em}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2em}
.t{font-size:3.6em;line-height:1.35}
.tb{font-size:4.4em;line-height:1.3}
.tl{font-size:5.6em;line-height:1.2;font-weight:700}
.muted{color:#6b7280}.grn{color:#2f9e7a}.org{color:#c07a12}.pur{color:#6d28d9}
.u{text-decoration:underline;text-decoration-thickness:.12em;text-underline-offset:.15em;font-weight:700}
.pill{display:inline-block;padding:.1em .6em;border-radius:999px;font-weight:700;white-space:nowrap}
.p-s{background:#fde7c7;color:#9a5b05}.p-u{background:#dff3ec;color:#1f7a5c}.p-v{background:#ede9fe;color:#6d28d9}
.n{display:inline-block;min-width:1.5em;font-weight:800;color:#c07a12}
/* tap to reveal */
.tap{cursor:pointer;border-radius:1em;transition:background .2s}
.tap .ans{visibility:hidden}
.tap.shown .ans{visibility:visible}
.tap:not(.shown):hover{background:#fff8e6}
.blank{display:inline-block;min-width:5.5em;border-bottom:.12em solid #1f2a37;text-align:center;cursor:pointer;padding:0 .3em}
.blank .ans{visibility:hidden;color:#2f9e7a;font-weight:800}
.blank.shown .ans{visibility:visible}
.hint{font-size:2.4em;color:#9aa1ab;font-style:italic}
/* choice buttons */
.opts{white-space:nowrap}
.opt{font:inherit;font-weight:700;border:.12em solid #c9ced6;background:#fff;color:#1f2a37;border-radius:.6em;padding:.05em .45em;cursor:pointer;margin:0 .1em}
.opt:hover{border-color:#6d28d9}
.opt.ok{background:#2f9e7a;border-color:#2f9e7a;color:#fff}
.opt.no{background:#fde2e2;border-color:#e05252;color:#b42323;animation:sh .35s}
.q.done .opt:not(.ok){opacity:.35}
@keyframes sh{25%{transform:translateX(-.25em)}75%{transform:translateX(.25em)}}
.fix{color:#2f9e7a;font-weight:800;visibility:hidden}
.q.done .fix{visibility:visible}
/* tools */
.tools{position:absolute;right:10em;bottom:1.6em;display:flex;gap:1.2em}
.tool{font:inherit;font-size:2.4em;font-weight:700;border:none;border-radius:999px;padding:.35em 1.1em;cursor:pointer;background:#ede9fe;color:#6d28d9}
.tool.rs{background:#eef0f3;color:#5b6573}
/* sort */
.chips{display:flex;flex-wrap:wrap;gap:1.4em;justify-content:center;min-height:6em}
.chip{font-size:3.6em;font-weight:700;background:#fff;border:.1em solid #c9ced6;border-radius:999px;padding:.2em .8em;cursor:pointer;box-shadow:0 .1em .3em rgba(0,0,0,.06)}
.chip.sel{border-color:#6d28d9;background:#f3efff;transform:scale(1.06)}
.chip.ok{border-color:#2f9e7a;background:#e6f6f0;cursor:default}
.chip.no{border-color:#e05252;background:#fde2e2;animation:sh .35s}
.bin{flex:1;border-radius:2.4em;padding:2em 2.4em;min-height:30em;cursor:pointer;border:.35em dashed transparent}
.bin.bs{background:#fff4e2}.bin.bu{background:#e7f6f0}
.bin.hot{border-color:#6d28d9}
.bin h4{font-size:4.2em;margin-bottom:.6em}
.bin .chips{justify-content:flex-start}
/* timeline */
.tline{position:relative;height:9em;margin:2em 1em 1em}
.tline .ax{position:absolute;left:0;right:3em;top:4.4em;height:.5em;background:#1f2a37;border-radius:1em}
.tline .ax:after{content:"";position:absolute;right:-1.6em;top:-1.1em;border:1.35em solid transparent;border-left:2em solid #1f2a37}
.tline .now{position:absolute;right:0;top:0;font-size:2.6em;font-weight:800}
.tline .past{position:absolute;left:0;top:2.6em;font-size:2.4em;color:#6b7280}
.tline .dot{position:absolute;top:3.3em;width:2.7em;height:2.7em;border-radius:50%;background:#c07a12;left:55%}
.tline .dl{position:absolute;top:0;left:55%;transform:translateX(-30%);font-size:2.6em;font-weight:800;color:#c07a12}
.tline .span{position:absolute;top:3.2em;left:4%;right:10%;height:2.8em;border-radius:2em;background:repeating-linear-gradient(90deg,#2f9e7a 0 1.4em,transparent 1.4em 2.6em);opacity:.55}
.tline .ql{position:absolute;top:-.2em;left:45%;font-size:3.6em;font-weight:900;color:#2f9e7a}
/* dialogue */
.line{font-size:5.2em;line-height:1.3;padding:.35em .6em;border-radius:.6em;opacity:0;transform:translateY(.3em);transition:.3s}
.line.on{opacity:1;transform:none}
.line .why{font-size:.62em;color:#6d28d9;font-weight:700;margin-left:.5em}
/* table */
table.vt{border-collapse:separate;border-spacing:0;width:100%;background:#fff;border-radius:2em;overflow:hidden;box-shadow:0 .4em 1.8em rgba(31,42,55,.08)}
.vt th,.vt td{font-size:4.6em;padding:.45em .5em;text-align:center;border-bottom:.04em solid #e6e8ec}
.vt th{background:#2f9e7a;color:#fff;font-size:3.4em;line-height:1.15}
.vt th small{display:block;font-weight:500;font-size:.7em;opacity:.9}
.vt td:first-child{font-weight:800}
.vt td.tap{color:#2f9e7a;font-weight:800}
/* board game */
.board{display:grid;grid-template-columns:repeat(5,1fr);gap:1.4em}
.cell{background:#fff;border-radius:1.6em;padding:1.2em 1.2em;cursor:pointer;position:relative;box-shadow:0 .2em .8em rgba(31,42,55,.08);min-height:14em}
.cell b{font-size:2.6em;color:#c07a12}
.cell .e{font-size:4.6em;display:block;line-height:1.2}
.cell .qq{font-size:2.9em;line-height:1.2;font-weight:600}
.cell.x:after{content:"✗";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14em;color:rgba(224,82,82,.75);font-weight:900}
.cell.x{background:#f6f6f6}
.nav{position:fixed;bottom:1vh;width:5vh;height:5vh;border-radius:50%;border:none;background:rgba(0,0,0,.08);color:#555;font-size:2.6vh;cursor:pointer;opacity:.5;z-index:5}
.nav:hover{opacity:1}.nav.pv{left:1vw}.nav.nx{left:calc(1vw + 6vh)}
"""


def frame(kicker, page, title, body, tools=True):
    t = ('<div class="tools"><button class="tool all">Show all</button>'
         '<button class="tool rs">↺ Reset</button></div>') if tools else ''
    return (f'<section class="slide"><div class="frame">'
            f'<div class="hd"><span class="k">{kicker}</span><span class="pg">Packet p. {page}</span></div>'
            f'<h3>{title}</h3>{body}{t}</div></section>')


def blank(ans, w=None):
    st = f' style="min-width:{w}em"' if w else ''
    return f'<span class="blank"{st}><span class="ans">{ans}</span></span>'


def choice(a, b, ok, sep='/'):
    """Two inline option buttons; ok = 0 or 1."""
    return (f'<span class="opts"><button class="opt" data-ok="{int(ok == 0)}">{a}</button>{sep}'
            f'<button class="opt" data-ok="{int(ok == 1)}">{b}</button></span>')


K1 = "Part 1 · Time words · together"
K2 = "Part 2 · Warm-up + game · on your own"
slides = []


def part(n, total):
    return f' <small>{n} of {total}</small>' if total > 1 else ''


def chunks(lst, n):
    return [lst[k:k + n] for k in range(0, len(lst), n)]


def stack(items, extra=''):
    """Single roomy column of items, spread down the slide."""
    return f'<div class="box" style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly{extra}">{items}</div>'


# ---------- p1 Writing warm-up ----------
slides.append(frame("Writing warm-up · everyone · 10 minutes", 1, "Write about your life",
    '<div class="row" style="flex:1">'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1.4em">'
    '<div class="tl">How long have you…?</div>'
    '<div class="tb"><span class="pill p-u">for</span> + time → for 4 years</div>'
    '<div class="tb"><span class="pill p-u">since</span> + start → since 2019</div></div>'
    '<div class="box" style="display:flex;flex-direction:column;justify-content:center;gap:1.4em">'
    '<div class="tl">Have you ever…?</div>'
    '<div class="tb">Yes, I have. / No, I haven’t.</div>'
    '<div class="tb">+ one more sentence.<br>A time word? → <span class="pill p-s">V2</span></div></div></div>'
    '<div class="box tb" style="background:#fff8e6;text-align:center"><b>You make up the answer.</b> It is about your life. Many answers are OK.</div>',
    tools=False))

wu = [
    ("How long have you lived in Boston?", "I have lived in Boston <b>for 4 years</b>.",
     "I have lived in Boston since 2019."),
    ("How long have you studied English?", "I have studied English <b>since 2023</b>.", ""),
    ("Have you ever taken the Silver Line?", "Yes, I have. I took it to the airport <b>last month</b>.",
     "No, I haven’t. I take the bus."),
    ("Have you ever worked in customer service?", "No, I haven’t. I have worked in a kitchen.", ""),
    ("How long have you worked at your job?", "I have worked at my job <b>for 2 years</b>.",
     "I have looked for a job since September."),
    ("Have you ever paid a bill online?", "Yes, I have. I paid my phone bill online <b>last week</b>.", ""),
]
for g, grp in enumerate(chunks(list(enumerate(wu, 1)), 3), 1):
    cards = ''.join(
        f'<div class="tap" style="padding:.4em .6em"><div class="tb"><span class="n">{i}.</span><b>{q}</b></div>'
        f'<div class="ans t grn" style="margin:.3em 0 0 1.9em">{ex}'
        + (f' <span class="muted">or: {oth}</span>' if oth else '') + '</div></div>'
        for i, (q, ex, oth) in grp)
    slides.append(frame("Writing warm-up · everyone · 10 minutes", 1, "Write about your life" + part(g, 2),
        stack(cards)
        + ('<div class="hint">Tap a question to see an example.</div>' if g == 1
           else '<div class="hint">★ Star your best answer. Read it to a teacher.</div>')))

# ---------- p2 Have has two jobs ----------
slides.append(frame(K1, 2, "<i>Have</i> has two jobs",
    '<div class="row" style="flex:1">'
    '<div class="box" style="background:#fff4e2;display:flex;flex-direction:column;justify-content:center;gap:1.2em">'
    '<div class="tl org">Have = I own it 🔑</div>'
    '<div class="tl" style="font-weight:400">I <b>have</b> <span class="u">a car</span>.</div>'
    '<div class="tb muted">have + a thing</div></div>'
    '<div class="box" style="background:#e7f6f0;display:flex;flex-direction:column;justify-content:center;gap:1.2em">'
    '<div class="tl grn">Have = helper 🤝</div>'
    '<div class="tl" style="font-weight:400">I <b>have</b> <span class="u">driven</span> a car.</div>'
    '<div class="tb muted">have + V3</div></div></div>'
    '<div class="box tb" style="background:#f3efff;text-align:center"><b>Test:</b> Look at the word <b>after</b> have. A thing? → own it. A <span class="pill p-v">V3</span>? → helper.</div>',
    tools=False))

# ---------- p2 Own it or helper ----------
oh = [("I <b>have</b> two jobs.", 0), ("I <b>have</b> worked at two jobs.", 1),
      ("She <b>has</b> a new phone.", 0), ("She <b>has</b> lost her phone.", 1),
      ("We <b>have</b> a meeting on Monday.", 0), ("We <b>have</b> met our new neighbors.", 1),
      ("<b>Has</b> he seen the doctor?", 1), ("Do you <b>have</b> a doctor?", 0)]
for g, grp in enumerate(chunks(list(enumerate(oh, 1)), 4), 1):
    items = ''.join(
        f'<div class="q tb" style="display:flex;justify-content:space-between;align-items:center;gap:1em"><span><span class="n">{i}.</span>{s}</span>'
        f'{choice("🔑 Own it", "🤝 Helper", ok, " ")}</div>'
        for i, (s, ok) in grp)
    slides.append(frame(K1, 2, "Own it or helper?" + part(g, 2), stack(items, ';padding-left:6em;padding-right:6em')))
slides.append(frame(K1, 2, "★ Challenge",
    '<div class="box tap" style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:2em;text-align:center">'
    '<div class="tl" style="font-size:7em;font-weight:400">I <b>have had</b> my car for 5 years.</div>'
    '<div class="tb">Which word is the <b>helper</b>? Which word is <b>“own it”</b>?</div>'
    '<div class="ans tl grn"><b>have</b> = helper · <b>had</b> = V3 of have (own it)</div></div>'
    '<div class="hint">Tap to see the answer.</div>'))

# ---------- p2 Experience backpack ----------
slides.append(frame(K1, 2, "Why <i>have</i>? Your experience backpack",
    '<div class="row" style="flex:1">'
    '<div class="box" style="background:#e7f6f0;display:flex;flex-direction:column;justify-content:space-evenly;text-align:center">'
    '<div style="font-size:16em;line-height:1">🎒</div>'
    '<div class="tl">I <b class="grn">have eaten</b> sushi.</div>'
    '<div class="tb">It is in my backpack <b>now</b>. No date.</div>'
    '<div class="tb"><span class="pill p-u">have + V3</span></div></div>'
    '<div class="box" style="background:#fff4e2;display:flex;flex-direction:column;justify-content:space-evenly;text-align:center">'
    '<div style="font-size:16em;line-height:1">📷</div>'
    '<div class="tl">I <b class="org">ate</b> sushi <span class="u">yesterday</span>.</div>'
    '<div class="tb">An old photo with a date. Finished.</div>'
    '<div class="tb"><span class="pill p-s">V2</span></div></div></div>',
    tools=False))

# ---------- p3 Specified vs unspecified ----------
slides.append(frame(K1, 3, "V2 or have + V3?",
    '<div class="row" style="flex:1">'
    '<div class="box" style="background:#fff4e2;display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tl org">Specified Time → <span class="pill p-s">V2</span></div>'
    '<div class="tline"><div class="ax"></div><span class="now">NOW</span><span class="past">past</span>'
    '<span class="dl">yesterday</span><span class="dot"></span></div>'
    '<div class="tb">You say <b>when</b>. It is finished.</div>'
    '<div class="tl">I <b class="org">ate</b> sushi <span class="u">yesterday</span>.</div></div>'
    '<div class="box" style="background:#e7f6f0;display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tl grn">Unspecified Time → <span class="pill p-u">have + V3</span></div>'
    '<div class="tline"><div class="ax"></div><span class="now">NOW</span><span class="past">past</span>'
    '<span class="span"></span><span class="ql">?</span></div>'
    '<div class="tb">You don’t say when. Any time up to now.</div>'
    '<div class="tl">I <b class="grn">have eaten</b> sushi <span class="u">two times</span>.</div></div></div>'
    '<div class="box tb" style="background:#f3efff;text-align:center"><b>Ask:</b> Can I put my finger on <b>one day</b>? &nbsp; Yes → <span class="pill p-s">V2</span> &nbsp; No → <span class="pill p-u">have / has + V3</span></div>',
    tools=False))

# ---------- p3 A. Sort ----------
words = [("yesterday", "s"), ("never", "u"), ("in 2019", "s"), ("before", "u"),
         ("when I was a child", "s"), ("ever", "u"), ("on Saturday", "s"), ("many times", "u"),
         ("last summer", "s"), ("three times", "u"), ("two years ago", "s"), ("twice", "u")]
chips = ''.join(f'<span class="chip" data-k="{k}">{w}</span>' for w, k in words)
slides.append(frame(K1, 3, "A. Sort the time words",
    f'<div class="chips pool">{chips}</div>'
    '<div class="row" style="flex:1">'
    '<div class="bin bs" data-k="s"><h4 class="org">Specified Time → V2</h4><div class="chips"></div></div>'
    '<div class="bin bu" data-k="u"><h4 class="grn">Unspecified Time → have / has + V3</h4><div class="chips"></div></div></div>'
    '<div class="hint">Tap a time word, then tap a box.</div>'))

# ---------- p3 B. Circle the verb ----------
cv = [("I", "saw", "have seen", 0, "my cousin <span class='u'>yesterday</span>."),
      ("She", "visited", "has visited", 1, "Boston <span class='u'>two times</span>."),
      ("We", "came", "have come", 0, "to the U.S. <span class='u'>in 2021</span>."),
      ("My son", "took", "has taken", 1, "a plane <span class='u'>many times</span>."),
      ("He", "started", "has started", 0, "his job <span class='u'>three years ago</span>."),
      ("<span class='u'>Last night</span>, we", "ate", "have eaten", 0, "pizza."),
      ("I", "saw", "have seen", 1, "that movie <span class='u'>twice</span>."),
      ("My friends", "visited", "have visited", 0, "my house <span class='u'>on Saturday</span>."),
      ("", "Did you go", "Have you been", 1, "to New York <span class='u'>before</span>?"),
      ("When", "did you start", "have you started", 0, "English?")]
for g, grp in enumerate(chunks(list(enumerate(cv, 1)), 5), 1):
    items = ''.join(f'<div class="q tb"><span class="n">{i}.</span>{a} ({choice(x, y, ok)}) {b}</div>'
                    for i, (a, x, y, ok, b) in grp)
    sub = ('<div class="sub">Look at the time word first. Example: I (<b class="grn">called</b> / have called) my mom <span class="u">last night</span>.</div>'
           if g == 1 else '')
    slides.append(frame(K1, 3, "B. Circle the verb" + part(g, 2), sub + stack(items)))

# ---------- p4 C. Right or wrong ----------
rw = [("I have seen him <span class='u'>yesterday</span>.", 1, "I saw him yesterday."),
      ("Have you <span class='u'>ever</span> been to Canada?", 0, ""),
      ("She has moved here <span class='u'>in 2020</span>.", 1, "She moved here in 2020."),
      ("I went to the beach <span class='u'>last summer</span>.", 0, ""),
      ("<span class='u'>When</span> have you arrived?", 1, "When did you arrive?"),
      ("We have eaten there <span class='u'>many times</span>.", 0, "")]
for g, grp in enumerate(chunks(list(enumerate(rw, 1)), 3), 1):
    items = ''.join(
        f'<div class="q"><div class="tl" style="font-weight:400;display:flex;justify-content:space-between;align-items:center;gap:1em">'
        f'<span><span class="n">{i}.</span>{s}</span>{choice("✓ Right", "✗ Wrong", ok, " ")}</div>'
        f'<div class="fix tb" style="margin:.2em 0 0 1.9em">{("→ " + fx) if fx else "✓ Correct!"}</div></div>'
        for i, (s, ok, fx) in grp)
    sub = '<div class="sub">Look at the time word first. Wrong? Say it the right way.</div>' if g == 1 else ''
    slides.append(frame(K1, 4, "C. Right or wrong?" + part(g, 2), sub + stack(items)))

# ---------- p4 D. The switch ----------
slides.append(frame(K1, 4, "D. The switch: <i>ever</i> → <i>when</i>",
    '<div class="sub">First ask about <b>any time</b>. Then ask about <b>one time</b>. The verb changes!</div>'
    '<div class="box steps" style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="line" style="background:#e7f6f0"><b>A:</b> Have you <span class="u">ever</span> <b>lost</b> your keys?<span class="why">have + V3</span></div>'
    '<div class="line"><b>B:</b> Yes, I have.</div>'
    '<div class="line" style="background:#fff4e2"><b>A:</b> <span class="u">When</span> <b>did</b> you <b>lose</b> them?<span class="why">did + V1</span></div>'
    '<div class="line" style="background:#fff4e2"><b>B:</b> I <b>lost</b> them <span class="u">last month</span>, at work!<span class="why">V2</span></div></div>'
    '<div class="hint">Tap “Next line” to build the conversation.</div>'
    '<div class="tools"><button class="tool step">Next line ▸</button><button class="tool rs">↺ Reset</button></div>',
    tools=False))
slides.append(frame(K1, 4, "D. Your turn with a partner",
    '<div class="box" style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="tb">You pick the idea:</div>'
    '<div class="tb" style="display:flex;flex-wrap:wrap;gap:.6em">'
    '<span class="pill p-v">go to a wedding</span><span class="pill p-v">cook for a big party</span><span class="pill p-v">see the ocean</span>'
    '<span class="pill p-v">take a test in English</span><span class="pill p-v">ride a bike in Boston</span></div>'
    '<div class="tl" style="font-weight:400;line-height:1.6">A: Have you ever ________ ?<br>B: Yes, I have.<br>'
    'A: When did you ________ ?<br>B: I ________ .</div></div>'
    '<div class="hint">Talk first. Then write your conversation.</div>',
    tools=False))

# ---------- p4 E. App game ----------
slides.append(frame(K1, 4, "E. Finish on the app 📱",
    '<div class="box" style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:3em;text-align:center">'
    '<div class="tl" style="font-size:7em">The <span class="pur">Time Indicators</span> game</div>'
    '<div class="tl" style="font-weight:400">Play <b>Round 1</b>. Write your score in your packet.</div></div>',
    tools=False))

# ---------- p5 1. Meeting words ----------
mw = [("At the tenant meeting, I will", "raise a concern", "about the broken heat."),
      ("Everyone can", "participate", "in the meeting."),
      ("My doctor is great. I", "recommend", "her to all my friends."),
      ("<span class='u'>Finally</span>, we", "reached an agreement", ": the party is on Friday."),
      ("My manager asked for ideas. I", "suggested", "a new schedule.")]
bank = ('<div class="box tb" style="text-align:center;background:#f3efff;display:flex;flex-wrap:wrap;gap:.5em;justify-content:center">'
        '<span class="pill p-v">participate</span><span class="pill p-v">suggested</span><span class="pill p-v">recommend</span>'
        '<span class="pill p-v">reached an agreement</span><span class="pill p-v">raise a concern</span></div>')
for g, grp in enumerate(chunks(list(enumerate(mw, 1)), 3), 1):
    items = ''.join(f'<div class="tb"><span class="n">{i}.</span>{a} {blank(b, 8)} {c}</div>' for i, (a, b, c) in grp)
    slides.append(frame(K2, 5, "1. Meeting words" + part(g, 2), bank + stack(items)
        + ('<div class="hint">Tap a blank to check.</div>' if g == 1 else '')))

# ---------- p5 2. Have you ever / Did you ----------
hd = [("volunteered at a food bank?", 0), ("help out at the cleanup <span class='u'>last Saturday</span>?", 1),
      ("signed up for a class online?", 0), ("donate clothes <span class='u'>last winter</span>?", 1),
      ("supported a friend in a hard time?", 0)]
slides.append(frame(K2, 5, "2. <i>Have you ever…?</i> or <i>Did you…?</i>",
    '<div class="row" style="flex:1">'
    '<div class="box" style="background:#e7f6f0;display:flex;flex-direction:column;justify-content:center;gap:1em">'
    '<div class="tl grn">Have you ever + V3?</div><div class="tb">any time in your life</div>'
    '<div class="tb" style="margin-top:1em">Have you ever <b>donated</b> blood?</div></div>'
    '<div class="box" style="background:#fff4e2;display:flex;flex-direction:column;justify-content:center;gap:1em">'
    '<div class="tl org">Did you + V1?</div><div class="tb">one finished time</div>'
    '<div class="tb" style="margin-top:1em">Did you <b>donate</b> blood <span class="u">last year</span>?</div></div></div>'
    '<div class="box tb" style="background:#f3efff;text-align:center"><b>Look at the verb.</b> V3? → Have you ever. &nbsp;V1? → Did you.</div>',
    tools=False))
items = ''.join(f'<div class="q tb"><span class="n">{i}.</span>({choice("Have you ever", "Did you", ok)}) {s}</div>'
                for i, (s, ok) in enumerate(hd, 1))
slides.append(frame(K2, 5, "2. Circle the right start", stack(items)))

# ---------- p5 3. Finish the sentence ----------
slides.append(frame(K2, 5, "3. Finish the sentence about you",
    '<div class="box" style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly;text-align:center">'
    '<div class="tl" style="font-size:7em;font-weight:400">I have never <b class="grn">seen snow</b>.</div>'
    '<div class="tap"><div class="tb muted">Other good answers (tap)</div>'
    '<div class="ans tl" style="font-weight:400">I have never <b class="grn">ridden a horse</b>.<br>I have never <b class="grn">eaten sushi</b>.</div></div></div>'
    '<div class="box tb" style="background:#fff8e6;text-align:center"><b>You make up the ending.</b> Use your own ideas. &nbsp;<span class="pill p-u">have / has (never) + V3</span></div>',
    tools=False))
slides.append(frame(K2, 5, "3. Your turn",
    stack('<div class="tl" style="font-weight:400"><span class="n">1.</span>I have never ____________ .</div>'
          '<div class="tl" style="font-weight:400"><span class="n">2.</span>I have ____________ many times.</div>'
          '<div class="tl" style="font-weight:400"><span class="n">3.</span>My family has never ____________ .</div>'
          '<div class="tl" style="font-weight:400"><span class="n">4.</span>Have you ever ____________ ?</div>',
          ';padding-left:6em'),
    tools=False))

# ---------- p6 4. Verb forms (V1 only, tap to reveal) + completed ----------
def vtable(rows, hidden):
    head = ('<tr><th>V1<small>base</small></th><th>V1-s<small>he / she / it</small></th>'
            '<th>V-ing<small>-ing</small></th><th>V2<small>past</small></th><th>V3<small>past participle</small></th></tr>')
    body = ''
    for r in rows:
        body += '<tr><td>' + r[0] + '</td>' + ''.join(
            (f'<td class="tap"><span class="ans">{c}</span></td>' if hidden else f'<td class="grn" style="font-weight:800">{c}</td>')
            for c in r[1:]) + '</tr>'
    return f'<table class="vt">{head}{body}</table>'


vrows = [("meet", "meets", "meeting", "met", "met"), ("speak", "speaks", "speaking", "spoke", "spoken")]
slides.append(frame(K2, 6, "4. Verb forms of the week",
    '<div class="sub">Write the other forms of <b>meet</b> and <b>speak</b>. They are on this week’s quiz!</div>'
    f'<div style="flex:1;display:flex;align-items:center">{vtable(vrows, True)}</div>'
    '<div class="hint">Tap a box to check one form.</div>'))
slides.append(frame(K2, 6, "4. Verb forms of the week <small>check</small>",
    '<div class="sub">Check your chart. <b>met = met</b> (V2 and V3 are the same). <b>spoke ≠ spoken</b>.</div>'
    f'<div style="flex:1;display:flex;align-items:center">{vtable(vrows, False)}</div>',
    tools=False))

# ---------- p6 5. Use the right form ----------
rf = [("<span class='u'>Every month</span>, the neighborhood group", "meets", "at the library.", "meet"),
      ("<span class='u'>Right now</span>, a parent is", "speaking", "at the school meeting.", "speak"),
      ("<span class='u'>Yesterday</span>, I didn’t", "meet", "my child’s new teacher.", "meet"),
      ("<span class='u'>Last night</span>, did she", "speak", "up about parking?", "speak"),
      ("My daughter doesn’t", "speak", "Spanish at school <span class='u'>every day</span>.", "speak"),
      ("<span class='u'>Right now</span>, who are you", "meeting", "with?", "meet"),
      ("I have", "spoken", "to the mayor <span class='u'>once</span>.", "speak"),
      ("Have you", "met", "your new neighbors?", "meet")]
for g, grp in enumerate(chunks(list(enumerate(rf, 1)), 4), 1):
    items = ''.join(f'<div class="tb"><span class="n">{i}.</span>{a} {blank(b)} {c} <span class="muted">({v})</span></div>'
                    for i, (a, b, c, v) in grp)
    sub = '<div class="sub">Look at the clue words. Write <b>meet</b> or <b>speak</b> in the right form.</div>' if g == 1 else ''
    slides.append(frame(K2, 6, "5. Use the right form" + part(g, 2), sub + stack(items)
        + ('<div class="hint">Tap a blank to check.</div>' if g == 1 else '')))

# ---------- p6 6. Paragraph ----------
slides.append(frame(K2, 6, "6. Write a paragraph: meeting people",
    '<div class="sub"><b>You finish each sentence with your own ideas.</b></div>'
    + stack('<div class="tl" style="font-weight:400">Last week, I <b class="org">met</b> ___.</div>'
            '<div class="tl" style="font-weight:400">We talked about ___.</div>'
            '<div class="tl" style="font-weight:400">At home, I <b>don’t speak</b> ___.</div>'
            '<div class="tl" style="font-weight:400">At work, I <b>speak</b> ___.</div>'
            '<div class="tl" style="font-weight:400">I <b class="grn">have never spoken</b> ___.</div>'
            '<div class="tl" style="font-weight:400">Next week, I <b>will meet</b> ___.</div>', ';padding-left:6em'),
    tools=False))
slides.append(frame(K2, 6, "6. Sample paragraph",
    '<div class="box tap" style="flex:1;display:flex;flex-direction:column;justify-content:center;background:#fff8e6">'
    '<div class="tb muted">Tap to see one example. Yours will be different!</div>'
    '<div class="ans tl" style="font-weight:400;line-height:1.5;margin-top:.4em">Last week, I <b>met</b> my new neighbor. We talked about our kids. '
    'At home, I don’t speak English. At work, I speak English and Spanish. I <b>have never spoken</b> at a meeting. '
    'Next week, I will meet my neighbor for coffee.</div></div>'
    '<div class="box tb" style="text-align:center">☐ I used <b>met</b> (V2). &nbsp; ☐ I used <b>have + V3</b>. &nbsp; ☐ I read it to a partner.</div>',
    tools=False))

# ---------- p7 Board game: how to play ----------
KG = "Part 2 · Warm-up + game · in small groups"
slides.append(frame(KG, 7, "Have you ever…? board game",
    stack('<div class="tl" style="font-weight:400"><span class="n">1.</span>Pick a question. Ask the person on your <b>left</b>.</div>'
          '<div class="tl" style="font-weight:400"><span class="n">2.</span>They answer: <i>Yes, I have. / No, I haven’t.</i></div>'
          '<div class="tl" style="font-weight:400"><span class="n">3.</span><b>Yes?</b> Ask: <i>When did you…? Where did you…?</i></div>'
          '<div class="tl" style="font-weight:400"><span class="n">4.</span><b>No?</b> Ask: <i>Do you want to?</i></div>', ';padding-left:5em')
    + '<div class="row"><div class="box tb" style="background:#e7f6f0">Write who answered + one detail.</div>'
    '<div class="box tb" style="background:#fff8e6">You can always say <b>“Pass.”</b></div></div>',
    tools=False))
slides.append(frame(KG, 7, "Listen to an example",
    '<div class="box steps" style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly">'
    '<div class="line" style="background:#e7f6f0"><b>A:</b> Have you ever <b>eaten</b> sushi?<span class="why">have + V3</span></div>'
    '<div class="line"><b>B:</b> Yes, I have.</div>'
    '<div class="line" style="background:#fff4e2"><b>A:</b> When <b>did</b> you <b>eat</b> it?<span class="why">did + V1</span></div>'
    '<div class="line" style="background:#fff4e2"><b>B:</b> I <b>ate</b> it <span class="u">last year</span>.<span class="why">V2</span></div></div>'
    '<div class="hint">Stuck? Look at your phrase bank sheet.</div>'
    '<div class="tools"><button class="tool step">Next line ▸</button><button class="tool rs">↺ Reset</button></div>',
    tools=False))

bq = [("🍣", "eaten sushi"), ("❄️", "seen snow"), ("🐎", "ridden a horse"), ("✈️", "flown in a plane"),
      ("🍲", "cooked for 10 people"), ("🎤", "sung karaoke"), ("⭐", "met a famous person"),
      ("🗣️", "spoken at a meeting"), ("🏕️", "swum in the ocean"), ("📱", "lost your phone"),
      ("🚚", "driven a truck"), ("⚽", "watched a game in a stadium"), ("💃", "taken a dance class"),
      ("🎉", "forgotten a birthday"), ("🗼", "been to New York City")]
cells = ''.join(f'<div class="cell"><b>{i}</b><span class="e">{e}</span><div class="qq">Have you ever {q}?</div></div>'
                for i, (e, q) in enumerate(bq, 1))
slides.append(frame("Part 2 · Warm-up + game · in small groups", 7, "Pick a question!",
    f'<div class="board" style="flex:1">{cells}</div>'
    '<div class="tools"><button class="tool rs">↺ Clear board</button></div>',
    tools=False))

# ---------- p8-9 Finished early ----------
slides.append(frame("Finished early?", "8–9", "Finished early? Pick one.",
    '<div class="row" style="flex:1">'
    '<div class="box"><div class="tl org">Verb charts</div><div class="t" style="margin-top:.6em">'
    '<b>Chart 1:</b> Add the helping verbs for <b>meet</b> (she).<br><b>Chart 2:</b> Write all of <b>speak</b> (they).<br>'
    '<span class="muted">Help: Grammar Companion, pages 9 and 11–12.</span></div></div>'
    '<div class="box"><div class="tl grn">Yes, I have! / Never!</div><div class="t" style="margin-top:.6em">'
    '3 things you <b>have done</b>, 2 you have <b>never done</b>.<br>Add: <i>but I want to</i> or <i>and I don’t want to!</i></div></div>'
    '<div class="box"><div class="tl pur">Two truths and a lie</div><div class="t" style="margin-top:.6em">'
    'Write 3 <b>I have…</b> sentences. 2 are true. 1 is a lie.<br>Your partner guesses, then asks: <i>When did you…? Where?</i></div></div></div>'
    '<div class="box t">Check: <b>have / has + V3</b> · <b>never</b> (no <s>not</s>) · <b>When did you + V1?</b> · he / she + <b>has</b></div>',
    tools=False))

JS = r"""
<button class="nav pv" aria-label="Previous">◀</button><button class="nav nx" aria-label="Next">▶</button>
<script>
const s=[...document.querySelectorAll('.slide')];let i=0;
const orig=s.map(e=>e.innerHTML);
function go(n){i=Math.max(0,Math.min(s.length-1,n));s.forEach((e,k)=>e.classList.toggle('on',k===i));document.getElementById('c').textContent=(i+1)+' / '+s.length;history.replaceState(null,'','#'+(i+1));}
const IA='button,.tap,.blank,.chip,.bin,.cell';
let sel=null;
document.addEventListener('click',e=>{
  const t=e.target, sl=t.closest('.slide');
  if(t.closest('.nav')){go(i+(t.closest('.nx')?1:-1));return;}
  if(t.closest('.tool.rs')){sl.innerHTML=orig[s.indexOf(sl)];sel=null;return;}
  if(t.closest('.tool.all')){sl.querySelectorAll('.tap,.blank').forEach(x=>x.classList.add('shown'));
    sl.querySelectorAll('.q').forEach(q=>{q.classList.add('done');q.querySelectorAll('.opt').forEach(o=>{o.classList.remove('no');if(o.dataset.ok==='1')o.classList.add('ok')})});
    sl.querySelectorAll('.pool .chip').forEach(c=>{sl.querySelector('.bin[data-k="'+c.dataset.k+'"] .chips').appendChild(c);c.className='chip ok'});return;}
  if(t.closest('.tool.step')){const l=sl.querySelector('.line:not(.on)');if(l)l.classList.add('on');return;}
  const o=t.closest('.opt');
  if(o){const q=o.closest('.q');if(q.classList.contains('done'))return;
    if(o.dataset.ok==='1'){o.classList.add('ok');q.classList.add('done');}
    else{o.classList.remove('no');void o.offsetWidth;o.classList.add('no');}return;}
  const ch=t.closest('.chip');
  if(ch){if(ch.classList.contains('ok'))return;sl.querySelectorAll('.chip.sel').forEach(c=>c.classList.remove('sel'));
    ch.classList.add('sel');sel=ch;sl.querySelectorAll('.bin').forEach(b=>b.classList.add('hot'));return;}
  const bin=t.closest('.bin');
  if(bin&&sel&&sl.contains(sel)){sl.querySelectorAll('.bin').forEach(b=>b.classList.remove('hot'));const c=sel;sel=null;c.classList.remove('sel');
    if(c.dataset.k===bin.dataset.k){bin.querySelector('.chips').appendChild(c);c.classList.add('ok');}
    else{c.classList.remove('no');void c.offsetWidth;c.classList.add('no');setTimeout(()=>c.classList.remove('no'),700);}return;}
  const tp=t.closest('.tap,.blank');if(tp){tp.classList.toggle('shown');return;}
  const cell=t.closest('.cell');if(cell){cell.classList.toggle('x');return;}
  if(t.closest(IA))return;   // interactive bits never advance
  go(e.clientX<innerWidth/4?i-1:i+1);
});
document.addEventListener('keydown',e=>{if(['ArrowRight',' ','PageDown','Enter'].includes(e.key)){e.preventDefault();go(i+1);}if(['ArrowLeft','PageUp','Backspace'].includes(e.key))go(i-1);if(e.key==='f')document.documentElement.requestFullscreen?.();});
go((parseInt(location.hash.slice(1))||1)-1);
</script></body></html>"""


def main(src, dst):
    html = open(src, encoding='utf-8').read()
    html = html.replace('</style>', CSS + '</style>', 1)
    first = html.index('<section class="slide">')
    html = html[:first] + ''.join(slides) + html[first:]
    html = re.sub(r'<script>.*?</script></body></html>\s*$', JS, html, flags=re.S)
    assert 'const orig' in html, 'nav script not replaced'
    open(dst, 'w', encoding='utf-8').write(html)
    print(f'{len(slides)} packet slides added → {dst}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
