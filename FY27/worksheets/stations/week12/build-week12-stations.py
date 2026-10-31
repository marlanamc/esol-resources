#!/usr/bin/env python3
"""Week 12 Tuesday stations, Tue 12/1/26: review (zero/first conditionals, can/should/must,
have you ever, good at) with money and banking.

Quiz verbs: buy, sell. Vocab: returns and financial problems (exchange, refund,
withdraw, deposit, charge, dispute). Stations: 1 WARM-UP, 2 SPEAK (B/V + i/ee review),
3 READ (Two Charges for One Phone), 4 REAL WORLD (receipt + return policy).

    python3 build-week12-stations.py
writes the HTML and PDFs next to this file. The stores, people, and numbers are made up.
Receipt tax follows Massachusetts: 6.25%, clothing under $175 not taxed.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week12-day1-2026-12-01"
BUY = ("buy", "buys", "buying", "bought", "bought")
SELL = ("sell", "sells", "selling", "sold", "sold")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "Sound review: B/V and i/ee. With a teacher.", "Pages 4&ndash;5"),
    ("READ", "With your group. A teacher will visit.", "Pages 6&ndash;7"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 8&ndash;9 + 2 color pages on the table"),
]


def warmup(p, key):
    mix = [("If the ATM (", "isn&rsquo;t", "won&rsquo;t be", 0, ") working, I will go inside the bank."),
           ("You (", "must show", "must to show", 0, ") your ID to open an account."),
           ("Have you ever (", "send", "sent", 1, ") money to another country?"),
           ("Is she good at (", "save", "saving", 1, ") money?"),
           ("If I don&rsquo;t get paid tomorrow, I (", "didn&rsquo;t pay", "won&rsquo;t pay", 1, ") my rent."),
           ("You (", "shouldn&rsquo;t share", "shouldn&rsquo;t shares", 0, ") your PIN.")]
    li1 = "".join(f'<li><b class="n">{i}.</b> {a}{p.circ(x, r == 0)} / {p.circ(y, r == 1)}{b}</li>'
                  for i, (a, x, y, r, b) in enumerate(mix, 1))
    fill = [("This shirt is too small. I want to {} it.", "exchange"),
            ("Did the store agree to {} your money?", "refund"),
            ("Don&rsquo;t {} cash from that ATM. It has a fee.", "withdraw"),
            ("{} your paycheck into your bank account.", "Deposit"),
            ("The store will {} your card when it ships.", "charge"),
            ("If your bill is wrong, call the bank to {} the charge.", "dispute")]
    li2 = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(fill, 1))
    page2 = f"""  <div class="task">
    <h2>1. Review mix</h2>
    <p class="how">Circle the correct form. Each one is from a different week!</p>
    <p class="example">Example: If it (<b class="circ" style="width:auto;padding:0 6px;border-radius:12px;">rains</b> / will rain), I take the bus.</p>
    <ol class="items">{li1}</ol>
  </div>
  <div class="task">
    <h2>2. Fill in the blank</h2>
    <p class="how">Use every word once. Change the verb form if needed.</p>
    <div class="bank"><span>refund</span> <span>withdraw</span> <span>exchange</span> <span>charge</span> <span>dispute</span> <span>deposit</span></div>
    <ol class="items">{li2}</ol>
  </div>
  <div class="task">
    <h2>3. Money advice</h2>
    <p class="how"><b>You make up the advice.</b> Use your own ideas. Many answers are OK.</p>
    <div class="own"><b>Example:</b> If you lose your bank card, you should <span class="u">call the bank right away</span>. &middot; Other good answers: <span class="u">check your bank app</span> &middot; <span class="u">lock your card</span></div>
    <ol class="items">
      <li><b class="n">1.</b> You should never {p.b("<i>answers vary: + V1</i>", "long")}.</li>
      <li><b class="n">2.</b> If a store charges you two times, you should {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">3.</b> If you want to save money, you can {p.b("<i>answers vary</i>", "long")}.</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every Saturday</b>, my brother {} fruit at the market. (sell)", "sells"),
        ("<b>Right now</b>, I am {} a new phone plan. (buy)", "buying"),
        ("<b>Yesterday</b>, she didn&rsquo;t {} her old couch. (sell)", "sell"),
        ("<b>Last week</b>, did you {} a jacket? (buy)", "buy"),
        ("My mother {} rice in big bags <b>every month</b>. (buy)", "buys"),
        ("<b>Right now</b>, is the store {} winter coats? (sell)", "selling"),
        ("We <b>haven&rsquo;t</b> {} a new TV yet. (buy)", "bought"),
        ("<b>Have</b> they {} all the tickets? (sell)", "sold"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>buy</b> and <b>sell</b>. <i>Buy</i> and <i>sell</i> are on this week&rsquo;s quiz!</p>
    {L.forms_table([BUY, SELL], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>buy</b> or <b>sell</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>Last month</b> + buy</p>
    <p class="ideas">Ideas: a winter coat &middot; a gift &middot; a bus pass &middot; groceries</p>
    {p.ln("<i>answers vary: Last month, I bought a winter coat.</i>")}
    <p class="prompt"><b>Online</b> + buy <b>+ not</b></p>
    <p class="ideas">Ideas: shoes &middot; food &middot; clothes &middot; medicine</p>
    {p.ln("<i>answers vary: I don&rsquo;t buy shoes online.</i>")}
    <p class="prompt"><b>Have you ever</b> + sell<b>?</b></p>
    <p class="ideas">Ideas: food &middot; old clothes &middot; a car &middot; something online</p>
    {p.ln("<i>answers vary: Have you ever sold old clothes?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


PAIRS = [("boat", "vote", "vote"), ("live", "leave", "live"), ("berry", "very", "very"), ("sit", "seat", "seat"),
         ("best", "vest", "best"), ("fill", "feel", "feel"), ("ban", "van", "van"), ("chip", "cheap", "cheap")]
WHICH = [("I need to <b>leave</b> the bank.", "I need to <b>live</b> near the bank.", "a"),
         ("Is this your <b>vest</b>?", "Is this your <b>best</b>?", "a"),
         ("The <b>chips</b> are on sale.", "The <b>cheap</b> ones are on sale.", "b"),
         ("They counted the <b>boats</b>.", "They counted the <b>votes</b>.", "b")]


def speak(p, key):
    rows = "".join(
        "<tr>" + "".join(
            f'<td class="n">{j + 1}</td><td>{p.circ(PAIRS[j][0], PAIRS[j][2] == PAIRS[j][0])}</td>'
            f'<td>{p.circ(PAIRS[j][1], PAIRS[j][2] == PAIRS[j][1])}</td>' for j in (i, i + 4)) + "</tr>"
        for i in range(4))
    which = "".join(f'<li><b class="n">{i}.</b> &nbsp;{p.circ("a.", c == "a")} {a} &emsp; {p.circ("b.", c == "b")} {b}</li>'
                    for i, (a, b, c) in enumerate(WHICH, 1))
    page4 = f"""  <h2>Two sounds you know</h2>
  <div class="rhythm">
    <div><div class="big">B / V</div><p><b>B</b> = lips together, pop! &nbsp; <b>V</b> = top teeth on bottom lip, buzz.</p><p class="small">boat / vote &middot; best / vest</p></div>
    <div><div class="big">i / ee</div><p><b>i</b> = quick, relaxed. &nbsp; <b>ee</b> = long, with a smile.</p><p class="small">live / leave &middot; sit / seat</p></div>
  </div>
  <p class="how"><b>Try it:</b> Say <i>very cheap</i>. Teeth on your lip for <b>v</b>. Smile for <b>ee</b>. Now say <i>berry chip</i>.</p>
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
    <p class="how">Take turns. Read one sentence each. Watch your lips and your smile!</p>
    <ol class="read-aloud">
      <li>Vivian bought a very big bag of beans.</li>
      <li>Please keep the receipt. You will need it.</li>
      <li>Victor deposited his check at the bank.</li>
      <li>Is this vest cheap? It&rsquo;s the best one.</li>
      <li>If you leave the store, you can&rsquo;t get a refund.</li>
      <li>We live near a very busy street.</li>
      <li>Have you ever bought a used van?</li>
      <li>Steve sells cheap vegetables every week.</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b>. Then ask one more question: <i>&ldquo;Why?&rdquo;</i> or <i>&ldquo;Really?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>What is the best thing you have bought this year?</li>
      <li>Have you ever returned something to a store? Why?</li>
      <li>Do you usually pay with cash or a card?</li>
      <li>Where can you buy cheap vegetables near you?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. My hard words</h2>
    <p class="how">Write 3 words with <b>b, v, i,</b> or <b>ee</b> that are hard for you. Practice them at home.</p>
    {p.ln("<i>answers vary</i>")}
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "B/V and i/ee review &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


def read(p, key):
    page6 = """  <div class="words">
    <b>Words to know</b>
    <div class="wgrid">
      <div><b>receipt</b> = the paper that shows what you paid</div>
      <div><b>debit card</b> = a card that takes money from your bank</div>
      <div><b>bank app</b> = your bank on your phone</div>
      <div><b>double charge</b> = you pay two times for one thing</div>
      <div><b>business days</b> = Monday to Friday, not holidays</div>
      <div><b>due</b> = you must pay by this day</div>
    </div>
  </div>
  <div class="paras">
  <p>Rafael works at a bakery. He is good at saving money. Every month, he deposits part of his paycheck into his savings account. In November, he finally had enough money for a new phone.</p>
  <p>On Saturday, he went to CityTech, an electronics store. The phone cost $349.99. He paid with his <b>debit card</b>. &ldquo;You should keep your <b>receipt</b>,&rdquo; the cashier said. &ldquo;If there is a problem, you must have it to return the phone.&rdquo;</p>
  <p>On Monday, Rafael checked his <b>bank app</b>. He saw two charges from CityTech: $349.99 and $349.99. &ldquo;That&rsquo;s $699.98!&rdquo; he said. &ldquo;I only bought one phone.&rdquo; Now he had only $85 in his account, and his rent was <b>due</b> on Friday.</p>
  <p>He called his friend Luc&iacute;a. &ldquo;Have you ever had a <b>double charge</b>?&rdquo; he asked. &ldquo;Yes, once,&rdquo; she said. &ldquo;You should call the store first. If they don&rsquo;t help, you can dispute the charge with your bank.&rdquo;</p>
  <p>Rafael went back to CityTech with his receipt. The manager looked at the computer. &ldquo;You&rsquo;re right. The machine charged you two times. I&rsquo;m sorry. We will refund $349.99. It can take 5 to 7 <b>business days</b>.&rdquo;</p>
  <p>&ldquo;Five to seven days? My rent is due on Friday,&rdquo; Rafael said. The manager gave him a paper with a refund number. &ldquo;If the money isn&rsquo;t in your account by next Tuesday, call your bank and give them this number.&rdquo;</p>
  <p>While he was there, Rafael looked at his new phone case. It was the wrong size. &ldquo;Can I exchange this case?&rdquo; he asked. &ldquo;Sure,&rdquo; the manager said. &ldquo;You can exchange it for 14 days with the receipt.&rdquo; He got the right case.</p>
  <p>On Thursday, the $349.99 was back in his account. Rafael paid his rent on time. Now he checks his bank app every week. &ldquo;If you see a strange charge, don&rsquo;t wait,&rdquo; he tells his coworkers. &ldquo;Call the store or your bank right away.&rdquo;</p>
  </div>"""
    page7 = f"""  <p class="how"><b>First:</b> Read the story alone. Read it <b>2 times</b>. Then answer. The <b>&para;</b> number tells you which paragraph to look in.</p>
  <div class="task">
    <h2>Part A: Think about it</h2>
    <p class="how">The answers are not always in one sentence. Think, then write. <b>&#9733;</b> = challenge.</p>
    <ol class="items">
      <li><b class="n">1.</b> How does Rafael save money? <span class="small">(&para;1)</span>{p.ln("He deposits part of his paycheck into savings every month.")}</li>
      <li><b class="n">2.</b> Why should you keep your receipt? <span class="small">(&para;2)</span>{p.ln("If there is a problem, you must have it to return the item.")}</li>
      <li><b class="n">3.</b> What was the problem? How much did CityTech take in all? <span class="small">(&para;3)</span>{p.ln("They charged him two times: $699.98.")}</li>
      <li><b class="n">4.</b> What did Luc&iacute;a say to do first? Then what? <span class="small">(&para;4)</span>{p.ln("Call the store first. If they don&rsquo;t help, dispute it with the bank.")}</li>
      <li><b class="n">5.</b> <b>&#9733;</b> Why was Rafael worried about &ldquo;5 to 7 business days&rdquo;? <span class="small">(&para;3, 6)</span>{p.ln("His rent was due Friday. He only had $85. The money might come late.")}</li>
      <li><b class="n">6.</b> <b>&#9733;</b> What does Rafael do differently now? <span class="small">(&para;8)</span>{p.ln("He checks his bank app every week.")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>Part B: Find the grammar you know</h2>
    <p class="how">Find one sentence in the story for each. Write it.</p>
    <div class="gline"><b style="width:5.4em;">If &hellip;,</b>{p.ln("If there is a problem, you must have it&hellip; / If they don&rsquo;t help, you can&hellip;")}</div>
    <div class="gline"><b style="width:5.4em;">should</b>{p.ln("You should keep your receipt. / You should call the store first.")}</div>
    <div class="gline"><b style="width:5.4em;">Have you ever</b>{p.ln("Have you ever had a double charge?")}</div>
    <div class="gline"><b style="width:5.4em;">good at</b>{p.ln("He is good at saving money.")}</div>
  </div>
  <div class="task">
    <h2>Part C: Talk together</h2>
    <ol class="items">
      <li><b class="n">1.</b> Do you keep your receipts? Where?</li>
      <li><b class="n">2.</b> How do you keep track of your money: an app, a notebook, or in your head?</li>
    </ol>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to talk about your own money.</p>"""
    sub = "Two Charges for One Phone &middot; with your group"
    return L.page("story", "STATION 3: READ", sub, 6, page6, key) + L.page("rd", "STATION 3: READ", sub, 7, page7, key)


TF = [("You can return the lamp marked FS.", "F"),
      ("With no receipt, you get your money back in cash.", "F"),
      ("The store is open on Sundays.", "N"),
      ("A refund to a card can take 5&ndash;7 business days.", "T"),
      ("The store charged tax on the jacket.", "F"),
      ("You can exchange clothes for a new size for 60 days.", "T")]
FAMILY = [("Ana", "towels", "Refund", "Wrong color, has the receipt. 17 days is less than 30."),
          ("Marco", "lamp", "No", "FS = final sale. No returns or exchanges."),
          ("Bia", "headphones", "No", "Electronics: 14 days. Nov. 14 to Dec. 1 is 17 days."),
          ("Leo", "jacket", "Exchange", "Too big. Clothes: new size for 60 days.")]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages. Start with <b>page 1</b> (the receipt and the return policy). Read it <b>together</b>. Check answers with your group. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> When did the Silva family shop? {p.b("November 14, 2026")}</li>
      <li><b class="n">2.</b> How did they pay? {p.b("debit card")}</li>
      <li><b class="n">3.</b> How many days do you have for most returns? {p.b("30 days", "short")}</li>
      <li><b class="n">4.</b> What does <b>FS</b> mean? {p.b("final sale")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. True, false, or not on the page?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the page, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the page</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>C. What will happen?</h2>
    <p class="how">Find the rule in the return policy. Finish the sentence.</p>
    <ol class="items">
      <li><b class="n">1.</b> If you return the blender on Dec. 10 with the receipt, you will get {p.b("a full refund", "long")}.</li>
      <li><b class="n">2.</b> If you don&rsquo;t have a receipt, you will get {p.b("store credit (a gift card)", "long")}.</li>
      <li><b class="n">3.</b> If you paid with cash, you will get {p.b("cash back", "long")}.</li>
      <li><b class="n">4.</b> <b>&#9733;</b> You return <b>opened</b> headphones on Nov. 20. How much is the fee?{p.ln("15% of $49.99 = $7.50 (restocking fee)")}</li>
    </ol>
  </div>
  <p class="how bottom"><b>Talk:</b> Have you ever returned something? Was it easy or hard?</p>"""
    rows = "".join(f'<tr><td class="t">{n} &middot; {it}</td><td class="c">Refund / Exchange / No</td>{p.td(w) if key else "<td></td>"}</tr>'
                   .replace("Refund / Exchange / No", (" / ".join(p.circ(x, x == a) for x in ("Refund", "Exchange", "No")))) for n, it, a, w in FAMILY)
    page9 = f"""  <p class="how">Now look at <b>page 2</b> on the table: <b>the Silva family</b>. Today is <b>Tuesday, December 1</b>.</p>
  <div class="task">
    <h2>D. Can they return it?</h2>
    <p class="how">Read about each person. Circle <b>Refund</b>, <b>Exchange</b>, or <b>No</b>. Then write why. Check the <b>days</b> and the <b>rules</b>.</p>
    <table class="pick tall">
      <tr><th style="width:24%;">Person &middot; item</th><th style="width:34%;">Circle one</th><th>Why?</th></tr>
      {rows}
    </table>
  </div>
  <div class="task">
    <h2>E. At the returns desk</h2>
    <p class="how">Choose one person. <b>A</b> = the cashier. <b>B</b> = the customer. Fill in, then act it out. <b>Switch</b>.</p>
    <div class="textbox">
      <b>B:</b> Hi. I want to {p.b("<i>return / exchange</i>")} this {p.b("<i>item</i>", "short")}.<br>
      <b>A:</b> OK. When did you buy it? &emsp; <b>B:</b> I bought it on {p.b("<i>November 14</i>")}.<br>
      <b>A:</b> What&rsquo;s the problem? &emsp; <b>B:</b> {p.b("<i>answers vary</i>", "long")}<br>
      <b>A:</b> Do you have the receipt? &emsp; <b>B:</b> {p.b("<i>answers vary</i>", "long")}<br>
      <b>A:</b> {p.b("<i>answers vary: use the policy</i>", "long")}
    </div>
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


def packet(key):
    p = L.P(key)
    body = (L.cover(12, "Tuesday, December 1, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + read(p, key) + real_world(p, key)
            + L.verb_charts(10, BUY, "he", SELL, "they", key))
    return L.doc("Week 12 Tuesday Stations Packet" + (" (Answer Key)" if key else ""), L.packet_css(key), body)


DOC_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1b1b1b; background: #fff;
         font-size: 17px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up store, family, and card number. */
  .page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .row { display: flex; gap: 18px; align-items: flex-start; }
  .receipt { width: 3.3in; flex: none; background: #fbfbf7; border: 1px solid #ccc; box-shadow: 2px 3px 0 #ddd;
             font-family: "Courier New", Courier, monospace; font-size: 14.5px; line-height: 1.45; padding: 14px 16px; }
  .receipt .c { text-align: center; }
  .receipt .store { font-family: "Atkinson Hyperlegible", Arial, sans-serif; font-size: 22px; font-weight: bold; color: #0f5e75; }
  .receipt hr { border: none; border-top: 1.5px dashed #888; margin: 6px 0; }
  .receipt table { width: 100%; border-collapse: collapse; }
  .receipt td { padding: 1px 0; vertical-align: top; }
  .receipt td.r { text-align: right; white-space: nowrap; }
  .receipt .tot td { font-weight: bold; font-size: 16px; }
  .policy { flex: 1; border: 2px solid #0f5e75; border-radius: 8px; overflow: hidden; }
  .policy h1 { background: #0f5e75; color: #fff; font-size: 22px; padding: 8px 14px; }
  .policy ul { padding: 8px 14px 8px 30px; font-size: 16px; }
  .policy li { margin-bottom: 7px; }
  .policy .warn { background: #fdecea; border-left: 5px solid #c0392b; padding: 4px 8px; margin-left: -16px; list-style: none; }
  .h { font-size: 30px; font-weight: bold; color: #0f5e75; margin-bottom: 4px; }
  .person { display: flex; gap: 14px; border: 2px solid #cfe2e8; border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; }
  .avatar { width: 58px; height: 58px; border-radius: 50%; flex: none; display: grid; place-items: center; color: #fff; font-size: 26px; font-weight: bold; }
  .person h2 { font-size: 21px; margin-bottom: 2px; }
  .bubble { background: #eef6f8; border-radius: 14px; padding: 8px 12px; font-size: 17px; }
  .words-box { margin-top: 22px; border: 2px dashed #0f5e75; border-radius: 10px; padding: 12px 18px; }
  .words-box h2 { font-size: 21px; color: #0f5e75; margin-bottom: 6px; }
  .wg { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 22px; font-size: 17px; }
  .cal { margin-top: auto; border: 2px dashed #0f5e75; border-radius: 8px; padding: 8px 14px; font-size: 16px; }
"""


def documents():
    sheet1 = """<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="row">
    <div class="receipt">
      <div class="c"><div class="store">Bright Home</div>Home &middot; Kitchen &middot; Clothing<br>200 River Road</div>
      <hr>
      <div>Date: 11/14/2026 &nbsp; 3:42 PM<br>Customer: SILVA</div>
      <hr>
      <table>
        <tr><td>BLENDER</td><td class="r">39.99 T</td></tr>
        <tr><td>BATH TOWELS 2 @ 12.99</td><td class="r">25.98 T</td></tr>
        <tr><td>WINTER JACKET (M)</td><td class="r">59.99</td></tr>
        <tr><td>TABLE LAMP &nbsp;**FS**</td><td class="r">19.99 T</td></tr>
        <tr><td>HEADPHONES</td><td class="r">49.99 T</td></tr>
      </table>
      <hr>
      <table>
        <tr><td>SUBTOTAL</td><td class="r">195.94</td></tr>
        <tr><td>MA SALES TAX 6.25%</td><td class="r">8.50</td></tr>
        <tr class="tot"><td>TOTAL</td><td class="r">$204.44</td></tr>
      </table>
      <hr>
      <div>DEBIT CARD **** 4417<br>APPROVED</div>
      <hr>
      <div class="c">T = taxed &nbsp; FS = FINAL SALE<br>KEEP THIS RECEIPT<br>Thank you!</div>
    </div>
    <div class="policy">
      <h1>Return Policy</h1>
      <ul>
        <li><b>Most items:</b> return in <b>30 days</b> with your receipt for a <b>full refund</b>.</li>
        <li><b>No receipt?</b> You get <b>store credit</b> (a gift card). You must show a photo ID.</li>
        <li><b>Clothing:</b> exchange for a new size or color for <b>60 days</b> with your receipt.</li>
        <li><b>Electronics:</b> return in <b>14 days</b> in the box. <b>Opened</b> electronics: <b>15% restocking fee</b>.</li>
        <li class="warn"><b>Final sale (FS):</b> no returns. No exchanges.</li>
        <li><b>How you get your money:</b> card payments go back to your card in <b>5&ndash;7 business days</b>. Cash payments get cash.</li>
      </ul>
    </div>
  </div>
  <div class="words-box">
    <h2>Useful words at the returns desk</h2>
    <div class="wg">
      <div><b>refund</b> = you get your money back</div>
      <div><b>exchange</b> = you trade it for a different one</div>
      <div><b>store credit</b> = a gift card for this store</div>
      <div><b>restocking fee</b> = money you pay to return an opened item</div>
      <div><b>final sale</b> = you can&rsquo;t return it</div>
      <div><b>receipt</b> = the paper that shows what you paid</div>
    </div>
  </div>
</section>"""
    people = [
        ("A", "#c0392b", "Ana Silva", "These towels are the wrong color. I have the receipt. I just want my money back."),
        ("M", "#1f6fb2", "Marco Silva", "The lamp is too small for my desk. Can I return it?"),
        ("B", "#7d3c98", "Bia Silva", "I opened the headphones and used them. They work, but I don&rsquo;t like them."),
        ("L", "#2e7d32", "Leo Silva", "The jacket is too big. I want the same jacket in a small. I have the receipt."),
    ]
    cards = "".join(f'<div class="person"><div class="avatar" style="background:{c};">{i}</div><div><h2>{n}</h2>'
                    f'<div class="bubble">&ldquo;{q}&rdquo;</div></div></div>' for i, c, n, q in people)
    sheet2 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <div class="h">The Silva family</div>
  <p style="margin-bottom:12px;">Today is <b>Tuesday, December 1</b>. The Silva family goes back to Bright Home with their receipt from November 14. Everybody wants something different.</p>
  {cards}
  <div class="cal"><b>Count the days:</b> November 14 &rarr; November 30 = 16 days. November 30 &rarr; December 1 = 1 more day. <b>Total: 17 days.</b></div>
</section>"""
    return L.doc("Week 12 Tuesday Real World: Receipt and Return Policy", DOC_CSS, sheet1 + sheet2)


def self_check():
    why = {1: "FS = final sale. No returns.", 2: "No receipt = store credit (a gift card).",
           3: "The page doesn&rsquo;t say the store hours.", 4: "Card payments: 5&ndash;7 business days.",
           5: "No <b>T</b> next to the jacket. (MA doesn&rsquo;t tax clothes under $175.)", 6: "Clothing: 60 days with a receipt."}
    word = {"T": "True", "F": "False", "N": "Not on the page"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    body = f"""<h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a">November 14, 2026</td><td class="why">11/14/2026</td></tr>
      <tr><td class="n">2</td><td class="a">debit card</td><td class="why"></td></tr>
      <tr><td class="n">3</td><td class="a">30 days</td><td class="why"></td></tr>
      <tr><td class="n">4</td><td class="a">final sale</td><td class="why"></td></tr>
    </table>
    <h2>B. True, false, or not on the page?</h2>
    <table>{tf}</table>
    <h2>C. What will happen?</h2>
    <table>
      <tr><td class="n">1</td><td class="a">a full refund</td><td class="why">Dec. 10 is 26 days. Less than 30.</td></tr>
      <tr><td class="n">2</td><td class="a">store credit</td><td class="why">a gift card</td></tr>
      <tr><td class="n">3</td><td class="a">cash</td><td class="why"></td></tr>
      <tr><td class="n">4&#9733;</td><td class="a">$7.50</td><td class="why">15% of $49.99 = $7.4985 &asymp; $7.50</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Find the rule in the policy together. <b>Part D hint:</b> count the days, and look for <b>FS</b> on the receipt.</div>"""
    return L.self_check_doc("Week 12 Station 4 Self-Check", body)


def leader_guide():
    words = "".join(f'<tr><td class="n">{i + 1}</td><td>{PAIRS[i][2]}</td><td class="n">{i + 5}</td><td>{PAIRS[i + 4][2]}</td></tr>' for i in range(4))
    which = "".join(f'<li><b>{c}.</b> {(a if c == "a" else b)}</li>' for a, b, c in WHICH)
    top = L.leader_top(12, "12/1/26", STATIONS, [
        "<b>This week:</b> <b>review</b> (if, can / should / must, have you ever, good at) with money words. Quiz verbs: <b>buy, sell</b>. Week 12 Quiz opens Thu 12/3. Week 11 Quiz opens today, due 12/8.",
        "<b>Before class:</b> print the 2 color pages (2 copies) and the self-check card.",
        "<b>Floating:</b> start each block at <b>Station 4</b> (show the receipt: <b>T</b> and <b>FS</b>; do Part B #1 together). Then Station 3, then Station 1.",
        "<b>Moves:</b> 3-minute warning, then move. <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (B/V + i/ee)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p>A review of Weeks 8 and 10. Mixing both sounds in one sentence is the hard part (<i>very cheap, best vest</i>). Use the same cues: <b>lips / teeth</b> for B/V, <b>relaxed / smile</b> for i/ee.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>Warm up.</b> <i>very cheap / berry chip</i>. Exaggerate both.</td></tr>
    <tr><td>5 min</td><td><b>A. Listen and circle.</b> Say each word twice, naturally. Then check.</td></tr>
    <tr><td>4 min</td><td><b>B. Partner game.</b> Walk around.</td></tr>
    <tr><td>3 min</td><td><b>C. Which sentence?</b> Read the sentences below.</td></tr>
    <tr><td>5 min</td><td><b>D. Read aloud.</b> One sentence each. Fix one sound per person.</td></tr>
    <tr><td>5 min</td><td><b>E. Talk.</b> Full sentence + one follow-up.</td></tr>
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
        <li>Point: lips or teeth? Smile or relax?</li>
        <li>Fix <b>one word</b>, then move on.</li>
        <li>In Part E, repeat it back correctly. Don&rsquo;t stop them.</li>
      </ul>
      <div class="recast">Learner: &ldquo;I bought a <u>bery</u> <u>chip</u> coat.&rdquo;<br>You: &ldquo;A <b>v</b>ery ch<b>ee</b>p coat? Nice! Where?&rdquo;</div>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 12 &middot; Tue 12/1/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. Review:</b> 1 isn&rsquo;t &middot; 2 must show &middot; 3 sent &middot; 4 saving &middot; 5 won&rsquo;t pay &middot; 6 shouldn&rsquo;t share</p>
        <p><b>2. Words:</b> 1 exchange &middot; 2 refund &middot; 3 withdraw &middot; 4 Deposit &middot; 5 charge &middot; 6 dispute</p>
        <p><b>3. Advice:</b> answers vary. Check <i>should / can + V1</i>.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> buy, buys, buying, bought, bought &middot; sell, sells, selling, sold, sold</p>
        <p><b>5. Right form:</b> 1 sells &middot; 2 buying &middot; 3 sell &middot; 4 buy &middot; 5 buys &middot; 6 selling &middot; 7 bought &middot; 8 sold</p>
        <p><b>6. Your turn:</b> answers vary: <i>I bought &hellip; / I don&rsquo;t buy &hellip; online / Have you ever sold &hellip;?</i></p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {c}" for i, (_, _, c) in enumerate(PAIRS))} &middot; <b>C:</b> {" &middot; ".join(f"{i} {c}" for i, (_, _, c) in enumerate(WHICH, 1))} &middot; <b>D&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: READ, Two Charges for One Phone (pages 6&ndash;7)</h2>
    <p><b>A:</b> 1 deposits part of his paycheck into savings &middot; 2 you need it to return something &middot; 3 charged two times, $699.98 &middot; 4 call the store; if no help, dispute with the bank &middot; &#9733;5 rent due Friday, only $85, refund could be late &middot; &#9733;6 checks his bank app every week. <i>Level 3 can stop at Q4.</i></p>
    <p><b>B:</b> If: <i>If there is a problem, you must have it&hellip; / If they don&rsquo;t help, you can dispute&hellip; / If the money isn&rsquo;t in your account&hellip;, call&hellip; / If you see a strange charge, don&rsquo;t wait.</i> &middot; should: <i>You should keep your receipt. / You should call the store first.</i> &middot; Have you ever: <i>Have you ever had a double charge?</i> &middot; good at: <i>He is good at saving money.</i></p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Receipt + return policy (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 Nov. 14, 2026 &middot; 2 debit card &middot; 3 30 days &middot; 4 final sale</p>
    <p><b>B:</b> 1 False &middot; 2 False (store credit) &middot; 3 Not on the page &middot; 4 True &middot; 5 False (no T) &middot; 6 True</p>
    <p><b>C:</b> 1 a full refund (26 days) &middot; 2 store credit &middot; 3 cash &middot; &#9733;4 $7.50 (15% of $49.99)</p>
    <p><b>D:</b> {" &middot; ".join(f"<b>{n}</b> ({it}) &rarr; {a}: {w}" for n, it, a, w in FAMILY)}</p>
    <p><b>E:</b> answers vary. The cashier&rsquo;s answer must match the policy.</p>
    <p style="font-size:12px;">Store, family, and card number are made up. Tax: 6.25% on $135.95 of taxable items = $8.50; the jacket is clothing under $175, so no tax in MA. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (he + buy, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (they + sell):</b> sell, sells, selling, sold, sold &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("they", SELL))}</p>
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
