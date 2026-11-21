#!/usr/bin/env python3
"""Thanksgiving break writing packet: 6 days, Wed Nov 25 to Mon Nov 30, 2026.

Students take it home Tuesday Nov 24 and bring it back Tuesday Dec 1.
Mandy and Kevin are the same two people from the Week 10 just/already/yet worksheet,
so each day has two different model answers (one celebrates, one works / doesn't).

    python3 build-thanksgiving-writing-packet.py
Writes thanksgiving-writing-packet.html/.pdf (8 pages: print double-sided = 4 sheets).
Needs Google Chrome (for the PDF) and pdfinfo.
"""
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">')
RETURN_DATE = "Tuesday, December 1"

# ---------------------------------------------------------------- data
# **x** in a model = the grammar, shown bold + underlined.
DAYS = [
    {
        "n": 1, "day": "Wednesday", "date": "Nov 25", "title": "Getting Ready",
        "grammar": "Just · Already · Yet", "week": "Week 10",
        "rules": [
            ("already", ["have / has", "already", "V3"], "I have already bought the food."),
            ("just", ["have / has", "just", "V3"], "She has just made a pie."),
            ("yet", ["haven't / hasn't", "V3", "… yet"], "I haven't cleaned yet."),
        ],
        "models": [
            ("Mandy", "Family dinner at her house tomorrow",
             "It is Wednesday night, and I am very busy! My family is coming tomorrow. "
             "I **have already bought** the turkey. I **have already cleaned** the house. "
             "I **have just made** two pies, and the kitchen smells so good. "
             "I **haven't set** the table **yet**. I **haven't called** my sister **yet**. "
             "She is bringing the rice."),
            ("Kevin", "Works at the food pantry. No big dinner.",
             "I don't cook on Thanksgiving. I work at the food pantry. "
             "Today we **have already given** out 100 turkeys! I **have just gotten** home, and I am tired. "
             "I **have already bought** my bus ticket to my mom's house. "
             "I **haven't packed** my bag **yet**."),
        ],
        "task": "Write about <b>YOUR</b> week. What <b>have</b> you <b>already</b> done? What <b>haven't</b> you done <b>yet</b>?",
        "cue": "No Thanksgiving for you? No problem. Write about your work, your home, or your weekend.",
        "ideas": "cleaned · cooked · bought food · finished work · called my family · done the laundry · paid my bills · studied English",
        "starters": ["I have already ___.", "I have just ___.", "I haven't ___ yet.", "My ___ has already ___."],
        "check": ["already", "just", "yet", "have / has + <b>V3</b>", "5+ sentences"],
    },
    {
        "n": 2, "day": "Thursday", "date": "Nov 26", "title": "Today Is Thanksgiving",
        "grammar": "Right Now + Usually", "week": "Weeks 1 + 6",
        "rules": [
            ("right now", ["am / is / are", "V1-ing"], "My kids are watching TV."),
            ("every year", ["usually / always", "V1"], "We usually eat at 4:00."),
            ("he / she", ["always / never", "V1-s"], "My mom always cries."),
        ],
        "models": [
            ("Mandy", "Family dinner at her house",
             "Today is Thanksgiving. It is 2:00, and my house is very loud! "
             "Right now, my husband **is cooking** the turkey. My kids **are watching** the parade on TV. "
             "My sister **is making** rice and beans. Every year, we **usually eat** at 4:00. "
             "My mother **always says** a prayer before dinner. We **never finish** all the food!"),
            ("Kevin", "At his mom's apartment",
             "Today I am at my mom's apartment. Right now, she **is sleeping** on the couch, and I "
             "**am washing** the dishes. We **are not eating** turkey. We **are eating** fish soup, "
             "like in our country. On holidays, we **usually call** our family back home. "
             "My mom **always cries** a little. I **sometimes cry** too."),
        ],
        "task": "Write about <b>YOUR</b> day today. What <b>is happening</b> right now? What do you <b>usually</b> do on a holiday?",
        "cue": "Working today? Write about your job right now!",
        "ideas": "cooking · eating · watching TV · working · resting · talking on the phone · playing · sleeping",
        "starters": ["Right now, I am ___.", "My ___ is ___.", "On holidays, I usually ___.", "My family always / never ___."],
        "check": ["am / is / are + <b>V1-ing</b>", "usually / always / never", "he / she + <b>V1-s</b>", "5+ sentences"],
    },
    {
        "n": 3, "day": "Friday", "date": "Nov 27", "title": "Yesterday",
        "grammar": "Past Simple", "week": "Week 4",
        "rules": [
            ("regular", ["V1", "+ -ed"], "cooked /t/ · played /d/ · visited /id/"),
            ("irregular", ["V2"], "ate · went · came · took · felt"),
            ("negative", ["didn't", "V1"], "I didn't wash the dishes."),
        ],
        "models": [
            ("Mandy", "Family dinner at her house",
             "Yesterday was a great day. My family **came** at 1:00. We **ate** turkey, rice and beans, "
             "and pie. My son **helped** me in the kitchen. After dinner, we **played** cards and "
             "**watched** football. Everyone **went** home at 9:00. I **didn't wash** the dishes. "
             "I **was** too tired! Today I am eating leftovers."),
            ("Kevin", "Visited his mom",
             "Yesterday I **took** the bus to my mom's house. The trip **was** two hours. "
             "My mom **cooked** fish soup, and we **talked** all day. I **didn't watch** football. "
             "I don't like football! At night, we **looked** at old photos. "
             "I **felt** happy and a little homesick."),
        ],
        "task": "Write about <b>YESTERDAY</b> (Thursday). Where did you go? What did you eat? Who did you see? How did you feel?",
        "cue": "Did you work yesterday? Write about your work day. Bonus: Today is Black Friday. Did you go shopping?",
        "ideas": "ate · drank · cooked · visited · stayed home · watched · worked · slept · called · felt",
        "starters": ["Yesterday, I ___.", "I ate ___.", "I didn't ___.", "I felt ___ because ___."],
        "check": ["<b>V2</b> verbs", "didn't + <b>V1</b>", "I read my -ed words out loud", "5+ sentences"],
    },
    {
        "n": 4, "day": "Saturday", "date": "Nov 28", "title": "Holidays I Know",
        "grammar": "Have You Ever…?", "week": "Week 9",
        "rules": [
            ("in my life", ["have / has", "V3"], "I have eaten tamales."),
            ("not in my life", ["have never", "V3"], "I have never cooked a turkey."),
            ("the story", ["V2", "+ when"], "I went in 2019."),
        ],
        "models": [
            ("Mandy", "Thanksgiving every year",
             "I **have celebrated** Thanksgiving many times. I **have never cooked** a turkey alone. "
             "My husband always helps! I **have been** to the big parade in New York one time. "
             "I **went** in 2019. It **was** very cold, but I **loved** the giant balloons. "
             "**Have** you **ever seen** the parade?"),
            ("Kevin", "A different holiday from home",
             "In my country, we don't have Thanksgiving. Our big holiday is in December. "
             "**Have** you **ever eaten** tamales? I **have eaten** a lot of tamales! "
             "My grandmother **made** them every Christmas. I **have** also **tried** turkey here, "
             "but I **have never eaten** pumpkin pie. Maybe next year!"),
        ],
        "task": "Write about a holiday from <b>YOUR</b> country, or a holiday you love. What <b>have</b> you done? What <b>have</b> you <b>never</b> done?",
        "cue": "Then add one story sentence with V2: when did it happen?",
        "ideas": "eaten · cooked · danced · seen · been to · celebrated · made · tried · given · worn",
        "starters": ["My favorite holiday is ___.", "I have ___.", "I have never ___.", "The first time, I ___ in (year) ___."],
        "check": ["have / has + <b>V3</b>", "never + <b>V3</b>", "1 story sentence with <b>V2</b>", "5+ sentences"],
    },
    {
        "n": 5, "day": "Sunday", "date": "Nov 29", "title": "Advice for a Friend",
        "grammar": "Can · Should · Must", "week": "Week 8",
        "rules": [
            ("good idea", ["should / shouldn't", "V1"], "You should bring a pie."),
            ("it's OK", ["can", "V1"], "You can say, “No, thank you.”"),
            ("very important", ["must / must not", "V1"], "You must buy boots."),
        ],
        "models": [
            ("Mandy", "Letter to Rosa: her first Thanksgiving dinner",
             "Dear Rosa, You are going to your coworker's house for Thanksgiving. "
             "Here is my advice. You **should bring** something small, like flowers or a pie. "
             "You **shouldn't arrive** very early. You **can try** a little of everything. "
             "You **can say**, “No, thank you,” if you don't like something. "
             "And you **must say** thank you to the cook! Love, Mandy"),
            ("Kevin", "Letter to Luis: his first winter here",
             "Dear Luis, Welcome to Massachusetts! Winter is coming, so here is my advice. "
             "You **must buy** a warm coat and boots. You **can find** cheap coats at the thrift store. "
             "You **should wear** a hat every day. You **shouldn't walk** on ice in sneakers. "
             "You **must not park** on the street in a snow emergency. See you soon, Kevin"),
        ],
        "task": "Write a letter to a friend. Choose: &nbsp;<span class=\"cb\"></span><b>A.</b> their first Thanksgiving dinner &nbsp; <span class=\"cb\"></span><b>B.</b> their first winter here",
        "cue": "You make up the friend's name! No “to” after can / should / must: <s>You should to bring</s> → You should bring.",
        "ideas": "bring · wear · buy · try · say · arrive · drive · walk · call · ask",
        "starters": ["Dear ___,", "You should ___.", "You shouldn't ___.", "You can ___.", "You must ___."],
        "check": ["should / shouldn't", "can", "must", "<b>V1</b> after (no to, no -s)", "5+ sentences"],
    },
    {
        "n": 6, "day": "Monday", "date": "Nov 30", "title": "Looking Ahead to December",
        "grammar": "If… Will…", "week": "Week 7",
        "rules": [
            ("the if part", ["If", "V1 / V1-s", ","], "If it snows,"),
            ("the result", ["will", "V1"], "my kids will build a snowman."),
            ("an idea", ["Let's", "V1"], "Let's have a party!"),
        ],
        "models": [
            ("Mandy", "Plans with her kids",
             "December is coming! **If** it **snows** this month, my kids **will build** a snowman. "
             "**If** I **have** a day off, I **will take** them to see the lights downtown. "
             "**If** the weather **is** nice, we **will walk** to the park. "
             "**If** I **see** my classmates on Tuesday, I **will tell** them about my pies!"),
            ("Kevin", "Saving money for a trip",
             "In December, I will work a lot at the food pantry. **If** I **save** money, I **will buy** "
             "a plane ticket. **If** I **buy** a ticket, I **will visit** my family in January. "
             "**If** it **is** very cold, I **will stay** home and study English. "
             "**Let's have** a party in December, class!"),
        ],
        "task": "Write about <b>YOUR</b> December. <b>You make up the “if” part.</b> It can be big or small!",
        "cue": "",
        "ideas": "snows · have time · get a day off · save money · feel tired · see my family · get paid",
        "starters": ["If it snows, I will ___.", "If I have time, I will ___.", "If I ___, I will ___.", "Let's ___!"],
        "check": ["If + <b>V1 / V1-s</b>", "will + <b>V1</b>", "comma after the if part", "5+ sentences"],
        "questions": True,
    },
]

WORD_BANK = [
    ("Food", "turkey · stuffing · mashed potatoes · gravy · cranberry sauce · pumpkin pie · leftovers"),
    ("People", "family · relatives · neighbors · coworkers · guests · the cook"),
    ("Things to do", "parade · football · Black Friday sales · a long walk · a nap · a video call"),
    ("Feelings", "thankful · grateful · full · tired · relaxed · busy · homesick · lonely · happy"),
]
VERBS = [  # V1, V2, V3
    ("eat", "ate", "eaten"), ("make", "made", "made"), ("buy", "bought", "bought"),
    ("go", "went", "gone"), ("see", "saw", "seen"), ("take", "took", "taken"),
    ("give", "gave", "given"), ("bring", "brought", "brought"), ("feel", "felt", "felt"),
    ("have", "had", "had"), ("drink", "drank", "drunk"), ("sleep", "slept", "slept"),
    ("cook", "cooked", "cooked"), ("visit", "visited", "visited"), ("watch", "watched", "watched"),
    ("call", "called", "called"),
]

# ---------------------------------------------------------------- html
CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #000; background: #fff; font-size: 14px; line-height: 1.35; }
.page { width: 8.5in; height: 11in; padding: 0.35in 0.5in 0.3in; display: flex; flex-direction: column; overflow: hidden; break-after: page; }
@media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,.25); } }
@media print { @page { size: letter portrait; margin: 0; } }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.cb { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #000; vertical-align: -2px; margin-right: 5px; flex: none; }
.chip { border: 1.5px solid #000; padding: 0 7px; font-size: 13px; white-space: nowrap; }
.chip.v { border-style: dashed; font-weight: bold; }
.chip.hot { background: #000; color: #fff; font-weight: bold; }
.plus { font-weight: bold; }

/* day header */
.top { display: flex; align-items: stretch; gap: 12px; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
.daybadge { flex: none; background: #000; color: #fff; border-radius: 8px; padding: 4px 12px; text-align: center; line-height: 1.1; display: flex; flex-direction: column; justify-content: center; }
.daybadge .d { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.daybadge .n { font-size: 26px; font-weight: bold; }
.toptxt { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.toptxt .when { font-size: 14px; }
.toptxt h1 { font-size: 26px; line-height: 1.1; }
.gram { flex: none; text-align: right; display: flex; flex-direction: column; justify-content: center; }
.gram b { font-size: 16px; }
.gram span { font-size: 12px; font-style: italic; }

.rules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-bottom: 9px; }
.rule { border: 1.5px solid #000; padding: 4px 8px 5px; display: flex; flex-direction: column; gap: 4px; }
.rule .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; font-weight: bold; }
.rule .f { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; }
.rule .ex { font-style: italic; font-size: 13px; }

.models { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 9px; }
.model { border: 2px solid #000; padding: 5px 10px 7px; }
.model .who { font-size: 16px; font-weight: bold; }
.model .ctx { font-size: 12px; font-style: italic; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 4px; }
.model p { font-size: 14px; line-height: 1.42; }
.model p b { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 2px; }

.task { border: 2px solid #000; background: #000; color: #fff; padding: 5px 10px; font-size: 16px; }
.task .cb { border-color: #fff; }
.taskbody { border: 2px solid #000; border-top: none; padding: 5px 10px 7px; margin-bottom: 4px; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.cue { font-size: 13px; font-style: italic; margin-bottom: 3px; }
.ideas { font-size: 13px; margin-bottom: 4px; }
.ideas b { font-style: normal; }
.starters { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 2px; }
.starters span { border: 1.5px dashed #000; border-radius: 12px; padding: 0 9px; font-size: 13px; font-weight: bold; }
.write { flex: 1; min-height: 0; background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 0.37in, #000 0.37in, #000 calc(0.37in + 1px)); background-size: 100% calc(0.37in + 1px); }
.qs { border-top: 1.5px dashed #000; margin-top: 4px; padding-top: 4px; }
.qs .lbl { font-size: 14px; }
.qs .ex { font-size: 12px; font-style: italic; }
.qline { display: flex; gap: 6px; align-items: flex-end; height: 0.38in; font-weight: bold; }
.qline .ln { flex: 1; border-bottom: 1px solid #000; height: 100%; text-align: right; font-size: 18px; }

.check { border: 1.5px dashed #000; padding: 4px 9px; font-size: 13px; display: flex; flex-wrap: wrap; gap: 3px 14px; align-items: center; }
.check .h { font-weight: bold; }
.bottom { display: flex; gap: 8px; align-items: stretch; }
.bottom .check { flex: 1; }
.tnote { flex: none; width: 2.3in; height: 0.6in; border: 1.5px solid #000; padding: 2px 7px; font-size: 12px; }
.foot { font-size: 10px; display: flex; justify-content: space-between; margin-top: 3px; }

/* cover */
.cover h1 { font-size: 34px; line-height: 1.05; }
.cover .sub { font-size: 16px; font-style: italic; margin-top: 2px; }
.name-row { display: flex; gap: 14px; align-items: flex-end; font-size: 18px; font-weight: bold; margin: 12px 0 10px; }
.name-row .fill { flex: 1; border-bottom: 2px solid #000; height: 26px; }
.due { border: 2.5px solid #000; padding: 6px 12px; font-size: 17px; text-align: center; margin-bottom: 10px; }
.how { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
.how div { border: 1.5px solid #000; padding: 5px 8px; font-size: 13px; display: flex; gap: 7px; align-items: flex-start; }
.how b.n { flex: none; width: 22px; height: 22px; border-radius: 50%; background: #000; color: #fff; display: grid; place-items: center; font-size: 13px; }
.cal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-bottom: 10px; }
.cal div { border: 2px solid #000; padding: 5px 9px; display: flex; flex-direction: column; gap: 1px; }
.cal .d { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; display: flex; justify-content: space-between; }
.cal .t { font-size: 17px; font-weight: bold; }
.cal .g { font-size: 13px; font-style: italic; }
h2 { font-size: 16px; margin-bottom: 4px; }
.bank { border: 2px solid #000; padding: 5px 10px; margin-bottom: 10px; }
.bank p { font-size: 13px; margin-bottom: 2px; }
table.verbs { width: 100%; border-collapse: collapse; font-size: 13px; }
table.verbs th, table.verbs td { border: 1.5px solid #000; padding: 1px 7px; text-align: left; }
table.verbs th { background: #000; color: #fff; }
.vwrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* thank-you page */
.ty .card { border: 2.5px dashed #000; padding: 10px 16px; display: flex; flex-direction: column; flex: 1; min-height: 0; margin-bottom: 8px; }
.ty .card .write { margin-top: 6px; }
"""


def md(text):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


def chips(parts):
    out = []
    for p in parts:
        cls = "chip v" if re.match(r"^V\d", p) else ("chip hot" if p in ("already", "just", "… yet", "If", "will", "Let's") else "chip")
        out.append(f'<span class="{cls}">{p}</span>')
    return '<span class="plus">+</span>'.join(out)


def footer(n):
    return (f'<div class="foot"><span>ESOL 3 · Thanksgiving Writing Packet</span>'
            f'<span>Page {n} of 8 · Bring it back {RETURN_DATE}</span></div>')


def day_page(d):
    rules = "".join(
        f'<div class="rule"><span class="lbl">{lbl}</span><span class="f">{chips(parts)}</span>'
        f'<span class="ex">{ex}</span></div>' for lbl, parts, ex in d["rules"])
    models = "".join(
        f'<div class="model"><div class="who">{who}</div><div class="ctx">{ctx}</div><p>{md(txt)}</p></div>'
        for who, ctx, txt in d["models"])
    starters = "".join(f"<span>{s}</span>" for s in d["starters"])
    check = "".join(f'<span><span class="cb"></span>{c}</span>' for c in d["check"])
    cue = f'<div class="cue">{d["cue"]}</div>' if d["cue"] else ""
    qs = ""
    if d.get("questions"):
        qs = ('<div class="qs"><div class="lbl"><b>Tuesday questions.</b> Write 2 questions for a classmate. '
              'You will ask them in class on Tuesday!</div>'
              '<div class="ex">Examples: What did you eat on Thursday? · Have you ever seen snow? · '
              'Have you bought a winter coat yet?</div>'
              '<div class="qline">1.<span class="ln">?</span></div>'
              '<div class="qline">2.<span class="ln">?</span></div></div>')
    return f"""
<section class="page">
  <div class="top">
    <div class="daybadge"><span class="d">Day</span><span class="n">{d['n']}</span></div>
    <div class="toptxt"><span class="when">{d['day']}, {d['date']}</span><h1>{d['title']}</h1></div>
    <div class="gram"><b>{d['grammar']}</b><span>from {d['week']}</span></div>
  </div>
  <div class="rules">{rules}</div>
  <h2>Read the models. Two people, two different answers.</h2>
  <div class="models">{models}</div>
  <div class="task">{d['task']}</div>
  <div class="taskbody">
    {cue}
    <div class="ideas"><b>Ideas:</b> {d['ideas']}</div>
    <div class="starters">{starters}</div>
    <div class="write"></div>
    {qs}
  </div>
  <div class="bottom"><div class="check"><span class="h">Check:</span>{check}</div>
  <div class="tnote"><b>Teacher:</b></div></div>
  {footer(d['n'] + 1)}
</section>"""


def cover():
    how = "".join(f'<div><b class="n">{i}</b><span>{t}</span></div>' for i, t in enumerate([
        "Read the grammar box.",
        "Read the 2 models. Mandy and Kevin write <b>different</b> answers.",
        "Write about <b>YOUR</b> life. 5 sentences or more.",
        "Check the boxes at the bottom.",
    ], 1))
    cal = "".join(
        f'<div><span class="d"><span>Day {d["n"]} · {d["day"][:3]} {d["date"]}</span><span class="cb"></span></span>'
        f'<span class="t">{d["title"]}</span><span class="g">{d["grammar"]}</span></div>' for d in DAYS)
    bank = "".join(f"<p><b>{k}:</b> {v}</p>" for k, v in WORD_BANK)
    half = len(VERBS) // 2

    def vt(rows):
        body = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in rows)
        return f'<table class="verbs"><tr><th>V1</th><th>V2</th><th>V3</th></tr>{body}</table>'

    return f"""
<section class="page cover">
  <h1>My Thanksgiving<br>Writing Packet</h1>
  <div class="sub">6 days · 6 short writings · Wednesday, November 25 to Monday, November 30</div>
  <div class="name-row">Name:<span class="fill"></span></div>
  <div class="due"><b>Bring this packet back on {RETURN_DATE}.</b><br>
    <span style="font-size:14px">Write a little every day. 10 to 15 minutes is perfect. Mistakes are OK!</span></div>
  <h2>How to do each day</h2>
  <div class="how">{how}</div>
  <h2>My 6 days <span style="font-weight:normal;font-size:13px">(check the box when you finish)</span></h2>
  <div class="cal">{cal}</div>
  <h2>Holiday word bank</h2>
  <div class="bank">{bank}</div>
  <h2>Verbs you will use</h2>
  <div class="vwrap">{vt(VERBS[:half])}{vt(VERBS[half:])}</div>
  <div style="flex:1"></div>
  {footer(1)}
</section>"""


def thank_you():
    return f"""
<section class="page ty">
  <div class="top">
    <div class="daybadge"><span class="d">Bonus</span><span class="n">★</span></div>
    <div class="toptxt"><span class="when">Any day</span><h1>A Thank-You Note</h1></div>
    <div class="gram"><b>thankful for + noun</b><span>because + sentence</span></div>
  </div>
  <div class="rules">
    <div class="rule"><span class="lbl">a thing / a person</span><span class="f">{chips(["I am thankful for", "noun"])}</span><span class="ex">I am thankful for my sister.</span></div>
    <div class="rule"><span class="lbl">the reason</span><span class="f">{chips(["because", "subject", "verb"])}</span><span class="ex">because she always helps me.</span></div>
    <div class="rule"><span class="lbl">say it to them</span><span class="f">{chips(["Thank you for", "V1-ing"])}</span><span class="ex">Thank you for helping me.</span></div>
  </div>
  <div class="models">
    <div class="model"><div class="who">Mandy</div><div class="ctx">To her sister</div><p>Dear Ana, <b>I am thankful for</b> you <b>because</b> you always help me. <b>Thank you for bringing</b> the rice on Thursday. It was delicious! Love, Mandy</p></div>
    <div class="model"><div class="who">Kevin</div><div class="ctx">To the bus driver</div><p>To the driver of the 7:00 bus: <b>Thank you for waiting</b> for me every morning. <b>I am thankful for</b> you <b>because</b> I am never late for work. Kevin</p></div>
  </div>
  <div class="task">Write a thank-you note to someone in <b>YOUR</b> life. <b>You choose who!</b></div>
  <div class="taskbody">
    <div class="ideas"><b>Ideas:</b> a family member · a friend · a coworker · a neighbor · a teacher · a doctor · a classmate · YOU!</div>
    <div class="starters"><span>Dear ___,</span><span>I am thankful for ___ because ___.</span><span>Thank you for ___ing.</span></div>
    <div class="write"></div>
  </div>
  <div class="check"><span class="h">Check:</span><span><span class="cb"></span>thankful for</span><span><span class="cb"></span>because</span><span><span class="cb"></span>Thank you for + <b>V1-ing</b></span><span><span class="cb"></span>I signed my name</span></div>
  {footer(8)}
</section>"""


def build():
    pages = cover() + "".join(day_page(d) for d in DAYS) + thank_you()
    html = (f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Thanksgiving Writing Packet</title>'
            f'{FONT}<style>{CSS}</style></head><body>{pages}</body></html>')
    path = HERE / "thanksgiving-writing-packet.html"
    path.write_text(html)
    pdf = path.with_suffix(".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000",
                    f"--print-to-pdf={pdf}", path.resolve().as_uri()], check=True, capture_output=True)
    n = re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1)
    print(f"{pdf.name}: {n} pages{'' if n == '8' else '  <-- expected 8'}")


if __name__ == "__main__":
    build()
