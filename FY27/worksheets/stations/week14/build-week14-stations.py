#!/usr/bin/env python3
"""Week 14 Tuesday stations, Tue 12/15/26: practice comparatives + superlatives (started Thu 12/10).

No quiz this week: verb review is buy, sell, spend. Vocab: economic news (cost of
living, inflation, wages, unemployed, interest rate, economy). Stations: 1 WARM-UP,
2 SPEAK (Which is better? debates), 3 READ (news article + price chart),
4 REVIEW GAME (fall grammar quiz board with a student judge).

    python3 build-week14-stations.py
writes the HTML and PDFs next to this file. The newspaper, people, and prices are
made up for practice, and the article says so.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week14-day1-2026-12-15"
BUY = ("buy", "buys", "buying", "bought", "bought")
SELL = ("sell", "sells", "selling", "sold", "sold")
SPEND = ("spend", "spends", "spending", "spent", "spent")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "<i>Which is better?</i> With a teacher.", "Pages 4&ndash;5"),
    ("READ", "With your group. A teacher will visit.", "Pages 6&ndash;7"),
    ("REVIEW GAME", "With your group. Take turns being the judge.", "Pages 8&ndash;9 + game sheet on the table"),
]


def warmup(p, key):
    fill = [("The {} is very high here. Rent, food, and bus fares all cost a lot.", "cost of living"),
            ("Why are many workers asking for higher {}?", "wages"),
            ("The news said fewer people are {} this month.", "unemployed"),
            ("When the {} goes up, loans cost more money.", "interest rate"),
            ("{} means your paycheck doesn&rsquo;t go as far as it used to.", "Inflation"),
            ("The news talks about the {} almost every day.", "economy")]
    li1 = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(fill, 1))
    match = [("cheap", "comparative", "cheaper"), ("expensive", "superlative", "the most expensive"),
             ("good", "comparative", "better"), ("big", "superlative", "the biggest"), ("small", "comparative", "smaller")]
    li2 = "".join(f'<li><b class="n">{i}.</b> {a} &rarr; <span class="small">({k})</span> {p.b(f)}</li>' for i, (a, k, f) in enumerate(match, 1))
    page2 = f"""  <div class="task">
    <h2>1. Fill in the blank</h2>
    <p class="how">Use every word once. Change the word form if needed.</p>
    <div class="bank"><span>inflation</span> <span>economy</span> <span>cost of living</span> <span>wages</span> <span>interest rate</span> <span>unemployed</span></div>
    <ol class="items">{li1}</ol>
  </div>
  <div class="task">
    <h2>2. Write the form</h2>
    <p class="how">Write the comparative or superlative. Use the words in the box.</p>
    <div class="bank"><span>smaller</span> <span>the most expensive</span> <span>better</span> <span>the biggest</span> <span>cheaper</span></div>
    <ol class="items">{li2}</ol>
  </div>
  <div class="task">
    <h2>3. Compare things in your life</h2>
    <p class="how"><b>You make up the sentence.</b> Use your own ideas. Many answers are OK.</p>
    <div class="own"><b>Example:</b> <span class="u">The bus</span> is cheaper than <span class="u">a taxi</span>. &middot; Other good answers: <span class="u">Rice</span> is cheaper than <span class="u">meat</span>. &middot; <span class="u">Summer</span> is better than <span class="u">winter</span>.</div>
    <ol class="items">
      <li><b class="n">1.</b> {p.b("<i>answers vary</i>")} is cheaper than {p.b("<i>answers vary</i>")}.</li>
      <li><b class="n">2.</b> {p.b("<i>answers vary</i>")} is the best {p.b("<i>answers vary</i>")} in my city.</li>
      <li><b class="n">3.</b> Is {p.b("<i>answers vary</i>")} more expensive than {p.b("<i>answers vary</i>")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every week</b>, my family {} about $150 on food. (spend)", "spends"),
        ("<b>Right now</b>, more people are {} used cars. (buy)", "buying"),
        ("<b>Last year</b>, the factory didn&rsquo;t {} many cars. (sell)", "sell"),
        ("<b>Yesterday</b>, did you {} eggs? They cost more now! (buy)", "buy"),
        ("<b>Right now</b>, are families {} more on rent? (spend)", "spending"),
        ("That store doesn&rsquo;t {} bread <b>every day</b>. (sell)", "sell"),
        ("We <b>have</b> {} more on groceries this year. (spend)", "spent"),
        ("<b>Have</b> they {} their house? (sell)", "sold"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms: money verbs review</h2>
    <p class="how">Write the other forms of <b>buy</b>, <b>sell</b>, and <b>spend</b>. No quiz this week. Keep this chart in your binder!</p>
    {L.forms_table([BUY, SELL, SPEND], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>buy</b>, <b>sell</b>, or <b>spend</b>.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>Last weekend</b> + buy</p>
    <p class="ideas">Ideas: groceries &middot; a gift &middot; warm clothes &middot; nothing!</p>
    {p.ln("<i>answers vary: Last weekend, I bought a gift for my son.</i>")}
    <p class="prompt"><b>A taxi</b> + cheap <b>+ not</b> + than</p>
    <p class="ideas">Ideas: the bus &middot; the train &middot; walking &middot; a bike</p>
    {p.ln("<i>answers vary: A taxi isn&rsquo;t cheaper than the bus.</i>")}
    <p class="prompt"><b>Which</b> + the best<b>?</b></p>
    <p class="ideas">Ideas: store for vegetables &middot; restaurant &middot; park &middot; time to shop</p>
    {p.ln("<i>answers vary: Which store is the best for vegetables?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


HEAR = [("The bus is cheaper than a taxi.", "C"), ("This is the cheapest store.", "S"),
        ("Winter is colder than fall.", "C"), ("July is the hottest month.", "S"),
        ("Rent is more expensive than last year.", "C"), ("Coffee had the biggest change.", "S"),
        ("My new job is better than my old job.", "C"), ("That was the best day of my life!", "S")]
DEBATES = ["City or country?", "Cook at home or eat out?", "Bus or car?", "Summer or winter in Boston?",
           "A big store or a small store?", "Call or text?"]
WHO = ["has the oldest phone?", "wakes up the earliest?", "has the longest bus or train ride?",
       "has the biggest family?", "is the best cook?", "lives the closest to school?"]


def speak(p, key):
    hear = "".join(
        f'<li><b class="n">{i}.</b> <span>_____________</span> <span class="cc">{p.circ("-er / more &hellip; than", a == "C")} &middot; {p.circ("the -est / the most", a == "S")}</span></li>'
        for i, (_, a) in enumerate(HEAR, 1))
    debates = "".join(f"<div>{d}</div>" for d in DEBATES)
    page4 = f"""  <h2>Quiet <i>than</i></h2>
  <div class="rhythm">
    <div><div class="big" style="font-size:22px;">The <b>BUS</b> is <b>CHEAP</b>er thn a <b>TAX</b>i.</div><p><b>than</b> is quiet and fast: &ldquo;thn.&rdquo; <b>-er</b> is short.</p></div>
    <div><div class="big" style="font-size:22px;">It&rsquo;s the <b>CHEAP</b>est store.</div><p><b>the</b> is quiet. The <b>adjective</b> is loud: the <b>BEST</b>, the most ex<b>PEN</b>sive.</p></div>
  </div>
  <div class="task">
    <h2>A. Listen: compare 2, or number 1?</h2>
    <p class="how">Your teacher reads a sentence. Is it <b>-er / more &hellip; than</b> (2 things) or <b>the -est / the most</b> (number 1)? Circle it.</p>
    <ol class="items" style="font-size:17px;">{hear}</ol>
  </div>
  <div class="task">
    <h2>B. Which is better? Friendly debate</h2>
    <p class="how">Choose a topic. Each person picks a side and gives <b>2 reasons</b>. Use <b>-er / more &hellip; than</b>.</p>
    <div class="debates">{debates}</div>
    <div class="bank starters" style="margin-top:8px; font-size:17px;">
      <span><b>I think</b> the city is better <b>because</b> &hellip;</span><span><b>Yes, but</b> the country is quieter.</span>
      <span>The bus is <b>cheaper than</b> a car.</span><span><b>I agree.</b> / <b>I don&rsquo;t agree.</b></span>
    </div>
  </div>"""
    who = "".join(f'<tr><td class="q">Who {w}</td><td></td></tr>' for w in WHO)
    page5 = f"""  <div class="task">
    <h2>C. Who is number 1 in our group?</h2>
    <p class="how">Ask the people <b>at your table</b>. Write a name. Then write 2 sentences: <i>Ana has the oldest phone in our group.</i></p>
    <table class="who">{who}</table>
    {p.ln("<i>answers vary: check the + -est / the most</i>", 2)}
  </div>
  <div class="task">
    <h2>D. Talk together</h2>
    <p class="how">Answer with a <b>full sentence</b>. Then ask: <i>&ldquo;Why?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>What is the best food from your country?</li>
      <li>What is the most expensive thing in Boston?</li>
      <li>Is your city here bigger or smaller than your hometown?</li>
      <li>What is the best time of year here? Why?</li>
    </ol>
  </div>
  <div class="task">
    <h2>E. Say it to your teacher</h2>
    <p class="how">Write one sentence with <b>-er / more &hellip; than</b> and one with <b>the -est / the most</b>. Read them to your teacher.</p>
    <div class="gline"><b>than</b>{p.ln("<i>answers vary</i>")}</div>
    <div class="gline"><b>the</b>{p.ln("<i>answers vary</i>")}</div>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "Which is better? &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


# (food, last year, this year)
PRICES = [("Eggs (12)", 3.50, 4.20), ("Milk (1 gallon)", 4.40, 4.29), ("Bread (1 loaf)", 2.80, 3.10),
          ("Coffee (1 lb)", 6.90, 8.40), ("Chicken (1 lb)", 2.10, 2.10)]


def chart_svg():
    w, h, left, top, bottom = 660, 250, 150, 18, 30
    scale = (w - left - 60) / 9.0
    rows = []
    bh = 16
    for i, (food, a, b) in enumerate(PRICES):
        y = top + i * 44
        rows.append(f'<text x="{left - 10}" y="{y + 20}" text-anchor="end" font-size="15" font-weight="700">{food}</text>'
                    f'<rect x="{left}" y="{y}" width="{a * scale:.1f}" height="{bh}" fill="#b9c4d6"/>'
                    f'<text x="{left + a * scale + 6:.1f}" y="{y + 13}" font-size="13">${a:.2f}</text>'
                    f'<rect x="{left}" y="{y + bh + 2}" width="{b * scale:.1f}" height="{bh}" fill="#1f4e8c"/>'
                    f'<text x="{left + b * scale + 6:.1f}" y="{y + bh + 15}" font-size="13" font-weight="700">${b:.2f}</text>')
    legend = (f'<rect x="{left}" y="{h - 16}" width="14" height="12" fill="#b9c4d6"/><text x="{left + 20}" y="{h - 6}" font-size="13">December 2025</text>'
              f'<rect x="{left + 140}" y="{h - 16}" width="14" height="12" fill="#1f4e8c"/><text x="{left + 160}" y="{h - 6}" font-size="13" font-weight="700">December 2026</text>')
    return (f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif" '
            f'role="img" aria-label="Bar chart of five grocery prices, last year and this year">'
            f'<line x1="{left}" y1="{top - 6}" x2="{left}" y2="{h - bottom}" stroke="#333" stroke-width="1.5"/>{"".join(rows)}{legend}</svg>')


def read(p, key):
    page6 = f"""  <div class="paper">
    <div class="mast"><span>EAST SIDE WEEKLY</span><span>December 14, 2026 &middot; Practice article: the newspaper, people, and prices are made up</span></div>
    <h1 class="hl">Your Grocery Bill: What Costs More This Year?</h1>
  </div>
  <div class="words" style="margin-bottom:8px;">
    <b>Words to know</b>
    <div class="wgrid">
      <div><b>grocery bill</b> = what you pay for food</div>
      <div><b>shopper</b> = a person who shops</div>
      <div><b>a dozen</b> = 12</div>
      <div><b>rise</b> = go up</div>
      <div><b>economist</b> = an expert on money and the economy</div>
      <div><b>paycheck</b> = the money you get for your work</div>
    </div>
  </div>
  <div class="chartbox">{chart_svg()}</div>
  <div class="paras">
  <p>Shoppers in East Side are talking about prices. &ldquo;My <b>grocery bill</b> is bigger than last year,&rdquo; says Maria Lopes, a mother of three. &ldquo;I buy the same food, but I spend more.&rdquo;</p>
  <p>The <i>East Side Weekly</i> checked prices at three local stores in December 2025 and December 2026. Some foods are more expensive now. Coffee had the biggest change. A pound of coffee costs $1.50 more than last year.</p>
  <p>Eggs are also more expensive. <b>A dozen</b> eggs costs $4.20 now. Last year, it was $3.50. But not everything costs more. Milk is a little cheaper than last year, and chicken is the same price.</p>
  <p>Why do prices change? When prices <b>rise</b> for a long time, <b>economists</b> call it inflation. Weather, gas prices, and wages can all change food prices. &ldquo;When coffee farms have a bad year, there is less coffee, so it is more expensive,&rdquo; says a local store owner.</p>
  <p>Wages matter too. If prices go up faster than wages, families can buy less with their <b>paychecks</b>. Maria has a plan. &ldquo;I compare unit prices, and I buy rice and beans in bulk. It&rsquo;s the cheapest way to feed my family.&rdquo;</p>
  </div>"""
    page7 = f"""  <p class="how"><b>First:</b> Read the article alone. Read it <b>2 times</b>. Look at the chart too. Then answer.</p>
  <div class="task">
    <h2>Part A: Read the chart and the article</h2>
    <p class="how">The answers are not always in one sentence. <b>&#9733;</b> = challenge.</p>
    <ol class="items">
      <li><b class="n">1.</b> Which food costs the most now? How much? {p.b("coffee, $8.40", "long")}</li>
      <li><b class="n">2.</b> Which food had the biggest change? {p.b("coffee (+$1.50)", "long")}</li>
      <li><b class="n">3.</b> Which food is cheaper than last year? {p.b("milk", "long")}</li>
      <li><b class="n">4.</b> Which food is the same price? {p.b("chicken", "long")}</li>
      <li><b class="n">5.</b> <b>&#9733;</b> Is bread cheaper or more expensive now? By how much?{p.ln("More expensive: $3.10 &minus; $2.80 = 30&cent; more.")}</li>
      <li><b class="n">6.</b> <b>&#9733;</b> Why can coffee get more expensive? <span class="small">(&para;4)</span>{p.ln("When coffee farms have a bad year, there is less coffee.")}</li>
      <li><b class="n">7.</b> <b>&#9733;</b> What does Maria do to save money? <span class="small">(&para;5)</span>{p.ln("She compares unit prices and buys rice and beans in bulk.")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>Part B: Find the grammar</h2>
    <p class="how">Find these in the article. Write the word.</p>
    <table class="pick" style="font-size:17px;">
      <tr><th>-er than</th><th>more &hellip; than</th><th>the -est</th><th>a little / the same</th></tr>
      <tr>{p.td("bigger")}{p.td("more expensive")}{p.td("the biggest / the cheapest")}{p.td("a little cheaper / the same price")}</tr>
    </table>
  </div>
  <div class="task">
    <h2>Part C: Talk together</h2>
    <ol class="items">
      <li><b class="n">1.</b> What costs more now than last year for you?</li>
      <li><b class="n">2.</b> What is the cheapest way to eat well? <i>&ldquo;The cheapest way is &hellip;&rdquo;</i></li>
    </ol>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to talk about your own money.</p>"""
    sub = "News: grocery prices &middot; with your group"
    return L.page("story", "STATION 3: READ", sub, 6, page6, key) + L.page("rd", "STATION 3: READ", sub, 7, page7, key)


# Review game: category -> [(points, question, answer)]
GAME = [
    ("V2 / V3", [(100, "V2 of <b>buy</b>?", "bought"), (200, "V3 of <b>speak</b>?", "spoken"),
                 (300, "V2 <b>and</b> V3 of <b>drink</b>?", "drank, drunk")]),
    ("If &hellip;", [(100, "Finish: If it rains, I ___ (take) the bus.", "will take / take"),
                     (200, "Fix it: <i>If I will see her, I will tell her.</i>", "If I <b>see</b> her, I will tell her."),
                     (300, "Zero or first? <i>If you heat ice, it melts.</i>", "zero (always true)")]),
    ("Can / should / must", [(100, "Fix it: <i>She can to swim.</i>", "She can swim."),
                             (200, "A rule or a good idea? You ___ wear a seatbelt.", "must (a rule)"),
                             (300, "Give advice with <b>should</b>: &ldquo;I&rsquo;m always tired.&rdquo;", "You should + V1 (any good idea)")]),
    ("Have you ever", [(100, "Make a question: <i>ever / you / eaten / have / sushi</i>", "Have you ever eaten sushi?"),
                       (200, "Answer short: Have you ever seen snow?", "Yes, I have. / No, I haven&rsquo;t."),
                       (300, "Fix it: <i>Have you ever went to New York?</i>", "Have you ever <b>been</b> to New York?")]),
    ("Good at", [(100, "I&rsquo;m good at (cook / cooking).", "cooking"),
                 (200, "Fix it: <i>He is good in fixing cars.</i>", "He is good <b>at</b> fixing cars."),
                 (300, "Say 2 things you are good at.", "good at + V-ing, 2 times")]),
    ("For / since", [(100, "___ 2019", "since"), (200, "___ six months", "for"),
                     (300, "Today is Dec. 15, 2026. <i>since 2020</i> = for how long?", "for six years")]),
    ("Bigger / better", [(100, "Comparative of <b>cheap</b>?", "cheaper"), (200, "Superlative of <b>good</b>?", "the best"),
                         (300, "Fix it: <i>Boston is more bigger than my town.</i>", "Boston is <b>bigger than</b> my town.")]),
]


def game(p, key):
    grid = "".join(f"<tr><td class=\"cat\">{c}</td>" + "".join(f"<td>{pts}</td>" for pts, _, _ in qs) + "</tr>" for c, qs in GAME)
    page8 = f"""  <div class="task">
    <h2>How to play</h2>
    <ol class="items" style="list-style:none;">
      <li><b class="n">1.</b> Choose a <b>judge</b>. The judge holds the <b>answer sheet</b> (page 2 of the game sheet) and doesn&rsquo;t play.</li>
      <li><b class="n">2.</b> Take turns. Choose a category and points: <i>&ldquo;For / since, 200, please!&rdquo;</i></li>
      <li><b class="n">3.</b> The judge reads the question. You answer <b>out loud</b>.</li>
      <li><b class="n">4.</b> Right? You get the points. Wrong? Anyone can try for the points.</li>
      <li><b class="n">5.</b> Cross off the square below. <b>New judge</b> every 5 questions.</li>
    </ol>
  </div>
  <div class="task">
    <h2>Cross off the squares</h2>
    <table class="board"><tr><th>Category</th><th>100</th><th>200</th><th>300</th></tr>{grid}</table>
  </div>
  <div class="task">
    <h2>Scoreboard</h2>
    <table class="pick"><tr><th style="width:34%;">Name</th><th>Points (add them up!)</th><th style="width:18%;">Total</th></tr>
    {'<tr><td style="height:34px;"></td><td></td><td></td></tr>' * 5}</table>
  </div>"""
    checks = "".join(f'<span>&#9744; {c}</span>' for c, _ in GAME)
    page9 = f"""  <div class="task">
    <h2>My fall review</h2>
    <p class="how"><b>Use your own ideas.</b> Finish the sentences about <b>your</b> fall in English class.</p>
    <div class="textbox" style="line-height:2.3;">
      This fall, I have learned {p.b("<i>answers vary: have + V3</i>", "long")}.<br>
      Now I can {p.b("<i>answers vary: can + V1</i>", "long")} in English.<br>
      I&rsquo;m good at {p.b("<i>answers vary: + V-ing</i>", "long")}, but I&rsquo;m not good at {p.b("<i>+ V-ing</i>")} yet.<br>
      The hardest thing for me was {p.b("<i>answers vary</i>", "long")}.<br>
      English is easier than {p.b("<i>answers vary</i>")} now. &#128522;<br>
      Over the break, I should {p.b("<i>answers vary: should + V1</i>", "long")}.<br>
      If I practice every week, I will {p.b("<i>answers vary: will + V1</i>", "long")}.
    </div>
  </div>
  <div class="task">
    <h2>What do you want to practice more?</h2>
    <p class="how">Check <b>2</b>. Tell your teacher!</p>
    <div class="checks">{checks}</div>
  </div>
  <div class="task">
    <h2>Share</h2>
    <p class="how">Read your fall review to the person next to you. Then say one thing you liked about theirs.</p>
  </div>"""
    sub = "fall review &middot; with your group"
    return L.page("rd", "STATION 4: REVIEW GAME", sub, 8, page8, key) + L.page("rd", "STATION 4: REVIEW GAME", sub, 9, page9, key)


EXTRA_CSS = """
  .debates { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .debates div { border: 2px solid #000; border-radius: 8px; padding: 8px; text-align: center; font-size: 17px; font-weight: bold; }
  .paper { border-top: 4px double #000; border-bottom: 1.5px solid #000; margin-bottom: 8px; }
  .mast { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; border-bottom: 1px solid #000; }
  .mast span:first-child { font-weight: bold; letter-spacing: 2px; font-size: 14px; }
  .hl { font-size: 25px; line-height: 1.15; padding: 6px 0; }
  .chartbox { border: 1.5px solid #000; padding: 4px 8px; margin-bottom: 8px; }
  .chartbox svg { width: 100%; height: 2.2in; display: block; }
  .story .paras p { font-size: 16.5px; margin-bottom: 7px; }
  table.board { width: 100%; border-collapse: collapse; font-size: 17px; }
  table.board th, table.board td { border: 1.5px solid #000; padding: 4px 8px; text-align: center; }
  table.board td.cat { text-align: left; font-weight: bold; width: 40%; }
  .checks { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 17px; }
"""


def packet(key):
    p = L.P(key)
    body = (L.cover(14, "Tuesday, December 15, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + read(p, key) + game(p, key)
            + L.verb_charts(10, SPEND, "she", SELL, "I", key))
    return L.doc("Week 14 Tuesday Stations Packet" + (" (Answer Key)" if key else ""), L.packet_css(key) + EXTRA_CSS, body)


GAME_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #111; background: #fff;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Station 4 game sheet: print 1 per table (color). Page 1 = questions face up. Page 2 = judge's answers. */
  .page { width: 11in; height: 8.5in; padding: 0.4in 0.45in; display: flex; flex-direction: column; page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter landscape; margin: 0; } }
  .top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .top h1 { font-size: 30px; }
  .top span { font-size: 14px; }
  .grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-template-rows: auto repeat(3, 1fr); gap: 6px; }
  .cat { background: #1f4e8c; color: #fff; font-weight: bold; text-align: center; border-radius: 8px; padding: 8px 4px; font-size: 16px; display: grid; place-items: center; }
  .q { border: 2px solid #1f4e8c; border-radius: 8px; padding: 7px; font-size: 18px; line-height: 1.25; display: flex; flex-direction: column; gap: 4px; }
  .q .pts { font-size: 22px; font-weight: bold; color: #c98f00; }
  .judge h1 { color: #b3261e; }
  .judge .q { border-color: #b3261e; }
  .judge .cat { background: #b3261e; }
  .judge .a { font-weight: bold; color: #b3261e; font-size: 17px; }
  .judge .q { font-size: 15px; }
"""


def game_doc():
    def board(judge):
        cells = "".join(f'<div class="cat">{c}</div>' for c, _ in GAME)
        for r in range(3):
            for _, qs in GAME:
                pts, q, a = qs[r]
                extra = f'<div class="a">&rarr; {a}</div>' if judge else ""
                cells += f'<div class="q"><span class="pts">{pts}</span><span>{q}</span>{extra}</div>'
        return cells
    p1 = f"""<section class="page">
  <div class="top"><h1>Fall Review Game</h1><span>Station 4 &middot; The judge reads the question. You answer out loud.</span></div>
  <div class="grid">{board(False)}</div>
</section>"""
    p2 = f"""<section class="page judge">
  <div class="top"><h1>Judge&rsquo;s Answers (don&rsquo;t show!)</h1><span>Fold this page back. Other good answers can be OK too. Ask your teacher.</span></div>
  <div class="grid">{board(True)}</div>
</section>"""
    return L.doc("Week 14 Station 4 Fall Review Game", GAME_CSS, p1 + p2)


def leader_guide():
    hear = "".join(f'<tr><td class="n">{i}</td><td>{s}</td><td>{"compare 2" if a == "C" else "number 1"}</td></tr>' for i, (s, a) in enumerate(HEAR, 1))
    top = L.leader_top(14, "12/15/26", STATIONS, [
        "<b>This week:</b> practice <b>comparatives + superlatives</b> (started Thursday). <b>No quiz</b>: verb review <b>buy, sell, spend</b>. Last Tuesday before break (12/22 is review + party).",
        "<b>Before class:</b> print the game sheet in color (1 per table). Page 2 is the judge&rsquo;s answers: fold it back.",
        "<b>Floating:</b> no Real World table this week. Start each block at <b>Station 3</b> (help read the chart: light bar = last year, dark = this year). Then Station 4 (check the judge is reading answers), then Station 1.",
        "<b>Moves:</b> 3-minute warning, then move. <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (Which is better?)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p>Goal: use <b>-er / more &hellip; than</b> to give reasons, and <b>the -est / the most</b> for number 1. Pronunciation: <b>than</b> is weak (&ldquo;thn&rdquo;). Common errors: <i>more cheaper</i>, <i>more better</i>, <i>the most big</i>, <i>bigger that</i>.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>Quiet than.</b> Model: <i>The BUS is CHEAPer thn a TAXi.</i> Everyone repeats.</td></tr>
    <tr><td>4 min</td><td><b>A. Listen.</b> Read the sentences below. They circle compare 2 or number 1.</td></tr>
    <tr><td>9 min</td><td><b>B. Debate.</b> 2&ndash;3 topics. Each person: a side + 2 reasons. Keep it friendly and fast.</td></tr>
    <tr><td>5 min</td><td><b>C. Who is number 1?</b> At the table. Then 2 sentences each.</td></tr>
    <tr><td>4 min</td><td><b>D + E.</b> Talk, then each person reads you their two sentences.</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Read these sentences</h2>
      <table class="script">{hear}</table>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li><i>more cheaper</i> &rarr; short word: <b>-er</b> only. Long word: <b>more</b> only. Never both.</li>
        <li><i>good &rarr; better &rarr; the best</i>, <i>bad &rarr; worse &rarr; the worst</i>.</li>
        <li>Fix <b>one</b> thing, then move on.</li>
      </ul>
      <div class="recast">Learner: &ldquo;The city is more better.&rdquo;<br>You: &ldquo;The city is <b>better</b>? Why is it better?&rdquo;</div>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 14 &middot; Tue 12/15/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. Words:</b> 1 cost of living &middot; 2 wages &middot; 3 unemployed &middot; 4 interest rate &middot; 5 Inflation &middot; 6 economy</p>
        <p><b>2. Forms:</b> 1 cheaper &middot; 2 the most expensive &middot; 3 better &middot; 4 the biggest &middot; 5 smaller</p>
        <p><b>3. Compare:</b> answers vary. Check <i>-er than / the best / more &hellip; than</i>.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> buy, buys, buying, bought, bought &middot; sell, sells, selling, sold, sold &middot; spend, spends, spending, spent, spent</p>
        <p><b>5. Right form:</b> 1 spends &middot; 2 buying &middot; 3 sell &middot; 4 buy &middot; 5 spending &middot; 6 sell &middot; 7 spent &middot; 8 sold</p>
        <p><b>6. Your turn:</b> answers vary: <i>I bought &hellip; / A taxi isn&rsquo;t cheaper than &hellip; / Which &hellip; is the best?</i></p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i} {'compare 2' if a == 'C' else 'number 1'}" for i, (_, a) in enumerate(HEAR, 1))} &middot; <b>B&ndash;E:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: READ, Grocery prices (pages 6&ndash;7)</h2>
    <p><b>A:</b> 1 coffee, $8.40 &middot; 2 coffee (+$1.50) &middot; 3 milk ($4.40 &rarr; $4.29) &middot; 4 chicken &middot; &#9733;5 more expensive, 30&cent; &middot; &#9733;6 a bad year on coffee farms = less coffee &middot; &#9733;7 compares unit prices, buys rice and beans in bulk</p>
    <p><b>B:</b> -er than: <i>bigger than</i> &middot; more &hellip; than: <i>more expensive</i> &middot; the -est: <i>the biggest change, the cheapest way</i> &middot; also: <i>a little cheaper, the same price, faster than</i></p>
    <p style="font-size:12px;">The newspaper, people, and prices are made up for practice; the article says so. Eggs +$0.70, bread +$0.30, coffee +$1.50, milk &minus;$0.11, chicken $0.</p>
  </div>
  <div class="box">
    <h2>Station 4: REVIEW GAME (pages 8&ndash;9 + game sheet)</h2>
    <p>The judge&rsquo;s answers are on page 2 of the game sheet. <b>Fall review:</b> answers vary. Look for <i>have + V3, can + V1, good at + V-ing, easier than, should + V1, If &hellip; will</i>. The &ldquo;practice more&rdquo; checks are useful for planning January review.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (she + spend, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (I + sell):</b> sell, sells, selling, sold, sold &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("I", SELL))}</p>
  </div>
</section>"""
    return L.doc("Week 14 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


if __name__ == "__main__":
    outputs = {
        f"{STEM}-packet.html": (packet(False), 10),
        f"{STEM}-packet-key.html": (packet(True), 10),
        f"{STEM}-leader-guide.html": (leader_guide(), 2),
        f"{STEM}-review-game.html": (game_doc(), 2),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
