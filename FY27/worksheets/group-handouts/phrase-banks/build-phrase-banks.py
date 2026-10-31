#!/usr/bin/env python3
"""Phrase bank worksheets for Weeks 9-15 (have you ever, good at, for/since,
comparatives, how much/how many, fall review).

Front pages keep the adverbs-of-frequency format (forms row, "Where does it go?"
rule key, 4-column phrase bank); the style block is read from that file so every
sheet matches it. Back pages use a different set of activities each week.

    python3 build-phrase-banks.py           # all six
    python3 build-phrase-banks.py week12-for-since  # just one
writes <slug>.html and <slug>.pdf next to this file.
"""
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
REF = (HERE / "adverbs-of-frequency.html").read_text()
BASE_CSS = REF[REF.index("<style>") + 7: REF.index("</style>")]

EXTRA_CSS = """
  /* Added for the Week 9-15 sheets */
  .forms { display: grid; border: 1.5px solid #000; margin-top: 4px; }
  .forms > div { padding: 4px 6px; text-align: center; }
  .forms > div + div { border-left: 1.5px solid #000; }
  .forms .word { font-size: 18px; font-weight: bold; }
  .forms .sm { font-size: 11px; }
  .forms .md { font-size: 14px; }
  .write-row .adv.wide { width: 1.6in; }
  .write-row .adv.xwide { width: 2.3in; font-size: 14px; }
  table.interview td.c { width: 14%; text-align: center; }
  .frame { border: 1.5px dashed #000; padding: 4px 9px; font-size: 14px; margin: 4px 0 6px; }
  .rank { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 4px; }
  .rank > div { border: 1.5px solid #000; padding: 5px 8px; font-size: 14px; }
  .rank b { display: block; font-size: 14px; margin-bottom: 2px; }
  .rank .opt { line-height: 1.9; }
  .rank .opt .cb { margin-right: 6px; }
  .dice { line-height: 1; margin-bottom: 2px; }
  .die { display: inline-grid; place-items: center; width: 22px; height: 22px; border: 2px solid #000; border-radius: 5px; font-size: 14px; font-weight: bold; }
  .rules.three { grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
  .rules.three .rule { padding: 4px 7px; }
  .rules.three .chip { font-size: 13px; padding: 1px 5px; }
  .bank-split .cat-name.yes::before { content: "\\2713  "; }
  .bank-split .cat-name.no::before { content: "\\2717  "; }
"""


def chips(*parts):
    """chips("I", ("usually",), "drink") -> word boxes; a 1-tuple is the black target chip."""
    out = []
    for x in parts:
        if isinstance(x, tuple):
            out.append(f'<span class="chip adv">{x[0]}</span>')
        else:
            out.append(f'<span class="chip">{x}</span>')
    return f'<div class="formula">{"".join(out)}</div>'


def rule(name, formula, ex, no):
    no_html = f'<div class="no">&#10007; <s>{no}</s></div>' if no and not no.startswith("<") else (f'<div class="no">{no}</div>' if no else "")
    ex_html = "".join(f'<div class="ex">{e}</div>' for e in (ex if isinstance(ex, list) else [ex]))
    return f'<div class="rule"><div class="rule-name">{name}</div>{formula}{ex_html}{no_html}</div>'


def remember(text):
    return f'<div class="rule wide"><div class="rule-name" style="margin:0">Remember: <span style="font-weight:normal">{text}</span></div></div>'


def bank(cats, strip, split=False):
    cls = "bank bank-split" if split else "bank"
    body = "".join(
        f'<div class="cat"><div class="cat-name{(" " + c[2]) if len(c) > 2 else ""}">{c[0]}</div><ul>'
        + "".join(f"<li>{x}</li>" for x in c[1]) + "</ul></div>" for c in cats)
    return f'<div class="{cls}">{body}</div><div class="cat-be">{strip}</div>'


def rows(label_example, labels, cls=""):
    """Writing rows: first an italic example, then empty rows."""
    lab, ex = label_example
    out = [f'<div class="write-row"><span class="adv {cls}">{lab}</span><span class="fill example">{ex}</span></div>'] if ex else []
    out += [f'<div class="write-row"><span class="adv {cls}">{l}</span><span class="fill"></span></div>' for l in labels]
    return "".join(out)


def interview(head, first, n=4, extra_cols=None):
    cols = extra_cols or ["My partner&rsquo;s answer"]
    th = f"<tr><th>{head}</th>" + "".join(f"<th>{c}</th>" for c in cols) + "</tr>"
    trs = f'<tr><td class="q">{first}</td>' + "<td></td>" * len(cols) + "</tr>"
    trs += (f'<tr><td class="q">&hellip;</td>' + "<td></td>" * len(cols) + "</tr>") * (n - 1)
    return f'<table class="interview">{th}{trs}</table>'


def check(items):
    return '<div class="check"><b>Check:</b> ' + "".join(f'<span><span class="cb"></span>{i}</span>' for i in items) + "</div>"


def box(n, title, sub, inner, style=""):
    st = f' style="{style}"' if style else ""
    return f'<div class="box"{st}><h2>{n}. {title} <span class="small">{sub}</span></h2>{inner}</div>'


def sheet(title, front_title, forms_box, rules_box, bank_box, back_title, back):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>{BASE_CSS}{EXTRA_CSS}</style>
</head>
<body>
<section class="page">
  <div class="name-row">Name: <span class="fill"></span> Date: <span class="fill date"></span></div>
  <div class="title-row"><h1>{front_title}</h1><span class="sub">Keep this page. Use it to write on the back.</span></div>
  {forms_box}
  {rules_box}
  <div class="box" style="flex:1; display:flex; flex-direction:column;">{bank_box}</div>
</section>
<section class="page">
  <div class="title-row"><h1>{back_title}</h1><span class="sub">Look at the front for help.</span></div>
  {back}
</section>
</body>
</html>
"""


def forms_row(cells, cols=None):
    n = cols or len(cells)
    return f'<div class="forms" style="grid-template-columns: repeat({n}, 1fr);">{"".join(f"<div>{c}</div>" for c in cells)}</div>'


# ---------------------------------------------------------------- Week 9: Have you ever?
def have_you_ever():
    verbs = [("eat", "eaten"), ("see", "seen"), ("go", "been*"), ("ride", "ridden"), ("fly", "flown"), ("meet", "met")]
    forms = box(1, "The verbs: V1 &rarr; V3", "Have you ever + <b>V3</b>? &nbsp;*go &rarr; <b>been</b> = you went and came back.",
                forms_row([f'<div class="sm">V1: {a}</div><div class="word">{b}</div>' for a, b in verbs]))
    rules = box(2, "How does it work?", "The important words are in <b>black</b>.", '<div class="rules">' + "".join([
        rule("A. Ask: Have you ever + V3?", chips("Have", "you", ("ever",), ("eaten",), "sushi?"),
             "<b>Has</b> she <b>ever</b> ridden a horse?", "Have you ever ate sushi?"),
        rule("B. Yes: I have + V3", chips("I", ("have",), ("been",), "to New York."),
             "Yes, I <b>have</b>. I&rsquo;ve <b>tried</b> it twice.", "I have went there."),
        rule("C. No: I have never + V3", chips("I", "have", ("never",), "seen", "snow."),
             "No, I <b>haven&rsquo;t</b>. / I&rsquo;ve <b>never</b> flown.", "I haven&rsquo;t never seen snow."),
        rule("D. Tell more: When did you + V1?", chips(("When did", ), "you", "go?"),
             "&rarr; I <b>went</b> last year. (one time, finished: <b>V2</b>)", "I have been there last year."),
        remember("he / she / it &rarr; <b>has</b>: She <b>has</b> never driven a truck. &nbsp;|&nbsp; <i>once &middot; twice &middot; many times</i> go at the end."),
    ]) + "</div>")
    cats = [
        ("Food", ["eaten sushi", "tried Thai food", "cooked for 20 people", "made bread", "eaten a whole pizza", "drunk coconut water"]),
        ("Travel", ["been to New York", "flown in a plane", "taken a long train ride", "been on a boat", "seen the ocean", "driven in snow"]),
        ("Nature", ["seen snow", "climbed a mountain", "swum in a lake", "slept in a tent", "seen a whale"]),
        ("Work", ["worked at night", "had two jobs", "worked in a restaurant", "spoken at a meeting", "started a business"]),
        ("Fun", ["been to a concert", "sung karaoke", "danced salsa", "watched a baseball game", "ridden a roller coaster"]),
        ("Life in Boston", ["taken the T", "eaten clam chowder", "walked in Boston Common", "been to the beach in winter"]),
        ("People", ["met a famous person", "forgotten someone&rsquo;s name", "helped a stranger", "given a speech"]),
        ("Phone &amp; tech", ["broken my phone screen", "lost my phone", "bought something online", "sent a voice message"]),
    ]
    bk = '<h2>3. Phrase bank <span class="small">These are <b>V3</b>. Put <i>have / has</i> before them.</span></h2>' + bank(
        cats, "<b>Short answers:</b> &nbsp;Yes, I have. &middot; No, I haven&rsquo;t. &middot; No, never. &middot; Once. &middot; Twice. &middot; Many times! &middot; Not yet, but I want to.")
    back = "".join([
        box(4, "Yes, I have! / Never!", "3 things you <b>have</b> done, 2 you have <b>never</b> done. Add: <b>but I want to</b> or <b>and I don&rsquo;t want to!</b>",
            rows(("example", "I have flown in a plane three times."), ["I have", "I have", "I have"])
            + rows(("", ""), ["I&rsquo;ve never", "I&rsquo;ve never"])),
        box(5, "Two truths and a lie", "Write 3 sentences. <b>2 are true. 1 is a lie.</b> Your partner guesses the lie, then asks: <i>When did you&hellip;? Where?</i>",
            rows(("", ""), ["1. I have", "2. I have", "3. I have"])
            + '<div class="hint" style="margin-top:4px">My partner guessed: &nbsp;1 &nbsp; 2 &nbsp; 3 &emsp;&emsp; Right? &nbsp;Yes / No &#128578;</div>'),
        box(6, "Ask a partner", "Ask <b>Have you ever&hellip;?</b> If yes, ask <b>When did you&hellip;?</b>",
            '<div class="hint">Partner&rsquo;s name: ______________________</div>'
            + interview("Have you ever&hellip;", "&hellip;eaten sushi?", 4, ["Yes / No", "When? Where? (did)"])
            + '<div class="hint" style="margin-top:6px">Write about your partner. <b>has</b> + V3, then the story in <b>V2</b>: <i>Ana has eaten sushi. She ate it in 2020.</i></div><div class="line"></div><div class="line"></div>'),
        check(["have / has + V3", "never (no <i>not</i>)", "When did you + V1?", "he / she + has"]),
    ])
    return sheet("Have You Ever Worksheet", "Have You Ever&hellip;?", forms, rules, bk, "Write About You", back)


# ---------------------------------------------------------------- Week 10: What are you good at?
def good_at():
    levels = [("great at", 100, "&#9733;&#9733;&#9733;"), ("good at", 75, "&#9733;&#9733;"), ("OK at", 50, "&#9733;"),
              ("not very good at", 25, "polite!"), ("bad at", 5, "&nbsp;")]
    forms = box(1, "How good are you?", "From great to bad. All of them: + <b>V-ing</b> or a <b>noun</b>.",
                f'<div class="scale" style="grid-template-columns: repeat(5, 1fr);">' + "".join(
                    f'<div><div class="word">{w}</div><div class="bar"><i style="width:{pct}%"></i></div><div class="ex">{s}</div></div>' for w, pct, s in levels) + "</div>")
    rules = box(2, "How does it work?", "The important words are in <b>black</b>.", '<div class="rules">' + "".join([
        rule("A. good at + V-ing", chips("I&rsquo;m", ("good at",), ("cooking",), "rice."),
             "She&rsquo;s good at <b>fixing</b> cars.", "I&rsquo;m good at cook."),
        rule("B. good at + a noun", chips("I&rsquo;m", ("good at",), "math."),
             "He&rsquo;s bad at <b>names</b>.", "I&rsquo;m good in math."),
        rule("C. Question: Are you good at&hellip;?", chips(("Are",), "you", "good at", "drawing?"),
             "&rarr; Yes, I am! / I&rsquo;m OK at it. / Not really.", "Do you good at drawing?"),
        rule("D. interested in + V-ing / noun", chips("I&rsquo;m", ("interested in",), "learning", "computers."),
             "She&rsquo;s <b>interested in</b> nursing.", "I&rsquo;m interesting in art."),
        remember("-ing spelling: make &rarr; mak<b>ing</b> &middot; swim &rarr; swim<b>ming</b> &nbsp;|&nbsp; <i>not very good at</i> is a polite way to say <i>bad at</i>."),
    ]) + "</div>")
    cats = [
        ("Cooking &amp; food", ["cooking", "baking", "making soup", "cooking for a big group", "trying new food"]),
        ("Fixing &amp; building", ["fixing things", "fixing cars", "building furniture", "painting walls", "sewing"]),
        ("People", ["listening to people", "talking to customers", "taking care of kids", "solving problems", "making people laugh", "teaching"]),
        ("Art &amp; music", ["drawing", "singing", "dancing", "playing the guitar", "taking photos"]),
        ("Sports", ["playing soccer", "running", "swimming", "lifting heavy things"]),
        ("Numbers &amp; money", ["math", "saving money", "counting fast", "making a budget"]),
        ("Computers &amp; phone", ["typing", "using computers", "fixing phones", "making videos"]),
        ("Languages", ["speaking Spanish", "learning languages", "remembering new words", "spelling", "remembering names"]),
        ("Work skills", ["working with a team", "working fast", "organizing things", "driving", "cleaning"]),
    ]
    bk = '<h2>3. Phrase bank <span class="small">Pick any skill. Change it if you want.</span></h2>' + bank(
        cats, "<b>Jobs:</b> &nbsp;cook &middot; mechanic &middot; nurse &middot; teacher &middot; cashier &middot; driver &middot; electrician &middot; home health aide &middot; hairdresser &middot; carpenter &middot; tailor &middot; cleaner")
    back = "".join([
        box(4, "My skills profile", "Like a job application. Use <b>V-ing</b> or a noun. Add a detail: <b>because&hellip;</b> or <b>for example&hellip;</b>",
            '<div class="frame"><b>SKILLS</b> &nbsp;Name: ______________________ &emsp; Languages I speak: ______________________</div>'
            + rows(("example", "I&rsquo;m great at cooking. For example, I cook for 15 people every Sunday."),
                   ["I&rsquo;m great at", "I&rsquo;m good at", "I&rsquo;m OK at", "I&rsquo;m not very good at", "I&rsquo;m interested in"], "xwide")),
        box(5, "Not yet!", "Something you are not good at <b>yet</b>. How can you get better? Use <b>can</b> or <b>should</b>.",
            rows(("example", "I&rsquo;m not good at typing yet, but I can practice 10 minutes every day."), ["I&rsquo;m not good at", ""], "wide")),
        box(6, "Ask a partner, then give job advice", "Ask <b>Are you good at&hellip;?</b> Then choose a job for your partner from the front.",
            '<div class="hint">Partner&rsquo;s name: ______________________</div>'
            + interview("Are you good at&hellip;", "&hellip;fixing things?", 4, ["Yes / OK / No", "Example?"])
            + '<div class="hint" style="margin-top:6px">Your advice. Remember <b>is</b> for he / she: <i>Ana <b>is</b> good at listening. She should be a nurse.</i></div>'
            + rows(("", ""), ["You should be a"], "wide").replace("</span></div>", "</span></div>", 1)
            + '<div class="hint">&hellip; because you&rsquo;re good at ______________________. &emsp; Write about your partner:</div><div class="line"></div>'),
        check(["good at + V-ing", "interest<b>ed</b> in (not interesting)", "he / she + <b>is</b> good at", "-ing spelling"]),
    ])
    return sheet("What Are You Good At Worksheet", "What Are You Good At?", forms, rules, bk, "Write About You", back)


# ---------------------------------------------------------------- Week 12: How long? for / since
def for_since():
    tl = """<svg viewBox="0 0 720 92" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif" style="width:100%;height:0.95in;display:block;">
      <line x1="40" y1="52" x2="690" y2="52" stroke="#000" stroke-width="3"/><polygon points="690,46 704,52 690,58" fill="#000"/>
      <circle cx="160" cy="52" r="9" fill="#000"/><text x="160" y="84" text-anchor="middle" font-size="15" font-weight="700">2019</text>
      <text x="160" y="22" text-anchor="middle" font-size="17" font-weight="700">since 2019</text><text x="160" y="38" text-anchor="middle" font-size="12">(the start point)</text>
      <text x="640" y="84" text-anchor="middle" font-size="15" font-weight="700">NOW</text><line x1="640" y1="40" x2="640" y2="64" stroke="#000" stroke-width="3"/>
      <path d="M170 44 Q400 4 630 44" fill="none" stroke="#000" stroke-width="2.5" stroke-dasharray="6 5"/>
      <text x="400" y="20" text-anchor="middle" font-size="17" font-weight="700">for 7 years</text><text x="400" y="36" text-anchor="middle" font-size="12">(how much time)</text>
    </svg>"""
    forms = box(1, "for or since?", "Both answer <b>How long?</b> Both use <b>have / has + V3</b>.",
                tl + forms_row(['<div class="word">for</div><div class="md">+ how much time</div><div class="sm">5 minutes &middot; 2 weeks &middot; 10 years</div>',
                                '<div class="word">since</div><div class="md">+ the start point</div><div class="sm">Monday &middot; 8:00 &middot; 2019 &middot; I was a kid</div>']))
    rules = box(2, "How does it work?", "The important words are in <b>black</b>.", '<div class="rules">' + "".join([
        rule("A. Ask: How long have you + V3?", chips(("How long",), ("have",), "you", "lived", "here?"),
             "How long <b>has</b> she worked there?", "How long do you live here?"),
        rule("B. for + how much time", chips("I", "have lived", "here", ("for",), "7 years."),
             "I&rsquo;ve known her <b>for</b> a long time.", "since 7 years"),
        rule("C. since + the start point", chips("I", "have worked", "there", ("since",), "2021."),
             "&hellip;<b>since</b> Monday / <b>since</b> I was 15.", "for 2021"),
        rule("D. Not since then: haven&rsquo;t + V3", chips("I", ("haven&rsquo;t",), "had", "a vacation", "since 2023."),
             "She <b>hasn&rsquo;t</b> been to the beach <b>for</b> a year.", "I don&rsquo;t have a vacation since 2023."),
        remember("V3: live &rarr; <b>lived</b> &middot; know &rarr; <b>known</b> &middot; be &rarr; <b>been</b> &middot; have &rarr; <b>had</b> &nbsp;|&nbsp; he / she / it &rarr; <b>has</b>"),
    ]) + "</div>")
    cats = [
        ("Home", ["lived in this city", "lived in my apartment", "had my car", "had my phone", "lived with my roommate"]),
        ("Work", ["worked at my job", "been a cook / a cleaner", "had this schedule", "worked nights", "had my driver&rsquo;s license"]),
        ("Learning", ["studied English", "been in this class", "known how to drive", "used this app", "read this book"]),
        ("People", ["known my best friend", "been married", "had my dog / cat", "known my neighbors", "been a mother / father"]),
        ("Habits", ["played soccer", "been a vegetarian", "gone to the same church", "woken up at 5:00", "drunk coffee every day"]),
        ("Things I own", ["had these shoes", "had this coat", "had my bike", "used this backpack"]),
        ("Not since (haven&rsquo;t)", ["haven&rsquo;t had a vacation", "haven&rsquo;t been to the beach", "haven&rsquo;t seen a movie", "haven&rsquo;t slept 8 hours", "haven&rsquo;t eaten pizza"]),
    ]
    bk = '<h2>3. Phrase bank <span class="small">These are <b>have + V3</b> phrases. Add for or since.</span></h2>' + bank(
        cats, "<b>for:</b> a few days &middot; two weeks &middot; a month &middot; six months &middot; a year &middot; a long time &emsp; <b>since:</b> Monday &middot; last week &middot; January &middot; 2020 &middot; I was a kid &middot; I moved here")
    back = "".join([
        box(4, "Facts about me", "Use the bank. 2 with <b>for</b>, 2 with <b>since</b>.",
            rows(("example", "I have lived in my apartment since 2022."), ["for", "since", "for", "since"])),
        box(5, "Switch it!", "Today is <b>Thursday, December 3, 2026</b>. Change <b>since</b> to <b>for</b>. Do 3, then one of yours from Part 4.",
            rows(("since 2020", "for six years"), ["since 2016", "since Monday", "since August", "my sentence"], "wide")),
        box(6, "Guess how long!", "Your partner chooses one fact: <i>How long have you lived here?</i> Guess with <b>yes / no</b> questions until you find it.",
            '<div class="frame"><b>Have you</b> lived here <b>for more than</b> 5 years? &middot; <b>Have you</b> lived here <b>since</b> 2020? &middot; <b>Less than</b> 3 years? &rarr; Yes, I have. / No, I haven&rsquo;t.</div>'
            + '<div class="hint">Partner&rsquo;s name: ______________________ &emsp; My guesses:</div><div class="line"></div><div class="line"></div>'
            + '<div class="hint" style="margin-top:6px">Write the answer. Remember <b>has</b>: <i>Ana has lived here for four years.</i></div><div class="line"></div>'),
        check(["have / has + V3", "for + how much time", "since + start point", "How long have you&hellip;?"]),
    ])
    return sheet("For and Since Worksheet", "How Long? For and Since", forms, rules, bk, "Write About You", back)


# ---------------------------------------------------------------- Week 13: comparatives + superlatives
def comparatives():
    adj = [("cheap", "cheaper", "the cheapest"), ("big", "bigger", "the biggest"), ("easy", "easier", "the easiest"),
           ("expensive", "more expensive", "the most expensive"), ("good", "better", "the best"), ("bad", "worse", "the worst")]
    forms = box(1, "Three steps", "adjective &rarr; compare 2 &rarr; number 1",
                forms_row([f'<div class="md">{a}</div><div class="word">{b}</div><div class="md"><b>{c}</b></div>' for a, b, c in adj]))
    rules = box(2, "How does it work?", "The important words are in <b>black</b>.", '<div class="rules">' + "".join([
        rule("A. Short words: + er + than", chips("The bus", "is", ("cheaper",), ("than",), "a taxi."),
             "Boston is <b>colder than</b> Miami.", "more cheaper"),
        rule("B. Long words: more + than", chips("Rent", "is", ("more expensive",), ("than",), "last year."),
             "This chair is <b>more comfortable</b>.", "expensiver"),
        rule("C. Number 1: the + -est / the most", chips("This", "is", ("the cheapest",), "store."),
             "It&rsquo;s <b>the most beautiful</b> park.", "the most big"),
        rule("D. Spelling", chips("big &rarr; bigger", "easy &rarr; easier", "nice &rarr; nicer"),
             "hot &rarr; ho<b>tt</b>er &middot; busy &rarr; bus<b>i</b>er", "bigest"),
        remember("good &rarr; <b>better</b> &rarr; <b>the best</b> &middot; bad &rarr; <b>worse</b> &rarr; <b>the worst</b> &nbsp;|&nbsp; <b>than</b>, not <i>that</i>: &#10007; <s>bigger that</s>"),
    ]) + "</div>")
    cats = [
        ("Getting around", ["the bus", "the T", "a car", "a bike", "walking", "an Uber", "the train"]),
        ("Shopping", ["Market Basket", "a corner store", "Target", "shopping online", "a farmers market", "a dollar store"]),
        ("Food", ["home cooking", "takeout", "rice / bread", "coffee / tea", "fruit / candy", "chicken / fish", "water / soda"]),
        ("Places", ["Boston", "my hometown", "the city", "the country", "my old apartment", "a house", "an apartment"]),
        ("Seasons", ["summer", "winter", "fall", "spring"]),
        ("Life", ["my first year here", "this year", "my life now", "life 10 years ago", "English class", "my old job"]),
        ("Phone &amp; tech", ["calling", "texting", "a big phone", "a small phone", "email", "a laptop", "a tablet"]),
        ("Work &amp; life", ["the day shift", "the night shift", "a big company", "a small company", "working at home", "a full-time job", "a part-time job"]),
    ]
    bk = '<h2>3. Phrase bank <span class="small">Things to compare. Then pick an adjective.</span></h2>' + bank(
        cats, "<b>Adjectives:</b> cheap &middot; expensive &middot; fast &middot; slow &middot; easy &middot; hard &middot; big &middot; small &middot; safe &middot; healthy &middot; busy &middot; quiet &middot; friendly &middot; comfortable &middot; convenient &middot; good &middot; bad")
    rank = '<div class="rank">' + "".join(
        f'<div><b>{t}</b><div class="opt">' + "".join(f'<span class="cb"></span>{o}<br>' for o in opts) + "</div></div>"
        for t, opts in [("Getting to work", ["the bus", "a car", "a bike"]), ("Buying food", ["a big store", "a corner store", "online"]),
                        ("Seasons in Boston", ["summer", "fall", "winter"])]) + "</div>"
    back = "".join([
        box(4, "Rank it!", "Write <b>1, 2, 3</b> in the boxes (1 = the best for you). Then write about your number 1 and number 3.",
            rank + rows(("example", "The bus is the best because it is cheaper than a car."), ["My #1", "My #3"], "wide")),
        box(5, "My opinion", "<b>I think</b> ___ is ___ <b>than</b> ___ <b>because</b> &hellip; Use the bank.",
            rows(("example", "I think summer is better than winter because I can go to the beach."), ["I think", "I think", "I think"])),
        box(6, "Friendly debate", "Choose a topic with a partner. You pick one side. Your partner answers: <b>Yes, but&hellip;</b>",
            '<div class="frame"><b>Topics:</b> City or country? &middot; Cook or eat out? &middot; Call or text? &middot; Bus or car? &middot; Big store or small store?</div>'
            + interview("My side + my reason", "Cooking is cheaper than eating out.", 3, ["My partner: <i>Yes, but&hellip;</i>"])),
        check(["-er <b>or</b> more (not both)", "than (not that)", "the + -est / the most", "spelling: bigger, easier"]),
    ])
    return sheet("Comparatives and Superlatives Worksheet", "Bigger, Better, the Best", forms, rules, bk, "Write About You", back)


# ---------------------------------------------------------------- Week 14: How much / How many
def how_much():
    forms = box(1, "Can you count it?", "Yes &rarr; <b>many</b>. No &rarr; <b>much</b>. Both &rarr; <b>a lot of / some / any</b>.",
                forms_row(['<div class="word">How many?</div><div class="md">eggs, hours, kids</div>',
                           '<div class="word">a few</div><div class="md">a few eggs</div>',
                           '<div class="word">How much?</div><div class="md">rice, time, money</div>',
                           '<div class="word">a little</div><div class="md">a little rice</div>',
                           '<div class="word">a lot of</div><div class="md">both!</div>']))
    rules = box(2, "How does it work?", "The important words are in <b>black</b>.", '<div class="rules">' + "".join([
        rule("A. Can count: How many + -s", chips(("How many",), "eggs", "do you need?"),
             "&rarr; <b>a few</b> eggs / six eggs", "How many egg?"),
        rule("B. Can&rsquo;t count: How much (no -s)", chips(("How much",), "rice", "do you need?"),
             "&rarr; <b>a little</b> rice / a bag of rice", "How much rices?"),
        rule("C. Money: How much is / does&hellip; cost?", chips(("How much",), "is", "it?"),
             "<b>How much</b> does the bus cost?", "How many is it?"),
        rule("D. Both: a lot of / some / any", chips("I have", ("a lot of",), "friends / time."),
             ["Do you have <b>any</b> milk? &rarr; I don&rsquo;t have <b>any</b>."], "I have many money."),
        remember("Count it with a container: <b>a bottle of</b> water &middot; <b>a bag of</b> rice &middot; <b>a loaf of</b> bread &middot; <b>two cups of</b> coffee"),
    ]) + "</div>")
    cats = [
        ("Count it: food", ["eggs", "apples", "bananas", "potatoes", "onions", "tomatoes", "cans of beans", "tortillas", "carrots", "lemons", "cookies", "avocados", "peppers"], "yes"),
        ("Count it: life", ["hours", "days", "kids", "friends", "jobs", "bills", "classes", "emails", "steps", "minutes", "weeks", "phone calls", "messages"], "yes"),
        ("Can&rsquo;t count: food", ["rice", "bread", "milk", "water", "coffee", "sugar", "salt", "cheese", "meat", "oil", "juice", "butter", "soup", "flour", "pasta", "tea"], "no"),
        ("Can&rsquo;t count: life", ["money", "time", "homework", "work", "sleep", "information", "advice", "traffic", "news", "help", "furniture", "music", "weather", "electricity", "fun"], "no"),
    ]
    bk = '<h2>3. Phrase bank <span class="small">&#10003; = count it (How many) &nbsp; &#10007; = can&rsquo;t count it (How much)</span></h2>' + bank(
        cats, "<b>Containers:</b> a bag of &middot; a bottle of &middot; a box of &middot; a can of &middot; a carton of &middot; a cup of &middot; a gallon of &middot; a loaf of &middot; a pound of &middot; a piece of", split=True)
    survey = """<table class="interview"><tr><th>Question</th><th>My guess</th><th>My partner&rsquo;s answer</th></tr>
      <tr><td class="q">How many hours do you sleep?</td><td></td><td></td></tr>
      <tr><td class="q">How much water do you drink every day?</td><td></td><td></td></tr>
      <tr><td class="q">How many cups of coffee or tea do you drink?</td><td></td><td></td></tr>
      <tr><td class="q">How much time do you spend on your phone?</td><td></td><td></td></tr>
      <tr><td class="q">How many &hellip;</td><td></td><td></td></tr>
      <tr><td class="q">How much &hellip;</td><td></td><td></td></tr></table>"""
    back = "".join([
        box(4, "Dinner for 6", "You are cooking dinner for 6 people. Write 6 things you need. Use <b>a few / a little / a bag of / 2 pounds of&hellip;</b>",
            rows(("example", "a bag of rice, 2 pounds of chicken, and a few onions"), ["1, 2", "3, 4", "5, 6", "drinks"])
            + '<div class="hint" style="margin-top:4px">Now ask a partner: <b>How much rice do you need? How many onions?</b></div>'),
        box(5, "Guess the number", "First, <b>guess</b> your partner&rsquo;s answer. Then ask. Were you close?", survey),
        box(6, "Write about your partner", "Use <b>a lot of / not much / not many / a few / a little</b>. Remember <b>V1-s</b>.",
            rows(("example", "Ana sleeps 6 hours. She doesn&rsquo;t drink much water, but she drinks a lot of coffee!"), ["", "", ""])),
        check(["How many + -s", "How much (no -s)", "a few / a little", "a lot of = both"]),
    ])
    return sheet("How Much and How Many Worksheet", "How Much? How Many?", forms, rules, bk, "Write About You", back)


# ---------------------------------------------------------------- Week 15: fall review, roll a sentence
def fall_review():
    faces = [f'<span class="die">{n}</span>' for n in range(1, 7)]
    points = [("always / never", "I <b>usually</b> + V1"), ("If &hellip;, will", "If + V1, will + V1"), ("can / should / must", "should + V1"),
              ("Have you ever", "have + V3"), ("for / since", "have + V3 + for"), ("-er than / the -est", "cheaper than")]
    forms = box(1, "Roll 1: the grammar", "Roll a die. The number tells you the grammar.",
                forms_row([f'<div class="dice">{f}</div><div class="word" style="font-size:15px;">{n}</div><div class="sm">{e}</div>' for f, (n, e) in zip(faces, points)]))
    rules = box(2, "Quick rules", "The important words are in <b>black</b>.", '<div class="rules three">' + "".join([
        rule(f"{faces[0]} Before the verb", chips("I", ("usually",), "cook."), "", "I cook usually."),
        rule(f"{faces[1]} No <i>will</i> after <i>if</i>", chips("If", "it", ("rains",), ",", "I", ("will", ), "stay home."), "", "If it will rain"),
        rule(f"{faces[2]} Modal + V1", chips("You", ("should",), "rest."), "", "should to rest"),
        rule(f"{faces[3]} have + V3", chips("I", ("have",), ("eaten",), "it."), "", "I have ate it."),
        rule(f"{faces[4]} for time, since start", chips("for 2 years", ("since",), "2024"), "", "since 2 years"),
        rule(f"{faces[5]} -er OR more", chips("cheaper", ("than",), "a car"), "", "more cheaper"),
    ]) + "</div>")
    topics = [("Food", ["cook dinner", "eat rice", "drink coffee", "buy fruit", "try new food", "eat dessert", "skip breakfast"]),
              ("Work", ["work on weekends", "start early", "help customers", "take a break", "get a raise", "work late", "talk to my boss"]),
              ("Home", ["clean the kitchen", "pay the rent", "do laundry", "fix things", "live in my apartment", "cook for my family", "wash the dishes"]),
              ("Family &amp; friends", ["call my mom", "visit friends", "play with my kids", "send messages", "know my neighbor", "meet new people", "help a friend"]),
              ("Getting around", ["take the bus", "drive", "walk to class", "ride a bike", "take the T", "get a ride", "be late"]),
              ("Free time", ["watch movies", "play soccer", "listen to music", "go to the park", "sleep late", "read a book", "dance"])]
    cats = [(f"{f} {t}", items) for f, (t, items) in zip(faces, topics)]
    bk = '<h2>3. Roll 2: the topic <span class="small">Roll again. Pick a phrase from that topic. Change the verb form for your grammar!</span></h2>' + bank(
        cats, "<b>No die?</b> Close your eyes and point to a number. Or search &ldquo;roll a die&rdquo; on your phone.")
    roll_rows = "".join('<tr><td class="c" style="height:42px;"></td><td class="c"></td><td></td><td class="c"><span class="cb"></span></td></tr>' for _ in range(7))
    back = "".join([
        box(4, "Roll a sentence", "Roll for the grammar. Roll for the topic. <b>Say</b> your sentence to your partner. Then <b>write</b> it.",
            f"""<table class="interview"><tr><th style="width:10%;">Roll 1</th><th style="width:10%;">Roll 2</th><th>My sentence</th><th style="width:12%;">Partner &#10003;</th></tr>
            <tr><td class="c"><span class="die">4</span></td><td class="c"><span class="die">1</span></td><td><i>Have you ever tried Thai food? Yes, I have!</i></td><td class="c">&#10003;</td></tr>{roll_rows}</table>
            <div class="hint" style="margin-top:4px">Partner &#10003; = your partner checks it with the rules on the front. Fix it together if it&rsquo;s not right.</div>"""),
        box(5, "Make it a question", "Choose 2 of your sentences. Change them into questions. Ask your partner.",
            rows(("example", "I usually cook dinner. &rarr; Do you usually cook dinner?"), ["Question 1", "Question 2"], "wide")),
        box(6, "My best sentence", "Choose your favorite sentence from today. Write it perfectly. Read it to the class!",
            '<div class="line"></div><div class="line"></div><div class="line"></div>'),
        check(["he / she + V1-s", "no <i>will</i> after <i>if</i>", "modal + V1", "have + V3"]),
    ])
    return sheet("Fall Review Roll a Sentence Worksheet", "Fall Review: Roll a Sentence", forms, rules, bk, "Roll, Say, Write", back)


# File names start with the course week the grammar starts (two digits so they sort).
SHEETS = {
    "week09-have-you-ever": have_you_ever,
    "week10-good-at": good_at,
    "week12-for-since": for_since,
    "week13-comparatives": comparatives,
    "week14-how-much-how-many": how_much,
    "week15-fall-review-roll-a-sentence": fall_review,
}

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(SHEETS)
    for slug in wanted:
        html = SHEETS[slug]()
        assert "&mdash;" not in html and "—" not in html, f"em dash in {slug}"
        out = HERE / f"{slug}.html"
        out.write_text(html)
        pdf = out.with_suffix(".pdf")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000",
                        f"--print-to-pdf={pdf}", out.resolve().as_uri()], check=True, capture_output=True)
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        n = re.search(r"Pages:\s+(\d+)", info).group(1)
        print(f"{pdf.name}: {n} pages{'' if n == '2' else '  <-- expected 2'}")
