#!/usr/bin/env python3
"""Week 13 Tuesday stations, Tue 12/8/26: practice How long...? + for / since (started Thu 12/3).

Quiz verbs: eat, drink. Vocab: groceries (run out of, stock up on, buy in bulk,
unit price, serving size, go bad). Stations: 1 WARM-UP, 2 SPEAK (How long have you...?
interviews; quiet "for"), 3 WRITE (My story: then and now), 4 REAL WORLD (shelf tags,
unit price, buy in bulk?).

    python3 build-week13-stations.py
writes the HTML and PDFs next to this file. The store, people, and prices are made up.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
import stations_lib as L  # noqa: E402

STEM = "week13-day1-2026-12-08"
EAT = ("eat", "eats", "eating", "ate", "eaten")
DRINK = ("drink", "drinks", "drinking", "drank", "drunk")
STATIONS = [
    ("WARM-UP", "On your own. Check with a partner. A teacher will visit.", "Pages 2&ndash;3"),
    ("SPEAK", "<i>How long have you&hellip;?</i> With a teacher.", "Pages 4&ndash;5"),
    ("WRITE", "On your own, then a partner. A teacher will visit.", "Pages 6&ndash;7"),
    ("REAL WORLD", "With your group. A teacher will visit.", "Pages 8&ndash;9 + 2 color pages on the table"),
]


def warmup(p, key):
    fs = [("I have studied English {} two years.", "for"), ("She hasn&rsquo;t worked at the clinic {} last spring.", "since"),
          ("We have known our neighbors {} we moved here.", "since"), ("Has he had his job {} six months?", "for"),
          ("I haven&rsquo;t seen my family {} 2019.", "since")]
    li1 = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a, "short"))}</li>' for i, (t, a) in enumerate(fs, 1))
    sf = [("She has worked at the store since 2016.", "ten years"), ("I haven&rsquo;t called my sister since August.", "four months"),
          ("We have known our landlord since 2021.", "five years"), ("He has studied English since last December.", "one year")]
    li2 = "".join(f'<li><b class="n">{i}.</b> {t} &rarr; for {p.b(a)}</li>' for i, (t, a) in enumerate(sf, 1))
    page2 = f"""  <div class="task">
    <h2>1. For or since?</h2>
    <p class="how">Write <b>for</b> (a length of time) or <b>since</b> (a starting point).</p>
    <p class="example">Example: I have lived here <u>since</u> 2021. &middot; I have lived here <u>for</u> five years.</p>
    <ol class="items">{li1}</ol>
  </div>
  <div class="task">
    <h2>2. Since &rarr; for</h2>
    <p class="how">Today is <b>December 8, 2026</b>. Change <b>since</b> to <b>for</b>. Write how long.</p>
    <p class="example">Example: I have lived here since 2024. &rarr; for <u>two years</u></p>
    <ol class="items">{li2}</ol>
  </div>
  <div class="task">
    <h2>3. Finish the sentence about you</h2>
    <p class="how"><b>You make up the ending.</b> Use your own ideas. Use <b>for</b> or <b>since</b>.</p>
    <div class="own"><b>Example:</b> I have lived in my apartment <span class="u">since 2022</span>. &middot; Other good answers: <span class="u">for four years</span> &middot; <span class="u">since my son was born</span></div>
    <ol class="items">
      <li><b class="n">1.</b> I have lived in my home {p.b("<i>answers vary: for / since &hellip;</i>", "long")}.</li>
      <li><b class="n">2.</b> I have known my best friend {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">3.</b> How long have you {p.b("<i>answers vary: + V3</i>", "long")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every morning</b>, my husband {} two cups of coffee. (drink)", "drinks"),
        ("<b>Right now</b>, the kids are {} rice and beans. (eat)", "eating"),
        ("<b>Yesterday</b>, we didn&rsquo;t {} any milk. (drink)", "drink"),
        ("<b>Last night</b>, what did you {} for dinner? (eat)", "eat"),
        ("She doesn&rsquo;t {} meat <b>every day</b>. (eat)", "eat"),
        ("<b>Right now</b>, is he {} a glass of water? (drink)", "drinking"),
        ("We <b>have</b> {} all the bread. It&rsquo;s gone! (eat)", "eaten"),
        ("<b>Have</b> you {} any water today? (drink)", "drunk"),
    ]
    lis = "".join(f'<li><b class="n">{i}.</b> {t.format(p.b(a))}</li>' for i, (t, a) in enumerate(items, 1))
    page3 = f"""  <div class="task">
    <h2>4. Verb forms of the week</h2>
    <p class="how">Write the other forms of <b>eat</b> and <b>drink</b>. <i>Eat</i> and <i>drink</i> are on this week&rsquo;s quiz!</p>
    {L.forms_table([EAT, DRINK], p)}
  </div>
  <div class="task">
    <h2>5. Use the right form</h2>
    <p class="how">Look at the <b>bold</b> clue words. Write the correct form of <b>eat</b> or <b>drink</b>. Use your chart.</p>
    <ol class="items">{lis}</ol>
  </div>
  <div class="task">
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>Every morning</b> + drink</p>
    <p class="ideas">Ideas: coffee &middot; tea with milk &middot; a big glass of water &middot; juice</p>
    {p.ln("<i>answers vary: Every morning, I drink tea with milk.</i>")}
    <p class="prompt"><b>Last night</b> + eat <b>+ not</b></p>
    <p class="ideas">Ideas: dinner &middot; meat &middot; dessert &middot; a big meal</p>
    {p.ln("<i>answers vary: Last night, I didn&rsquo;t eat dessert.</i>")}
    <p class="prompt"><b>How long</b> + have you<b>?</b></p>
    <p class="ideas">Ideas: lived here &middot; had your phone &middot; known your best friend &middot; worked at your job</p>
    {p.ln("<i>answers vary: How long have you had your phone?</i>")}
  </div>"""
    return (L.page("wu3", "STATION 1: WARM-UP", "on your own", 2, page2, key)
            + L.page("wu3", "STATION 1: WARM-UP", "on your own", 3, page3, key))


HEAR = [("for", "3 years"), ("since", "Monday"), ("for", "a long time"), ("since", "2019"),
        ("since", "I was a kid"), ("for", "two weeks"), ("since", "last summer"), ("for", "six months")]
INTERVIEW = ["lived in this city", "had your phone", "known your best friend", "studied English",
             "been in this class", "had your oldest shoes"]


def speak(p, key):
    hear = "".join(f'<li><b class="n">{i}.</b> I&rsquo;ve lived here _____ &hellip; <span class="cc">{p.circ("for", a == "for")} / {p.circ("since", a == "since")}</span></li>'
                   for i, (a, _) in enumerate(HEAR, 1))
    rows = "".join(f'<tr><td class="q">How long have you {q}?</td><td></td><td></td></tr>' for q in INTERVIEW)
    page4 = f"""  <h2>Quiet <i>for</i>, loud time</h2>
  <div class="rhythm">
    <div><div class="big" style="font-size:22px;">How <b>LONG</b> have you <b>LIVED</b> here?</div><p><b>How long</b> and the <b>verb</b> are loud. <i>have you</i> is fast: &ldquo;h&rsquo;v you.&rdquo;</p></div>
    <div><div class="big" style="font-size:22px;">I&rsquo;ve lived here for <b>SIX YEARS</b>.</div><p><b>for</b> is quiet and short: &ldquo;fer.&rdquo; The <b>time</b> is loud. <b>since</b> is clear: <i>since TWO-thousand NINETEEN</i>.</p></div>
  </div>
  <p class="how"><b>Try it:</b> Tap the table on the loud words. <i>I&rsquo;ve lived here fer SIX YEARS.</i></p>
  <div class="task">
    <h2>A. Listen: for or since?</h2>
    <p class="how">Your teacher reads the end of the sentence. Is it <b>for</b> or <b>since</b>? Circle it. Then write the time you hear.</p>
    <ol class="items listen2">{hear}</ol>
  </div>
  <div class="task">
    <h2>B. Around the table</h2>
    <p class="how">Go around fast. Each person says: <i>&ldquo;I&rsquo;ve lived here for ___.&rdquo;</i> Then again with <i>since</i>. Keep <b>for</b> quiet!</p>
  </div>
  <div class="task">
    <h2>C. Interview your table</h2>
    <p class="how">Ask the people <b>at your table</b>. Write a name and the answer. Answer with <b>for</b> or <b>since</b>.</p>
    <table class="who"><tr><th style="text-align:left;padding:4px 10px;">Question</th><th>Name</th><th>Answer</th></tr>{rows}</table>
  </div>"""
    page5 = f"""  <div class="task">
    <h2>D. Read aloud with a partner</h2>
    <p class="how">A job interview at a restaurant. <b>A</b> = manager. <b>B</b> = you. Then <b>switch</b>.</p>
    <div class="tip" style="font-size:18px; line-height:1.7;">
      <b>A:</b> So, how long have you worked as a cook?<br>
      <b>B:</b> I&rsquo;ve worked as a cook for eight years.<br>
      <b>A:</b> Great. And how long have you lived in Boston?<br>
      <b>B:</b> I&rsquo;ve lived here since 2021.<br>
      <b>A:</b> Have you ever worked in a big kitchen?<br>
      <b>B:</b> Yes, I have. I worked in a hotel kitchen for three years.<br>
      <b>A:</b> What are you good at?<br>
      <b>B:</b> I&rsquo;m good at cooking fast, and I&rsquo;m good at working with a team.
    </div>
  </div>
  <div class="task">
    <h2>E. Talk together</h2>
    <p class="how">Ask your group. Answer with a <b>full sentence</b> with <b>for</b> or <b>since</b>. Then ask: <i>&ldquo;Really? Why?&rdquo;</i></p>
    <ol class="read-aloud">
      <li>How long have you had your phone? Do you like it?</li>
      <li>How long have you known the oldest friend you have?</li>
      <li>What food have you eaten since you were a child?</li>
      <li>How long have you studied English? What helps you most?</li>
    </ol>
  </div>
  <div class="task">
    <h2>F. Say it to your teacher</h2>
    <p class="how">Write one sentence with <b>for</b> and one with <b>since</b>. Read them to your teacher. Quiet <b>for</b>!</p>
    <div class="gline"><b>for</b>{p.ln("<i>answers vary</i>")}</div>
    <div class="gline"><b>since</b>{p.ln("<i>answers vary</i>")}</div>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "How long have you&hellip;? &middot; with a teacher"
    return L.page("", "STATION 2: SPEAK", sub, 4, page4, key) + L.page("", "STATION 2: SPEAK", sub, 5, page5, key)


def write(p, key):
    page6 = f"""  <p class="how" style="font-size:17px;"><b>Today you write about your life: then and now.</b> Choose any part of your life: your home, your job, your family, a hobby, this class. You don&rsquo;t have to write about anything private.</p>
  <div class="task">
    <h2>Step 1: Read Samira&rsquo;s story</h2>
    <div class="tl">
      <svg viewBox="0 0 700 74" xmlns="http://www.w3.org/2000/svg" font-family="Atkinson Hyperlegible, Arial, sans-serif">
        <line x1="20" y1="30" x2="680" y2="30" stroke="#111" stroke-width="3"/>
        <polygon points="680,24 694,30 680,36" fill="#111"/>
        {"".join(f'<circle cx="{x}" cy="30" r="8" fill="#111"/><text x="{x}" y="16" text-anchor="middle" font-size="15" font-weight="700">{y}</text><text x="{x}" y="54" text-anchor="middle" font-size="14">{a}</text><text x="{x}" y="70" text-anchor="middle" font-size="14">{b}</text>' for x, y, a, b in [(70, "2015", "got", "married"), (230, "2019", "moved to", "Boston"), (390, "2021", "started at", "the hospital"), (550, "2025", "started", "ESOL class")])}
        <text x="660" y="16" text-anchor="end" font-size="15" font-weight="700">NOW</text>
      </svg>
    </div>
    <div class="model">
      I moved to Boston in 2019. I <b>have lived</b> here <b>for</b> seven years. At first, I didn&rsquo;t have a job, and I missed my family a lot. In 2021, I started work in a hospital cafeteria. I <b>have worked</b> there <b>since</b> 2021. I am good at cooking, so now I help the cook. I got married in 2015, so my husband and I <b>have been</b> married <b>for</b> eleven years. We <b>have had</b> our cat, Luna, <b>since</b> 2023. Last year, I started my ESOL class. I <b>have studied</b> English <b>for</b> one year, and my English is better every month.
    </div>
    <div class="gram3" style="margin-top:6px;">
      <div><b>In / Last year</b> + V2<br><i>I moved here in 2019.</i></div>
      <div><b>have + V3 + for</b><br>a length of time: <i>for 7 years</i></div>
      <div><b>have + V3 + since</b><br>a starting point: <i>since 2021</i></div>
    </div>
  </div>
  <div class="task">
    <h2>Step 2: Make your timeline</h2>
    <p class="how">Write 4 years (or dates) and what started. <b>Use your own life.</b> Ideas: moved &middot; started a job &middot; met my friend &middot; had my first child &middot; got my car &middot; started this class</p>
    <div class="mytl">
      {"".join(f'<div><span class="dot"></span>{p.b("<i>year</i>", "short")}<br>{p.b("<i>what started</i>")}</div>' for _ in range(4))}
      <div class="now"><span class="dot"></span><b>NOW</b></div>
    </div>
  </div>"""
    page7 = f"""  <div class="task">
    <h2>Step 3: Build your sentences</h2>
    <p class="how">Use your timeline. Write the year sentence, then the <b>for / since</b> sentence.</p>
    <table class="pick" style="font-size:16px;">
      <tr><th style="width:44%;">In ___, I ___ (V2).</th><th>I have ___ (V3) for / since ___.</th></tr>
      <tr><td><i>In 2021, I started at the hospital.</i></td><td><i>I have worked there since 2021.</i></td></tr>
      {f'<tr><td>{p.b("<i>answers vary</i>", "long")}</td><td>{p.b("<i>answers vary</i>", "long")}</td></tr>' * 3}
    </table>
  </div>
  <div class="task">
    <h2>Step 4: Write your story</h2>
    <p class="how">Write <b>8 sentences or more</b>. Start: <i>&ldquo;I &hellip; in &hellip;&rdquo;</i> End with something about <b>now</b>.</p>
    {p.ln("<i>answers vary: check the list below</i>", 10)}
  </div>
  <div class="task" style="margin-bottom:6px;">
    <h2>Step 5: Check, then share</h2>
    <div class="checks">
      <span>&#9744; 2 sentences with <b>for</b></span><span>&#9744; 2 sentences with <b>since</b></span>
      <span>&#9744; 1 sentence with <b>in</b> + a year + V2</span><span>&#9744; have / has + <b>V3</b> (not V2!)</span>
    </div>
    <p class="how" style="margin-top:4px;"><b>Partner:</b> read your story to a partner. Your partner asks you one question: <i>&ldquo;How long have you &hellip;?&rdquo;</i></p>
  </div>"""
    sub = "My story: then and now"
    return L.page("rd wr", "STATION 3: WRITE", sub, 6, page6, key) + L.page("rd wr", "STATION 3: WRITE", sub, 7, page7, key)


TF = [("The bigger package is always the better deal.", "F"),
      ("The unit price tells you the price for one pound, ounce, or egg.", "T"),
      ("The 20-lb bag of rice is cheaper per pound.", "T"),
      ("Bananas are on sale this week.", "N"),
      ("The 18-pack of eggs costs less per egg.", "F"),
      ("The store sells organic milk.", "N")]
DEALS = [("Rice", "2 lb, $3.49", "20 lb, $21.99", "20 lb", "$1.75/lb vs $1.10/lb"),
         ("Cereal", "12 oz, $3.99", "24 oz, $6.49", "24 oz", "33&cent;/oz vs 27&cent;/oz"),
         ("Olive oil", "17 oz, $8.99", "34 oz, $19.49", "17 oz", "53&cent;/oz vs 57&cent;/oz. Small is cheaper!"),
         ("Eggs", "12, $3.99", "18, $6.29", "12", "33&cent; vs 35&cent; an egg. Small is cheaper!")]
FAMILIES = [("Mr. Ortiz", "the gallon of milk", "No", "He lives alone. It will go bad before he drinks it."),
            ("The Diallo family", "the 20-lb bag of rice", "Yes", "6 people eat rice every day. Rice doesn&rsquo;t go bad fast."),
            ("Rosa", "bananas for 3 weeks", "No", "Bananas go bad in a few days.")]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    deals = "".join(f'<tr><td class="t">{n}</td><td class="c">{p.circ(a, w == a.split(",")[0])}</td><td class="c">{p.circ(b, w == b.split(",")[0])}</td>{p.td(why)}</tr>'
                    for n, a, b, w, why in DEALS)
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages. Start with <b>page 1</b> (the shelf tags). Read them <b>together</b>. You can use your phone calculator. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Read a shelf tag</h2>
    <p class="how">Look at the tag for the <b>small</b> bag of rice.</p>
    <ol class="items">
      <li><b class="n">1.</b> What is the price? {p.b("$3.49", "short")} &emsp; How big is the bag? {p.b("2 lb", "short")}</li>
      <li><b class="n">2.</b> What is the <b>unit price</b>? {p.b("$1.75 per pound", "long")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. Which is the better deal?</h2>
    <p class="how">Look at the <b>unit price</b> on each tag. Circle the better deal. <b>Careful!</b> Bigger is not always cheaper.</p>
    <table class="pick"><tr><th style="width:16%;">Food</th><th style="width:20%;">Small</th><th style="width:20%;">Big</th><th>Unit prices</th></tr>{deals}</table>
  </div>
  <div class="task">
    <h2>C. True, false, or not on the tags?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the tags, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the tags</th></tr>{tf}</table>
  </div>
  <p class="how bottom"><b>Talk:</b> Do you look at the unit price when you shop? What do you buy in bulk?</p>"""
    fam = "".join(f'<tr><td class="t" style="white-space:normal;">{n}<br><span class="small" style="font-weight:normal;">{it}</span></td>'
                  f'<td class="c">{p.circ("Yes", a == "Yes")} / {p.circ("No", a == "No")}</td>{p.td(w) if key else "<td></td>"}</tr>'
                  for n, it, a, w in FAMILIES)
    page9 = f"""  <p class="how">Now look at <b>page 2</b> on the table: <b>Should they buy in bulk?</b></p>
  <div class="task">
    <h2>D. Should they buy it?</h2>
    <p class="how">A good deal is not good if the food <b>goes bad</b>. Circle <b>Yes</b> or <b>No</b>. Write why.</p>
    <table class="pick tall"><tr><th style="width:28%;">Who &middot; what</th><th style="width:16%;">Buy it?</th><th>Why?</th></tr>{fam}</table>
    <p class="how"><b>&#9733;</b> Kim&rsquo;s family needs 34 ounces of olive oil. What should they buy? How much will they save?</p>
    {p.ln("Two 17-oz bottles: $17.98. The 34-oz bottle is $19.49. They save $1.51.")}
  </div>
  <div class="task">
    <h2>E. Your turn</h2>
    <p class="how"><b>Use your own ideas.</b> Finish the sentences about <b>your</b> home.</p>
    <div class="textbox">
      At my house, we buy {p.b("<i>answers vary</i>")} in bulk because {p.b("<i>answers vary</i>", "long")}.<br>
      We never stock up on {p.b("<i>answers vary</i>")}. If we buy a lot, it will {p.b("<i>go bad</i>")}.<br>
      We often run out of {p.b("<i>answers vary</i>")}.
    </div>
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


EXTRA_CSS = """
  .tl { border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; margin-bottom: 8px; }
  .tl svg { display: block; width: 100%; height: 0.95in; }
  .model { border-left: 5px solid #000; background: #f4f4f4; padding: 8px 12px; font-size: 16.5px; line-height: 1.5; }
  .mytl { display: grid; grid-template-columns: repeat(4, 1fr) 0.5fr; gap: 6px; border-top: 3px solid #000; padding-top: 10px; margin-top: 10px; font-size: 16px; line-height: 2; }
  .mytl > div { position: relative; }
  .mytl .dot { position: absolute; top: -18px; left: 10px; width: 14px; height: 14px; border-radius: 50%; background: #000; }
  .mytl .now .dot { left: 0; }
  .mytl .blank { min-width: 1.4in; }
  .mytl .blank.short { min-width: 0.7in; }
  .wr .line { height: 27px; }
  .checks { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; font-size: 16px; }
"""


def packet(key):
    p = L.P(key)
    body = (L.cover(13, "Tuesday, December 8, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + write(p, key) + real_world(p, key)
            + L.verb_charts(10, EAT, "she", DRINK, "we", key))
    return L.doc("Week 13 Tuesday Stations Packet" + (" (Answer Key)" if key else ""), L.packet_css(key) + EXTRA_CSS, body)


DOC_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif; color: #1b1b1b; background: #fff;
         font-size: 17px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Table copy for the REAL WORLD station: print in color, 2 copies. Made-up store, prices, and people. */
  .page { width: 8.5in; height: 11in; padding: 0.45in 0.55in; display: flex; flex-direction: column; overflow: hidden;
          page-break-after: always; break-after: page; }
  @media screen { body { background: #e6e6e6; padding: 24px 0; } .page { background: #fff; margin: 0 auto 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); } }
  @media print { @page { size: letter portrait; margin: 0; } }
  .station { font-size: 13px; color: #555; text-align: right; margin-bottom: 8px; }
  .h { font-size: 30px; font-weight: bold; color: #b0531c; margin-bottom: 2px; }
  .sub { margin-bottom: 12px; }
  .tags { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 16px; }
  .pair-label { grid-column: 1 / -1; font-size: 19px; font-weight: bold; color: #b0531c; border-bottom: 2px solid #f0d2bd; margin-top: 2px; }
  .tag { display: flex; border: 2px solid #333; border-radius: 4px; overflow: hidden; background: #fff; height: 0.92in; }
  .tag .left { flex: 1; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between; }
  .tag .name { font-size: 16px; font-weight: bold; text-transform: uppercase; }
  .tag .size { font-size: 14px; color: #444; }
  .tag .unit { background: #fff3a8; border: 1px solid #c9b200; border-radius: 3px; font-size: 14px; padding: 1px 6px; width: fit-content; }
  .tag .right { width: 1.25in; background: #b0531c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; }
  .help { margin-top: auto; display: flex; gap: 14px; align-items: center; border: 2px dashed #b0531c; border-radius: 8px; padding: 10px 14px; }
  .help .demo { flex: none; }
  .person { display: flex; gap: 14px; border: 2px solid #f0d2bd; border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; flex: none; display: grid; place-items: center; color: #fff; font-size: 26px; font-weight: bold; }
  .person h2 { font-size: 21px; margin-bottom: 4px; }
  .person ul { padding-left: 1.1em; }
  .dates { border: 2px solid #b0531c; border-radius: 8px; padding: 10px 16px; margin-top: auto; }
  .dates h2 { color: #b0531c; font-size: 20px; margin-bottom: 4px; }
"""

TAGS = [("Rice", [("Long grain rice", "2 lb bag", "$3.49", "$1.75 per lb"), ("Long grain rice", "20 lb bag", "$21.99", "$1.10 per lb")]),
        ("Cereal", [("Oat cereal", "12 oz box", "$3.99", "33.3&cent; per oz"), ("Oat cereal", "24 oz box", "$6.49", "27.0&cent; per oz")]),
        ("Olive oil", [("Olive oil", "17 oz bottle", "$8.99", "52.9&cent; per oz"), ("Olive oil", "34 oz bottle", "$19.49", "57.3&cent; per oz")]),
        ("Eggs", [("Large eggs", "12 eggs", "$3.99", "33.3&cent; per egg"), ("Large eggs", "18 eggs", "$6.29", "34.9&cent; per egg")]),
        ("Milk", [("Whole milk", "half gallon", "$2.89", "$5.78 per gallon"), ("Whole milk", "1 gallon", "$4.29", "$4.29 per gallon")])]


def documents():
    tags = "".join(f'<div class="pair-label">{food}</div>' + "".join(
        f'<div class="tag"><div class="left"><div><div class="name">{n}</div><div class="size">{sz}</div></div>'
        f'<div class="unit">Unit price: <b>{u}</b></div></div><div class="right">{pr}</div></div>' for n, sz, pr, u in items)
        for food, items in TAGS)
    sheet1 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 1 of 2 &middot; Leave this on the table</div>
  <div class="h">Eastside Market: shelf tags</div>
  <p class="sub">Two sizes of the same food. Which one is the better deal? Look at the <b>unit price</b> (the yellow box).</p>
  <div class="tags">{tags}</div>
  <div class="help" style="margin-top:14px;"><b style="font-size:19px;color:#b0531c;">Unit price</b><span>= the price for <b>one</b> pound, ounce, egg, or gallon. The <b>lower</b> unit price is the better deal.<br>Big package: $21.99 for 20 lb &rarr; $21.99 &divide; 20 = <b>$1.10 per lb</b>.</span></div>
</section>"""
    people = [("O", "#1f6fb2", "Mr. Ortiz", ["He lives alone.", "He drinks milk only in his coffee, about 1 cup a week.",
                                              "Milk goes bad about one week after you open it."]),
              ("D", "#2e7d32", "The Diallo family", ["6 people live in their apartment.", "They eat rice every day, lunch and dinner.",
                                                      "They have a big closet. Rice stays good for a long time."]),
              ("R", "#c0392b", "Rosa", ["Bananas are cheap this week. She wants to stock up for 3 weeks.",
                                         "Bananas get brown and soft in 4 or 5 days."]),
              ("K", "#7d3c98", "Kim&rsquo;s family", ["They cook with olive oil every day.", "They need 34 ounces of olive oil for the month."])]
    cards = "".join(f'<div class="person"><div class="avatar" style="background:{c};">{i}</div><div><h2>{n}</h2><ul>'
                    + "".join(f"<li>{x}</li>" for x in facts) + "</ul></div></div>" for i, c, n, facts in people)
    sheet2 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <div class="h">Should they buy in bulk?</div>
  <p class="sub">A big package can save money. But if the food <b>goes bad</b>, you throw it away. That costs money too!</p>
  {cards}
  <div class="dates">
    <h2>Dates on food</h2>
    <b>Best by / Use by:</b> the food is best before this date. &middot; <b>Sell by:</b> a date for the store.<br>
    Many foods are still OK after the date. If it smells bad or looks bad, throw it out.
  </div>
</section>"""
    return L.doc("Week 13 Tuesday Real World: Shelf Tags and Unit Price", DOC_CSS, sheet1 + sheet2)


def self_check():
    why = {1: "Olive oil and eggs: the small one is cheaper per unit.", 2: "Unit price = price for one.", 3: "$1.10 is less than $1.75.",
           4: "The tags don&rsquo;t say &ldquo;sale.&rdquo;", 5: "34.9&cent; is more than 33.3&cent;.", 6: "The tags only show whole milk."}
    word = {"T": "True", "F": "False", "N": "Not on the tags"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    deals = "".join(f'<tr><td class="n">{n}</td><td class="a">{w}</td><td class="why">{why}</td></tr>' for n, _, _, w, why in DEALS)
    body = f"""<h2>A. Read a shelf tag</h2>
    <table>
      <tr><td class="n">1</td><td class="a">$3.49 &middot; 2 lb</td><td class="why"></td></tr>
      <tr><td class="n">2</td><td class="a">$1.75 per pound</td><td class="why">the yellow box</td></tr>
    </table>
    <h2>B. Which is the better deal?</h2>
    <table>{deals}</table>
    <h2>C. True, false, or not on the tags?</h2>
    <table>{tf}</table>
    <div class="tip"><b>Different answer?</b> Compare the yellow unit price boxes together. The <b>lower</b> number wins. <b>Part D hint:</b> will they eat it before it goes bad?</div>"""
    return L.self_check_doc("Week 13 Station 4 Self-Check", body)


def leader_guide():
    hear = "".join(f'<tr><td class="n">{i}</td><td>I&rsquo;ve lived here <b>{a}</b> {t}.</td></tr>' for i, (a, t) in enumerate(HEAR, 1))
    top = L.leader_top(13, "12/8/26", STATIONS, [
        "<b>This week:</b> practice <b>How long&hellip;? + for / since</b> (started Thursday). Quiz verbs: <b>eat, drink</b>. Week 13 Quiz opens Thu 12/10.",
        "<b>New: Station 3 is a full WRITE station.</b> Students write a short life story with for / since. Visit early: help with the timeline (Step 2). Writing about the past can bring up hard memories: students choose the topic, and home, job, or a hobby are fine.",
        "<b>Floating:</b> start at <b>Station 4</b> (show one shelf tag and the yellow unit price), then <b>Station 3</b> (check timelines), then Station 1.",
        "<b>Moves:</b> 3-minute warning, then move. <b>Finished early</b> anywhere &rarr; verb charts (page 10).",
    ])
    page1 = f"""<section class="page">
  {top}
  <div class="header-row" style="margin-top:6px;"><h1>Leading Station 2: SPEAK (How long&hellip;?)</h1><span class="tag">Packet pages 4&ndash;5</span></div>
  <p>Two goals: (1) answer <i>How long have you&hellip;?</i> with <b>for / since</b>, and (2) sound natural: <b>for</b> is weak (&ldquo;fer&rdquo;), the time is stressed. Learners often stress <b>FOR</b>, or say <i>since 3 years</i>.</p>
  <table class="timeline">
    <tr><td>3 min</td><td><b>The beat.</b> Tap on stressed words: <i>I&rsquo;ve lived here fer SIX YEARS.</i></td></tr>
    <tr><td>5 min</td><td><b>A. For or since?</b> Read the sentences below at normal speed (weak <i>for</i>!).</td></tr>
    <tr><td>3 min</td><td><b>B. Around the table.</b> Fast chain. Fix <i>since + length</i> right away.</td></tr>
    <tr><td>6 min</td><td><b>C. Interview.</b> At the table only. Push for full answers.</td></tr>
    <tr><td>4 min</td><td><b>D. Read aloud.</b> Pairs read the interview, then switch.</td></tr>
    <tr><td>4 min</td><td><b>E + F.</b> Talk, then each person reads you their two sentences.</td></tr>
  </table>
  <div class="cols">
    <div>
      <h2>A. Read these sentences</h2>
      <table class="script">{hear}</table>
    </div>
    <div>
      <h2>When they say it wrong</h2>
      <ul class="dots">
        <li><i>since 3 years</i> &rarr; hold up 3 fingers: <i>for</i> 3 years. Point back to a date: <i>since</i> 2023.</li>
        <li><i>I live here for 6 years</i> &rarr; recast: <i>You&rsquo;ve lived here for 6 years.</i></li>
        <li>Fix <b>one</b> thing, then move on.</li>
      </ul>
      <div class="recast">Learner: &ldquo;I live here since 2020.&rdquo;<br>You: &ldquo;Oh, you&rsquo;ve <b>lived</b> here since 2020? Six years!&rdquo;</div>
    </div>
  </div>
</section>"""
    page2 = f"""<section class="page">
  <div class="header-row"><h1>Answer Keys</h1><span class="tag">Week 13 &middot; Tue 12/8/26 &middot; full key: packet-key PDF</span></div>
  <div class="box">
    <h2>Station 1: WARM-UP (pages 2&ndash;3)</h2>
    <div class="cols">
      <div>
        <p><b>1. For / since:</b> 1 for &middot; 2 since &middot; 3 since &middot; 4 for &middot; 5 since</p>
        <p><b>2. Since &rarr; for:</b> 1 ten years &middot; 2 four months &middot; 3 five years &middot; 4 one year</p>
        <p><b>3. About you:</b> answers vary. Check <i>for + length</i>, <i>since + start</i>, <i>have + V3</i>.</p>
      </div>
      <div>
        <p><b>4. Forms:</b> eat, eats, eating, ate, eaten &middot; drink, drinks, drinking, drank, drunk</p>
        <p><b>5. Right form:</b> 1 drinks &middot; 2 eating &middot; 3 drink &middot; 4 eat &middot; 5 eat &middot; 6 drinking &middot; 7 eaten &middot; 8 drunk</p>
        <p><b>6. Your turn:</b> answers vary: <i>I drink &hellip; / I didn&rsquo;t eat &hellip; / How long have you + V3?</i></p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i} {a} ({t})" for i, (a, t) in enumerate(HEAR, 1))} &middot; <b>B&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: WRITE (pages 6&ndash;7)</h2>
    <p>Answers vary. Look for: <b>In + year + V2</b> (<i>I moved here in 2019</i>), <b>have / has + V3 + for + length</b>, <b>have / has + V3 + since + start</b>. Common errors: <i>since 3 years</i>; <i>I have went</i> (V2 for V3); <i>I live here for 6 years</i> (present for present perfect). Praise content first. Mark only for / since and V3.</p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Shelf tags (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 $3.49, 2 lb &middot; 2 $1.75 per pound</p>
    <p><b>B:</b> {" &middot; ".join(f"{n}: <b>{w}</b> ({why})" for n, _, _, w, why in DEALS)}</p>
    <p><b>C:</b> 1 False &middot; 2 True &middot; 3 True &middot; 4 Not on the tags &middot; 5 False &middot; 6 Not on the tags</p>
    <p><b>D:</b> {" &middot; ".join(f"<b>{n}</b>: {a}. {w}" for n, _, a, w in FAMILIES)} &middot; &#9733; Kim: two 17-oz bottles = $17.98 vs $19.49, save $1.51.</p>
    <p><b>E:</b> answers vary. Check <i>If we buy a lot, it will go bad.</i></p>
    <p style="font-size:12px;">Store, prices, and people are made up. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
  </div>
  <div class="box">
    <h2>VERB CHARTS (page 10)</h2>
    <p><b>Chart 1 (she + eat, helpers only):</b> Present: &mdash; / doesn&rsquo;t / Does &middot; Past: &mdash; / didn&rsquo;t / Did &middot; Future: will / won&rsquo;t / Will &middot; Pres. cont.: is / isn&rsquo;t / Is &middot; Past cont.: was / wasn&rsquo;t / Was &middot; Fut. cont.: will be / won&rsquo;t be / Will &hellip; be &middot; Pres. perfect: has / hasn&rsquo;t / Has</p>
    <p><b>Chart 2 (we + drink):</b> drink, drinks, drinking, drank, drunk &middot; {" &middot; ".join(" / ".join(r) for r in L.conjugate("we", DRINK))}</p>
  </div>
</section>"""
    return L.doc("Week 13 Tuesday Stations Leader Guide", L.LEADER_CSS, page1 + page2)


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
