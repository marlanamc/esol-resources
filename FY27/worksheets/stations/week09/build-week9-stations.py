#!/usr/bin/env python3
"""Week 9 Tuesday stations, Tue 11/10/26: practice can / should / must (started Thu 11/5).

Quiz verbs: take, bring. Vocab: volunteering (volunteer, help out, support,
contribute, donate, sign up for). Stations: 1 WARM-UP, 2 SPEAK (can vs can't),
3 GAME (advice cards), 4 REAL WORLD (food pantry flyer: getting free food).

Revised Nov 4 2026 after the Week 8 debrief: READ was too many questions, so
Station 3 is a card game; learners work 2-3 jobs, so the pantry is a place they
can use, not a place to work for free; the phone call moved up to Part B so
every group reaches it; Station 1 ends with real writing, not a bonus.

    python3 build-week9-stations.py
writes the HTML and PDFs next to this file. The pantry, people, and phone
numbers are made up.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week9-day1-2026-11-10"
TAKE = ("take", "takes", "taking", "took", "taken")
BRING = ("bring", "brings", "bringing", "brought", "brought")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "<i>Can</i> or <i>can&rsquo;t</i>? With a teacher.", "Pages 4&ndash;5"),
    ("GAME", "Advice cards. With your group. A teacher will visit.", "Pages 6&ndash;7 + cards on the table"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 8&ndash;9 + 2 color pages on the table"),
]


def warmup(p, key):
    page2 = f"""  <div class="task">
    <h2>1. Can, should, or must?</h2>
    <p class="how">Use every word once. Then <b>V1</b>. No <i>to</i>, no <i>-s</i>.</p>
    <div class="bank"><span>can&rsquo;t</span> <span>Should</span> <span>must not</span> <span>must</span> <span>Can</span> <span>shouldn&rsquo;t</span></div>
    <ol class="items">
      <li><b class="n">1.</b> You {p.b("must", "short")} show your ID at the airport.</li>
      <li><b class="n">2.</b> My son is two. He {p.b("can&rsquo;t", "short")} read yet.</li>
      <li><b class="n">3.</b> You {p.b("shouldn&rsquo;t", "short")} eat a lot of candy. It&rsquo;s bad for your teeth.</li>
      <li><b class="n">4.</b> {p.b("Can", "short")} you speak Spanish?</li>
      <li><b class="n">5.</b> You {p.b("must not", "short")} text while you drive. It&rsquo;s against the law.</li>
      <li><b class="n">6.</b> {p.b("Should", "short")} I call the doctor or go to the clinic?</li>
    </ol>
  </div>
  <div class="task">
    <h2>2. Fill in the blank</h2>
    <p class="how">Use every word once. Change the verb form if needed.</p>
    <div class="bank"><span>donate</span> <span>sign up for</span> <span>volunteer</span> <span>help out</span> <span>support</span> <span>contribute</span></div>
    <ol class="items">
      <li><b class="n">1.</b> She doesn&rsquo;t {p.b("volunteer")} on Sundays, only on Saturdays.</li>
      <li><b class="n">2.</b> Can you {p.b("help out")} with the park cleanup on Sunday?</li>
      <li><b class="n">3.</b> Our neighborhood {p.b("supports")} families who need help with food and rent.</li>
      <li><b class="n">4.</b> Everyone can {p.b("contribute")} time or money to the community garden.</li>
      <li><b class="n">5.</b> We {p.b("donate")} winter coats to the shelter twice a year.</li>
      <li><b class="n">6.</b> Did you {p.b("sign up for")} the soccer team online?</li>
    </ol>
  </div>
  <div class="task">
    <h2>3. Give advice</h2>
    <p class="how">Your friend has a problem. <b>You make up the advice.</b> Use your own ideas. Many answers are OK.<br>Pattern: <b>should / shouldn&rsquo;t + V1</b></p>
    <div class="own">
      <b>Example:</b> &ldquo;I&rsquo;m always tired.&rdquo; &rarr; You should <span class="u">go to bed early</span>.<br>
      &emsp;&emsp;&emsp;&ensp; Other good answers: You should <span class="u">take a walk</span>. &middot; You shouldn&rsquo;t <span class="u">drink coffee at night</span>.
    </div>
    <ol class="items">
      <li><b class="n">1.</b> &ldquo;Food is very expensive this month.&rdquo; You should {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">2.</b> &ldquo;I want to practice English.&rdquo; You should {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">3.</b> &ldquo;My back hurts.&rdquo; You shouldn&rsquo;t {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">4.</b> &ldquo;I have a job interview.&rdquo; Should I {p.b("<i>answers vary</i>", "long")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every Saturday</b>, my neighbor {} her own bags to the pantry. (bring)", "brings"),
        ("<b>Right now</b>, I am {} the bus to work. (take)", "taking"),
        ("<b>Yesterday</b>, we didn&rsquo;t {} our lunch to work. (bring)", "bring"),
        ("I <b>have</b> {} my son to the doctor two times this month. (take)", "taken"),
    ]
    you = [  # (starter, ideas, key example)
        ("At work, I must", "wake up at 5 &middot; wear a uniform &middot; be on time &middot; stand all day",
         "At work, I must wear a uniform."),
        ("During the week, I can&rsquo;t", "cook dinner &middot; see my kids a lot &middot; rest &middot; go to bed early",
         "During the week, I can&rsquo;t see my kids a lot."),
        ("On my day off, I should", "sleep &middot; call my family &middot; clean the house &middot; study English",
         "On my day off, I should call my family."),
        ("I help out", "my sister: I watch her kids &middot; a coworker: I give him a ride &middot; my neighbor: I carry her bags",
         "I help out my sister. I watch her kids."),
    ]
    you_html = "".join(
        f'<div class="gline"><b style="width:auto;">{s}</b>{p.ln(f"<i>answers vary: {ex}</i>")}</div>\n'
        f'    <p class="ideas">Ideas: {ideas}</p>\n    ' for s, ideas, ex in you)
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>take</b> and <b>bring</b>. <i>Take</i> and <i>bring</i> are on this week&rsquo;s quiz!</p>
    {L.forms_table([TAKE, BRING], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>take</b> or <b>bring</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Write about you</h2>
    <p class="how">Write true sentences about <b>your</b> week. <b>You make up the ending.</b> Many answers are OK.</p>
    {you_html}<p class="prompt"><b>&#11088; Star your best sentence.</b> Read it to your teacher.</p>
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


LISTEN = [  # (sentence with ___, answer) — the leader reads these
    ("I ___ drive.", "can&rsquo;t"),
    ("She ___ come on Saturday.", "can"),
    ("We ___ help out on Sunday.", "can"),
    ("He ___ lift heavy boxes.", "can&rsquo;t"),
    ("They ___ speak Spanish.", "can&rsquo;t"),
    ("You ___ park here.", "can"),
    ("My son ___ swim.", "can&rsquo;t"),
    ("I ___ volunteer this week.", "can"),
]


def speak(p, key):
    listen = "".join(
        f'<li><b class="n">{j + 1}.</b> {s.replace("___", "_____")} <span class="cc">{p.circ("can", a == "can")} / {p.circ("can&rsquo;t", a != "can")}</span></li>'
        for j, (s, a) in enumerate(LISTEN))
    who = ["cook for 20 people", "drive a truck", "speak 3 languages", "fix a bike",
           "sew a button", "swim", "sing in English", "lift 25 pounds"]
    who_rows = "".join(f'<tr><td class="q">Can you {who[i]}?</td><td></td><td class="q">Can you {who[i + 4]}?</td><td></td></tr>'
                       for i in range(4))
    page4 = f"""  <h2>Can or can&rsquo;t? Listen to the beat.</h2>
  <div class="rhythm">
    <div><div class="big">can</div><p class="beats">I can <b>SWIM</b>.</p><p>da da <b>DUM</b></p>
      <p class="small"><b>can</b> is short and quiet. The <b>verb</b> is loud.</p></div>
    <div><div class="big">can&rsquo;t</div><p class="beats">I <b>CAN&rsquo;T</b> swim.</p><p>da <b>DUM</b> da</p>
      <p class="small"><b>can&rsquo;t</b> is long and loud. You often don&rsquo;t hear the <b>t</b>!</p></div>
  </div>
  <p class="how"><b>Try it:</b> Clap the beat. <i>I can SWIM</i> (clap on SWIM). <i>I CAN&rsquo;T swim</i> (clap on CAN&rsquo;T).</p>
  <div class="task">
    <h2>A. Listen and circle</h2>
    <p class="how">Your teacher reads the sentence. Circle <b>can</b> or <b>can&rsquo;t</b>.</p>
    <ol class="items listen2">{listen}</ol>
  </div>
  <div class="task">
    <h2>B. Your turn: thumbs up or down</h2>
    <p class="how"><b>Partner A</b> reads a sentence from Part A with <i>can</i> or <i>can&rsquo;t</i>. Don&rsquo;t show it! <b>Partner B</b>: thumbs up &#128077; = <i>can</i>, thumbs down &#128078; = <i>can&rsquo;t</i>. Switch.</p>
  </div>
  <div class="task">
    <h2>C. Who can do it?</h2>
    <p class="how">Ask the people <b>at your table</b>. Write a name. Short answers are <b>loud</b>: &ldquo;Yes, I <b>CAN</b>.&rdquo; &ldquo;No, I <b>CAN&rsquo;T</b>.&rdquo;</p>
    <table class="who">{who_rows}</table>
  </div>"""
    page5 = f"""  <div class="task">
    <h2>D. Read aloud</h2>
    <p class="how">Take turns. Read one sentence each. <i>can</i> = quiet. <i>can&rsquo;t</i> = loud.</p>
    <ol class="read-aloud">
      <li>I can help out on Saturday, but I can&rsquo;t come on Sunday.</li>
      <li>Can you bring a box? Yes, I can.</li>
      <li>She can&rsquo;t lift the boxes. They&rsquo;re too heavy.</li>
      <li>Kids can volunteer with a parent.</li>
      <li>He can cook, but he can&rsquo;t bake.</li>
      <li>We can&rsquo;t park here. We should take the bus.</li>
      <li>You must sign in. You should bring water.</li>
      <li>Can you take these coats to the shelter?</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b>. Then ask one more question: <i>&ldquo;Why?&rdquo;</i> or <i>&ldquo;Really?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>What can you do well? What can&rsquo;t you do?</li>
      <li>What can you cook? Can you cook for a big group?</li>
      <li>When can you help a neighbor: weekdays or weekends?</li>
      <li>What can you do in English now? What do you want to learn?</li>
      <li>What should a new student in this class bring?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. Say it to your teacher</h2>
    <p class="how">Write one sentence with <b>can</b> and one with <b>can&rsquo;t</b>. Read them to your teacher.</p>
    <div class="gline"><b>can</b>{p.ln("<i>answers vary</i>")}</div>
    <div class="gline"><b>can&rsquo;t</b>{p.ln("<i>answers vary</i>")}</div>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "<i>can</i> or <i>can&rsquo;t</i> &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


CARDS = [  # (emoji, problem, (idea, idea)) - front = problem, back = sample advice. One deck per table.
    ("&#129393;", "I work two jobs. I&rsquo;m always tired.",
     ("You should sleep on your day off.", "You can ask your family to help at home.")),
    ("&#129398;", "My apartment is cold. My landlord doesn&rsquo;t fix the heat.",
     ("You should call your landlord again.", "You can call 311. The city can help.")),
    ("&#128084;", "I have a job interview tomorrow. I&rsquo;m nervous.",
     ("You should practice with a friend.", "You shouldn&rsquo;t be late.")),
    ("&#128483;&#65039;", "My kids speak English. They don&rsquo;t want to speak my language.",
     ("You should speak your language at home.", "You can read books in your language together.")),
    ("&#129658;", "I don&rsquo;t understand my doctor. She talks very fast.",
     ("You should ask for an interpreter. It&rsquo;s free.", "You can say, &ldquo;Please speak slowly.&rdquo;")),
    ("&#128722;", "Food is very expensive this month.",
     ("You should go to a food pantry.", "You can buy rice and beans. They&rsquo;re cheap.")),
    ("&#9200;", "My coworker is always late. I do her work.",
     ("You should talk to your coworker.", "You can talk to your boss.")),
    ("&#128218;", "I want to practice English, but I don&rsquo;t have time.",
     ("You can listen to English on the bus.", "You should practice on the app for 10 minutes a day.")),
    ("&#129298;", "My son is sick. I have to work tomorrow.",
     ("You should call your boss early.", "You can ask a family member to help.")),
    ("&#9993;&#65039;", "I got a letter in English. I don&rsquo;t understand it.",
     ("You shouldn&rsquo;t throw it away.", "You can ask your teacher to read it with you.")),
    ("&#128663;", "My car broke down. I need to get to work.",
     ("You can take the bus.", "You should ask a coworker for a ride.")),
    ("&#128564;", "I can&rsquo;t sleep at night.",
     ("You shouldn&rsquo;t drink coffee at night.", "You should turn off your phone in bed.")),
    ("&#128241;", "My phone bill is too high.",
     ("You should call the company.", "You can ask for a cheaper plan.")),
    ("&#129509;", "Winter is coming. My kids need warm coats.",
     ("You should ask your kids&rsquo; school. Some schools give free coats.", "You can buy coats at a second-hand store.")),
    ("&#128172;", "I miss my family in my country.",
     ("You should call them on video.", "You can make new friends here.")),
]


def game(p, key):
    page6 = """  <div class="gram3">
    <div><b>should</b> = a good idea<br>You <b>should</b> rest.</div>
    <div><b>shouldn&rsquo;t</b> = not a good idea<br>You <b>shouldn&rsquo;t</b> worry.</div>
    <div><b>can</b> = it&rsquo;s possible<br>You <b>can</b> call a friend.</div>
  </div>
  <div class="task">
    <h2>How to play</h2>
    <ol class="items" style="list-style:none;">
      <li><b class="n">1.</b> Put the <b>cards</b> in a pile, problem side down.</li>
      <li><b class="n">2.</b> Take a card. Read the problem out loud: <i>&ldquo;I have a problem. &hellip;&rdquo;</i></li>
      <li><b class="n">3.</b> <b>Everyone</b> gives advice. Use <b>should</b>, <b>shouldn&rsquo;t</b>, or <b>can</b> + <b>V1</b>. <b>Stuck?</b> Look at the <b>back</b> of the card for ideas.</li>
      <li><b class="n">4.</b> You pick the <b>best advice</b>. That person keeps the card.</li>
      <li><b class="n">5.</b> Next person takes a card. Most cards when the timer rings wins!</li>
    </ol>
  </div>
  <div class="task">
    <h2>Give advice</h2>
    <div class="bank starters" style="font-size:17px;">
      <span>You <b>should</b> &hellip;</span><span>You <b>shouldn&rsquo;t</b> &hellip;</span>
      <span>You <b>can</b> &hellip;</span><span>Maybe you <b>can</b> &hellip;</span>
    </div>
  </div>
  <div class="task">
    <h2>Answer the advice</h2>
    <div class="bank starters" style="font-size:17px;">
      <span>Good idea! Thank you.</span><span>Hmm. I can&rsquo;t. I &hellip;</span>
      <span>That&rsquo;s the best advice!</span><span>Can you say that again?</span>
    </div>
  </div>
  <div class="tip" style="font-size:17px;"><b>Example:</b><br>
    <b>Ana</b> (reads a card): I have a problem. Food is very expensive this month.<br>
    <b>Juan:</b> You <b>should go</b> to a food pantry. &emsp; <b>Mei:</b> You <b>can buy</b> rice and beans. They&rsquo;re cheap.<br>
    <b>Ana:</b> Good idea, Juan! Thank you. <i>(Juan keeps the card.)</i></div>
  <p class="how bottom"><b>Remember:</b> <i>should</i> + <b>V1</b>. No <i>to</i>. &ensp; &#10007; You should <s>to go</s>. &ensp; &#10003; You should <b>go</b>.</p>"""
    page7 = f"""  <div class="task">
    <h2>A. The best advice</h2>
    <p class="how">Write <b>2 problems</b> from the game and the <b>best advice</b> your group gave.</p>
    <div class="gline"><b style="width:5.2em;">Problem:</b>{p.ln("<i>answers vary: My phone bill is too high.</i>")}</div>
    <div class="gline"><b style="width:5.2em;">Advice:</b>{p.ln("<i>answers vary: You should call the company.</i>")}</div>
    <div style="height:10px;"></div>
    <div class="gline"><b style="width:5.2em;">Problem:</b>{p.ln("<i>answers vary</i>")}</div>
    <div class="gline"><b style="width:5.2em;">Advice:</b>{p.ln("<i>answers vary: should / shouldn&rsquo;t / can + V1</i>")}</div>
  </div>
  <div class="task">
    <h2>B. Make a card</h2>
    <p class="how">Write a problem. It can be <b>your</b> problem or a friend&rsquo;s. Read it to your group. Get advice!</p>
    <div class="gline"><b style="width:auto;">I have a problem.</b>{p.ln("<i>answers vary</i>")}</div>
    <div class="gline"><b style="width:auto;">My group says: You should</b>{p.ln("<i>answers vary: + V1</i>")}</div>
  </div>
  <div class="task">
    <h2>C. Talk together</h2>
    <ol class="items">
      <li><b class="n">1.</b> Who gives you good advice? Your mom? A friend? A coworker?</li>
      <li><b class="n">2.</b> What is the best advice you ever got?</li>
      <li><b class="n">3.</b> What should a new person in this country know?</li>
    </ol>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "Advice cards &middot; with your group"
    return L.page("", "STATION 3: GAME", sub, 6, page6, key) + L.page("", "STATION 3: GAME", sub, 7, page7, key)


CARDS_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #000; background: #fff; }
  /* Station 3 advice cards: print 1 per table, cut on the dashed lines before class. */
  .page { width: 8.5in; height: 11in; padding: 0.35in 0.4in; display: flex; flex-direction: column; overflow: hidden; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .top { display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; margin-bottom: 6px; }
  .top b { font-size: 15px; }
  .grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(5, 1fr); }
  .card { border: 1.5px dashed #777; padding: 12px 14px; display: flex; flex-direction: column; }
  .card .e { font-size: 30px; line-height: 1; margin-bottom: 6px; }
  .card .t { font-size: 19px; font-weight: bold; line-height: 1.25; }
  .card .f { margin-top: auto; font-size: 12px; color: #444; }
  .page { page-break-after: always; break-after: page; }
  .card.back { background: #f4f4f4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .card.back .own { font-size: 12px; font-style: italic; margin-bottom: 4px; }
  .card.back .lbl { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
  .card.back ul { padding-left: 1em; }
  .card.back li { font-size: 16px; line-height: 1.25; margin-bottom: 5px; }
"""


def cards_doc():
    """Page 1 = problems, page 2 = sample advice. Print double-sided, flip on the LONG edge.
    Each back row is mirrored left-right so a card's back lands behind its front."""
    head = '<div class="top"><b>Advice cards</b><span>Station 3: GAME &middot; 1 set per table &middot; print double-sided (long edge), cut on the dashed lines</span></div>'
    fronts = "".join(
        f'<div class="card"><div class="e">{e}</div><div class="t">{t}</div>'
        f'<div class="f">You should &hellip; &middot; You can &hellip;</div></div>' for e, t, _ in CARDS)
    backs = []
    for r in range(5):
        row = CARDS[r * 3:r * 3 + 3]
        for e, t, (a, b) in reversed(row):
            backs.append(f'<div class="card back"><div class="own">Try your own idea first!</div>'
                         f'<div class="lbl">Ideas</div><ul><li>{a}</li><li>{b}</li></ul></div>')
    body = (f'<section class="page">\n  {head}\n  <div class="grid">{fronts}</div>\n</section>\n'
            f'<section class="page">\n  {head}\n  <div class="grid">{"".join(backs)}</div>\n</section>')
    return L.doc("Week 9 Station 3 Advice Cards", CARDS_CSS, body)


TF = [  # (statement, True / False / Not)
    ("You must show ID to get food.", "F"),
    ("You can come to the pantry two times a week.", "F"),
    ("You can bring your children.", "T"),
    ("The pantry gives free diapers.", "N"),
]
# Sheet 2 people: (name, best time, why) - only one time works for each
BEST = [("Amina", "Friday, 4:00&ndash;7:00", "She works weekdays until 3. English class on Wednesday. She cleans houses on Saturday."),
        ("Carlos", "Home Delivery (Saturday)", "He can&rsquo;t leave home. He is 67. He must call to sign up."),
        ("Ji-woo", "Wednesday, 5:00&ndash;7:30", "She works Thursday&ndash;Sunday. She is free Monday&ndash;Wednesday.")]


def real_world(p, key):
    def h(ans, hint, size=""):
        """Mad-libs blank: the blank with a small hint under it."""
        return f'<span class="hint">{p.b(ans, size)}<small>{hint}</small></span>'

    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages from a food pantry. Start with <b>page 1</b> (the flyer). Read it <b>together</b>. Check answers with your group.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> What days is the pantry open? {p.b("Wednesday, Friday, Saturday", "long")}</li>
      <li><b class="n">2.</b> How often can you come? {p.b("one time a week")}</li>
      <li><b class="n">3.</b> What should you bring on your first visit? {p.b("proof of address (a bill or a letter)", "long")}</li>
      <li><b class="n">4.</b> Who can get home delivery? {p.b("people 60 or older, or people who can&rsquo;t leave home", "long")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. Call for home delivery</h2>
    <p class="how">Someone in your family (or a neighbor) can&rsquo;t come to the pantry. You call to sign them up. <b>A</b> = Grace at the pantry. <b>B</b> = you. Use the flyer and <b>your own ideas</b>. Circle <b>She</b> or <b>He</b>. Use a <b>made-up</b> address. Then <b>switch</b>.</p>
    <div class="call">
      <p><b>A:</b> Eastside Food Pantry, this is Grace. How can I help you?</p>
      <p><b>B:</b> Hi. I want to sign up my {h("<i>grandmother</i>", "older family member")} for home delivery.</p>
      <p><b>A:</b> OK. Home delivery is for people {h("60 or older", "age: look at the flyer")}, or people who can&rsquo;t {h("leave home", "look at the flyer")}. Tell me about this person.</p>
      <p><b>B:</b> She / He is {h("<i>78</i>", "age", "short")} years old. She / He can&rsquo;t {h("<i>walk far</i>", "why? walk far &middot; drive &middot; carry bags", "long")}.</p>
      <p><b>A:</b> What&rsquo;s the address? Can you spell the street, please?</p>
      <p><b>B:</b> It&rsquo;s {h("<i>22 Oak Street</i>", "number + street (make it up)", "long")}. That&rsquo;s {h("<i>O-A-K</i>", "spell the street")}.</p>
      <p><b>A:</b> OK. We deliver on {h("Saturday", "day")} from {h("12:30", "time", "short")} to {h("3:00", "time", "short")}. Someone must be home.</p>
      <p><b>B:</b> Can I / Should I {h("<i>call before Saturday</i>", "your question: see ideas below", "long")}?</p>
      <p><b>A:</b> {h("<i>Yes, you should.</i>", "answer: Yes, you can. &middot; No, but &hellip;", "long")}</p>
      <p><b>B:</b> Thank you so much!</p>
    </div>
    <p class="ideas" style="font-size:15px;">Ideas for B&rsquo;s question: Should I call before Saturday? &middot; Can I get milk and eggs? &middot; Can I get delivery every week?</p>
    <p class="how" style="margin-top:6px;"><b>&#9733; Make it harder:</b> A, add a problem! <i>&ldquo;Sorry, the list is full this week.&rdquo;</i> &middot; <i>&ldquo;We can&rsquo;t deliver to that street.&rdquo;</i> &middot; <i>&ldquo;Nobody can be home on Saturday? Hmm&hellip;&rdquo;</i> B, find a solution: <i>Can I &hellip;? Should I &hellip;?</i></p>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    pick = "".join(f'<tr><td class="t">{n}</td><td>{p.b(s) if key else ""}</td><td>{p.b(w) if key else ""}</td></tr>'
                   .replace('<span class="blank ans">', '<span class="ans">') for n, s, w in BEST)
    page9 = f"""  <div class="task">
    <h2>C. True, false, or not on the flyer?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the flyer, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the flyer</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>D. Find the best day</h2>
    <p class="how">Look at <b>page 2</b> on the table. These 3 people need food. Only <b>one</b> time works for each person.</p>
    <table class="pick tall">
      <tr><th style="width:16%;">Person</th><th style="width:34%;">Best time</th><th>Why?</th></tr>
      {pick}
    </table>
    <p class="how"><b>&#9733;</b> This is Ji-woo&rsquo;s first visit. What should she bring?</p>
    {p.ln("She should bring proof of address (a bill or a letter) and her own bags.")}
  </div>
  <p class="how bottom"><b>Talk:</b> Is there a food pantry near you? Where can you buy cheap food?</p>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


HINT_CSS = """
  /* Mad-libs blanks in the Station 4 phone call: a small hint under the line */
  .hint { display: inline-flex; flex-direction: column; }
  .hint small { font-size: 12px; font-style: italic; text-align: center; line-height: 1.1; margin-top: 1px; color: #333; }
  .call p { margin-bottom: 7px; }
"""


def packet(key):
    p = L.P(key)
    body = (L.cover(9, "Tuesday, November 10, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + game(p, key) + real_world(p, key)
            + L.verb_charts(10, TAKE, "he", BRING, "we", key))
    title = "Week 9 Tuesday Stations Packet" + (" (Answer Key)" if key else "")
    return L.doc(title, L.packet_css(key) + HINT_CSS, body)


FLYER_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1f2a1f; background: #fff;
         font-size: 17px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up pantry, people, and numbers.
     Questions are on packet pages 8-9; page 9 Part D needs sheet 2. */
  .page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .hero { background: #2f6b2f; color: #fff; border-radius: 10px; padding: 14px 20px; display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
  .hero svg { width: 64px; height: 64px; flex: none; }
  .hero .org { font-size: 15px; opacity: 0.95; }
  .hero h1 { font-size: 40px; line-height: 1; letter-spacing: 1px; }
  .hero .tag { font-size: 18px; margin-top: 4px; }
  table.shifts { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 17px; }
  table.shifts th { background: #e6f0e1; color: #2f6b2f; text-align: left; padding: 6px 8px; font-size: 14px; border-bottom: 2px solid #2f6b2f; }
  table.shifts td { padding: 8px 8px; border-bottom: 1px solid #cfdcc9; vertical-align: top; }
  table.shifts td.n { font-weight: bold; color: #2f6b2f; white-space: nowrap; }
  table.shifts td.t { white-space: nowrap; }
  .food { font-size: 16px; margin-bottom: 14px; }
  .cols { display: flex; gap: 14px; }
  .box { border: 2px solid #2f6b2f; border-radius: 8px; padding: 8px 14px; flex: 1; }
  .box h2 { font-size: 21px; color: #2f6b2f; margin-bottom: 4px; }
  .box ul { padding-left: 1.1em; font-size: 17px; }
  .box li { margin-bottom: 6px; }
  .rules { flex: 1.5; }
  .warm { background: #fff6d6; border-color: #d9a400; }
  .warm h2 { color: #8a6500; }
  .langs { font-size: 16px; color: #444; margin-top: 14px; text-align: center; }
  .contact { margin-top: auto; background: #2f6b2f; color: #fff; border-radius: 8px; padding: 8px 16px; display: flex; justify-content: space-between; font-size: 16px; }
  .wk-title { font-size: 32px; font-weight: bold; color: #2f6b2f; margin-bottom: 4px; }
  .wk-sub { font-size: 17px; margin-bottom: 14px; }
  .person { display: flex; gap: 16px; border: 2px solid #cfdcc9; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; }
  .avatar { width: 64px; height: 64px; border-radius: 50%; flex: none; display: grid; place-items: center; color: #fff; font-size: 30px; font-weight: bold; }
  .person h2 { font-size: 22px; margin-bottom: 4px; }
  .person ul { padding-left: 1.1em; font-size: 17px; }
  .person li { margin-bottom: 3px; }
  .reminder { border: 2px dashed #2f6b2f; border-radius: 8px; padding: 8px 14px; font-size: 16px; }
"""


def flyer():
    sheet1 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="hero">
    <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#fff"/><path d="M14 30h36l-4 20H18z" fill="#2f6b2f"/><path d="M22 30c0-8 4-14 10-14s10 6 10 14" fill="none" stroke="#2f6b2f" stroke-width="4"/><circle cx="26" cy="24" r="4" fill="#d9a400"/><circle cx="36" cy="22" r="5" fill="#c0392b"/></svg>
    <div>
      <div class="org">Eastside Community Food Pantry &middot; 45 Elm Street (church basement)</div>
      <h1>FREE FOOD for your family</h1>
      <div class="tag">Everyone is welcome. It&rsquo;s free. No ID needed.</div>
    </div>
  </div>
  <table class="shifts">
    <tr><th>Day</th><th>Time</th><th>Good to know</th></tr>
    <tr><td class="n">Wednesday</td><td class="t">5:00&ndash;7:30 p.m.</td><td>Come after work.</td></tr>
    <tr><td class="n">Friday</td><td class="t">4:00&ndash;7:00 p.m.</td><td>Come after work or school.</td></tr>
    <tr><td class="n">Saturday</td><td class="t">9:00 a.m.&ndash;12:00 p.m.</td><td>Our busiest day. Come early!</td></tr>
    <tr><td class="n">Home Delivery</td><td class="t">Saturday<br>12:30&ndash;3:00 p.m.</td><td>For people 60 or older, or people who can&rsquo;t leave home. You must call to sign up.</td></tr>
  </table>
  <p class="food"><b>Every week we have:</b> rice &middot; beans &middot; pasta &middot; canned food &middot; bread &middot; eggs &middot; milk</p>
  <div class="cols">
    <div class="box rules">
      <h2>Pantry rules</h2>
      <ul>
        <li>You <b>must</b> sign in at the front desk.</li>
        <li>You <b>can</b> come <b>one time</b> a week.</li>
        <li>First visit? You <b>should</b> bring proof of address: a bill or a letter with your name.</li>
        <li>No ID? That&rsquo;s OK. You <b>can</b> still get food.</li>
        <li>You <b>should</b> bring your own bags.</li>
        <li>You <b>can</b> bring your children.</li>
      </ul>
    </div>
    <div class="box warm">
      <h2>Good to know</h2>
      <ul>
        <li>Free food from a food pantry does <b>not</b> hurt your immigration case.</li>
        <li><b>Bus 7</b> stops in front.</li>
        <li>Heavy bags? Ask us. We <b>can</b> help.</li>
      </ul>
      <h2 style="margin-top:8px;">Want to help out?</h2>
      <ul><li>Volunteers are welcome. Text <b>VOLUNTEER</b> to <b>55190</b>.</li></ul>
    </div>
  </div>
  <p class="langs">We speak: English &middot; Espa&ntilde;ol &middot; Portugu&ecirc;s &middot; Krey&ograve;l ayisyen</p>
  <div class="contact"><span><b>Questions?</b> Grace Okafor, Pantry Coordinator</span><span>(617) 555-0190</span></div>
</section>"""
    people = [
        ("A", "#c0392b", "Amina, 38", ["She works at a hotel, Monday&ndash;Friday, 6:00 a.m.&ndash;3:00 p.m.",
                                         "She has English class on Wednesday evenings.",
                                         "She cleans houses on Saturday, 8:00 a.m.&ndash;1:00 p.m.",
                                         "She has 3 kids."]),
        ("C", "#1f6fb2", "Carlos, 67", ["He lives alone.",
                                          "He had surgery on his knee.",
                                          "He can&rsquo;t leave home for 2 months."]),
        ("J", "#7d3c98", "Ji-woo, 30", ["She works at a restaurant, Thursday&ndash;Sunday, 11:00 a.m.&ndash;10:00 p.m.",
                                          "She is free Monday, Tuesday, and Wednesday.",
                                          "She takes the bus.",
                                          "This is her first time at the pantry."]),
    ]
    cards = "".join(
        f'<div class="person"><div class="avatar" style="background:{c};">{i}</div><div><h2>{n}</h2><ul>'
        + "".join(f"<li>{x}</li>" for x in facts) + "</ul></div></div>"
        for i, c, n, facts in people)
    sheet2 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <div class="wk-title">Which day is best?</div>
  <p class="wk-sub">These 3 people want free food from the Eastside Community Food Pantry. Look at the days and times on page 1. Which time is best for each person?</p>
  {cards}
  <div class="reminder"><b>Remember:</b> check each person&rsquo;s <b>work days</b>, <b>free time</b>, and the <b>rules</b> (Home Delivery: who can get it?).</div>
</section>"""
    return L.doc("Week 9 Tuesday Real World: Food Pantry Flyer", FLYER_CSS, sheet1 + sheet2)


def self_check():
    tf_why = {
        1: "&ldquo;No ID? That&rsquo;s OK.&rdquo;",
        2: "You can come <b>one time</b> a week.",
        3: "&ldquo;You can bring your children.&rdquo;",
        4: "The flyer doesn&rsquo;t say anything about diapers.",
    }
    word = {"T": "True", "F": "False", "N": "Not on the flyer"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{tf_why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    best = "".join(f'<tr><td class="n">{n[0]}</td><td class="a">{s}</td><td class="why">{w}</td></tr>' for n, s, w in BEST)
    body = f"""<h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a">Wednesday, Friday, Saturday</td><td class="why"></td></tr>
      <tr><td class="n">2</td><td class="a">one time a week</td><td class="why"></td></tr>
      <tr><td class="n">3</td><td class="a" colspan="2">proof of address: a bill or a letter with your name</td></tr>
      <tr><td class="n">4</td><td class="a" colspan="2">people 60 or older, or people who can&rsquo;t leave home</td></tr>
    </table>
    <h2>C. True, false, or not on the flyer?</h2>
    <table>{tf}</table>
    <h2>D. Find the best day</h2>
    <table>{best}
      <tr><td class="n">&#9733;</td><td class="a" colspan="2">a bill or a letter with her name, and her own bags</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Find the sentence on the flyer together. Read it out loud. <b>Part B</b> (the phone call) has many good answers.</div>"""
    return L.self_check_doc("Week 9 Station 4 Self-Check", body,
                            stop="Finish Parts A, C, and D first.", page_ref="packet pages 8&ndash;9")


def leader_guide():
    script = "".join(
        f'<tr><td class="n">{i + 1}</td><td>{s.replace("___", "<b>" + a + "</b>")}</td></tr>' for i, (s, a) in enumerate(LISTEN))
    top = L.leader_top(9, "11/10/26", STATIONS, [
        "<b>This week:</b> practice <b>can / should / must</b> (started Thursday). Quiz verbs: <b>take, bring</b>. Week 9 Quiz opens Thu 11/12 at 6 p.m.",
        "<b>Before class:</b> print the <b>advice cards</b> double-sided (long edge) and cut them, 1 set per table. Station 4: 2 color flyers + self-check card face down.",
        "<b>At 6:00:</b> count off the people who are there into A, B, C. Group D starts empty. <b>Late?</b> Station 1, then join that group.",
        "<b>Floating:</b> start each block at <b>Station 4</b> (read the flyer together, Part A #1) and make sure every group gets to <b>Part B, the phone call</b>. Then <b>Station 3</b> (is everyone giving advice?), then <b>Station 1</b> (read each &#11088; sentence). Point out the flyer line: pantry food does <b>not</b> hurt an immigration case.",
        "<b>Moves:</b> 3-minute warning, then move. <b>7:46&ndash;end:</b> wrap-up, quiz reminder. <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (can / can&rsquo;t)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p>In a sentence, <b>can</b> is weak: <i>I c&rsquo;n SWIM</i> /k&#601;n/. <b>Can&rsquo;t</b> is strong: <i>I CAN&rsquo;T swim</i> /k&aelig;nt/, and the <b>t</b> is often silent. Learners listen for the <b>t</b> and miss it. Teach them to listen for the <b>beat</b>. In short answers both are strong: <i>Yes, I CAN. / No, I CAN&rsquo;T.</i></p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>The beat.</b> Clap it: <i>I can SWIM</i> (da da DUM) vs. <i>I CAN&rsquo;T swim</i> (da DUM da). Have everyone clap and say both.</td></tr>
    <tr><td>5 min</td><td><b>A. Listen and circle.</b> Read each sentence below once, at normal speed. Don&rsquo;t say the <b>t</b> hard. That&rsquo;s the point. Then check.</td></tr>
    <tr><td>4 min</td><td><b>B. Thumbs.</b> Partners read Part A sentences. Listen in. If thumbs are wrong, ask the reader to say it again with the beat.</td></tr>
    <tr><td>5 min</td><td><b>C. Who can do it?</b> At the table only. Push for loud short answers: <i>Yes, I CAN.</i></td></tr>
    <tr><td>4 min</td><td><b>D. Read aloud.</b> One sentence each. Fix only <i>can / can&rsquo;t</i>.</td></tr>
    <tr><td>4 min</td><td><b>E + F.</b> Talk, then each person reads you their two sentences (F).</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Read these sentences</h2>
      <table class="script">{script}</table>
      <p style="font-size:12px;">Time left? Read them again and switch can &harr; can&rsquo;t.</p>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li>Most common: a strong <b>CAN</b> that sounds like <i>can&rsquo;t</i>. Clap the beat with them.</li>
        <li>Fix <b>one</b> thing, then move on. Keep it light.</li>
        <li>In Part E, repeat it back correctly. Don&rsquo;t stop them.</li>
      </ul>
      <div class="recast">Learner: &ldquo;I <u>CAN</u> cook.&rdquo; (sounds like <i>can&rsquo;t</i>)<br>You: &ldquo;Oh, you can <b>COOK</b>? What do you cook?&rdquo;</div>
      <h2>Adjust the level</h2>
      <ul class="dots">
        <li><b>Beginner:</b> Part A with 4 sentences, then repeat after you.</li>
        <li><b>Stronger:</b> They read Part A for the group to circle.</li>
      </ul>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 9 &middot; Tue 11/10/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. Modals:</b> 1 must &middot; 2 can&rsquo;t &middot; 3 shouldn&rsquo;t &middot; 4 Can &middot; 5 must not &middot; 6 Should</p>
        <p><b>2. Words:</b> 1 volunteer &middot; 2 help out &middot; 3 supports &middot; 4 contribute &middot; 5 donate &middot; 6 sign up for</p>
        <p><b>3. Advice:</b> answers vary. Check <i>should / shouldn&rsquo;t</i> + V1 (no <i>to</i>, no <i>-s</i>). #1 could be <i>go to a food pantry</i>. #4 is a question: <i>Should I</i> + V1?</p>
      </div>
      <div>
        <p><b>4. Forms:</b> take, takes, taking, took, taken &middot; bring, brings, bringing, brought, brought</p>
        <p><b>5. Right form:</b> 1 brings &middot; 2 taking &middot; 3 bring &middot; 4 taken</p>
        <p><b>6. Write about you:</b> answers vary. Look for modal + V1: <i>I must &hellip; / I can&rsquo;t &hellip; / I should &hellip;</i> Read each learner&rsquo;s &#11088; sentence when you visit.</p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {a}" for i, (_, a) in enumerate(LISTEN))} &middot; <b>C&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: GAME, Advice cards (pages 6&ndash;7 + 15 cards)</h2>
    <p>No fixed answers. Listen for <b>should / shouldn&rsquo;t / can + V1</b>. The most common error: <i>You should <s>to</s> go.</i> Recast it: &ldquo;Yes, you should <b>go</b>. Good idea!&rdquo; Let the reader choose the best advice; don&rsquo;t judge it yourself. Card backs have sample advice: push for their own idea first.</p>
    <p><b>Page 7:</b> A and B answers vary (check modal + V1). C is talk only. <b>Short on time?</b> Skip page 7. The game is the main activity.</p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Food pantry flyer (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 Wednesday, Friday, Saturday &middot; 2 one time a week &middot; 3 proof of address (a bill or a letter with your name) &middot; 4 people 60 or older, or people who can&rsquo;t leave home</p>
    <p><b>B (home delivery call):</b> from the flyer: 60 or older / leave home &middot; Saturday, 12:30 to 3:00. The rest varies: check <i>can&rsquo;t + V1</i> and B&rsquo;s own <i>Can I / Should I + V1?</i> question. Learners use a made-up address. &#9733; A adds a problem (list full, can&rsquo;t deliver there, nobody home); B solves it, e.g. <i>Can I pick up the food on Friday?</i></p>
    <p><b>C:</b> 1 False (no ID needed) &middot; 2 False (one time a week) &middot; 3 True &middot; 4 Not on the flyer</p>
    <p><b>D:</b> <b>Amina</b> &rarr; Friday 4&ndash;7. Not Wed: English class. Not Sat: she cleans houses. &middot; <b>Carlos</b> &rarr; Home Delivery (Sat 12:30&ndash;3). He can&rsquo;t leave home; he must call to sign up. &middot; <b>Ji-woo</b> &rarr; Wednesday 5&ndash;7:30. Not Fri/Sat: she works. &middot; &#9733; proof of address (a bill or a letter) and her own bags.</p>
    <p style="font-size:12px;">The pantry, people, and phone numbers are made up. A self-check card for Parts A, C, and D goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (he + take, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (we + bring):</b> bring, brings, bringing, brought, brought &middot; we bring / don&rsquo;t bring / Do we bring? &middot; we brought / didn&rsquo;t bring / Did we bring? &middot; we will bring / won&rsquo;t bring / Will we bring? &middot; we are bringing / aren&rsquo;t bringing / Are we bringing? &middot; we were bringing / weren&rsquo;t bringing / Were we bringing? &middot; we will be bringing / won&rsquo;t be bringing / Will we be bringing? &middot; we have brought / haven&rsquo;t brought / Have we brought?</p>
  </div>
</section>"""
    return L.doc("Week 9 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 10),
        f"{STEM}-packet-key.html": (packet(True), 10),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
        f"{STEM}-advice-cards.html": (cards_doc(), 2),
        f"{STEM}-real-world-document.html": (flyer(), 2),
        f"{STEM}-real-world-self-check.html": (self_check(), 1),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
