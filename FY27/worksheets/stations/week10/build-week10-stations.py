#!/usr/bin/env python3
"""Week 10 Tuesday stations, Tue 11/17/26: practice Have you ever...? (started Thu 11/12).

Quiz verbs: meet, speak. Vocab: meetings and suggestions (participate, suggest,
propose, recommend, reach an agreement, raise a concern). Stations: 1 WARM-UP,
2 SPEAK (short i / long ee), 3 TALK CARDS (Have you ever...? at the table),
4 REAL WORLD (neighborhood meeting flyer + comment card).

    python3 build-week10-stations.py
writes the HTML and PDFs next to this file. The association, library,
people, and phone numbers are made up.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week10-day1-2026-11-17"
MEET = ("meet", "meets", "meeting", "met", "met")
SPEAK_V = ("speak", "speaks", "speaking", "spoke", "spoken")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "Short <i>i</i> and long <i>ee</i>. With a teacher.", "Pages 4&ndash;5"),
    ("TALK CARDS", "With your group. A teacher will visit.", "Pages 6&ndash;7 + cards on the table"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 8&ndash;9 + 2 color pages on the table"),
]


def warmup(p, key):
    odd = [("participate &middot; raise a concern &middot; sandwich &middot; propose", "sandwich"),
           ("suggest &middot; recommend &middot; umbrella &middot; reach an agreement", "umbrella"),
           ("raise a concern &middot; mountain &middot; suggest &middot; participate", "mountain"),
           ("recommend &middot; pillow &middot; propose &middot; reach an agreement", "pillow"),
           ("participate &middot; recommend &middot; banana &middot; raise a concern", "banana")]
    odd_li = "".join(f'<li><b class="n">{i}.</b> {w.replace(a, p.circ(a, True))}</li>' for i, (w, a) in enumerate(odd, 1))
    hv = [("volunteered at a food bank?", "H"), ("help out at the cleanup <b>last Saturday</b>?", "D"),
          ("signed up for a class online?", "H"), ("donate clothes <b>last winter</b>?", "D"),
          ("supported a friend in a hard time?", "H")]
    hv_li = "".join(f'<li><b class="n">{i}.</b> ({p.circ("Have you ever", a == "H")} / {p.circ("Did you", a == "D")}) {t}</li>'
                    for i, (t, a) in enumerate(hv, 1))
    page2 = f"""  <div class="task">
    <h2>1. Odd one out</h2>
    <p class="how">Three are meeting words. Circle the one that does not belong.</p>
    <p class="example">Example: suggest &middot; propose &middot; <b class="circ" style="width:auto;padding:0 6px;border-radius:12px;">bus</b> &middot; recommend</p>
    <ol class="items">{odd_li}</ol>
  </div>
  <div class="task">
    <h2>2. Have you ever&hellip;? or Did you&hellip;?</h2>
    <p class="how">Circle the right start. <b>Have you ever + V3</b> = any time in your life. <b>Did you + V1</b> = one finished time.</p>
    <p class="example">Example: (<b class="circ" style="width:auto;padding:0 6px;border-radius:12px;">Have you ever</b> / Did you) donated blood?</p>
    <ol class="items">{hv_li}</ol>
  </div>
  <div class="task">
    <h2>3. Finish the sentence about you</h2>
    <p class="how"><b>You make up the ending.</b> Use your own ideas. Many answers are OK.<br>Pattern: <b>have / has (never) + V3</b></p>
    <div class="own">
      <b>Example:</b> I have never <span class="u">seen snow</span>.<br>
      &emsp;&emsp;&emsp;&ensp; Other good answers: I have never <span class="u">ridden a horse</span>. &middot; I have never <span class="u">eaten sushi</span>.
    </div>
    <ol class="items">
      <li><b class="n">1.</b> I have never {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">2.</b> I have {p.b("<i>answers vary</i>", "long")} many times.</li>
      <li><b class="n">3.</b> My family has never {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">4.</b> Have you ever {p.b("<i>answers vary</i>", "long")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every month</b>, the neighborhood group {} at the library. (meet)", "meets"),
        ("<b>Right now</b>, a parent is {} at the school meeting. (speak)", "speaking"),
        ("<b>Yesterday</b>, I didn&rsquo;t {} my child&rsquo;s new teacher. (meet)", "meet"),
        ("<b>Last night</b>, did she {} up about parking? (speak)", "speak"),
        ("My daughter doesn&rsquo;t {} Spanish at school <b>every day</b>. (speak)", "speak"),
        ("<b>Right now</b>, who are you {} with? (meet)", "meeting"),
        ("I <b>have</b> {} to the mayor once. (speak)", "spoken"),
        ("<b>Have</b> you {} your new neighbors? (meet)", "met"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>meet</b> and <b>speak</b>. <i>Meet</i> and <i>speak</i> are on this week&rsquo;s quiz!</p>
    {L.forms_table([MEET, SPEAK_V], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>meet</b> or <b>speak</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>Last week</b> + meet</p>
    <p class="ideas">Ideas: a friend &middot; my neighbor &middot; my child&rsquo;s teacher &middot; for coffee</p>
    {p.ln("<i>answers vary: Last week, I met my friend for coffee.</i>")}
    <p class="prompt"><b>At home</b> + speak <b>+ not</b></p>
    <p class="ideas">Ideas: English &middot; Spanish &middot; my language &middot; on the phone</p>
    {p.ln("<i>answers vary: At home, I don&rsquo;t speak English.</i>")}
    <p class="prompt"><b>Have you ever</b> + speak<b>?</b></p>
    <p class="ideas">Ideas: at a meeting &middot; to a big group &middot; on the radio &middot; to a doctor in English</p>
    {p.ln("<i>answers vary: Have you ever spoken at a meeting?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


PAIRS = [("ship", "sheep", "sheep"), ("sit", "seat", "sit"), ("live", "leave", "leave"), ("fill", "feel", "fill"),
         ("hit", "heat", "heat"), ("chip", "cheap", "chip"), ("bin", "bean", "bean"), ("still", "steal", "still")]
WHICH = [("I want to <b>leave</b> here.", "I want to <b>live</b> here.", "b"),
         ("Is that a <b>ship</b>?", "Is that a <b>sheep</b>?", "a"),
         ("These are <b>cheap</b>.", "These are <b>chips</b>.", "a"),
         ("Please <b>fill</b> the cup.", "Please <b>feel</b> the cup.", "b")]


def speak(p, key):
    rows = "".join(
        "<tr>" + "".join(
            f'<td class="n">{j + 1}</td><td>{p.circ(PAIRS[j][0], PAIRS[j][2] == PAIRS[j][0])}</td>'
            f'<td>{p.circ(PAIRS[j][1], PAIRS[j][2] == PAIRS[j][1])}</td>' for j in (i, i + 4)) + "</tr>"
        for i in range(4))
    which = "".join(
        f'<li><b class="n">{i}.</b> &nbsp;{p.circ("a.", c == "a")} {a} &emsp; {p.circ("b.", c == "b")} {b}</li>'
        for i, (a, b, c) in enumerate(WHICH, 1))
    page4 = f"""  <h2>Quick or long?</h2>
  <div class="rhythm">
    <div><div class="big">i &nbsp;<span style="font-size:20px;font-weight:normal;">ship &middot; sit &middot; live</span></div>
      <p><b>Short and quick.</b> Your mouth is relaxed. Don&rsquo;t smile.</p></div>
    <div><div class="big">ee &nbsp;<span style="font-size:20px;font-weight:normal;">sheep &middot; seat &middot; leave</span></div>
      <p><b>Long.</b> Smile wide, like a photo: <i>cheeeese!</i></p></div>
  </div>
  <p class="how"><b>Try it:</b> Put your fingers on the corners of your mouth. Say <i>sit</i>, then <i>seat</i>. On <b>ee</b>, your mouth moves out to a smile.</p>
  <div class="task">
    <h2>A. Listen and circle</h2>
    <p class="how">Your teacher says <b>one</b> word. Circle the word you hear.</p>
    <table class="pairs">{rows}</table>
  </div>
  <div class="task">
    <h2>B. Your turn: partner game</h2>
    <p class="how">Use the same words. <b>Partner A</b> says one word. <b>Partner B</b> points to it. Right? Switch. Wrong? Try again slowly.</p>
  </div>
  <div class="task">
    <h2>C. Listen again: which sentence?</h2>
    <p class="how">Your teacher says <b>a</b> or <b>b</b>. Circle the letter.</p>
    <ol class="items">{which}</ol>
  </div>"""
    page5 = f"""  <div class="task">
    <h2>D. Read aloud</h2>
    <p class="how">Take turns. Read one sentence each. Go slowly. <b>i</b> = quick. <b>ee</b> = long, with a smile.</p>
    <ol class="read-aloud">
      <li>Please have a seat. Sit here.</li>
      <li>Did he leave, or does he live here?</li>
      <li>The chips are cheap this week.</li>
      <li>Have you ever seen a sheep on a ship?</li>
      <li>Please fill out this form. I feel tired.</li>
      <li>We meet every week at the library.</li>
      <li>Have you ever spoken at a meeting?</li>
      <li>It&rsquo;s still cold, but the heat is on.</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b>. Then ask one more question: <i>&ldquo;When?&rdquo;</i> or <i>&ldquo;Really?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>Have you ever been on a big ship?</li>
      <li>Have you ever seen the sea in the winter?</li>
      <li>What do you eat when you need something cheap and quick?</li>
      <li>Do you want to live in the city or in the country? Why?</li>
      <li>Have you ever spoken English at a meeting?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. My hard words</h2>
    <p class="how">Write 3 words with <b>i</b> or <b>ee</b> that are hard for you. Practice them at home.</p>
    {p.ln("<i>answers vary</i>")}
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "short <i>i</i> and long <i>ee</i> &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


# Talk cards: (emoji, V3 phrase). Safe, everyday experiences only.
CARDS = [
    ("&#127843;", "eaten sushi"), ("&#10052;&#65039;", "seen snow"), ("&#128014;", "ridden a horse"),
    ("&#9992;&#65039;", "flown in a plane"), ("&#127858;", "cooked for 10 people"), ("&#127908;", "sung karaoke"),
    ("&#11088;", "met a famous person"), ("&#128483;&#65039;", "spoken at a meeting"), ("&#127957;&#65039;", "swum in the ocean"),
    ("&#128241;", "lost your phone"), ("&#128666;", "driven a truck"), ("&#127793;", "planted a garden"),
    ("&#127942;", "won a prize"), ("&#9917;", "watched a game in a stadium"), ("&#128131;", "taken a dance class"),
    ("&#127838;", "made bread"), ("&#128250;", "been on TV"), ("&#127881;", "forgotten a birthday"),
    ("&#127968;", "moved to a new city"), ("&#128508;", "been to New York City"),
]
V3_CHECK = [("eat", "eaten"), ("see", "seen"), ("ride", "ridden"), ("fly", "flown"), ("sing", "sung"),
            ("swim", "swum"), ("drive", "driven"), ("take", "taken"), ("forget", "forgotten"), ("be", "been")]


def talk(p, key):
    log = '<tr><td style="height:36px;"></td><td></td><td></td><td></td></tr>' * 5
    if key:
        log = log.replace("<td></td><td></td><td></td>", '<td></td><td></td><td class="ansc"><i>answers vary</i></td>', 1)
    page6 = f"""  <div class="task">
    <h2>How to play</h2>
    <ol class="items" style="list-style:none;">
      <li><b class="n">1.</b> Put the cards face down on the table.</li>
      <li><b class="n">2.</b> Take a card. Ask the person on your <b>left</b>: <i>&ldquo;Have you ever &hellip;?&rdquo;</i></li>
      <li><b class="n">3.</b> They answer: <b>Yes, I have.</b> / <b>No, I haven&rsquo;t.</b> / <b>No, never.</b></li>
      <li><b class="n">4.</b> <b>Yes?</b> Ask one more question with <b>did</b>: <i>When did you&hellip;? Where did you&hellip;? Did you like it?</i></li>
      <li><b class="n">5.</b> <b>No?</b> Ask: <i>&ldquo;Do you want to?&rdquo;</i> Then the next person takes a card.</li>
    </ol>
  </div>
  <div class="key" style="margin-bottom:10px;">
    <div><b>Have you ever + V3?</b><br>any time in your life</div>
    <div><b>When / Where did you + V1?</b><br>one finished time</div>
  </div>
  <div class="tip" style="margin-bottom:14px; font-size:17px; line-height:1.6;">
    <b>A:</b> Have you ever <b>eaten</b> sushi? &emsp; <b>B:</b> Yes, I have.<br>
    <b>A:</b> When <b>did</b> you <b>eat</b> it? &emsp;&emsp;&ensp; <b>B:</b> I <b>ate</b> it last year at my friend&rsquo;s house.<br>
    <b>A:</b> Did you like it? &emsp;&emsp;&emsp;&emsp;&ensp; <b>B:</b> Yes, I did!
  </div>
  <div class="task">
    <h2>Write it down</h2>
    <p class="how">After each turn, write who answered and one detail.</p>
    <table class="pick"><tr><th style="width:22%;">Who?</th><th style="width:30%;">Have you ever&hellip;?</th><th style="width:14%;">Yes / No</th><th>One detail (when? where?)</th></tr>{log}</table>
  </div>"""
    v3 = "".join(f"<td><b>{a}</b> &rarr; {p.b(b, 'short')}</td>" + ("</tr><tr>" if i % 5 == 4 and i < 9 else "")
                 for i, (a, b) in enumerate(V3_CHECK))
    page7 = f"""  <div class="task">
    <h2>A. Write about your group</h2>
    <p class="how">Write <b>4 sentences</b> about the people at your table. Use their names.</p>
    <div class="gram3">
      <div><b>has + V3</b><br>Ana <b>has been</b> to Mexico City.</div>
      <div><b>has never + V3</b><br>Juan <b>has never seen</b> snow.</div>
      <div><b>have both + V3</b><br>Mei and I <b>have both flown</b> in a plane.</div>
    </div>
    {p.ln("<i>answers vary: check has + V3 for one person, have + V3 for two</i>", 4)}
  </div>
  <div class="task">
    <h2>B. V3 check</h2>
    <p class="how">These verbs are on the cards. Write the <b>V3</b>.</p>
    <table class="pick" style="font-size:17px;"><tr>{v3}</tr></table>
  </div>
  <div class="task">
    <h2>C. &#9733; Make 2 new cards</h2>
    <p class="how">Write 2 new <i>Have you ever&hellip;?</i> questions. Ask your group.</p>
    <div class="gline"><b>1.</b>{p.ln("<i>answers vary: Have you ever + V3?</i>")}</div>
    <div class="gline"><b>2.</b>{p.ln("")}</div>
  </div>
  <div class="task">
    <h2>D. Talk together</h2>
    <ol class="items">
      <li><b class="n">1.</b> Which answer in your group was a surprise?</li>
      <li><b class="n">2.</b> What is something you have never done, but you want to do?</li>
    </ol>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "Have you ever&hellip;? &middot; with your group"
    return L.page("rd", "STATION 3: TALK CARDS", sub, 6, page6, key) + L.page("rd", "STATION 3: TALK CARDS", sub, 7, page7, key)


TF = [("Childcare is free.", "T"),
      ("You can bring your 12-year-old to childcare.", "F"),
      ("There will be a vote about the playground.", "T"),
      ("The mayor will come to the meeting.", "N"),
      ("You must be a citizen to speak at the meeting.", "F"),
      ("You can watch the meeting online.", "T")]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages. Start with <b>page 1</b> (the meeting flyer). Read it <b>together</b>. Check answers with your group. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> When is the meeting? {p.b("Monday, November 23, 6:30&ndash;8:00 p.m.", "long")}</li>
      <li><b class="n">2.</b> Where is the meeting? {p.b("Eastside Library, Community Room", "long")}</li>
      <li><b class="n">3.</b> At the Open Mic, how long can each person speak? {p.b("2 minutes", "short")}</li>
      <li><b class="n">4.</b> What will they vote on? {p.b("new playground equipment for Elm Park", "long")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. True, false, or not on the flyer?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the flyer, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the flyer</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>C. What should they do?</h2>
    <p class="how">Find the answer on the flyer. Write a sentence.</p>
    <ol class="items">
      <li><b class="n">1.</b> Rosa can&rsquo;t come on Monday. How can she share her concern?{p.ln("She can email it / use the online form / watch on Zoom.")}</li>
      <li><b class="n">2.</b> Luis wants to speak at the Open Mic. What must he do?{p.ln("He must sign up at the door.")}</li>
      <li><b class="n">3.</b> Mariam needs a Spanish interpreter. What should she do?{p.ln("She should call or email by November 20.")}</li>
      <li><b class="n">4.</b> <b>&#9733;</b> Tom has 3 kids: ages 2, 6, and 11. Can all 3 go to childcare? Why?{p.ln("No. Childcare is for ages 3&ndash;10. Only the 6-year-old can go.")}</li>
    </ol>
  </div>
  <p class="how bottom"><b>Talk:</b> Have you ever been to a meeting like this? A school meeting? A tenant meeting?</p>"""
    page9 = f"""  <p class="how">Now look at <b>page 2</b> on the table: <b>Mr. Haddad&rsquo;s comment card</b>.</p>
  <div class="task">
    <h2>D. Read the comment card</h2>
    <ol class="items">
      <li><b class="n">1.</b> What is the problem? {p.b("The streetlight on Cedar Street is broken.", "long")}</li>
      <li><b class="n">2.</b> How long has it been broken? {p.b("for 3 weeks (since October 26)", "long")}</li>
      <li><b class="n">3.</b> Has he called the city? How many times? {p.b("Yes, he has called 311 two times.", "long")}</li>
      <li><b class="n">4.</b> What does he suggest? {p.b("fix it this week / put a temporary light", "long")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Write your own comment card</h2>
    <p class="how"><b>Use your own idea.</b> What problem do you see in your neighborhood? Ideas: trash on the street &middot; no crosswalk &middot; a broken sidewalk &middot; not enough buses &middot; a dark park at night</p>
    <div class="textbox">
      <b>I want to raise a concern about</b> {p.b("<i>answers vary</i>", "long")}.<br>
      It is a problem because {p.b("<i>answers vary</i>", "long")}.<br>
      I have {p.b("<i>answers vary: seen it / called the city&hellip;</i>", "long")}.<br>
      <b>I suggest</b> that the city {p.b("<i>answers vary: + V1</i>", "long")}.
    </div>
  </div>
  <div class="task">
    <h2>&#9733; Open Mic practice</h2>
    <p class="how">Read your card to your group, like at the meeting. Speak for <b>2 minutes or less</b>. Your group says: <i>&ldquo;Thank you for raising your concern.&rdquo;</i></p>
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


def packet(key):
    p = L.P(key)
    body = (L.cover(10, "Tuesday, November 17, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + talk(p, key) + real_world(p, key)
            + L.verb_charts(10, MEET, "she", SPEAK_V, "they", key))
    return L.doc("Week 10 Tuesday Stations Packet" + (" (Answer Key)" if key else ""), L.packet_css(key), body)


CARDS_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #111; background: #fff;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Station 3 talk cards: print 1 copy per table (color or black and white). Cut on the dashed lines. */
  .page { width: 8.5in; height: 11in; padding: 0.4in; display: grid; grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr; page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .card { border: 1.5px dashed #888; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 8px; gap: 4px; }
  .card .emo { font-size: 38px; line-height: 1; }
  .card .hv { font-size: 16px; color: #555; }
  .card .ph { font-size: 22px; font-weight: bold; line-height: 1.15; }
  .card .n { font-size: 11px; color: #999; }
  .card.blank .ph { color: #999; font-weight: normal; font-size: 18px; }
  .card.blank .line { width: 85%; border-bottom: 1.5px solid #999; height: 26px; }
"""


def cards_doc():
    cells = [f'<div class="card"><div class="emo">{e}</div><div class="hv">Have you ever&hellip;</div>'
             f'<div class="ph">{ph}?</div><div class="n">{i}</div></div>' for i, (e, ph) in enumerate(CARDS, 1)]
    cells += ['<div class="card blank"><div class="hv">Have you ever&hellip;</div><div class="line"></div><div class="line"></div>'
              '<div class="ph">Your question!</div></div>'] * 4
    pages = "".join(f'<section class="page">{"".join(cells[i:i + 12])}</section>' for i in range(0, len(cells), 12))
    return L.doc("Week 10 Station 3 Talk Cards", CARDS_CSS, pages)


FLYER_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1c2433; background: #fff;
         font-size: 17px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up association, library, people, numbers.
     Questions are on packet pages 8-9; page 9 needs sheet 2. */
  .page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .hero { background: #24407a; color: #fff; border-radius: 10px; padding: 16px 22px; margin-bottom: 12px; }
  .hero .org { font-size: 16px; opacity: 0.95; }
  .hero h1 { font-size: 38px; line-height: 1.05; margin: 2px 0 4px; }
  .hero .all { display: inline-block; background: #f2b632; color: #1c2433; font-weight: bold; border-radius: 6px; padding: 2px 10px; font-size: 17px; }
  .when { display: flex; gap: 12px; margin-bottom: 12px; }
  .when > div { flex: 1; background: #eaf0fa; border-left: 6px solid #24407a; padding: 10px 14px; font-size: 19px; }
  .when b.l { display: block; font-size: 14px; color: #24407a; text-transform: uppercase; letter-spacing: 1px; }
  h2 { font-size: 21px; color: #24407a; margin: 6px 0 4px; }
  table.agenda { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  table.agenda td { padding: 9px 8px; border-bottom: 1px solid #ccd6ea; vertical-align: top; font-size: 18px; }
  table.agenda td.t { width: 15%; font-weight: bold; color: #24407a; white-space: nowrap; }
  .cols { display: flex; gap: 12px; }
  .box { flex: 1; border: 2px solid #24407a; border-radius: 8px; padding: 8px 14px; }
  .box h3 { font-size: 18px; color: #24407a; margin-bottom: 3px; }
  .box ul { padding-left: 1.1em; font-size: 17px; }
  .box li { margin-bottom: 4px; }
  .gold { border-color: #c98f00; background: #fff8e3; }
  .gold h3 { color: #8a6200; }
  .rules { margin-top: auto; background: #24407a; color: #fff; border-radius: 8px; padding: 8px 16px; font-size: 16px; }
  .card { border: 2px solid #999; border-radius: 6px; padding: 16px 22px; background: #fffef8; box-shadow: 3px 4px 0 #ddd; margin-bottom: 14px; }
  .card .ct { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #24407a; padding-bottom: 4px; margin-bottom: 10px; }
  .card .ct b { font-size: 22px; color: #24407a; }
  .card .row { display: flex; gap: 10px; margin-bottom: 8px; font-size: 17px; }
  .card .row .k { width: 1.6in; flex: none; font-weight: bold; color: #555; }
  .hand { font-family: "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; font-size: 19px; color: #1d3c8f; line-height: 1.5; }
"""


def flyer():
    sheet1 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="hero">
    <div class="org">East Side Neighborhood Association</div>
    <h1>Monthly Neighborhood Meeting</h1>
    <span class="all">Everyone is welcome. You don&rsquo;t need to be a citizen.</span>
  </div>
  <div class="when">
    <div><b class="l">When</b>Monday, November 23<br>6:30&ndash;8:00 p.m.</div>
    <div><b class="l">Where</b>Eastside Library<br>Community Room, 2nd floor (elevator)</div>
  </div>
  <h2>Agenda</h2>
  <table class="agenda">
    <tr><td class="t">6:30</td><td>Welcome and snacks</td></tr>
    <tr><td class="t">6:40</td><td>Update: the new crosswalk on Elm Street (City Transportation Office)</td></tr>
    <tr><td class="t">7:00</td><td><b>Vote:</b> new playground equipment for Elm Park. Two choices: a climbing wall or new swings.</td></tr>
    <tr><td class="t">7:30</td><td><b>Open Mic: raise a concern.</b> Sign up at the door. Each person can speak for <b>2 minutes</b>.</td></tr>
    <tr><td class="t">7:55</td><td>Next steps and next meeting</td></tr>
  </table>
  <div class="cols">
    <div class="box">
      <h3>Interpreters</h3>
      <ul><li>Spanish and Haitian Creole</li><li>Please call or email <b>by Friday, November 20</b>.</li></ul>
      <h3 style="margin-top:6px;">Free childcare</h3>
      <ul><li>Ages <b>3 to 10</b>, in Room B</li></ul>
    </div>
    <div class="box gold">
      <h3>Can&rsquo;t come?</h3>
      <ul><li>Watch on Zoom: eastsideneighbors.example.org/live</li><li>Email your concern: hello@eastsideneighbors.example.org</li><li>Or use the online comment form.</li></ul>
    </div>
  </div>
  <div class="rules" style="margin-top:14px;"><b>Meeting rules:</b> Raise your hand to speak. One person speaks at a time. Be respectful. &middot; Questions? (617) 555-0177</div>
</section>"""
    sheet2 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <h2 style="font-size:30px;">Mr. Haddad&rsquo;s comment card</h2>
  <p style="margin-bottom:12px;">Mr. Haddad can&rsquo;t speak at the Open Mic. He works on Monday nights. He filled out the online comment form.</p>
  <div class="card">
    <div class="ct"><b>East Side Neighborhood Association &middot; Comment Card</b><span>Nov. 16, 2026</span></div>
    <div class="row"><span class="k">Name</span><span class="hand">Karim Haddad</span></div>
    <div class="row"><span class="k">Street</span><span class="hand">Cedar Street</span></div>
    <div class="row"><span class="k">My concern</span><span class="hand">The streetlight in front of 18 Cedar Street is broken. It has been broken for 3 weeks, since October 26. At night the sidewalk is very dark. My kids walk home from the bus stop at 5:30, and it is already dark.</span></div>
    <div class="row"><span class="k">What I have done</span><span class="hand">I have called 311 two times. They gave me a ticket number, but nobody has fixed it.</span></div>
    <div class="row"><span class="k">My suggestion</span><span class="hand">I suggest that the city fix the light this week. If they can&rsquo;t, I recommend a temporary light. Can someone from the association help me contact the city?</span></div>
    <div class="row"><span class="k">Contact me</span><span class="hand">karim.h@example.com</span></div>
  </div>
  <div class="box" style="flex:none;">
    <h3>Useful words for a concern</h3>
    <ul>
      <li><b>raise a concern</b> = tell people about a problem</li>
      <li><b>suggest / recommend</b> = say a good idea: <i>I suggest that the city fix it.</i></li>
      <li><b>311</b> = the city phone number for problems like broken lights or trash</li>
    </ul>
  </div>
</section>"""
    return L.doc("Week 10 Tuesday Real World: Neighborhood Meeting", FLYER_CSS, sheet1 + sheet2)


def self_check():
    why = {1: "&ldquo;Free childcare&rdquo;", 2: "Childcare is for ages 3 to 10.", 3: "7:00: Vote on the playground.",
           4: "The flyer doesn&rsquo;t say who will come.", 5: "&ldquo;You don&rsquo;t need to be a citizen.&rdquo;",
           6: "Watch on Zoom."}
    word = {"T": "True", "F": "False", "N": "Not on the flyer"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    body = f"""<h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a" colspan="2">Monday, November 23, 6:30&ndash;8:00 p.m.</td></tr>
      <tr><td class="n">2</td><td class="a" colspan="2">Eastside Library, Community Room (2nd floor)</td></tr>
      <tr><td class="n">3</td><td class="a">2 minutes</td><td class="why"></td></tr>
      <tr><td class="n">4</td><td class="a" colspan="2">new playground equipment for Elm Park</td></tr>
    </table>
    <h2>B. True, false, or not on the flyer?</h2>
    <table>{tf}</table>
    <h2>C. What should they do?</h2>
    <table>
      <tr><td class="n">1</td><td class="a" colspan="2">Email it, use the online form, or watch on Zoom.</td></tr>
      <tr><td class="n">2</td><td class="a" colspan="2">He must sign up at the door.</td></tr>
      <tr><td class="n">3</td><td class="a" colspan="2">Call or email by Friday, November 20.</td></tr>
      <tr><td class="n">4&#9733;</td><td class="a">No</td><td class="why">Ages 3&ndash;10 only. Only the 6-year-old can go.</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Find the sentence on the flyer together. Read it out loud. <b>Part D:</b> look for <i>has been</i>, <i>have called</i>, and <i>I suggest</i> on the card.</div>"""
    return L.self_check_doc("Week 10 Station 4 Self-Check", body)


def leader_guide():
    words = "".join(f'<tr><td class="n">{i + 1}</td><td>{PAIRS[i][2]}</td><td class="n">{i + 5}</td><td>{PAIRS[i + 4][2]}</td></tr>'
                    for i in range(4))
    which = "".join(f'<li><b>{c}.</b> {(a if c == "a" else b)}</li>' for a, b, c in WHICH)
    top = L.leader_top(10, "11/17/26", STATIONS, [
        "<b>This week:</b> practice <b>Have you ever&hellip;?</b> (started Thursday). Quiz verbs: <b>meet, speak</b>. Week 10 Quiz opens Thu 11/19 at 6 p.m.",
        "<b>Before class:</b> cut 1 set of talk cards per table. Print the flyer in color (2 copies) and the self-check card.",
        "<b>Floating:</b> start each block at <b>Station 4</b> (show the flyer, do Part B #1 together). Then Station 3: play one card with them so they hear the <i>did</i> follow-up. Then Station 1.",
        "<b>Moves:</b> 3-minute warning, then move. <b>7:46&ndash;end:</b> wrap-up, quiz reminder. <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (i / ee)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p>Spanish, Portuguese, Haitian Creole, and Arabic have one <b>i</b> sound, close to English <b>ee</b>, so <i>live</i> and <i>leave</i> sound the same. Goal: <b>hear</b> it, then <b>make</b> it.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>Quick or long?</b> Fingers on the corners of the mouth: <i>sit / seat</i>. Exaggerate the smile on <b>ee</b>.</td></tr>
    <tr><td>5 min</td><td><b>A. Listen and circle.</b> Say each word twice, naturally. Then check.</td></tr>
    <tr><td>4 min</td><td><b>B. Partner game.</b> Walk around. Model once, slowly, if needed.</td></tr>
    <tr><td>3 min</td><td><b>C. Which sentence?</b> Read the sentences below.</td></tr>
    <tr><td>5 min</td><td><b>D. Read aloud.</b> One sentence each. Fix only i / ee.</td></tr>
    <tr><td>5 min</td><td><b>E. Talk.</b> Push for a full sentence and one follow-up.</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Say these words</h2>
      <table class="script">{words}</table>
      <h2>C. Say these sentences</h2>
      <ol class="key">{which}</ol>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li>Point to your smile for <b>ee</b>, relax your face for <b>i</b>.</li>
        <li>Fix <b>one word</b>, then move on. Keep it light.</li>
      </ul>
      <div class="recast">Learner: &ldquo;I want to <u>leev</u> in Boston.&rdquo;<br>You: &ldquo;Oh, you want to <b>live</b> in Boston? Where?&rdquo;</div>
      <h2>Adjust the level</h2>
      <ul class="dots"><li><b>Beginner:</b> repeat after you, word by word.</li><li><b>Stronger:</b> they say a word for the group to circle.</li></ul>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 10 &middot; Tue 11/17/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. Odd one out:</b> 1 sandwich &middot; 2 umbrella &middot; 3 mountain &middot; 4 pillow &middot; 5 banana</p>
        <p><b>2. Have you ever / Did you:</b> 1 Have you ever &middot; 2 Did you (last Saturday) &middot; 3 Have you ever &middot; 4 Did you (last winter) &middot; 5 Have you ever</p>
        <p><b>3. About you:</b> answers vary. Check <i>have / has (never) + V3</i>.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> meet, meets, meeting, met, met &middot; speak, speaks, speaking, spoke, spoken</p>
        <p><b>5. Right form:</b> 1 meets &middot; 2 speaking &middot; 3 meet &middot; 4 speak &middot; 5 speak &middot; 6 meeting &middot; 7 spoken &middot; 8 met</p>
        <p><b>6. Your turn:</b> answers vary: <i>Last week, I met &hellip; / I don&rsquo;t speak &hellip; / Have you ever spoken &hellip;?</i></p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {c}" for i, (_, _, c) in enumerate(PAIRS))} &middot; <b>C:</b> {" &middot; ".join(f"{i} {c}" for i, (_, _, c) in enumerate(WHICH, 1))} &middot; <b>D&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: TALK CARDS (pages 6&ndash;7 + cards)</h2>
    <p><b>Game and A:</b> answers vary. Listen for <i>Have you ever + V3?</i> &rarr; <i>Yes, I have.</i> &rarr; <i>When did you + V1?</i> &rarr; <i>I + V2</i>. In A: <i>has + V3</i> for one person, <i>have both + V3</i> for two.</p>
    <p><b>B, V3:</b> {" &middot; ".join(f"{a} &rarr; {b}" for a, b in V3_CHECK)} &middot; <b>C:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Neighborhood meeting (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 Monday, Nov. 23, 6:30&ndash;8:00 p.m. &middot; 2 Eastside Library, Community Room &middot; 3 2 minutes &middot; 4 new playground equipment for Elm Park</p>
    <p><b>B:</b> 1 True &middot; 2 False (ages 3&ndash;10) &middot; 3 True &middot; 4 Not on the flyer &middot; 5 False &middot; 6 True (Zoom)</p>
    <p><b>C:</b> 1 email it / online form / watch on Zoom &middot; 2 sign up at the door &middot; 3 call or email by Nov. 20 &middot; &#9733;4 No: only the 6-year-old (ages 3&ndash;10)</p>
    <p><b>D:</b> 1 the streetlight on Cedar Street is broken &middot; 2 for 3 weeks, since October 26 &middot; 3 yes, two times (311) &middot; 4 fix it this week, or a temporary light</p>
    <p><b>E:</b> answers vary. Check <i>I suggest that the city + V1</i> (no <i>-s</i>: <i>the city fix</i>) and one <i>have + V3</i>.</p>
    <p style="font-size:12px;">The association, library, people, websites, and phone numbers are made up. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (she + meet, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (they + speak):</b> speak, speaks, speaking, spoke, spoken &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("they", SPEAK_V))}</p>
  </div>
</section>"""
    return L.doc("Week 10 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 10),
        f"{STEM}-packet-key.html": (packet(True), 10),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
        f"{STEM}-talk-cards.html": (cards_doc(), 2),
        f"{STEM}-real-world-document.html": (flyer(), 2),
        f"{STEM}-real-world-self-check.html": (self_check(), 1),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
