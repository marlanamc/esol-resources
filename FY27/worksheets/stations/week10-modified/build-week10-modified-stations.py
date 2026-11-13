#!/usr/bin/env python3
"""Week 10 Tuesday stations, MODIFIED: Tue 11/17/26. 3 longer stations instead of 4.

Week 9's "Have you ever...?" was hard, so this night slows down:
  Page 1      WRITING WARM-UP, everyone together (prompt + writing lines)
  Station 1   WARM-UP + GAME, on your own then with your group (reuses the
              original Week 10 warm-up pages and the Have you ever game)
  Station 2   CARD GAME with a teacher (Matt), no page
  Station 3   TIME WORDS with a teacher (Marlana): Past Simple vs Present
              Perfect, then finish on the app's Time Indicators game
  Finished early: verb charts + write about you

The original 4-station set stays in ../week10/ for another day; this script
imports its pieces so nothing there changes.

    python3 build-week10-modified-stations.py
"""
import importlib.util
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

_spec = importlib.util.spec_from_file_location("w10", HERE.parent / "week10" / "build-week10-stations.py")
W10 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(W10)

STEM = "week10-modified-day1-2026-11-17"
STRIP = ('  <div class="strip"><div class="name-row">Name: <span class="blank"></span> '
         'My group: &nbsp;A &nbsp; B &nbsp; C</div></div>\n')
ROTATION = [("A", [1, 2, 3]), ("B", [2, 3, 1]), ("C", [3, 1, 2])]
STATIONS = [
    ("WARM-UP + GAME", "On your own, then with your group.", "Pages 2&ndash;4"),
    ("CARD GAME", "With a teacher. No paper.", "&mdash;"),
    ("TIME WORDS", "With a teacher. Then the app.", "Pages 5&ndash;7"),
]

EXTRA_CSS = """
  .wkey { margin-bottom: 8px; }
  .wkey div { font-size: 15px; line-height: 1.3; }
  .wq { margin-bottom: 9px; }
  .wq .q { font-size: 19px; font-weight: bold; }
  .wq .q b.n { display: inline-block; width: 1.4em; }
  .wq .model, .wq .alt { font-size: 15px; font-style: italic; padding-left: 1.6em; }
  .wq .alt { font-size: 14px; color: #333; }
  .wq .line { height: 32px; margin-left: 1.6em; }
  .star { font-size: 15px; border: 1.5px dashed #000; padding: 5px 10px; margin-top: 8px; }
  .tw { display: flex; gap: 12px; margin-bottom: 10px; }
  .tw > div { flex: 1; border: 2.5px solid #000; padding: 8px 12px; }
  .tw .hd { font-size: 20px; font-weight: bold; line-height: 1.15; }
  .tw .ar { font-size: 16px; margin-bottom: 4px; }
  .tw .ex { font-size: 16px; font-style: italic; margin-top: 4px; }
  .tw .ws { font-size: 15px; margin-top: 4px; }
  .tw svg { display: block; width: 100%; height: 56px; margin: 4px 0 2px; }
  .ask { font-size: 17px; text-align: center; border: 1.5px solid #000; background: #f2f2f2; padding: 5px 10px; margin-bottom: 10px; }
  .wbank { font-size: 17px; font-weight: bold; text-align: center; border: 2px dashed #888; padding: 5px 8px; margin-bottom: 6px; line-height: 1.6; }
  .wbank span { white-space: nowrap; margin: 0 7px; }
  table.sort2 { width: 100%; border-collapse: collapse; }
  table.sort2 th { border: 2px solid #000; padding: 3px; font-size: 15px; width: 50%; }
  table.sort2 td { border: 2px solid #000; height: 0.95in; vertical-align: top; padding: 6px; font-size: 16px; color: #c00; font-weight: bold; }
  .ch ol.items li { font-size: 17px; margin-bottom: 7px; }
  table.fix { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  table.fix td { border: 1.5px solid #000; padding: 5px 8px; font-size: 17px; height: 40px; vertical-align: middle; }
  table.fix td.s { width: 46%; }
  table.fix td.c { width: 9%; text-align: center; }
  .chain { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; border: 2px solid #000; padding: 8px 12px; font-size: 17px; margin-bottom: 8px; }
  .chain .who { font-weight: bold; }
  .chain .lab { font-size: 13px; font-style: italic; }
  .dlg { font-size: 17px; line-height: 2.05; }
  .dlg .blank { line-height: 1.2; }
  .tw.two .big2 { font-size: 21px; margin: 4px 0 2px; }
  table.fix.hs td { height: 28px; padding: 2px 8px; font-size: 16px; }
  table.fix.hs td.s { width: 64%; }
  table.fix.hs td.c { width: 18%; }
  .bp { display: flex; gap: 14px; }
  .bp > div { flex: 1; border: 2px solid #000; padding: 4px 10px 6px; }
  .bp svg { display: block; width: 100%; height: 1.35in; margin: 2px 0 4px; }
  .bp p { font-size: 15px; line-height: 1.3; }
  .app { border: 2.5px solid #000; border-radius: 14px; padding: 8px 14px; display: flex; gap: 14px; align-items: center; }
  .app .ic { font-size: 40px; line-height: 1; }
  .app .zones { display: flex; gap: 8px; margin-top: 4px; font-size: 15px; }
  .app .zones div { border: 1.5px solid #000; border-radius: 8px; padding: 2px 8px; }
"""


def renumber(html, mapping, label=None, sub=None):
    """Swap page numbers (and optionally the station label/sub) on reused pages."""
    html = re.sub(r'<div class="pg">Page (\d+)</div>',
                  lambda m: f'<div class="pg">Page {mapping.get(int(m.group(1)), m.group(1))}</div>', html)
    if label:
        html = re.sub(r'<div class="label">[^<]*<span>[^<]*(?:<i>[^<]*</i>[^<]*)?</span>',
                      f'<div class="label">{label}<span>{sub}</span>', html)
    return html


# Page 1: question -> model answer -> learner writes their own answer.
WARM_QS = [  # (question, model answer, other answers or None)
    ("How long have you lived in Boston?",
     "I have lived in Boston <b>for</b> 4 years.",
     "I have lived in Boston <b>since</b> 2019. &middot; I have lived in Boston <b>for</b> 6 months."),
    ("How long have you studied English?",
     "I have studied English <b>since</b> 2023.", None),
    ("Have you ever taken the Silver Line?",
     "Yes, I have. I <b>took</b> it to the airport last month.",
     "No, I haven&rsquo;t. I take the bus."),
    ("Have you ever worked in customer service?",
     "No, I haven&rsquo;t. I have worked in a kitchen.", None),
    ("How long have you worked at your job?",
     "I have worked at my job <b>for</b> 2 years.",
     "I don&rsquo;t have a job now. I have looked for a job <b>since</b> September."),
    ("Have you ever paid a bill online?",
     "Yes, I have. I <b>paid</b> my phone bill online last week.", None),
]


def writing_warmup(p, key):
    items = ""
    for i, (q, model, other) in enumerate(WARM_QS, 1):
        alt = f'<div class="alt">Other answers: {other}</div>' if other else ""
        items += f"""  <div class="wq">
    <div class="q"><b class="n">{i}.</b> {q}</div>
    <div class="model">Example: {model}</div>{alt}
    {p.ln("<i>answers vary</i>", 2 if i <= 2 else 1)}
  </div>
"""
    body = STRIP + f"""  <div class="station-bar"><div class="label">WRITING WARM-UP<span>everyone &middot; 10 minutes</span></div><div class="pg">Page 1</div></div>
  <p class="how">Read the question and the example. Then write <b>your</b> answer. <b>You make up the answer.</b> It is about <b>your</b> life. Many answers are OK.</p>
  <div class="key wkey">
    <div><b>How long have you&hellip;?</b><br><b>for</b> + time: for 4 years, for 6 months<br><b>since</b> + start: since 2019, since September</div>
    <div><b>Have you ever&hellip;?</b><br>Yes, I have. / No, I haven&rsquo;t.<br>+ one more sentence. A time word? &rarr; <b>V2</b></div>
  </div>
{items}  <p class="star bottom"><b>&#9733; Star your best answer.</b> Read it to a teacher.</p>"""
    tag = '<div class="keytag">ANSWER KEY</div>' if key else ""
    return f'<section class="page">{tag}\n{body}\n</section>\n'


# Replaces the original "Odd one out" (too easy: sandwich vs. meeting words). Learners must
# know what each quiz vocab word means, and 2 answers need V2 (link to Station 3).
VOCAB = [
    ("The heat in my building is broken. At the tenant meeting, I will {}.", "raise a concern"),
    ("Everyone can {} in the meeting. You can talk, ask questions, or vote.", "participate"),
    ("My doctor is great. I {} her to all my friends.", "recommend"),
    ("We talked for an hour. <b>Finally</b>, we {}: the party is on Friday.", "reached an agreement"),
    ("<b>Yesterday</b>, my manager asked for ideas. I {} a new schedule.", "suggested"),
]


def vocab_task(p):
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(VOCAB, 1))
    return f"""<div class="task">
    <h2>1. Meeting words in real life</h2>
    <p class="how">Write a word from the box. Use each word one time.</p>
    <p class="bank" style="text-align:center;"><span>participate</span> <span>suggested</span> <span>recommend</span> <span>reached an agreement</span> <span>raise a concern</span></p>
    <p class="example">Example: I <u>propose</u> that we meet on Saturday. Is that OK for everyone?</p>
    <ol class="items">{lis}</ol>
  </div>"""


def station1(key):
    p = L.P(key)
    lab, sub = "STATION 1: WARM-UP + GAME", "on your own, then with your group"
    wu = W10.warmup(p, key).replace(L.NAME_STRIP, "")
    wu, n = re.subn(r'<div class="task">\s*<h2>1\. Odd one out</h2>.*?</div>', vocab_task(p), wu, count=1, flags=re.S)
    assert n == 1
    wu = renumber(wu, {1: 2, 2: 3}, lab, "on your own")
    # Phrase bank page dropped (Nov 13): hand out the week09-have-you-ever phrase bank sheet separately.
    game = re.sub(r'<section class="page pbp">.*?</section>\n', "", W10.talk(p, key), count=1, flags=re.S)
    game = game.replace("Look at page 5.", "Look at your phrase bank sheet.")
    game = renumber(game, {6: 4}, lab, "with your group")
    return wu + game


# ---------------------------------------------------------------- Station 3
# Labels match the app game (TimeIndicatorSortingUI): Specified Time -> Past Simple,
# Unspecified Time -> Present Perfect. All words below are in the app's rounds.
SORT_WORDS = [("yesterday", "S"), ("ever", "U"), ("last summer", "S"), ("never", "U"),
              ("two years ago", "S"), ("before", "U"), ("in 2019", "S"), ("many times", "U"),
              ("when I was a child", "S"), ("twice", "U"), ("on Saturday", "S"), ("three times", "U")]
SORT_ORDER = [0, 3, 6, 5, 8, 1, 10, 7, 2, 11, 4, 9]  # mixed so the columns are not in order

CHOOSE = [  # (sentence with {} for the choice, past, perfect, answer)
    ("I {} my cousin <b>yesterday</b>.", "saw", "have seen", "saw"),
    ("She {} Boston <b>two times</b>.", "visited", "has visited", "has visited"),
    ("We {} to the U.S. <b>in 2021</b>.", "came", "have come", "came"),
    ("My son {} a plane <b>many times</b>.", "took", "has taken", "has taken"),
    ("He {} his job <b>three years ago</b>.", "started", "has started", "started"),
    ("<b>Last night</b>, we {} pizza.", "ate", "have eaten", "ate"),
    ("I {} that movie <b>twice</b>.", "saw", "have seen", "have seen"),
    ("My friends {} my house <b>on Saturday</b>.", "visited", "have visited", "visited"),
]
QUESTIONS2 = [  # question pairs: (text, past, perfect, answer)
    ("{} to New York <b>before</b>?", "Did you go", "Have you been", "Have you been"),
    ("<b>When</b> {} English?", "did you start", "have you started", "did you start"),
]

FIX = [  # (sentence, correct?, fix)
    ("I have seen him <b>yesterday</b>.", False, "I saw him yesterday."),
    ("Have you <b>ever</b> been to Canada?", True, ""),
    ("She has moved here <b>in 2020</b>.", False, "She moved here in 2020."),
    ("I went to the beach <b>last summer</b>.", True, ""),
    ("<b>When</b> have you arrived?", False, "When did you arrive?"),
    ("We have eaten there <b>many times</b>.", True, ""),
]

TIMELINE_S = """<svg viewBox="0 0 300 56" aria-hidden="true">
  <line x1="10" y1="30" x2="270" y2="30" stroke="#000" stroke-width="2.5"/>
  <polygon points="270,24 284,30 270,36" fill="#000"/>
  <text x="276" y="54" font-size="13" text-anchor="middle" font-weight="bold">NOW</text>
  <circle cx="110" cy="30" r="9" fill="#000"/>
  <text x="110" y="14" font-size="13" text-anchor="middle">yesterday</text>
  <text x="10" y="54" font-size="13">past</text>
</svg>"""
TIMELINE_U = """<svg viewBox="0 0 300 56" aria-hidden="true">
  <line x1="10" y1="30" x2="270" y2="30" stroke="#000" stroke-width="2.5"/>
  <polygon points="270,24 284,30 270,36" fill="#000"/>
  <text x="276" y="54" font-size="13" text-anchor="middle" font-weight="bold">NOW</text>
  <path d="M20 18 V12 H262 V18" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="141" y="9" font-size="12" text-anchor="middle">any time in my life, up to now</text>
  <text x="110" y="35" font-size="20" text-anchor="middle" font-weight="bold">?</text>
  <text x="10" y="54" font-size="13">past</text>
</svg>"""


# ---------------------------------------------------------------- Station 3 start page
# Nov 13: a learner reads "have" only as possession. Show have's two jobs (like do),
# a sort, and the "experience backpack" (why present-tense have: the experience is with you NOW).
HAVE_SORT = [  # (sentence, "own" / "help" / "both")
    ("I <b>have</b> two jobs.", "own"),
    ("I <b>have</b> worked at two jobs.", "help"),
    ("She <b>has</b> a new phone.", "own"),
    ("She <b>has</b> lost her phone.", "help"),
    ("We <b>have</b> a meeting on Monday.", "own"),
    ("We <b>have</b> met our new neighbors.", "help"),
    ("<b>Has</b> he seen the doctor?", "help"),
    ("Do you <b>have</b> a doctor?", "own"),
]

BACKPACK = """<svg viewBox="0 0 230 150" aria-hidden="true">
  <path d="M80 26 C80 4 150 4 150 26" fill="none" stroke="#000" stroke-width="5"/>
  <rect x="8" y="24" width="214" height="122" rx="22" fill="#fff" stroke="#000" stroke-width="3"/>
  <path d="M8 54 H222" stroke="#000" stroke-width="2"/>
  <text x="115" y="46" font-size="19" font-weight="bold" text-anchor="middle">MY LIFE &#183; NOW</text>
  <text x="26" y="80" font-size="19">&#10003; eaten sushi</text>
  <text x="26" y="106" font-size="19">&#10003; seen snow</text>
  <text x="26" y="132" font-size="19">&#10003; worked two jobs</text>
</svg>"""
PHOTO = """<svg viewBox="22 14 156 166" aria-hidden="true">
  <g transform="rotate(-4 100 95)">
    <rect x="30" y="22" width="140" height="150" fill="#fff" stroke="#000" stroke-width="3"/>
    <rect x="44" y="36" width="112" height="90" fill="#eee" stroke="#000" stroke-width="1.5"/>
    <text x="100" y="94" font-size="40" text-anchor="middle">&#127843;</text>
    <text x="100" y="155" font-size="18" font-weight="bold" text-anchor="middle">yesterday</text>
  </g>
</svg>"""


def have_page(key):
    p = L.P(key)
    rows = "".join(
        f'<tr><td class="s"><b>{i}.</b> {t}</td><td class="c">{p.cb(k == "own")}</td><td class="c">{p.cb(k == "help")}</td></tr>'
        for i, (t, k) in enumerate(HAVE_SORT, 1))
    star = p.b("has = helper. had = V3 of have (own it).", "long")
    body = f"""  <div class="task">
    <h2>1. <i>Have</i> has two jobs</h2>
    <p class="how">You know <b>do</b> has two jobs: <i>I <b>do</b> my homework.</i> (action) &middot; <i><b>Do</b> you like coffee?</i> (helper). <b>Have</b> is the same!</p>
    <div class="tw two">
      <div><div class="hd">Have = I own it</div><div class="big2">I <b>have</b> a car.</div><div class="ws"><b>have + a thing</b></div><div class="ws">Question: <b>Do</b> you have a car?</div></div>
      <div><div class="hd">Have = helper</div><div class="big2">I <b>have</b> driven a car.</div><div class="ws"><b>have + V3</b> (present perfect)</div><div class="ws">Question: <b>Have</b> you driven a car?</div></div>
    </div>
    <p class="ask"><b>Test:</b> Look at the word <b>after</b> have. A thing? &rarr; own it. A <b>V3</b>? &rarr; helper.</p>
  </div>
  <div class="task">
    <h2>2. Own it or helper?</h2>
    <p class="how">Check <b>&#10003;</b> one box.</p>
    <table class="fix hs"><tr><td class="s" style="height:auto;font-size:14px;"><b>Sentence</b></td><td class="c" style="height:auto;font-size:14px;"><b>Own it</b></td><td class="c" style="height:auto;font-size:14px;"><b>Helper</b></td></tr>{rows}</table>
    <p class="how" style="margin-top:4px;"><b>&#9733; Challenge:</b> <i>I <b>have had</b> my car for 5 years.</i> Which word is the helper? Which word is &ldquo;own it&rdquo;? {star}</p>
  </div>
  <div class="task">
    <h2>3. Why <i>have</i>? Your experience backpack</h2>
    <div class="bp">
      <div>{BACKPACK}<p><i>I <b>have eaten</b> sushi.</i><br>The experience is in my backpack <b>now</b>. I <b>have</b> it with me. No date. &rarr; <b>have + V3</b></p></div>
      <div>{PHOTO}<p><i>I <b>ate</b> sushi <b>yesterday</b>.</i><br>An old photo with a date. It is finished. &rarr; <b>V2</b></p></div>
    </div>
  </div>"""
    return L.page("", "STATION 3: TIME WORDS", "start here: why <i>have</i>? &middot; with a teacher", 5, body, key)


def station3(key):
    p = L.P(key)
    order = [SORT_WORDS[i] for i in SORT_ORDER]
    bank = " &middot; ".join(f"<span>{w}</span>" for w, _ in order)
    s_col = ", ".join(w for w, c in SORT_WORDS if c == "S") if key else ""
    u_col = ", ".join(w for w, c in SORT_WORDS if c == "U") if key else ""

    def choose(t, a, b, ans):
        return t.format(f"({p.circ(a, ans == a)} / {p.circ(b, ans == b)})")
    lis = "".join(f'<li><b class="n">{i}.</b> {choose(*c)}</li>' for i, c in enumerate(CHOOSE + QUESTIONS2, 1))
    page6 = f"""  <div class="tw">
    <div>
      <div class="hd">Specified Time</div>
      <div class="ar">&rarr; Use <b>Past Simple</b>: <b>V2</b></div>
      {TIMELINE_S}
      <div class="ws">You say <b>when</b>. It is finished.</div>
      <div class="ex">I <b>ate</b> sushi <b>yesterday</b>.</div>
    </div>
    <div>
      <div class="hd">Unspecified Time</div>
      <div class="ar">&rarr; Use <b>Present Perfect</b>: <b>have / has + V3</b></div>
      {TIMELINE_U}
      <div class="ws">You <b>don&rsquo;t</b> say when. Any time up to now.</div>
      <div class="ex">I <b>have eaten</b> sushi <b>two times</b>.</div>
    </div>
  </div>
  <p class="ask"><b>Ask:</b> Can I put my finger on <b>one day</b> on the line? &nbsp; <b>Yes</b> &rarr; V2. &nbsp; <b>No</b> &rarr; have / has + V3.</p>
  <div class="task">
    <h2>A. Sort the time words</h2>
    <p class="how">Write each time word in the right box. In the app game, you do this too!</p>
    <p class="wbank">{bank}</p>
    <table class="sort2"><tr><th>Specified Time &rarr; V2</th><th>Unspecified Time &rarr; have / has + V3</th></tr>
      <tr><td>{s_col}</td><td>{u_col}</td></tr></table>
  </div>
  <div class="task ch">
    <h2>B. Look at the time word. Circle the verb.</h2>
    <p class="example">Example: I (<b class="circ" style="width:auto;padding:0 6px;border-radius:12px;">called</b> / have called) my mom <b>last night</b>.</p>
    <ol class="items">{lis}</ol>
  </div>"""
    fix_rows = "".join(
        f'<tr><td class="s"><b>{i}.</b> {s}</td><td class="c">{p.cb(ok)}</td>'
        f'<td>{(f"<span class=ans>{f}</span>" if key and f else "")}</td></tr>'
        for i, (s, ok, f) in enumerate(FIX, 1))
    page7 = f"""  <div class="task">
    <h2>C. Right or wrong?</h2>
    <p class="how">Right? Check <b>&#10003;</b>. Wrong? Write it the right way. <b>Look at the time word first.</b></p>
    <table class="fix"><tr><td class="s" style="height:auto;font-size:14px;"><b>Sentence</b></td><td class="c" style="height:auto;font-size:14px;"><b>Right</b></td><td style="height:auto;font-size:14px;"><b>Wrong? Fix it.</b></td></tr>{fix_rows}</table>
  </div>
  <div class="task">
    <h2>D. The switch: ever &rarr; when</h2>
    <p class="how">First you ask about <b>any time</b>. Then you ask about <b>one time</b>. The verb changes!</p>
    <div class="chain">
      <span class="who">A:</span><span>Have you <b>ever</b> <b>lost</b> your keys? <span class="lab">(unspecified &rarr; have + V3)</span></span>
      <span class="who">B:</span><span>Yes, I have.</span>
      <span class="who">A:</span><span><b>When did</b> you <b>lose</b> them? <span class="lab">(asking for a time &rarr; did + V1)</span></span>
      <span class="who">B:</span><span>I <b>lost</b> them <b>last month</b>, at work! <span class="lab">(specified &rarr; V2)</span></span>
    </div>
    <p class="how">Talk with a partner. Then write <b>your</b> conversation. <b>You pick the idea.</b><br>
      <span class="ideas" style="font-size:15px;">Ideas: go to a wedding &middot; cook for a big party &middot; see the ocean &middot; take a test in English &middot; ride a bike in Boston</span></p>
    <div class="dlg">
      <b>A:</b> Have you ever {p.b("<i>answers vary: been to a wedding</i>", "long")}?<br>
      <b>B:</b> Yes, I have.<br>
      <b>A:</b> When did you {p.b("<i>go</i>")}?<br>
      <b>B:</b> I {p.b("<i>went</i>", "short")} {p.b("<i>in 2023 / last summer</i>", "long")}.
    </div>
  </div>
  <div class="app bottom">
    <div class="ic">&#128241;</div>
    <div>
      <b style="font-size:19px;">E. Finish on the app: the Time Indicators game</b><br>
      <span style="font-size:16px;">Your teacher will show you the game. Put each time word in the right box. Play <b>Round 1</b>. My score: {p.b("", "short")}</span>
      <div class="zones"><div><b>Specified Time</b> &rarr; Use Past Simple</div><div><b>Unspecified Time</b> &rarr; Use Present Perfect</div></div>
    </div>
  </div>"""
    lab = "STATION 3: TIME WORDS"
    return (have_page(key)
            + L.page("", lab, "V2 or have + V3? &middot; with a teacher", 6, page6, key)
            + L.page("", lab, "with a teacher", 7, page7, key))


def packet(key):
    p = L.P(key)
    early = (renumber(L.verb_charts(8, W10.MEET, "she", W10.SPEAK_V, "they", key), {})
             + L.write_about_you_page(W10.PB_BACK, key, pg=9).replace("look at page 5 for help", "use your phrase bank sheet"))
    body = writing_warmup(p, key) + station1(key) + station3(key) + early
    css = L.packet_css(key) + L.NO_COVER_CSS + W10.PB_CSS + EXTRA_CSS
    return L.doc("Week 10 (Modified) Tuesday Stations Packet" + (" (Answer Key)" if key else ""), css, body)


def leader_guide():
    rows = "".join(
        f'<tr><td class="g">{g}</td><td>Page 1: writing</td>' + "".join(f"<td>{n} &middot; {STATIONS[n - 1][0]}</td>" for n in order) + "</tr>"
        for g, order in ROTATION)
    s_words = ", ".join(w for w, c in SORT_WORDS if c == "S")
    u_words = ", ".join(w for w, c in SORT_WORDS if c == "U")
    choose = " &middot; ".join(f"{i} {c[3]}" for i, c in enumerate(CHOOSE + QUESTIONS2, 1))
    fix = " &middot; ".join(f"{i} {'&#10003;' if ok else f}" for i, (_, ok, f) in enumerate(FIX, 1))
    page1 = f"""<section class="page">
  <div class="header-row"><h1>Tuesday Stations &middot; Leader Guide (Modified)</h1><span class="tag">Week 10 &middot; Tue 11/17/26 &middot; not for students</span></div>
  <table class="rotation">
    <tr><th>Group</th><th>Warm-up<span class="time">6:00&ndash;6:10</span></th><th>Block 1<span class="time">6:12&ndash;6:42</span></th><th>Block 2<span class="time">6:44&ndash;7:14</span></th><th>Block 3<span class="time">7:16&ndash;7:46</span></th></tr>
    {rows}
    <tr class="who"><td class="g">Adults</td><td colspan="4">Matt stays at <b>Station 2 (CARD GAME)</b>. Marlana stays at <b>Station 3 (TIME WORDS)</b>. Station 1 runs on its own.</td></tr>
  </table>
  <ul class="dots">
    <li><b>Why modified:</b> <i>Have you ever</i> was hard last week. Tonight = 3 longer stations (30 min), with one whole station on <b>time words</b>. The original 4-station set is in <b>week10/</b> for another day.</li>
    <li><b>6:00 Writing warm-up (page 1):</b> everyone, at their seats. Walk around and read starred sentences. <b>Late?</b> Do page 1, then join your group&rsquo;s station.</li>
    <li><b>Station 1 (pages 2&ndash;4):</b> about 12 min on pages 2&ndash;3 alone, then the <i>Have you ever</i> game together (page 4). Put the <b>Have you ever phrase bank sheet</b> on the table (group-handouts/phrase-banks/week09-have-you-ever.pdf, front side), or hand it out at the start. Not finished? Finish at home.</li>
    <li><b>Print:</b> packet double-sided (9 pages) + phrase bank sheets for Station 1. Groups A, B, C (about 6 each). Tell groups their order out loud or on the board. Nothing to cut, no flyer.</li>
    <li><b>7:46&ndash;end:</b> wrap-up, quiz reminder (Week 10 Quiz opens Thu 11/19, 6 p.m.). <b>Finished early</b> &rarr; verb charts (page 8) or write about you (page 9).</li>
  </ul>
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 3: TIME WORDS</h1><span class="tag">Packet pages 5&ndash;7 + app</span></div>
  <table class="timeline">
    <tr><td>7 min</td><td><b>Page 5: why <i>have</i>?</b> Start with <i>do</i> (they know its two jobs). Then the two <i>have</i> boxes and the test: the word <b>after</b> have. Sort together. The backpack: <i>I have eaten sushi</i> = &ldquo;I carry this experience with me <b>now</b>,&rdquo; so <i>have</i> really does mean something. For Spanish speakers: <i>tengo</i> un carro = own it, <i>he</i> comido = helper. English uses one word for both.</td></tr>
    <tr><td>3 min</td><td><b>The two boxes (page 6).</b> Link to the backpack: no date = backpack = have + V3. A date = the photo = V2.</td></tr>
    <tr><td>4 min</td><td><b>A. Sort.</b> Do <i>yesterday</i> and <i>ever</i> together, then let them try. Check out loud.</td></tr>
    <tr><td>5 min</td><td><b>B. Circle.</b> Rule: <b>find the time word first</b>, then pick the verb. Read each answer aloud as a group.</td></tr>
    <tr><td>4 min</td><td><b>C. Right or wrong?</b> The big error is <i>have + V3 + yesterday</i>. Ask: &ldquo;Is there a time word? Which box?&rdquo;</td></tr>
    <tr><td>4 min</td><td><b>D. The switch.</b> Read the model with one learner. Pairs talk first, then write. Listen for <i>When <b>did</b> you&hellip;?</i> (not <i>When have you&hellip;?</i>).</td></tr>
    <tr><td>3 min</td><td><b>E. App game, Round 1.</b> They write their score on the page. Out of time? They finish it at home.</td></tr>
  </table>
  <div class="recast">Learner: &ldquo;I have went to New York last year.&rdquo;<br>You: &ldquo;Last year? That&rsquo;s a finished time. So: I <b>went</b> to New York last year. Nice!&rdquo;</div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys + App Notes</h1><span class="tag">Week 10 modified &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>The app game: Time Indicators (check it before class)</h2>
    <p>Title in the app: <b>Time Indicators: Past Simple vs Present Perfect</b> (activity id <code>time-indicators-sorting</code>, link: <b>/activity/time-indicators-sorting</b>). Open it on a phone before class to check it shows up for students. The page uses the app&rsquo;s labels: <b>Specified Time &rarr; Use Past Simple</b> and <b>Unspecified Time &rarr; Use Present Perfect</b>.</p>
    <p><b>Round 1 only.</b> It has <i>ever, never, yesterday, last week, ago</i>, plus <i>just, already, yet</i>: a sneak peek of Thursday&rsquo;s lesson. Say: &ldquo;These go in the Present Perfect box. We learn them on Thursday!&rdquo; Round 2 has <i>for, since, lately</i> (not taught yet), and Round 3 has the tricky <i>this week / this morning</i>. Fast finishers can try Round 2.</p>
  </div>
  <div class="box">
    <h2>Page 1: Writing warm-up</h2>
    <p>Answers vary. 6 questions: <i>How long have you&hellip;?</i> (for / since) and <i>Have you ever&hellip;?</i> Each has a model. Common errors: <i>I <s>live</s> in Boston for 4 years</i> &rarr; <i>I <b>have lived</b>&hellip;</i>; <i>since 4 years</i> &rarr; <i>for 4 years</i>. A time word in the extra sentence (<i>last month</i>) &rarr; V2.</p>
  </div>
  <div class="box">
    <h2>Station 1: WARM-UP + GAME (pages 2&ndash;4)</h2>
    <p><b>1. Meeting words:</b> {" &middot; ".join(f"{i} {a}" for i, (_, a) in enumerate(VOCAB, 1))} &middot; <b>2. Have you ever / Did you:</b> 1 Have you ever &middot; 2 Did you &middot; 3 Have you ever &middot; 4 Did you &middot; 5 Have you ever &middot; <b>3:</b> answers vary</p>
    <p><b>4. Forms:</b> meet, meets, meeting, met, met &middot; speak, speaks, speaking, spoke, spoken &middot; <b>5:</b> 1 meets &middot; 2 speaking &middot; 3 meet &middot; 4 speak &middot; 5 speak &middot; 6 meeting &middot; 7 spoken &middot; 8 met &middot; <b>6:</b> answers vary</p>
    <p><b>Game (page 4):</b> answers vary. Listen for <i>Have you ever + V3?</i> &rarr; <i>When did you + V1?</i> &rarr; <i>I + V2</i>.</p>
  </div>
  <div class="box">
    <h2>Station 3: TIME WORDS (pages 5&ndash;7)</h2>
    <p><b>Page 5, 2. Own it or helper:</b> {" &middot; ".join(f"{i} {'own it' if k == 'own' else 'helper'}" for i, (_, k) in enumerate(HAVE_SORT, 1))} &middot; <b>&#9733;</b> <i>has</i> = helper, <i>had</i> = V3 of <i>have</i> (own it)</p>
    <p><b>A. Specified (V2):</b> {s_words} &middot; <b>Unspecified (have + V3):</b> {u_words}</p>
    <p><b>B:</b> {choose}</p>
    <p><b>C:</b> {fix}</p>
    <p><b>D:</b> answers vary. Check <i>Have you ever + V3</i>, then <i>When did you + V1</i>, then <i>I + V2 + time word</i>.</p>
  </div>
  <div class="box">
    <h2>FINISHED EARLY: verb charts (page 8) and write about you (page 9)</h2>
    <p><b>Chart 1 (she + meet, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (they + speak):</b> speak, speaks, speaking, spoke, spoken &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("they", W10.SPEAK_V))}</p>
  </div>
</section>"""
    return L.doc("Week 10 (Modified) Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 9),
        f"{STEM}-packet-key.html": (packet(True), 9),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
