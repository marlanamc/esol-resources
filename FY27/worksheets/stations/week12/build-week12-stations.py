#!/usr/bin/env python3
"""Week 12 Tuesday stations, Tue 12/1/26 (first class after Thanksgiving): practice just, already, yet
(started Thu 11/19; Thanksgiving week had no Thursday). Week 12 Quiz (Thu 12/3) tests it.

Quiz verbs: cost, spend. Vocab: spending and budgeting (purchase price, comparison shop,
budget, set aside, keep track of, total cost). Stations: 1 WARM-UP, 2 SPEAK (short i / long ee,
matching the app's Minimal Pair Lab this week), 3 GAME (where does it go? + a money question board),
4 REAL WORLD (Maribel's December bill checklist + spending tracker, with a phone call).

Built after the Thanksgiving shift (Nov 21, 2026). The 11/24 set keeps the Thanksgiving theme, so this
one has none and uses different tasks.

    python3 build-week12-stations.py
writes the HTML and PDFs next to this file. The people, companies, and numbers are made up.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week12-day1-2026-12-01"
COST = ("cost", "costs", "costing", "cost", "cost")
SPEND = ("spend", "spends", "spending", "spent", "spent")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 1&ndash;2"),
    ("SPEAK", "Sounds: <i>ship</i> or <i>sheep</i>? With a teacher.", "Pages 3&ndash;4"),
    ("GAME", "Money questions. With your group. A teacher will visit.", "Pages 5&ndash;6"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 7&ndash;8 + 2 color pages on the table"),
]

EXTRA_CSS = """
  .match { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .match ol { list-style: none; padding: 0; margin: 0; }
  .match li { margin-bottom: 7px; font-size: 17px; }
  .bank { border: 1.5px solid #000; padding: 6px 10px; margin: 6px 0 8px; font-size: 17px; text-align: center; }
  .caret { font-size: 17px; }
"""

# Task 1: match each question to its answer (letters are deranged: no answer sits on its own line).
MATCH_Q = ["Have you paid the rent yet?", "Has your son eaten?", "Did you buy the coat?",
           "Have you made a budget yet?", "Is the bus pass expensive?"]
MATCH_A = [("A", "No, not yet. I want to comparison shop first.", 3),
           ("B", "Yes. It costs $90 a month.", 5),
           ("C", "Yes, he has just finished. His plate is empty.", 2),
           ("D", "Yes, I have already paid it. I paid on Monday.", 1),
           ("E", "No, I haven&rsquo;t made it yet. I will do it tonight.", 4)]


def warmup(p, key):
    ans = {q: letter for letter, _, q in MATCH_A}
    qs = "".join(f'<li><b class="n">{i}.</b> {q} {p.b(ans[i], "short")}</li>' for i, q in enumerate(MATCH_Q, 1))
    alist = "".join(f'<li><b class="n">{letter}.</b> {a}</li>' for letter, a, _ in MATCH_A)
    vocab = [("I use an app to", "keep track of", "my spending. It shows every purchase."),
             ("Before I buy a TV, I", "comparison shop", "at three stores."),
             ("The", "total cost", "is $412 with tax and delivery."),
             ("Every payday, I", "set aside", "$20 for winter boots."),
             ("The", "purchase price", "of the sofa is $300. Delivery is extra."),
             ("We", "budget", "our money so we can pay every bill.")]
    vl = "".join(f'<li><b class="n">{i}.</b> {a} {p.b(w)} {c}</li>' for i, (a, w, c) in enumerate(vocab, 1))
    page1 = L.NAME_STRIP + f"""  <div class="task">
    <h2>1. Match the question and the answer</h2>
    <p class="how">Write the letter. <b>Just</b> = a moment ago. <b>Already</b> = before now. <b>Yet</b> = up to now (questions and negatives).</p>
    <div class="match"><ol>{qs}</ol><ol>{alist}</ol></div>
  </div>
  <div class="task">
    <h2>2. Money words</h2>
    <p class="how">Write the word or phrase that fits. Use each one one time.</p>
    <div class="bank">set aside &middot; total cost &middot; budget &middot; keep track of &middot; comparison shop &middot; purchase price</div>
    <ol class="items">{vl}</ol>
  </div>
  <div class="task">
    <h2>3. Put the words in order</h2>
    <p class="how">Write a complete sentence. Use <b>have/has + V3</b>.</p>
    <ol class="items">
      <li><b class="n">1.</b> set aside / already / have / $50 / I{p.ln("I have already set aside $50.")}</li>
      <li><b class="n">2.</b> yet / the bill / she / hasn&rsquo;t / paid{p.ln("She hasn&rsquo;t paid the bill yet.")}</li>
      <li><b class="n">3.</b> just / spent / We / $40 / have / on groceries{p.ln("We have just spent $40 on groceries.")}</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every week</b>, a bus pass {} $22.50 in Boston. (cost)", "costs"),
        ("<b>Right now</b>, my brother is {} his paycheck at the mall. (spend)", "spending"),
        ("<b>Last Saturday</b>, we {} $70 at the market. (spend)", "spent"),
        ("<b>Yesterday</b>, the tickets didn&rsquo;t {} a lot. (cost)", "cost"),
        ("Does a winter coat {} more than $100 <b>here</b>? (cost)", "cost"),
        ("She doesn&rsquo;t {} money on taxis <b>every week</b>. (spend)", "spend"),
        ("I <b>have</b> already {} my gift money. (spend)", "spent"),
        ("<b>Has</b> the new phone {} you a lot? (cost)", "cost"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page2 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>cost</b> and <b>spend</b>. <i>Cost</i> and <i>spend</i> are on the Week 12 Quiz (Thursday)!</p>
    {L.forms_table([COST, SPEND], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>cost</b> or <b>spend</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Write about you</h2>
    <p class="how">Write true sentences about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner. Then <b>&#9733; star your best sentence</b> and read it to a teacher.</p>
    <p class="prompt"><b>already</b> + pay</p>
    <p class="ideas">Ideas: my rent &middot; my phone bill &middot; for my bus pass</p>
    {p.ln("<i>answers vary: I have already paid my phone bill.</i>")}
    <p class="prompt"><b>yet</b> + buy <b>+ not</b></p>
    <p class="ideas">Ideas: winter boots &middot; a coat for my son &middot; my groceries for the week</p>
    {p.ln("<i>answers vary: I haven&rsquo;t bought winter boots yet.</i>")}
    <p class="prompt"><b>Last month</b> + spend <b>?</b></p>
    <p class="ideas">Ideas: on food &middot; on gas &middot; on your phone</p>
    {p.ln("<i>answers vary: How much did you spend on food last month?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 1, page1, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key))


# SPEAK: short i (ship) / long ee (sheep). (word 1, word 2, the one the teacher says)
PAIRS = [("ship", "sheep", "sheep"), ("live", "leave", "live"), ("fill", "feel", "fill"), ("sit", "seat", "seat"),
         ("chip", "cheap", "cheap"), ("bin", "bean", "bin"), ("rich", "reach", "reach"), ("it", "eat", "it")]
# Part C: both words are real, so students must listen. (sentence start, word a, word b, end, the one the teacher says)
HEAR = [("I want to", "live", "leave", "here.", "leave"), ("There is a", "ship", "sheep", "in the picture.", "ship"),
        ("Can you", "fill", "feel", "it?", "feel"), ("Did you", "hit", "heat", "it?", "heat")]


def speak(p, key):
    rows = "".join(
        "<tr>" + "".join(
            f'<td class="n">{j + 1}</td><td>{p.circ(PAIRS[j][0], PAIRS[j][2] == PAIRS[j][0])}</td>'
            f'<td>{p.circ(PAIRS[j][1], PAIRS[j][2] == PAIRS[j][1])}</td>' for j in (i, i + 4)) + "</tr>"
        for i in range(4))
    hear = "".join(f'<li><b class="n">{i}.</b> {a} ({p.circ(w1, said == w1)} / {p.circ(w2, said == w2)}) {end}</li>'
                   for i, (a, w1, w2, end, said) in enumerate(HEAR, 1))
    page3 = f"""  <h2>Short <i>i</i> or long <i>ee</i>? Your mouth knows.</h2>
  <div class="rhythm">
    <div><div class="big">ship &nbsp;<span style="font-size:22px;font-weight:normal;">short <i>i</i></span></div>
      <p>Short and relaxed. Your mouth is a little open. Quick sound.</p></div>
    <div><div class="big">sheep &nbsp;<span style="font-size:22px;font-weight:normal;">long <i>ee</i></span></div>
      <p>Smile! Your lips go wide. Hold the sound longer: <i>sheeeep</i>.</p></div>
  </div>
  <p class="how"><b>Try it:</b> Say <i>ship</i>, then <i>sheep</i>. Touch the corners of your mouth. Do they move out on <i>sheep</i>?</p>
  <div class="task">
    <h2>A. Listen and circle</h2>
    <p class="how">Your teacher says <b>one</b> word. Circle the word you hear.</p>
    <table class="pairs">{rows}</table>
  </div>
  <div class="task">
    <h2>B. Your turn: partner game</h2>
    <p class="how"><b>Partner A</b> says a word from Part A. <b>Partner B</b> points to it. Right? Switch. Wrong? Smile or relax, and try again.</p>
  </div>
  <div class="task">
    <h2>C. Listen to the sentence</h2>
    <p class="how">Both words are real. Your teacher reads the sentence <b>one</b> way. Circle the word you hear.</p>
    <ol class="items">{hear}</ol>
  </div>"""
    page4 = f"""  <div class="task">
    <h2>D. Read aloud</h2>
    <p class="how">Take turns. Read one sentence each. Smile on the long <i>ee</i>!</p>
    <ol class="read-aloud">
      <li>These jeans are cheap, but they don&rsquo;t fit.</li>
      <li>I need to fill out this form for the bank.</li>
      <li>Please keep the receipt. We need it for the return.</li>
      <li>Is this seat free? Can I sit here?</li>
      <li>I spend a lot on meat and cheese every week.</li>
      <li>My sister lives in Lynn. She will leave on Friday.</li>
      <li>It is easy to keep track of things in a list.</li>
      <li>The bill is big. We need to read it again.</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b>. Then ask: <i>&ldquo;Why?&rdquo;</i> or <i>&ldquo;Really?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>Where can you buy cheap meat or fish near here?</li>
      <li>Have you already bought winter clothes this year?</li>
      <li>What is something easy to fix? Something difficult?</li>
      <li>Do you keep your receipts? Where?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. My hard words</h2>
    <p class="how">Write 3 words with short <b>i</b> or long <b>ee</b> that are hard for you. Say them to your teacher.</p>
    {p.ln("<i>answers vary</i>")}
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "short i / long ee &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 3, page3, key) + L.page("", "STATION 2: SPEAK", sub, 4, page4, key)


# GAME page 5: where does the word go? (sentence with a caret spot, word, correct sentence)
PLACE = [("I have paid the rent.", "already", "I have <b>already</b> paid the rent."),
         ("She has bought the tickets.", "just", "She has <b>just</b> bought the tickets."),
         ("We haven&rsquo;t made a budget.", "yet", "We haven&rsquo;t made a budget <b>yet</b>."),
         ("Have you saved any money?", "yet", "Have you saved any money <b>yet</b>?"),
         ("They have spent $100 this week.", "already", "They have <b>already</b> spent $100 this week."),
         ("He has gotten his paycheck.", "just", "He has <b>just</b> gotten his paycheck.")]
# GAME page 6 board: (emoji, question, pattern tag, sample answer for the key)
QUESTIONS = [
    ("&#127968;", "Have you paid your rent yet this month?", "already / not yet", "Yes, I&rsquo;ve already paid it. / No, not yet."),
    ("&#129509;", "Have you bought winter boots yet?", "Yes, I have. / No, not yet.", "No, I haven&rsquo;t bought them yet."),
    ("&#128176;", "What does a bus pass cost here?", "It costs&hellip;", "It costs $90 a month."),
    ("&#127873;", "What have you already bought for the holidays?", "I&rsquo;ve already bought&hellip;", "I&rsquo;ve already bought a toy for my son."),
    ("&#128241;", "How do you keep track of your money?", "I keep track of&hellip;", "I keep track of my money in an app."),
    ("&#128722;", "Where do you comparison shop?", "I comparison shop at&hellip;", "I comparison shop at Target and Walmart."),
    ("&#127828;", "Have you eaten yet today?", "Yes, I have just&hellip; / No, not yet.", "Yes, I have just eaten a sandwich."),
    ("&#128184;", "What did you spend money on last weekend?", "I spent&hellip; on&hellip;", "I spent $30 on gas."),
    ("&#128092;", "Have you ever spent too much at a store?", "Have you ever + V3?", "Yes, I have. I spent too much on shoes."),
    ("&#127974;", "Do you set aside money every month? For what?", "I set aside&hellip; for&hellip;", "I set aside $50 for my family."),
    ("&#9749;", "How much does a coffee cost near here?", "It costs about&hellip;", "It costs about $3."),
    ("&#128221;", "Have you made a shopping list yet this week?", "already / yet + V3", "No, I haven&rsquo;t made it yet."),
    ("&#128717;&#65039;", "What is something that costs more in the U.S.?", "&hellip; costs more here.", "Rent costs more here."),
    ("&#127775;", "What is the best thing you have bought this year?", "The best thing I&rsquo;ve bought&hellip;", "The best thing I&rsquo;ve bought is a warm coat."),
    ("&#128198;", "Have you already planned your budget for December?", "already / not yet", "Yes, I&rsquo;ve already planned it."),
]


def game(p, key):
    place = "".join(f'<li><b class="n">{i}.</b> <span class="caret">{s}</span> ({w}){p.ln(c)}</li>'
                    for i, (s, w, c) in enumerate(PLACE, 1))
    page5 = f"""  <div class="gram3" style="font-size:16px;">
    <div><b>just</b> and <b>already</b> go<br><b>before V3</b>.<br>I have <b>just</b> paid.</div>
    <div><b>yet</b> goes at<br>the <b>end</b>.<br>I haven&rsquo;t paid <b>yet</b>.</div>
    <div><b>Questions:</b><br>Have you paid <b>yet</b>?<br>Has she <b>already</b> paid?</div>
  </div>
  <div class="task">
    <h2>Warm up together: where does the word go?</h2>
    <p class="how">Read the sentence. Add the word in ( ). Write the new sentence. Check with your group before the game.</p>
    <p class="example">Example: I have eaten. (just) &rarr; I have <b>just</b> eaten.</p>
    <ol class="items">{place}</ol>
  </div>
  <p class="tip bottom"><b>Remember:</b> <i>yet</i> is for questions and negatives. In a <b>yes</b> sentence, use <i>already</i>: I have <b>already</b> paid.</p>"""
    items = [(e, q, tag, None) for e, q, tag, _ in QUESTIONS]  # samples are in the leader guide
    page6 = f"""  <div class="task">
    <h2>How to play</h2>
    <ol class="items play" style="list-style:none;">
      <li><b class="n">1.</b> Pick a question. Ask the person on your <b>left</b>. Everyone puts an <b>&#10007;</b> on it.</li>
      <li><b class="n">2.</b> They answer with a <b>full sentence</b>. The small words in the box help. Page 5 helps with <i>just / already / yet</i>.</li>
      <li><b class="n">3.</b> The group checks: is the grammar right? <b>Yes</b> = 1 point ( <b>|</b> ). <b>Not sure?</b> Ask a teacher.</li>
      <li><b class="n">4.</b> Then that person picks the next question. Most points when the timer rings wins!</li>
    </ol>
  </div>
  {L.board(items, key)}
  {L.SCORE}
  <div class="task">
    <h2>Write your best answer</h2>
    {p.ln("<i>answers vary: check the pattern in the box</i>")}
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    return (L.page("", "STATION 3: GAME", "where does it go? &middot; with your group", 5, page5, key)
            + L.page("", "STATION 3: GAME", "money questions &middot; with your group", 6, page6, key))


# REAL WORLD: Maribel's December checklist. (bill, amount, due, paid on or "")
BILLS = [("Rent", "$1,350", "Dec. 1", "Nov. 30"), ("Electric (Northway Electric)", "$85", "Dec. 10", ""),
         ("Phone", "$45", "Dec. 3", "Nov. 28"), ("Internet", "$60", "Dec. 15", ""),
         ("Bus pass (monthly)", "$90", "Dec. 1", "Dec. 1"), ("Savings (set aside)", "$100", "Dec. 1", "Dec. 1")]
TF = [("Maribel has already paid the rent.", "T"),
      ("She has paid the internet bill.", "F"),
      ("Her phone bill costs $54.", "F"),
      ("She buys groceries at Market Basket.", "N"),
      ("She has already set aside $100.", "T"),
      ("The bus pass costs more than the phone bill.", "T")]
# Part D: (question, answer)
ASK = [("Has Maribel paid the electric bill yet?", "No, she hasn&rsquo;t. She hasn&rsquo;t paid it yet."),
       ("Has she paid the phone bill?", "Yes, she has. She has already paid it."),
       ("Has she bought her bus pass yet?", "Yes, she has. She has just bought it (today)."),
       ("Which bills has she not paid yet?", "The electric bill and the internet bill.")]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page7 = f"""  <p class="how"><b>On the table:</b> 2 color pages. Start with <b>page 1</b> (Maribel&rsquo;s December checklist). Today is <b>Tuesday, December 1</b>. Read it <b>together</b>. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> How much is the rent? {p.b("$1,350", "short")}</li>
      <li><b class="n">2.</b> When is the electric bill due? {p.b("December 10", "long")}</li>
      <li><b class="n">3.</b> How much does Maribel earn in December? {p.b("$2,400", "short")}</li>
      <li><b class="n">4.</b> How much has she spent on groceries so far? {p.b("$95", "short")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. True, false, or not on the page?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the page, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the page</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>C. Comparison shop: a winter coat</h2>
    <p class="how">Look at <b>page 2</b>. Maribel found the same coat at two stores. You can use your phone calculator.</p>
    <ol class="items">
      <li><b class="n">1.</b> The total cost at <b>Store A</b> is {p.b("$79.99", "short")}.</li>
      <li><b class="n">2.</b> The total cost at <b>Store B</b> is {p.b("$72.50", "short")}.</li>
      <li><b class="n">3.</b> Which store is cheaper? How much does she save? {p.b("Store B, $7.49", "long")}</li>
    </ol>
  </div>
  <p class="how bottom"><b>Talk:</b> Do you keep a list of your bills? On paper or on your phone?</p>"""
    asks = "".join(f'<li><b class="n">{i}.</b> {q}{p.ln(a)}</li>' for i, (q, a) in enumerate(ASK, 1))
    page8 = f"""  <div class="task">
    <h2>D. Ask and answer</h2>
    <p class="how">Look at the <b>Paid on</b> column on page 1. Take turns. Answer with <b>already</b>, <b>just</b>, or <b>not yet</b>.</p>
    <ol class="items">{asks}</ol>
    <ol class="items">
      <li><b class="n">5.</b> How much money does she need for the bills she hasn&rsquo;t paid yet? {p.b("$145", "short")}</li>
      <li><b class="n">6.</b> <b>&#9733;</b> Add <b>every</b> line on page 1 (bills + savings + groceries $400). How much is left from $2,400?{p.ln("$1,350 + $85 + $45 + $60 + $90 + $100 + $400 = $2,130. $2,400 &minus; $2,130 = $270.")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Phone call: Northway Electric</h2>
    <p class="how">Maribel calls about her electric bill. <b>Write your own lines</b> for B. Then read it with a partner. Switch.</p>
    <p><b>A:</b> Northway Electric. How can I help you?</p>
    <p><b>B:</b> Hi. I want to ask about my December bill.</p>
    {p.ln("<i>answers vary: It looks high. / When is it due?</i>")}
    <p><b>A:</b> OK. The total is $85. Have you paid it yet?</p>
    <p><b>B:</b></p>
    {p.ln("<i>No, not yet. / No, I haven&rsquo;t paid it yet.</i>")}
    <p><b>A:</b> It&rsquo;s due on December 10. Do you want to pay now?</p>
    <p><b>B:</b></p>
    {p.ln("<i>answers vary: Yes, please. / No, I will pay on Friday.</i>")}
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 7, page7, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key)


def write_about_you(p, key):
    body = f"""<div class="task">
    <h2>My money this week</h2>
    <p class="how">Write about yourself or an imaginary person. Use <b>have/has + V3</b>, and <b>cost</b> or <b>spend</b>.</p>
    <p class="example">Example: I have already paid my phone bill this month.</p>
    <p class="prompt"><b>1. Already:</b> a bill or payment you finished before today.</p>
    {p.ln("<i>Example: I have already paid the rent.</i>", 2)}
    <p class="prompt"><b>2. Not yet:</b> something you want to buy, but haven&rsquo;t bought.</p>
    {p.ln("<i>Example: I haven&rsquo;t bought a new phone yet.</i>", 2)}
    <p class="prompt"><b>3. Just:</b> something you did a moment ago.</p>
    {p.ln("<i>Example: I have just finished page 9.</i>", 2)}
    <p class="prompt"><b>4. Cost:</b> something that costs a lot here.</p>
    {p.ln("<i>Example: Rent costs a lot in Boston.</i>", 2)}
    <p class="prompt"><b>5. Ask a partner:</b> Have you &hellip; yet? Write their answer.</p>
    {p.ln("<i>Example: Have you made a budget yet? No, not yet.</i>", 2)}
    </div>
    <div class="tip bottom"><b>Check together:</b> underline <i>have</i> or <i>has</i>. Circle the V3. Is <i>yet</i> at the end?</div>"""
    return L.page("", "FINISHED EARLY?", "write about you", 10, body, key)


def packet(key):
    p = L.P(key)
    body = (warmup(p, key) + speak(p, key) + game(p, key) + real_world(p, key)
            + L.verb_charts(9, COST, "they", SPEND, "she", key) + write_about_you(p, key))
    return L.doc("Week 12 Tuesday Stations Packet" + (" (Answer Key)" if key else ""),
                 L.packet_css(key) + L.NO_COVER_CSS + EXTRA_CSS, body)


DOC_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1f2a33; background: #fff;
         font-size: 17px; line-height: 1.35; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up people, companies, and amounts. */
  .page { width: 8.5in; height: 11in; padding: 0.5in 0.6in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .hero { background: #1f5f7a; color: #fff; border-radius: 10px; padding: 14px 20px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
  .hero h1 { font-size: 32px; line-height: 1.05; }
  .hero .pay { background: #f2c14e; color: #1f2a33; font-weight: bold; border-radius: 8px; padding: 6px 12px; text-align: center; }
  table.bills { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 18px; }
  table.bills th { background: #e3eef3; text-align: left; padding: 8px; border-bottom: 2px solid #1f5f7a; }
  table.bills td { padding: 9px 8px; border-bottom: 1px solid #c9d6dc; }
  table.bills td.paid { color: #1d6b3a; font-weight: bold; }
  table.bills td.no { color: #a33a2a; font-weight: bold; }
  .note { background: #fff6c7; border: 1px solid #e6d77a; padding: 12px 16px; transform: rotate(-1deg); font-size: 17px; margin-top: auto; }
  .phone { width: 4.3in; margin: 0 auto 16px; border: 10px solid #222; border-radius: 30px; padding: 16px 14px; background: #f7f9fb; }
  .phone h2 { font-size: 20px; margin-bottom: 4px; color: #1f5f7a; }
  .phone .sub { font-size: 14px; color: #555; margin-bottom: 8px; }
  .row { display: flex; justify-content: space-between; border-bottom: 1px solid #d5dde2; padding: 6px 2px; font-size: 16px; }
  .row b { color: #a33a2a; }
  .coats { display: flex; gap: 14px; }
  .coat { flex: 1; border: 2px solid #c9d6dc; border-radius: 10px; padding: 10px 14px; background: #fbfdfe; }
  .coat h3 { font-size: 20px; color: #1f5f7a; }
  .coat .pr { font-size: 28px; font-weight: bold; }
"""


def documents():
    rows = "".join(f'<tr><td>{bill}</td><td>{amt}</td><td>{due}</td>'
                   + (f'<td class="paid">&#10003; {paid}</td>' if paid else '<td class="no">not yet</td>') + "</tr>"
                   for bill, amt, due, paid in BILLS)
    sheet1 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="hero"><div><div style="font-size:16px;">Maribel Ortiz</div><h1>My December Money Checklist</h1></div>
    <div class="pay">Pay this month<br><span style="font-size:24px;">$2,400</span></div></div>
  <table class="bills"><tr><th>Bill</th><th>Amount</th><th>Due</th><th>Paid on</th></tr>{rows}</table>
  <table class="bills"><tr><th>Groceries budget</th><th>Budget</th><th>Spent so far</th><th>Left</th></tr>
    <tr><td>Food for the month</td><td>$400</td><td>$95</td><td>$305</td></tr></table>
  <div class="note"><b>Maribel&rsquo;s notes</b><br>&bull; Today is Tuesday, December 1. I just bought my bus pass.<br>&bull; I keep track of every bill on this page.<br>&bull; Pay the electric bill before Dec. 10!<br>&bull; I need a winter coat. Comparison shop first (page 2).</div>
</section>"""
    sheet2 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <div class="phone">
    <h2>&#128241; Spending tracker</h2>
    <div class="sub">Maribel&rsquo;s app &middot; Nov. 28 &ndash; Dec. 1</div>
    <div class="row"><span>Nov. 28 &middot; Phone bill</span><b>&minus;$45.00</b></div>
    <div class="row"><span>Nov. 29 &middot; Groceries</span><b>&minus;$62.40</b></div>
    <div class="row"><span>Nov. 30 &middot; Rent</span><b>&minus;$1,350.00</b></div>
    <div class="row"><span>Nov. 30 &middot; Groceries</span><b>&minus;$32.60</b></div>
    <div class="row"><span>Dec. 1 &middot; Bus pass</span><b>&minus;$90.00</b></div>
    <div class="row"><span>Dec. 1 &middot; Savings (set aside)</span><b>&minus;$100.00</b></div>
  </div>
  <h2 style="font-size:24px; color:#1f5f7a; margin-bottom:8px;">The same winter coat, two stores</h2>
  <div class="coats">
    <div class="coat"><h3>Store A</h3><div class="pr">$79.99</div><p>Free shipping<br>Arrives in 3 days</p></div>
    <div class="coat"><h3>Store B</h3><div class="pr">$64.50</div><p>Shipping: $8.00<br>Arrives in 5 days</p></div>
  </div>
  <p style="margin-top:14px;">No sales tax: Massachusetts doesn&rsquo;t tax clothing under $175.</p>
</section>"""
    return L.doc("Week 12 Tuesday Real World: December Money Checklist", DOC_CSS, sheet1 + sheet2)


def self_check():
    why = {1: "Paid on Nov. 30.", 2: "Internet: not yet.", 3: "Phone: $45.",
           4: "The page doesn&rsquo;t say the store.", 5: "Savings: paid Dec. 1.", 6: "$90 is more than $45."}
    word = {"T": "True", "F": "False", "N": "Not on the page"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    body = f"""<h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a">$1,350</td><td class="why"></td></tr>
      <tr><td class="n">2</td><td class="a">December 10</td><td class="why"></td></tr>
      <tr><td class="n">3</td><td class="a">$2,400</td><td class="why">Pay this month</td></tr>
      <tr><td class="n">4</td><td class="a">$95</td><td class="why">Spent so far</td></tr>
    </table>
    <h2>B. True, false, or not on the page?</h2>
    <table>{tf}</table>
    <h2>C. Comparison shop</h2>
    <table>
      <tr><td class="n">1</td><td class="a">$79.99</td><td class="why">free shipping</td></tr>
      <tr><td class="n">2</td><td class="a">$72.50</td><td class="why">$64.50 + $8.00</td></tr>
      <tr><td class="n">3</td><td class="a">Store B, $7.49</td><td class="why">$79.99 &minus; $72.50</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Find it on the page together. <b>Part D hint:</b> look at the <b>Paid on</b> column.</div>"""
    return L.self_check_doc("Week 12 Station 4 Self-Check", body, page_ref="packet page 7")


def leader_guide():
    words = "".join(f'<tr><td class="n">{i + 1}</td><td>{PAIRS[i][2]}</td><td class="n">{i + 5}</td><td>{PAIRS[i + 4][2]}</td></tr>' for i in range(4))
    top = L.leader_top(12, "12/1/26", STATIONS, [
        "<b>This week:</b> practice <b>just, already, yet</b> (started Thu 11/19; no Thursday class Thanksgiving week). Quiz verbs: <b>cost, spend</b>. <b>Week 12 Quiz</b> (just / already / yet) opens Thu 12/3, due Tue 12/8.",
        "<b>Before class:</b> print the packet double-sided (no cover page; tell groups their station order out loud or on the board). Station 3 needs a timer. Print the 2 color pages (2 copies) and the self-check card.",
        "<b>Floating:</b> start each block at <b>Station 4</b> (read the <b>Paid on</b> column together and do Part B #1). Then Station 3, then Station 1.",
        "<b>Effort credit:</b> record meaningful attempts, explanations, and revisions through the teacher points workflow. Avoid duplicate credit for the same work.",
        "<b>Moves:</b> 3-minute warning, then move. <b>Finished early</b> anywhere &rarr; verb charts (page 9) or write about you (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (short i / long ee)</h1><span class="tag">Packet pages 3&ndash;4</span></div>
  <p>Short <b>i</b> (<i>ship, live, fill</i>) is quick and relaxed. Long <b>ee</b> (<i>sheep, leave, feel</i>) is longer, with spread lips. Many learners use one sound for both, so <i>cheap</i> and <i>chip</i> or <i>leave</i> and <i>live</i> get confused at work and in stores. This matches the app&rsquo;s Short i vs Long e Minimal Pair Lab this week.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>Your mouth knows.</b> Fingers on the corners of the mouth: relax for <i>ship</i>, smile for <i>sheep</i>.</td></tr>
    <tr><td>5 min</td><td><b>A. Listen and circle.</b> Say each word once, naturally. Then check.</td></tr>
    <tr><td>4 min</td><td><b>B. Partner game.</b> Walk around. If wrong, model once: relax or smile.</td></tr>
    <tr><td>3 min</td><td><b>C. Sentences.</b> Read each sentence with the word below.</td></tr>
    <tr><td>5 min</td><td><b>D. Read aloud.</b> One sentence each. Fix only the i / ee words.</td></tr>
    <tr><td>5 min</td><td><b>E + F.</b> Talk, then each person says their 3 hard words.</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Say these words</h2>
      <table class="script">{words}</table>
      <h2>C. Read these sentences</h2>
      <ol class="key">{"".join(f"<li>{a} <b>{said}</b> {end}</li>" for a, _, _, end, said in HEAR)}</ol>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li>Touch the corners of your mouth: smile = <i>ee</i>, relax = <i>i</i>. Let them try again.</li>
        <li>Make it matter: <i>&ldquo;Cheap? Or chip? I want cheap shoes, not chip shoes!&rdquo;</i></li>
        <li>Fix <b>one</b> word, then move on.</li>
      </ul>
      <div class="recast">Learner: &ldquo;These shoes are <u>chip</u>.&rdquo;<br>You: &ldquo;Ch<b>ee</b>p? Smile! Yes, cheap!&rdquo;</div>
      <h2>Adjust the level</h2>
      <ul class="dots"><li><b>Beginner:</b> only Part A pairs 1&ndash;4.</li><li><b>Stronger:</b> they read Part C for the group to circle.</li></ul>
    </div>
  </div>
</section>"""
    ans = {q: letter for letter, _, q in MATCH_A}
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 12 &middot; Tue 12/1/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 1&ndash;2)</h2>
    <div class="cols">
      <div>
        <p><b>1. Match:</b> {" &middot; ".join(f"{i} {ans[i]}" for i in range(1, 6))}</p>
        <p><b>2. Money words:</b> 1 keep track of &middot; 2 comparison shop &middot; 3 total cost &middot; 4 set aside &middot; 5 purchase price &middot; 6 budget</p>
        <p><b>3. Order:</b> I have already set aside $50. She hasn&rsquo;t paid the bill yet. We have just spent $40 on groceries.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> cost, costs, costing, cost, cost &middot; spend, spends, spending, spent, spent</p>
        <p><b>5. Right form:</b> 1 costs &middot; 2 spending &middot; 3 spent &middot; 4 cost &middot; 5 cost &middot; 6 spend &middot; 7 spent &middot; 8 cost</p>
        <p><b>6. Write about you:</b> answers vary. Watch #2: <i>haven&rsquo;t bought &hellip; yet</i> (V3, <i>yet</i> at the end).</p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 3&ndash;4)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {c}" for i, (_, _, c) in enumerate(PAIRS))} &middot; <b>C:</b> {" &middot; ".join(f"{i} {said}" for i, (_, _, _, _, said) in enumerate(HEAR, 1))} &middot; <b>D&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: GAME (pages 5&ndash;6)</h2>
    <p><b>Page 5:</b> {" &middot; ".join(f"{i} {c}" for i, (_, _, c) in enumerate(PLACE, 1))}</p>
    <p><b>Board samples:</b> {" &middot; ".join(f"{i} {a}" for i, (_, _, _, a) in enumerate(QUESTIONS, 1) if i in (1, 4, 7, 9, 12))} &middot; others: answers vary; check the pattern in the box.</p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, December money checklist (pages 7&ndash;8 + 2 color pages)</h2>
    <p><b>A:</b> 1 $1,350 &middot; 2 December 10 &middot; 3 $2,400 &middot; 4 $95 &middot; <b>B:</b> 1 True &middot; 2 False &middot; 3 False ($45) &middot; 4 Not on the page &middot; 5 True &middot; 6 True &middot; <b>C:</b> 1 $79.99 &middot; 2 $72.50 &middot; 3 Store B, saves $7.49</p>
    <p><b>D:</b> {" &middot; ".join(f"{i} {a}" for i, (_, a) in enumerate(ASK, 1))} &middot; 5 $145 ($85 + $60) &middot; &#9733;6 $2,130 total, <b>$270 left</b></p>
    <p><b>E:</b> answers vary. Check <i>No, not yet. / No, I haven&rsquo;t paid it yet.</i></p>
    <p style="font-size:12px;">People, companies, and amounts are made up. No sales tax on clothing under $175 in Massachusetts. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>FINISHED EARLY: verb charts (page 9) and write about you (page 10)</h2>
    <p><b>Page 10:</b> answers vary. Check have/has + V3; just/already before V3; yet at the end.</p>
    <p><b>Chart 1 (they + cost, helpers only):</b> Present: &mdash; / don&rsquo;t / Do &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: are / aren&rsquo;t / Are &middot; Past cont.: were / weren&rsquo;t / Were &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: have / haven&rsquo;t / Have</p>
    <p><b>Chart 2 (she + spend):</b> spend, spends, spending, spent, spent &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("she", SPEND))}</p>
  </div>
</section>"""
    return L.doc("Week 12 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 10),
        f"{STEM}-packet-key.html": (packet(True), 10),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
        f"{STEM}-real-world-document.html": (documents(), 2),
        f"{STEM}-real-world-self-check.html": (self_check(), 1),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
