#!/usr/bin/env python3
"""Week 11 Tuesday stations, Tue 11/24/26 (only class before Thanksgiving): practice good at + V-ing
(started Thu 11/19).

Quiz verbs: cost, spend. Vocab: spending and budgeting (purchase price, comparison
shop, budget, set aside, keep track of, total cost). Stations: 1 WARM-UP,
2 SPEAK (thirteen / thirty), 3 GAME (What are you good at? board), 4 REAL WORLD
(Thanksgiving sale flyer + a $60 shopping budget).

    python3 build-week11-stations.py
writes the HTML and PDFs next to this file. The store, prices, and people are made up.
Massachusetts doesn't tax most groceries, so the math has no tax.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week11-day1-2026-11-24"
COST = ("cost", "costs", "costing", "cost", "cost")
SPEND = ("spend", "spends", "spending", "spent", "spent")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "Numbers: <i>13</i> or <i>30</i>? With a teacher.", "Pages 4&ndash;5"),
    ("GAME", "With your group. A teacher will visit.", "Pages 6&ndash;7 + game board on the table"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 8&ndash;9 + 2 color pages on the table"),
]


def warmup(p, key):
    forms = [("listen", "listening", "to other people&rsquo;s ideas."), ("cook", "cooking", "?"),
             ("speak", "speaking", "in front of a group."), ("solve", "solving", "problems?"),
             ("save", "saving", "money.")]
    starts = ["She is good at", "Are you good at", "I&rsquo;m <b>not</b> good at", "Is he good at", "They <b>aren&rsquo;t</b> good at"]
    li1 = "".join(f'<li><b class="n">{i}.</b> {st} ({p.circ(a, False)} / {p.circ(b, True)}) {end}</li>'.replace(" )", ")").replace(") ?", ")?")
                  for i, (st, (a, b, end)) in enumerate(zip(starts, forms), 1))
    wyr = ["comparison shop at three stores <b>or</b> buy at the first store and save time?",
           "keep track of your spending in a notebook <b>or</b> on your phone?",
           "cook a big holiday meal <b>or</b> eat at a friend&rsquo;s house?"]
    li2 = "".join(f'<li><b class="n">{i}.</b> Would you rather {q}<div class="gline"><b style="width:auto;">Because</b>{p.ln("<i>answers vary</i>")}</div></li>'
                  for i, q in enumerate(wyr, 1))
    page2 = f"""  <div class="task">
    <h2>1. Circle the correct form</h2>
    <p class="how">After <b>good at</b>, use the <b>-ing</b> form.</p>
    <p class="example">Example: I am good at (fix / <b class="circ" style="width:auto;padding:0 6px;border-radius:12px;">fixing</b>) things.</p>
    <ol class="items">{li1}</ol>
  </div>
  <div class="task">
    <h2>2. Would you rather?</h2>
    <p class="how">Circle your answer. Then write one reason.</p>
    <ol class="items">{li2}</ol>
  </div>
  <div class="task">
    <h2>3. Finish the sentence about you</h2>
    <p class="how"><b>You make up the ending.</b> Use your own ideas. Pattern: <b>good at + V-ing</b></p>
    <div class="own"><b>Example:</b> I am good at <span class="u">cooking rice</span>. &middot; Other good answers: <span class="u">fixing cars</span> &middot; <span class="u">listening to my friends</span></div>
    <ol class="items">
      <li><b class="n">1.</b> I am good at {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">2.</b> I am not good at {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">3.</b> Are you good at {p.b("<i>answers vary</i>", "long")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every month</b>, my phone bill {} $45. (cost)", "costs"),
        ("<b>Right now</b>, I am {} too much on takeout. (spend)", "spending"),
        ("<b>Yesterday</b>, the groceries didn&rsquo;t {} much. (cost)", "cost"),
        ("<b>Last weekend</b>, how much did you {} at the market? (spend)", "spend"),
        ("<b>Last year</b>, our turkey {} $30. (cost)", "cost"),
        ("My sister doesn&rsquo;t {} money on coffee <b>every day</b>. (spend)", "spend"),
        ("We <b>have</b> {} $200 on school supplies since August. (spend)", "spent"),
        ("<b>Has</b> this old car {} you a lot in repairs? (cost)", "cost"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>cost</b> and <b>spend</b>. <i>Cost</i> and <i>spend</i> are on the Week 11 quiz!</p>
    {L.forms_table([COST, SPEND], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>cost</b> or <b>spend</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>Last week</b> + spend</p>
    <p class="ideas">Ideas: money on food &middot; $20 on gas &middot; time with my family</p>
    {p.ln("<i>answers vary: Last week, I spent $20 on gas.</i>")}
    <p class="prompt"><b>Every month</b> + cost <b>+ not</b></p>
    <p class="ideas">Ideas: my phone bill &middot; a bus pass &middot; internet</p>
    {p.ln("<i>answers vary: My phone bill doesn&rsquo;t cost a lot every month.</i>")}
    <p class="prompt"><b>Have you ever</b> + spend<b>?</b></p>
    <p class="ideas">Ideas: more than $100 on shoes &middot; a whole day shopping &middot; a holiday away from home</p>
    {p.ln("<i>answers vary: Have you ever spent a whole day shopping?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


NUMS = [("13", "30", "30"), ("14", "40", "14"), ("15", "50", "50"), ("16", "60", "16"),
        ("17", "70", "70"), ("18", "80", "18"), ("19", "90", "90"), ("$1.15", "$1.50", "$1.50")]
PRICES = [("The pie costs", "$14.99"), ("We spent", "$60"), ("The bus is", "$1.70"), ("The turkey costs", "$18.30")]


def speak(p, key):
    rows = "".join(
        "<tr>" + "".join(
            f'<td class="n">{j + 1}</td><td>{p.circ(NUMS[j][0], NUMS[j][2] == NUMS[j][0])}</td>'
            f'<td>{p.circ(NUMS[j][1], NUMS[j][2] == NUMS[j][1])}</td>' for j in (i, i + 4)) + "</tr>"
        for i in range(4))
    prices = "".join(f'<li><b class="n">{i}.</b> {t} {p.b(a, "short")}.</li>' for i, (t, a) in enumerate(PRICES, 1))
    page4 = f"""  <h2>13 or 30? Listen for the loud part.</h2>
  <div class="rhythm">
    <div><div class="big">13 &nbsp;<span style="font-size:22px;font-weight:normal;">thir&middot;<b>TEEN</b></span></div>
      <p class="beats">&#9675; <b>&#9679;</b></p>
      <p><b>-teen</b> is loud and long. You hear a clear <b>t</b> and <b>n</b>.</p></div>
    <div><div class="big">30 &nbsp;<span style="font-size:22px;font-weight:normal;"><b>THIR</b>&middot;ty</span></div>
      <p class="beats"><b>&#9679;</b> &#9675;</p>
      <p>The <b>start</b> is loud. <b>-ty</b> is short. It sounds like <i>thir-dy</i>.</p></div>
  </div>
  <p class="how"><b>Try it:</b> Say <i>thirteen</i>. Lift your hand on the loud part. Now say <i>thirty</i>. Where does your hand go up?</p>
  <div class="task">
    <h2>A. Listen and circle</h2>
    <p class="how">Your teacher says <b>one</b> number. Circle the number you hear.</p>
    <table class="pairs">{rows}</table>
  </div>
  <div class="task">
    <h2>B. Your turn: partner game</h2>
    <p class="how"><b>Partner A</b> says a number from Part A. <b>Partner B</b> points to it. Right? Switch. Wrong? Try again slowly.</p>
  </div>
  <div class="task">
    <h2>C. Write the price</h2>
    <p class="how">Your teacher reads a price. Write the number you hear.</p>
    <ol class="items">{prices}</ol>
  </div>"""
    page5 = f"""  <div class="task">
    <h2>D. Read aloud</h2>
    <p class="how">Take turns. Read one sentence each. Make the loud part loud!</p>
    <ol class="read-aloud">
      <li>The turkey costs thirty dollars.</li>
      <li>I spent fifteen dollars on a pie.</li>
      <li>My son is thirteen. My uncle is thirty.</li>
      <li>The number 70 bus comes at 6:15.</li>
      <li>We spent sixty dollars at the market.</li>
      <li>The store opens at 7:00 and closes at 2:00 on Thanksgiving.</li>
      <li>How much did the potatoes cost? Fourteen dollars? No, four!</li>
      <li>I have lived here for sixteen years, not sixty!</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b>. Say the numbers clearly.</p>
    <ol class="read-aloud">
      <li>How much does a gallon of milk cost here? In your home country?</li>
      <li>How much does a bus or train ride cost here?</li>
      <li>What is something that costs more in the U.S.? Less?</li>
      <li>Do you celebrate Thanksgiving? What food do you like?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. My hard numbers</h2>
    <p class="how">Write 3 numbers that are hard for you. Say them to your teacher.</p>
    {p.ln("<i>answers vary</i>")}
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "numbers &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


ING = [("cook", "cooking", "add -ing"), ("dance", "dancing", "drop the e"), ("swim", "swimming", "double + -ing"),
       ("write", "writing", "drop the e"), ("run", "running", "double + -ing"), ("fix", "fixing", "add -ing"),
       ("make", "making", "drop the e"), ("shop", "shopping", "double + -ing")]


def game(p, key):
    page6 = f"""  <div class="task">
    <h2>How to play</h2>
    <ol class="items" style="list-style:none;">
      <li><b class="n">1.</b> Put a small thing (a coin, an eraser) on <b>START</b>. That is you.</li>
      <li><b class="n">2.</b> Roll the die. <b>No die?</b> Flip a coin: heads = move 1, tails = move 2.</li>
      <li><b class="n">3.</b> Read your square. Ask the person on your <b>left</b>, or answer it yourself.</li>
      <li><b class="n">4.</b> Answer with a <b>full sentence</b>. Then the group asks <b>one more question</b>.</li>
      <li><b class="n">5.</b> First person to <b>FINISH</b> wins. Keep playing until the timer rings!</li>
    </ol>
  </div>
  <div class="key" style="margin-bottom:10px;">
    <div><b>good at + V-ing</b><br>I&rsquo;m good at <b>cooking</b>.</div>
    <div><b>not good at + V-ing</b><br>I&rsquo;m not good at <b>singing</b>.</div>
  </div>
  <div class="task">
    <h2>Ways to answer</h2>
    <div class="bank starters" style="font-size:17px;">
      <span><b>Yes, I am!</b> I&rsquo;m good at cooking rice.</span>
      <span><b>I&rsquo;m OK at it.</b> I&rsquo;m getting better.</span>
      <span><b>Not really.</b> I&rsquo;m not good at it.</span>
      <span><b>No, I&rsquo;m terrible at it!</b> &#128514;</span>
    </div>
  </div>
  <div class="task">
    <h2>One more question</h2>
    <div class="bank starters" style="font-size:17px;">
      <span>What do you cook?</span><span>Who taught you?</span>
      <span>How often do you practice?</span><span>Do you want to be good at it?</span>
    </div>
  </div>
  <div class="tip" style="font-size:17px;"><b>Example:</b><br>
    <b>A:</b> Are you good at <b>dancing</b>? &emsp; <b>B:</b> Yes, I am! I&rsquo;m good at <b>dancing</b> salsa.<br>
    <b>C:</b> Who taught you? &emsp;&emsp;&emsp;&emsp;&ensp; <b>B:</b> My mother taught me.</div>"""
    ing = "".join(f"<td><b>{a}</b> &rarr; {p.b(b, 'short')}</td>" + ("</tr><tr>" if i == 3 else "") for i, (a, b, _) in enumerate(ING))
    page7 = f"""  <div class="task">
    <h2>A. Write about your group</h2>
    <p class="how">Write <b>4 sentences</b> about the people at your table. Use their names.</p>
    <div class="gram3">
      <div><b>is good at</b><br>Ana <b>is good at</b> sewing.</div>
      <div><b>isn&rsquo;t good at</b><br>Juan <b>isn&rsquo;t good at</b> singing.</div>
      <div><b>are both good at</b><br>Mei and I <b>are both good at</b> cooking.</div>
    </div>
    {p.ln("<i>answers vary: check is / are good at + V-ing</i>", 4)}
  </div>
  <div class="task">
    <h2>B. Spell the -ing</h2>
    <div class="gram3">
      <div><b>Most verbs:</b> add <b>-ing</b><br>cook &rarr; cooking</div>
      <div><b>Ends in e:</b> drop the <b>e</b><br>dance &rarr; dancing</div>
      <div><b>Short, one vowel:</b> double<br>swim &rarr; swimming</div>
    </div>
    <table class="pick" style="font-size:17px;"><tr>{ing}</tr></table>
  </div>
  <div class="task">
    <h2>C. &#9733; Get better!</h2>
    <p class="how">What do you want to be good at? How can you practice? Use <b>should</b> or <b>can</b>.</p>
    <div class="gline"><b style="width:auto;">I want to be good at</b>{p.ln("<i>answers vary: + V-ing</i>")}</div>
    <div class="gline"><b style="width:auto;">I should / I can</b>{p.ln("<i>answers vary: + V1</i>")}</div>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "What are you good at? &middot; with your group"
    return L.page("rd", "STATION 3: GAME", sub, 6, page6, key) + L.page("rd", "STATION 3: GAME", sub, 7, page7, key)


TF = [("The store is closed on Thanksgiving.", "F"),
      ("Pumpkin pie costs less than apple pie.", "T"),
      ("You can use the coupon two times.", "F"),
      ("The store has free delivery.", "N"),
      ("One ear of corn costs 50 cents.", "T"),
      ("Frozen turkey is $1.29 a pound if you spend $10.", "F")]
# Elena's list: (item, how to price it, line total)
ELENA = [("Frozen turkey, 12 pounds", "12 &times; $1.29", "$15.48"), ("Pumpkin pie", "", "$6.99"),
         ("Cranberry sauce, 2 cans", "2 for $3", "$3.00"), ("Potatoes, 5-lb bag", "", "$3.99"),
         ("Dinner rolls, 12-pack", "", "$3.49"), ("Green beans, 2 pounds", "2 &times; $1.99", "$3.98")]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages. Start with <b>page 1</b> (the sale flyer). Read it <b>together</b>. Check answers with your group. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> When does the sale end? {p.b("Thursday, November 26", "long")}</li>
      <li><b class="n">2.</b> What time does the store close on Thanksgiving? {p.b("2:00 p.m.", "short")}</li>
      <li><b class="n">3.</b> How much are 2 cans of cranberry sauce? {p.b("$3.00", "short")}</li>
      <li><b class="n">4.</b> What do you need to get the $5 coupon? {p.b("spend $50 or more", "long")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. True, false, or not on the flyer?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the flyer, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the flyer</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>C. Comparison shop</h2>
    <p class="how">Use the flyer. Write the price. You can use your phone calculator.</p>
    <ol class="items">
      <li><b class="n">1.</b> A 10-pound <b>frozen</b> turkey costs {p.b("$12.90", "short")}.</li>
      <li><b class="n">2.</b> A 10-pound <b>fresh</b> turkey costs {p.b("$24.90", "short")}.</li>
      <li><b class="n">3.</b> With frozen, how much do you save? {p.b("$12.00", "short")}</li>
      <li><b class="n">4.</b> <b>&#9733;</b> Rolls: the 12-pack or the 24-pack? Which is cheaper <b>for one roll</b>?{p.ln("The 24-pack: about 25&cent; a roll. The 12-pack is about 29&cent; a roll.")}</li>
    </ol>
  </div>
  <p class="how bottom"><b>Talk:</b> Do you comparison shop? Which store has the best prices near you?</p>"""
    rows = "".join(f'<tr><td class="t" style="white-space:normal;">{it}</td><td class="c">{how}</td>{p.td(tot)}</tr>' for it, how, tot in ELENA)
    page9 = f"""  <p class="how">Now look at <b>page 2</b> on the table: <b>Elena&rsquo;s list</b>. Her budget is <b>$60</b>.</p>
  <div class="task">
    <h2>D. Elena&rsquo;s total cost</h2>
    <p class="how">Write the price of each thing. Then add. You can use your phone calculator.</p>
    <table class="pick">
      <tr><th>Item</th><th style="width:22%;">How?</th><th style="width:22%;">Price</th></tr>
      {rows}
      <tr><td class="t">TOTAL COST</td><td></td>{p.td("$36.93")}</tr>
    </table>
    <ol class="items">
      <li><b class="n">1.</b> How much money does Elena have left? {p.b("$23.07", "short")}</li>
      <li><b class="n">2.</b> Can she use the coupon? Why or why not? {p.b("No. She spends less than $50.", "long")}</li>
      <li><b class="n">3.</b> <b>&#9733;</b> Elena adds an apple pie and a bag of rice. What is the new total <b>with the coupon</b>?{p.ln("$36.93 + $8.99 + $9.99 = $55.91. That&rsquo;s $50 or more, so $5 off: $50.91.")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Your turn: a party for 6</h2>
    <p class="how"><b>Use your own ideas.</b> You have <b>$40</b>. Choose food from the flyer. Write your list and the total.</p>
    {p.ln("<i>answers vary: check the total is $40 or less</i>", 3)}
    <div class="gline"><b style="width:auto;">I will spend</b>{p.ln("<i>answers vary</i>")}<b style="width:auto;">and set aside</b>{p.ln("<i>answers vary</i>")}</div>
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


def packet(key):
    p = L.P(key)
    body = (L.cover(11, "Tuesday, November 24, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + game(p, key) + real_world(p, key)
            + L.verb_charts(10, COST, "it", SPEND, "I", key))
    return L.doc("Week 11 Tuesday Stations Packet" + (" (Answer Key)" if key else ""), L.packet_css(key), body)


# Board: 24 squares, snake path on a 6 x 4 grid. (emoji, text, colour class)
SQUARES = [
    ("&#127859;", "Are you good at <b>cooking</b>?", "a"), ("&#127912;", "Are you good at <b>drawing</b>?", "b"),
    ("&#128131;", "Are you good at <b>dancing</b>?", "c"), ("&#11014;&#65039;", "Free square! Say <b>2 things</b> you are good at.", "s"),
    ("&#128295;", "Are you good at <b>fixing</b> things?", "a"), ("&#127908;", "Are you good at <b>singing</b>?", "b"),
    ("&#127946;", "Are you good at <b>swimming</b>?", "c"), ("&#129504;", "Are you good at <b>remembering</b> names?", "a"),
    ("&#11013;&#65039;", "Oops! Go back 2.", "s"), ("&#128176;", "Are you good at <b>saving</b> money?", "b"),
    ("&#129518;", "Are you good at <b>math</b>?", "c"), ("&#128663;", "Are you good at <b>driving</b>?", "a"),
    ("&#128106;", "What is <b>your mom</b> good at?", "s"), ("&#129697;", "Are you good at <b>sewing</b>?", "b"),
    ("&#128066;", "Are you good at <b>listening</b>?", "c"), ("&#128514;", "Are you good at <b>telling jokes</b>?", "a"),
    ("&#128247;", "Are you good at <b>taking photos</b>?", "b"), ("&#11014;&#65039;", "Move ahead 1!", "s"),
    ("&#128187;", "Are you good at <b>using computers</b>?", "c"), ("&#127793;", "Are you good at <b>growing plants</b>?", "a"),
    ("&#128118;", "What were you good at <b>as a child</b>?", "s"), ("&#128722;", "Are you good at <b>comparison shopping</b>?", "b"),
    ("&#127891;", "What do you <b>want</b> to be good at?", "s"), ("&#9917;", "Are you good at <b>playing soccer</b>?", "c"),
]
BOARD_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1a1a1a; background: #fff;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Station 3 board: print in color, 1 per table. Landscape. */
  .page { width: 11in; height: 8.5in; padding: 0.4in 0.45in; display: flex; flex-direction: column; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter landscape; margin: 0; } }
  .top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .top h1 { font-size: 34px; }
  .top span { font-size: 15px; }
  .grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(4, 1fr); gap: 8px; }
  .sq { border: 2.5px solid #333; border-radius: 12px; padding: 6px 8px; font-size: 17px; display: flex; flex-direction: column; align-items: center;
        justify-content: center; text-align: center; position: relative; font-size: 16px; line-height: 1.2; }
  .sq .e { font-size: 30px; line-height: 1; margin-bottom: 4px; }
  .sq .no { position: absolute; top: 4px; left: 8px; font-size: 12px; color: #666; font-weight: bold; }
  .sq .arrow { position: absolute; font-size: 18px; color: #333; }
  .a { background: #ffe9c7; } .b { background: #dff2e1; } .c { background: #dde9fb; } .s { background: #ffd9e3; border-style: dashed; }
  .start { background: #2f6b2f; color: #fff; font-size: 22px; font-weight: bold; }
  .finish { background: #b3261e; color: #fff; font-size: 22px; font-weight: bold; }
  .foot { font-size: 14px; margin-top: 8px; display: flex; justify-content: space-between; }
"""


def board_doc():
    # Snake path: row 0 left->right, row 1 right->left, ... 6 x 4 = 24 cells. START sits in cell 0, FINISH in cell 23.
    cells = [None] * 24
    order = []
    for r in range(4):
        cols = range(6) if r % 2 == 0 else range(5, -1, -1)
        order += [r * 6 + c for c in cols]
    path = [("START", "start")] + SQUARES[:22] + [("FINISH", "finish")]
    for step, idx in enumerate(order):
        item = path[step]
        if len(item) == 2:
            cells[idx] = f'<div class="sq {item[1]}">{item[0]}{" &#127881;" if item[1] == "finish" else ""}</div>'
        else:
            e, t, c = item
            cells[idx] = f'<div class="sq {c}"><span class="no">{step}</span><div class="e">{e}</div><div>{t}</div></div>'
    body = f"""<section class="page">
  <div class="top"><h1>What are you good at?</h1><span>Station 3: GAME &middot; Roll the die or flip a coin (heads = 1, tails = 2)</span></div>
  <div class="grid">{"".join(cells)}</div>
  <div class="foot"><span>Follow the numbers: 1, 2, 3 &hellip; The path snakes back and forth.</span><span>Answer with a full sentence. Then the group asks one more question.</span></div>
</section>"""
    return L.doc("Week 11 Station 3 Game Board", BOARD_CSS, body)


FLYER_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #2a1a0f; background: #fff;
         font-size: 17px; line-height: 1.35; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up store and prices. */
  .page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .hero { background: #a4471d; color: #fff; border-radius: 10px; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .hero .store { font-size: 16px; }
  .hero h1 { font-size: 36px; line-height: 1.05; }
  .hero .dates { background: #f7c548; color: #2a1a0f; font-weight: bold; border-radius: 8px; padding: 6px 12px; text-align: center; font-size: 16px; }
  .deals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
  .deal { border: 2px solid #e2c3a8; border-radius: 10px; padding: 8px 10px; text-align: center; background: #fffaf3; }
  .deal .e { font-size: 30px; line-height: 1; }
  .deal .nm { font-size: 16px; font-weight: bold; margin: 2px 0; }
  .deal .pr { font-size: 26px; font-weight: bold; color: #a4471d; line-height: 1.1; }
  .deal .pr small { font-size: 15px; }
  .deal .fine { font-size: 13px; color: #555; }
  .deal.big { grid-column: span 2; background: #fff1dd; }
  .row { display: flex; gap: 10px; }
  .coupon { flex: 1; border: 3px dashed #a4471d; border-radius: 8px; padding: 8px 14px; background: #fff; }
  .coupon b.big { font-size: 26px; color: #a4471d; }
  .hours { flex: 1; background: #2a1a0f; color: #fff; border-radius: 8px; padding: 8px 14px; font-size: 15px; }
  .hours b { color: #f7c548; }
  .list { border: 2px solid #e2c3a8; border-radius: 6px; background: #fffef6; padding: 16px 24px; margin: 6px 0 14px;
          background-image: repeating-linear-gradient(#fffef6 0 33px, #c9d8ef 33px 34px); }
  .hand { font-family: "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; font-size: 21px; color: #1d3c8f; line-height: 34px; }
  .note { background: #fff6c7; border: 1px solid #e6d77a; padding: 12px 16px; transform: rotate(-1deg); font-size: 17px; }
"""


def flyer():
    deals = [
        ("&#129411;", "Frozen turkey", "$1.29<small>/lb</small>", "when you spend $25 or more", "big"),
        ("&#129411;", "Fresh turkey", "$2.49<small>/lb</small>", "", ""),
        ("&#129360;", "Pumpkin pie", "$6.99", "", ""), ("&#127822;", "Apple pie", "$8.99", "", ""),
        ("&#129387;", "Cranberry sauce", "2 for $3", "14-oz can", ""),
        ("&#129364;", "Potatoes", "$3.99", "5-lb bag", ""), ("&#127805;", "Corn", "4 for $2", "fresh ears", ""),
        ("&#129366;", "Dinner rolls", "$3.49", "12-pack", ""), ("&#129366;", "Dinner rolls", "$5.99", "24-pack", ""),
        ("&#129362;", "Green beans", "$1.99<small>/lb</small>", "", ""), ("&#127834;", "Rice", "$9.99", "10-lb bag", ""),
        ("&#127831;", "Chicken thighs", "$1.99<small>/lb</small>", "", ""),
    ]
    cells = "".join(f'<div class="deal {c}"><div class="e">{e}</div><div class="nm">{n}</div><div class="pr">{pr}</div>'
                    f'<div class="fine">{f}</div></div>' for e, n, pr, f, c in deals)
    sheet1 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="hero">
    <div><div class="store">Eastside Market</div><h1>Thanksgiving Sale!</h1></div>
    <div class="dates">Sale prices<br>Fri., Nov. 20 &ndash;<br>Thu., Nov. 26</div>
  </div>
  <div class="deals">{cells}</div>
  <div class="row">
    <div class="coupon"><b class="big">$5 OFF</b><br>when you spend <b>$50 or more</b>.<br><span style="font-size:14px;">One coupon per family. Show it at the register.</span></div>
    <div class="hours"><b>Store hours</b><br>Mon&ndash;Sat: 7:00 a.m.&ndash;10:00 p.m.<br>Sunday: 8:00 a.m.&ndash;8:00 p.m.<br><b>Thanksgiving (Thu., Nov. 26): 7:00 a.m.&ndash;2:00 p.m.</b></div>
  </div>
</section>"""
    sheet2 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <h1 style="font-size:32px; color:#a4471d;">Elena&rsquo;s list</h1>
  <p style="margin-bottom:8px;">Elena is cooking Thanksgiving dinner for her family. She shops at Eastside Market on Tuesday.</p>
  <div class="list"><div class="hand">
    Thanksgiving shopping &mdash; budget: $60<br>
    &bull; frozen turkey (12 pounds)<br>
    &bull; 1 pumpkin pie<br>
    &bull; cranberry sauce (2 cans)<br>
    &bull; potatoes (1 bag, 5 lb)<br>
    &bull; dinner rolls (12-pack)<br>
    &bull; green beans (2 pounds)
  </div></div>
  <div class="note"><b>Elena&rsquo;s notes</b><br>&bull; I keep track of my spending in a notebook.<br>&bull; I want to set aside $20 for gas this week.<br>&bull; Maybe I can buy an apple pie too. My son loves apple pie!</div>
</section>"""
    return L.doc("Week 11 Tuesday Real World: Thanksgiving Sale", FLYER_CSS, sheet1 + sheet2)


def self_check():
    why = {1: "Open 7:00 a.m.&ndash;2:00 p.m. on Thanksgiving.", 2: "$6.99 is less than $8.99.", 3: "One coupon per family.",
           4: "The flyer doesn&rsquo;t say anything about delivery.", 5: "4 for $2 = 50&cent; each.",
           6: "You need to spend $25 or more."}
    word = {"T": "True", "F": "False", "N": "Not on the flyer"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    body = f"""<h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a">Thursday, November 26</td><td class="why"></td></tr>
      <tr><td class="n">2</td><td class="a">2:00 p.m.</td><td class="why"></td></tr>
      <tr><td class="n">3</td><td class="a">$3.00</td><td class="why">2 for $3</td></tr>
      <tr><td class="n">4</td><td class="a">spend $50 or more</td><td class="why"></td></tr>
    </table>
    <h2>B. True, false, or not on the flyer?</h2>
    <table>{tf}</table>
    <h2>C. Comparison shop</h2>
    <table>
      <tr><td class="n">1</td><td class="a">$12.90</td><td class="why">10 &times; $1.29</td></tr>
      <tr><td class="n">2</td><td class="a">$24.90</td><td class="why">10 &times; $2.49</td></tr>
      <tr><td class="n">3</td><td class="a">$12.00</td><td class="why">$24.90 &minus; $12.90</td></tr>
      <tr><td class="n">4&#9733;</td><td class="a">24-pack</td><td class="why">$5.99 &divide; 24 &asymp; 25&cent;. $3.49 &divide; 12 &asymp; 29&cent;.</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Check the price on the flyer together. <b>Part D hint:</b> the turkey and green beans are <b>per pound</b>. Multiply!</div>"""
    return L.self_check_doc("Week 11 Station 4 Self-Check", body)


def leader_guide():
    words = "".join(f'<tr><td class="n">{i + 1}</td><td>{NUMS[i][2]}</td><td class="n">{i + 5}</td><td>{NUMS[i + 4][2]}</td></tr>' for i in range(4))
    top = L.leader_top(11, "11/24/26", STATIONS, [
        "<b>This week:</b> practice <b>good at + V-ing</b> (started Thursday). Quiz verbs: <b>cost, spend</b>. Only class this week: no class Thursday (Thanksgiving). <b>Week 11 Quiz opens Tue 12/1</b>, due Tue 12/8.",
        "<b>Before class:</b> print the game board in color (1 per table), and bring dice or coins. Print the flyer in color (2 copies) and the self-check card.",
        "<b>Floating:</b> start each block at <b>Station 4</b> (show the flyer, do Part B #1 together; point out <b>/lb</b> = per pound). Then Station 3, then Station 1.",
        "<b>Moves:</b> 3-minute warning, then move. <b>7:46&ndash;end:</b> wrap-up, Happy Thanksgiving! <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (13 / 30)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p><b>-teen</b> numbers have stress at the end with a clear <b>t</b>: thir<b>TEEN</b>. <b>-ty</b> numbers have stress at the start and a soft <b>t</b> (like <i>d</i>): <b>THIR</b>dy. Mistakes with money and times cause real problems at stores and appointments.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>The loud part.</b> Hand up on the stressed syllable: thir<b>TEEN</b> / <b>THIR</b>ty.</td></tr>
    <tr><td>5 min</td><td><b>A. Listen and circle.</b> Say each number once, naturally. Then check.</td></tr>
    <tr><td>4 min</td><td><b>B. Partner game.</b> Walk around. If wrong, model once with your hand.</td></tr>
    <tr><td>3 min</td><td><b>C. Prices.</b> Read the prices below at normal speed.</td></tr>
    <tr><td>5 min</td><td><b>D. Read aloud.</b> One sentence each. Fix only the numbers.</td></tr>
    <tr><td>5 min</td><td><b>E + F.</b> Talk, then each person says their 3 hard numbers.</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Say these numbers</h2>
      <table class="script">{words}</table>
      <h2>C. Read these prices</h2>
      <ol class="key">{"".join(f"<li>{t} <b>{a}</b>.</li>" for t, a in PRICES)}</ol>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li>Lift your hand on the stressed part. Let them try again.</li>
        <li>In real life, check it: <i>&ldquo;One-three or three-zero?&rdquo;</i> Teach this. It&rsquo;s a great safety phrase.</li>
        <li>Fix <b>one</b> number, then move on.</li>
      </ul>
      <div class="recast">Learner: &ldquo;It costs <u>THIR</u>teen dollars.&rdquo;<br>You: &ldquo;Thir<b>TEEN</b>? One-three? OK!&rdquo;</div>
      <h2>Adjust the level</h2>
      <ul class="dots"><li><b>Beginner:</b> only 13&ndash;19 vs 30&ndash;90.</li><li><b>Stronger:</b> they read prices for the group to write.</li></ul>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 11 &middot; Tue 11/24/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. Form:</b> 1 listening &middot; 2 cooking &middot; 3 speaking &middot; 4 solving &middot; 5 saving</p>
        <p><b>2. Would you rather:</b> answers vary. Check <i>because + a full sentence</i>.</p>
        <p><b>3. About you:</b> answers vary. Check <i>good at + V-ing</i>.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> cost, costs, costing, cost, cost &middot; spend, spends, spending, spent, spent</p>
        <p><b>5. Right form:</b> 1 costs &middot; 2 spending &middot; 3 cost &middot; 4 spend &middot; 5 cost &middot; 6 spend &middot; 7 spent &middot; 8 cost</p>
        <p><b>6. Your turn:</b> answers vary. Watch #2: <i>doesn&rsquo;t cost</i> (no -s after doesn&rsquo;t).</p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {c}" for i, (_, _, c) in enumerate(NUMS))} &middot; <b>C:</b> {" &middot; ".join(f"{i} {a}" for i, (_, a) in enumerate(PRICES, 1))} &middot; <b>D&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: GAME (pages 6&ndash;7 + board)</h2>
    <p><b>Game and A:</b> answers vary. Listen for <i>good at + V-ing</i> and <i>is good at</i> (one person) vs <i>are both good at</i>.</p>
    <p><b>B, -ing:</b> {" &middot; ".join(f"{a} &rarr; {b}" for a, b, _ in ING)} &middot; <b>C:</b> answers vary: <i>I want to be good at + V-ing. I should / can + V1.</i></p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Thanksgiving sale (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 Thursday, Nov. 26 &middot; 2 2:00 p.m. &middot; 3 $3.00 &middot; 4 spend $50 or more</p>
    <p><b>B:</b> 1 False (open 7&ndash;2) &middot; 2 True &middot; 3 False (one per family) &middot; 4 Not on the flyer &middot; 5 True (4 for $2) &middot; 6 False (spend $25+)</p>
    <p><b>C:</b> 1 $12.90 &middot; 2 $24.90 &middot; 3 $12.00 &middot; &#9733;4 the 24-pack (&asymp;25&cent; vs &asymp;29&cent; a roll)</p>
    <p><b>D:</b> turkey $15.48 &middot; pie $6.99 &middot; cranberry $3.00 &middot; potatoes $3.99 &middot; rolls $3.49 &middot; green beans $3.98 &middot; <b>total $36.93</b> &middot; 1 $23.07 left &middot; 2 No, under $50 &middot; &#9733;3 $36.93 + $8.99 + $9.99 = $55.91 &minus; $5 = <b>$50.91</b></p>
    <p><b>E:</b> answers vary. Check the math and <i>I will spend &hellip; and set aside &hellip;</i></p>
    <p style="font-size:12px;">Store and prices are made up. No sales tax: Massachusetts doesn&rsquo;t tax most groceries. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (it + cost, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (I + spend):</b> spend, spends, spending, spent, spent &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("I", SPEND))}</p>
  </div>
</section>"""
    return L.doc("Week 11 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 10),
        f"{STEM}-packet-key.html": (packet(True), 10),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
        f"{STEM}-game-board.html": (board_doc(), 1),
        f"{STEM}-real-world-document.html": (flyer(), 2),
        f"{STEM}-real-world-self-check.html": (self_check(), 1),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
