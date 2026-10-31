#!/usr/bin/env python3
"""Week 9 Tuesday stations, Tue 11/10/26: practice can / should / must (started Thu 11/5).

Quiz verbs: take, bring. Vocab: volunteering (volunteer, help out, support,
contribute, donate, sign up for). Stations: 1 WARM-UP, 2 SPEAK (can vs can't),
3 READ (Saturday at the Food Pantry), 4 REAL WORLD (volunteer flyer).

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
    ("READ", "With your group. A teacher will visit.", "Pages 6&ndash;7"),
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
      <li><b class="n">1.</b> &ldquo;I want to help my community.&rdquo; You should {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">2.</b> &ldquo;I want to practice English.&rdquo; You should {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">3.</b> &ldquo;My back hurts.&rdquo; You shouldn&rsquo;t {p.b("<i>answers vary</i>", "long")}.</li>
      <li><b class="n">4.</b> &ldquo;I have a job interview.&rdquo; Should I {p.b("<i>answers vary</i>", "long")}?</li>
    </ol>
  </div>"""
    items = [
        ("<b>Every Saturday</b>, my neighbor {} food to the shelter. (bring)", "brings"),
        ("<b>Right now</b>, I am {} the bus to the food bank. (take)", "taking"),
        ("<b>Yesterday</b>, we didn&rsquo;t {} enough coats to donate. (bring)", "bring"),
        ("<b>Last week</b>, did she {} her kids to the park cleanup? (take)", "take"),
        ("He doesn&rsquo;t {} the sign-up sheet home <b>every week</b>. (take)", "take"),
        ("<b>Right now</b>, are the volunteers {} boxes into the church? (bring)", "bringing"),
        ("I <b>have</b> {} a first aid class. (take)", "taken"),
        ("<b>Has</b> she {} cookies to the meeting? (bring)", "brought"),
    ]
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
    <h2>6. Bonus: Your turn</h2>
    <p class="how">Write a true sentence about <b>you</b>. <b>+ not</b> = negative. <b>?</b> = ask a partner.</p>
    <p class="prompt"><b>At my job</b> / <b>At home</b> + must</p>
    <p class="ideas">Ideas: be on time &middot; wash my hands &middot; wear a uniform &middot; cook dinner</p>
    {p.ln("<i>answers vary: At my job, I must be on time.</i>")}
    <p class="prompt"><b>At the library</b> + can <b>+ not</b></p>
    <p class="ideas">Ideas: eat &middot; talk loudly &middot; use my phone &middot; sleep</p>
    {p.ln("<i>answers vary: At the library, I can&rsquo;t talk loudly.</i>")}
    <p class="prompt"><b>This weekend</b> + should + take<b>?</b></p>
    <p class="ideas">Ideas: the bus &middot; my kids to the park &middot; a day off &middot; a walk</p>
    {p.ln("<i>answers vary: Should I take my kids to the park this weekend?</i>")}
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


def read(p, key):
    page6 = """  <div class="words">
    <b>Words to know</b>
    <div class="wgrid">
      <div><b>food pantry</b> = a place that gives free food</div>
      <div><b>shift</b> = your work time, like 9 to 12</div>
      <div><b>sign in</b> = write your name when you arrive</div>
      <div><b>gloves</b> = you wear them on your hands</div>
      <div><b>expired</b> = too old; the date is past</div>
      <div><b>heavy</b> = hard to lift</div>
    </div>
  </div>
  <div class="paras">
  <p>Every Saturday morning, the Eastside Community <b>Food Pantry</b> gives free food to families. Nobody gets paid. Volunteers do all the work. They sort cans, pack bags, and help families carry food to their cars.</p>
  <p>Mei moved to Boston last year. She wants to practice her English and meet new people, so she signed up for a Saturday <b>shift</b> online. The website says, &ldquo;Volunteers must be 16 or older. Kids 12 to 15 can volunteer with a parent.&rdquo; Mei&rsquo;s son, Leo, is 13, so he can come with her.</p>
  <p>On Saturday at 8:45, Mei and Leo walk into the church basement. A woman with a clipboard smiles. &ldquo;Hi! I&rsquo;m Grace, the volunteer leader. First, you must <b>sign in</b>. Then you should wash your hands and put on <b>gloves</b>.&rdquo;</p>
  <p>Grace takes them to a long table with boxes of cans. &ldquo;Today you can sort the cans,&rdquo; she says. &ldquo;Check the date on every can. If a can is <b>expired</b>, put it in the red box. You shouldn&rsquo;t give old food to families.&rdquo; Leo finds a can of soup from 2024. &ldquo;Mom, this one is expired!&rdquo; he says.</p>
  <p>At 10:00, the doors open and families come in. Some families bring their own bags. Others take bags from the pantry. A man asks Mei a question in Spanish. Mei can&rsquo;t speak Spanish, but another volunteer, Jorge, can. He helps the man find rice and beans.</p>
  <p>Some boxes are very <b>heavy</b>. Leo tries to pick one up. &ldquo;Leo, you shouldn&rsquo;t lift that box alone,&rdquo; Grace says. &ldquo;Two people must carry the big boxes.&rdquo; Jorge and Leo carry it together.</p>
  <p>At 12:00, the shift is over. Mei is tired but happy. &ldquo;Can we come back next week?&rdquo; Leo asks. &ldquo;Of course,&rdquo; Grace says. &ldquo;You can sign up online for any Saturday. And you should bring a water bottle next time. It gets hot in here!&rdquo;</p>
  <p>On the way home, Mei thinks about her neighbors. Many of them work on Saturdays. &ldquo;They can&rsquo;t volunteer on Saturdays,&rdquo; she thinks, &ldquo;but they can donate food. Everyone can help in some way.&rdquo;</p>
  </div>"""
    page7 = f"""  <p class="how"><b>First:</b> Read the story alone. Read it <b>2 times</b>. Then answer. The <b>&para;</b> number tells you which paragraph to look in.</p>
  <div class="task">
    <h2>Part A: Think about it</h2>
    <p class="how">The answers are not always in one sentence. Think, then write. <b>&#9733;</b> = challenge.</p>
    <ol class="items">
      <li><b class="n">1.</b> Why does Mei want to volunteer? Give 2 reasons. <span class="small">(&para;2)</span>{p.ln("She wants to practice English and meet new people.")}</li>
      <li><b class="n">2.</b> Leo is 13. Can he volunteer alone? Why or why not? <span class="small">(&para;2)</span>{p.ln("No. Kids 12&ndash;15 can volunteer only with a parent.")}</li>
      <li><b class="n">3.</b> Number the steps in order, 1&ndash;4. <span class="small">(&para;3&ndash;4)</span><br>
        &emsp;&ensp;{p.b("2", "short")} wash hands, put on gloves &emsp; {p.b("1", "short")} sign in<br>
        &emsp;&ensp;{p.b("4", "short")} put old cans in the red box &ensp; {p.b("3", "short")} check the date on the cans</li>
      <li><b class="n">4.</b> Mei can&rsquo;t speak Spanish. How does the man get help? <span class="small">(&para;5)</span>{p.ln("Jorge can speak Spanish. He helps the man find rice and beans.")}</li>
      <li><b class="n">5.</b> <b>&#9733;</b> Why shouldn&rsquo;t the pantry give expired food to families? <span class="small">(&para;4)</span>{p.ln("Answers vary: old food is not safe; people can get sick.")}</li>
      <li><b class="n">6.</b> <b>&#9733;</b> Mei&rsquo;s neighbors can&rsquo;t volunteer on Saturdays. How can they help? <span class="small">(&para;8)</span>{p.ln("They can donate food.")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>Part B: Find the grammar</h2>
    <div class="gram3">
      <div><b>must</b> = a rule</div>
      <div><b>should</b> = a good idea</div>
      <div><b>can</b> = it&rsquo;s OK / you are able</div>
    </div>
    <p class="how">Find one sentence in the story for each word. Write it.</p>
    <div class="gline"><b>must</b>{p.ln("Volunteers must be 16 or older. / You must sign in. / Two people must carry&hellip;")}</div>
    <div class="gline"><b>should</b>{p.ln("You should wash your hands&hellip; / You should bring a water bottle&hellip;")}</div>
    <div class="gline"><b>can</b>{p.ln("Kids 12 to 15 can volunteer with a parent. / Today you can sort the cans. &hellip;")}</div>
  </div>
  <div class="task">
    <h2>Part C: Talk together</h2>
    <ol class="items">
      <li><b class="n">1.</b> Do you volunteer or help people in your neighborhood? How?</li>
      <li><b class="n">2.</b> What should a new volunteer bring? <i>&ldquo;You should bring ___.&rdquo;</i></li>
      <li><b class="n">3.</b> In your home country, how do people help their neighbors?</li>
    </ol>
  </div>
  <p class="pass bottom"><b>You can say &ldquo;Pass.&rdquo;</b> You never have to answer a question.</p>"""
    sub = "Saturday at the Food Pantry &middot; with your group"
    return L.page("story", "STATION 3: READ", sub, 6, page6, key) + L.page("rd", "STATION 3: READ", sub, 7, page7, key)


TF = [  # (statement, True / False / Not)
    ("You need experience to volunteer.", "F"),
    ("A 14-year-old can volunteer with a parent.", "T"),
    ("Volunteers get a free lunch.", "N"),
    ("There is free parking on Friday.", "F"),
    ("Delivery drivers must have a car.", "T"),
    ("Front Desk volunteers must speak Spanish.", "F"),
]


def real_world(p, key):
    tf = "".join(f'<tr><td>{i}. {s}</td>' + "".join(f'<td class="c">{p.cb(a == x)}</td>' for x in "TFN") + "</tr>"
                 for i, (s, a) in enumerate(TF, 1))
    page8 = f"""  <p class="how"><b>On the table:</b> 2 color pages from a food pantry. Start with <b>page 1</b> (the flyer). Read it <b>together</b>. Check answers with your group. <b>&#9733;</b> = challenge.</p>
  <div class="task">
    <h2>A. Find it</h2>
    <ol class="items">
      <li><b class="n">1.</b> What 3 days does the pantry need volunteers? {p.b("Wednesday, Friday, Saturday", "long")}</li>
      <li><b class="n">2.</b> What must you wear on your feet? {p.b("closed-toe shoes")}</li>
      <li><b class="n">3.</b> How do you sign up? {p.b("text VOLUNTEER to 55190 / online", "long")}</li>
      <li><b class="n">4.</b> Who is Grace Okafor? {p.b("the volunteer leader")}</li>
    </ol>
  </div>
  <div class="task">
    <h2>B. True, false, or not on the flyer?</h2>
    <p class="how">Check <b>&#10003;</b> one box. If it&rsquo;s not on the flyer, you <b>can&rsquo;t know</b>.</p>
    <table class="tf"><tr><th></th><th>True</th><th>False</th><th>Not on the flyer</th></tr>{tf}</table>
  </div>
  <div class="task">
    <h2>C. Must, should, can, or can&rsquo;t?</h2>
    <p class="how">Read the rules on the flyer. Write <b>must</b>, <b>should</b>, <b>can</b>, or <b>can&rsquo;t</b>.</p>
    <ol class="items">
      <li><b class="n">1.</b> You {p.b("can&rsquo;t", "short")} wear sandals.</li>
      <li><b class="n">2.</b> You {p.b("must", "short")} sign in when you arrive.</li>
      <li><b class="n">3.</b> You {p.b("should", "short")} bring a water bottle.</li>
      <li><b class="n">4.</b> Kids 12&ndash;15 {p.b("can", "short")} volunteer with a parent.</li>
      <li><b class="n">5.</b> <b>&#9733;</b> Front Desk: is speaking 2 languages a rule? How do you know?{p.ln("No. The flyer says <i>should</i> (a good idea), not <i>must</i> (a rule).")}</li>
    </ol>
  </div>
  <p class="how bottom"><b>Talk:</b> Do you know a place to volunteer near you? A school, a church, a park?</p>"""
    rows = [("Amina", "Sort &amp; Pack, Friday 4&ndash;7", "She is 15. Her mom can come on Friday. Soccer on Saturday."),
            ("Carlos", "Delivery Driver, Saturday 12:30&ndash;3", "He has a car and a license. He can&rsquo;t lift 25 lb."),
            ("Ji-woo", "Front Desk, Wednesday 5&ndash;7:30", "She is free on Wednesday. She works Thu&ndash;Sun.")]
    pick = "".join(f'<tr><td class="t">{n}</td><td>{p.b(s) if key else ""}</td><td>{p.b(w) if key else ""}</td></tr>'
                   .replace('<span class="blank ans">', '<span class="ans">') for n, s, w in rows)
    page9 = f"""  <p class="how">Now look at <b>page 2</b> on the table: <b>Who can help?</b></p>
  <div class="task">
    <h2>D. Find the best shift</h2>
    <p class="how">Read about each person. Only <b>one</b> shift works for each person. Check the <b>day</b>, the <b>age</b>, and the <b>rules</b>.</p>
    <table class="pick tall">
      <tr><th style="width:16%;">Person</th><th style="width:34%;">Best shift</th><th>Why?</th></tr>
      {pick}
    </table>
    <p class="how"><b>&#9733;</b> Carlos is free all day Saturday. Why can&rsquo;t he do the Saturday Market shift?</p>
    {p.ln("Market volunteers must be able to lift 25 pounds. He has a bad back.")}
  </div>
  <div class="task">
    <h2>E. Sign up by text</h2>
    <p class="how">Write a text to Grace. <b>Use your own ideas!</b> Pick a shift that works for <b>you</b>. Then read your text to your group.</p>
    <div class="textbox">
      Hi Grace, my name is {p.b("<i>your name</i>")}. I want to volunteer on {p.b("<i>a day</i>")}<br>
      for the {p.b("<i>a shift</i>")} shift. I can {p.b("<i>answers vary</i>", "long")}.<br>
      I can&rsquo;t {p.b("<i>answers vary</i>", "long")}. Should I bring {p.b("<i>answers vary</i>")}?
    </div>
  </div>
  <div class="task">
    <h2>&#9733; Challenge: call Grace</h2>
    <p class="how">Work with a partner. <b>A</b> = Grace. <b>B</b> = a new volunteer. B asks 2 questions: <i>&ldquo;Can I &hellip;?&rdquo;</i> or <i>&ldquo;Should I &hellip;?&rdquo;</i> A answers with the flyer. Then <b>switch</b>.<br>
    <span class="small">Ideas: Can I bring my son? He is 11. &middot; Can I park in the lot on Friday? &middot; Should I bring gloves?</span></p>
  </div>"""
    sub = "with your group"
    return L.page("rw", "STATION 4: REAL WORLD", sub, 8, page8, key) + L.page("rw", "STATION 4: REAL WORLD", sub, 9, page9, key)


def packet(key):
    p = L.P(key)
    body = (L.cover(9, "Tuesday, November 10, 2026", STATIONS, key)
            + warmup(p, key) + speak(p, key) + read(p, key) + real_world(p, key)
            + L.verb_charts(10, TAKE, "he", BRING, "we", key))
    title = "Week 9 Tuesday Stations Packet" + (" (Answer Key)" if key else "")
    return L.doc(title, L.packet_css(key), body)


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
  table.shifts { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 17px; }
  table.shifts th { background: #e6f0e1; color: #2f6b2f; text-align: left; padding: 6px 8px; font-size: 14px; border-bottom: 2px solid #2f6b2f; }
  table.shifts td { padding: 9px 8px; border-bottom: 1px solid #cfdcc9; vertical-align: top; }
  table.shifts td.n { font-weight: bold; color: #2f6b2f; white-space: nowrap; }
  table.shifts td.t { white-space: nowrap; }
  .cols { display: flex; gap: 14px; }
  .box { border: 2px solid #2f6b2f; border-radius: 8px; padding: 8px 14px; flex: 1; }
  .box h2 { font-size: 21px; color: #2f6b2f; margin-bottom: 4px; }
  .box ul { padding-left: 1.1em; font-size: 17px; }
  .box li { margin-bottom: 6px; }
  .rules { flex: 1.5; }
  .warm { background: #fff6d6; border-color: #d9a400; }
  .warm h2 { color: #8a6500; }
  .langs { font-size: 16px; color: #444; margin-top: 16px; text-align: center; }
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
      <h1>VOLUNTEERS NEEDED!</h1>
      <div class="tag">Help your neighbors. No experience needed. We can train you!</div>
    </div>
  </div>
  <table class="shifts">
    <tr><th>Shift</th><th>Day and time</th><th>What you do</th><th>Who can volunteer</th></tr>
    <tr><td class="n">Front Desk</td><td class="t">Wednesday<br>5:00&ndash;7:30 p.m.</td><td>Sign families in. Answer the phone.</td><td>18 or older. You should speak 2 languages.</td></tr>
    <tr><td class="n">Sort &amp; Pack</td><td class="t">Friday<br>4:00&ndash;7:00 p.m.</td><td>Check dates on cans. Pack bags.</td><td>16 or older. Ages 12&ndash;15 with a parent.</td></tr>
    <tr><td class="n">Saturday Market</td><td class="t">Saturday<br>8:45 a.m.&ndash;12:00 p.m.</td><td>Help families choose food. Carry boxes.</td><td>16 or older. Ages 12&ndash;15 with a parent. You must be able to lift 25 pounds.</td></tr>
    <tr><td class="n">Delivery Driver</td><td class="t">Saturday<br>12:30&ndash;3:00 p.m.</td><td>Drive bags of food to seniors at home.</td><td>21 or older. You must have a driver&rsquo;s license and a car.</td></tr>
  </table>
  <div class="cols">
    <div class="box rules">
      <h2>Volunteer rules</h2>
      <ul>
        <li>You <b>must</b> sign up before your shift.</li>
        <li>You <b>must</b> sign in at the front desk when you arrive.</li>
        <li>You <b>must</b> wear closed-toe shoes. <b>No sandals.</b></li>
        <li>You <b>should</b> bring a water bottle.</li>
        <li>You <b>should</b> wear old clothes. Things can get dirty!</li>
        <li>You <b>can&rsquo;t</b> bring children under 12 to a shift.</li>
        <li>Can&rsquo;t come? Please text us <b>24 hours</b> before your shift.</li>
      </ul>
    </div>
    <div class="box warm">
      <h2>How to sign up</h2>
      <ul>
        <li>Text <b>VOLUNTEER</b> to <b>55190</b></li>
        <li>or sign up online: eastsidepantry.example.org</li>
      </ul>
      <h2 style="margin-top:8px;">Getting here</h2>
      <ul>
        <li><b>Bus 7</b> stops in front.</li>
        <li><b>Free parking</b> in the church lot on <b>Saturday only</b>.</li>
      </ul>
    </div>
  </div>
  <p class="langs">We speak: English &middot; Espa&ntilde;ol &middot; Portugu&ecirc;s &middot; Krey&ograve;l ayisyen</p>
  <div class="contact"><span><b>Questions?</b> Grace Okafor, Volunteer Leader</span><span>(617) 555-0190</span></div>
</section>"""
    people = [
        ("A", "#c0392b", "Amina, 15", ["High school student. School ends at 2:30.",
                                         "She plays soccer every Saturday, 8:00 a.m.&ndash;12:00 p.m.",
                                         "Her mom is free on Friday evenings. She can come with Amina."]),
        ("C", "#1f6fb2", "Carlos, 42", ["He works Monday&ndash;Friday, 7:00 a.m.&ndash;5:30 p.m.",
                                          "He is free all day Saturday.",
                                          "He has a car and a driver&rsquo;s license.",
                                          "He has a bad back. His doctor says: &ldquo;Don&rsquo;t lift heavy boxes.&rdquo;"]),
        ("J", "#7d3c98", "Ji-woo, 30", ["She speaks Korean and English.",
                                          "She works at a restaurant Thursday&ndash;Sunday, 11:00 a.m.&ndash;10:00 p.m.",
                                          "She is free Monday, Tuesday, and Wednesday.",
                                          "She doesn&rsquo;t have a car. She takes the bus."]),
    ]
    cards = "".join(
        f'<div class="person"><div class="avatar" style="background:{c};">{i}</div><div><h2>{n}</h2><ul>'
        + "".join(f"<li>{x}</li>" for x in facts) + "</ul></div></div>"
        for i, c, n, facts in people)
    sheet2 = f"""<section class="page">
  <div class="station">Station 4: REAL WORLD &middot; Page 2 of 2 &middot; Leave this on the table</div>
  <div class="wk-title">Who can help?</div>
  <p class="wk-sub">These 3 people want to volunteer at the Eastside Community Food Pantry. Look at the shifts on page 1. Which shift is best for each person?</p>
  {cards}
  <div class="reminder"><b>Remember:</b> check the <b>day and time</b>, the <b>age</b>, and the <b>rules</b> (lift 25 pounds? car and license?).</div>
</section>"""
    return L.doc("Week 9 Tuesday Real World: Volunteer Flyer", FLYER_CSS, sheet1 + sheet2)


def self_check():
    tf_why = {
        1: "&ldquo;No experience needed.&rdquo;",
        2: "Sort &amp; Pack and Market: ages 12&ndash;15 with a parent.",
        3: "The flyer doesn&rsquo;t say anything about lunch.",
        4: "Free parking on Saturday only.",
        5: "&ldquo;You must have a driver&rsquo;s license and a car.&rdquo;",
        6: "It says <b>should</b> speak 2 languages. Not <b>must</b>, and not only Spanish.",
    }
    word = {"T": "True", "F": "False", "N": "Not on the flyer"}
    tf = "".join(f'<tr><td class="n">{i}</td><td class="a">{word[a]}</td><td class="why">{tf_why[i]}</td></tr>'
                 for i, (_, a) in enumerate(TF, 1))
    card = f"""<div class="card">
    <div class="stop">
      <div class="big">STOP! Finish Parts A, B, and C first.</div>
      <div class="sub">Keep this card face-down until your group is done. Then check together.</div>
    </div>
    <div class="title"><h1>Station 4 Self-Check</h1><span>Real World &middot; packet page 8</span></div>
    <h2>A. Find it</h2>
    <table>
      <tr><td class="n">1</td><td class="a">Wednesday, Friday, Saturday</td><td class="why"></td></tr>
      <tr><td class="n">2</td><td class="a">closed-toe shoes</td><td class="why">No sandals!</td></tr>
      <tr><td class="n">3</td><td class="a" colspan="2">Text VOLUNTEER to 55190, or sign up online</td></tr>
      <tr><td class="n">4</td><td class="a">the volunteer leader</td><td class="why"></td></tr>
    </table>
    <h2>B. True, false, or not on the flyer?</h2>
    <table>{tf}</table>
    <h2>C. Must, should, can, or can&rsquo;t?</h2>
    <table>
      <tr><td class="n">1</td><td class="a">can&rsquo;t</td><td class="why">&ldquo;No sandals.&rdquo;</td></tr>
      <tr><td class="n">2</td><td class="a">must</td><td class="why"></td></tr>
      <tr><td class="n">3</td><td class="a">should</td><td class="why">a good idea, not a rule</td></tr>
      <tr><td class="n">4</td><td class="a">can</td><td class="why">with a parent</td></tr>
      <tr><td class="n">5&#9733;</td><td class="a">No</td><td class="why">The flyer says <b>should</b>: a good idea, not a rule.</td></tr>
    </table>
    <div class="tip"><b>Different answer?</b> Find the sentence on the flyer together. Read it out loud. <b>Part D hint:</b> for each person, check the day, the age, and the rules.</div>
  </div>"""
    return L.doc("Week 9 Station 4 Self-Check", L.SELFCHECK_CSS, f'<div class="sheet">\n  {card}\n  {card}\n</div>')


def leader_guide():
    script = "".join(
        f'<tr><td class="n">{i + 1}</td><td>{s.replace("___", "<b>" + a + "</b>")}</td></tr>' for i, (s, a) in enumerate(LISTEN))
    rotation_rows = "".join(
        f'<tr><td class="g">{g}<span>{"late arrivals" if g == "D" else "on time"}</span></td>'
        + "".join(f"<td>{n} &middot; {STATIONS[n - 1][0]}</td>" for n in order) + "</tr>"
        for g, order in L.ROTATION)
    page1 = f"""<section class="page">
  <div class="header-row"><h1>Tuesday Stations &middot; Leader Guide</h1><span class="tag">Week 9 &middot; Tue 11/10/26 &middot; not for students</span></div>
  <table class="rotation">
    <tr><th>Group</th><th>Block 1<span class="time">6:00&ndash;6:25</span></th><th>Block 2<span class="time">6:27&ndash;6:52</span></th><th>Block 3<span class="time">6:54&ndash;7:19</span></th><th>Block 4<span class="time">7:21&ndash;7:46</span></th></tr>
    {rotation_rows}
    <tr class="who"><td class="g">Adults</td><td colspan="4">One adult stays at <b>Station 2 (SPEAK)</b> all night. The other <b>floats</b> between Stations 1, 3, and 4.</td></tr>
  </table>
  <ul class="dots">
    <li><b>This week:</b> practice <b>can / should / must</b> (started Thursday). Quiz verbs: <b>take, bring</b>. Week 9 Quiz opens Thu 11/12 at 6 p.m.</li>
    <li><b>At 6:00:</b> count off the people who are there into A, B, C. Group D starts empty. <b>Late?</b> Station 1, then join that group.</li>
    <li><b>Floating:</b> start each block at <b>Station 4</b> (3&ndash;4 min: show the flyer, do Part B #1 together). Then Station 3, then Station 1. Back to Station 4 for Part D.</li>
    <li><b>Moves:</b> 3-minute warning, then move. <b>7:46&ndash;end:</b> wrap-up, quiz reminder. <b>Finished early</b> anywhere &rarr; verb charts (page 10).</li>
  </ul>
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
        <p><b>3. Advice:</b> answers vary. Check <i>should / shouldn&rsquo;t</i> + V1 (no <i>to</i>, no <i>-s</i>). #4 is a question: <i>Should I</i> + V1?</p>
      </div>
      <div>
        <p><b>4. Forms:</b> take, takes, taking, took, taken &middot; bring, brings, bringing, brought, brought</p>
        <p><b>5. Right form:</b> 1 brings &middot; 2 taking &middot; 3 bring &middot; 4 take &middot; 5 take &middot; 6 bringing &middot; 7 taken &middot; 8 brought</p>
        <p><b>6. Your turn:</b> answers vary. Look for modal + V1: <i>I must &hellip;</i> / <i>I can&rsquo;t &hellip;</i> / <i>Should I take &hellip;?</i></p>
      </div>
    </div>
  </div>
  <div class="box">
    <h2>Station 2: SPEAK (pages 4&ndash;5)</h2>
    <p><b>A:</b> {" &middot; ".join(f"{i + 1} {a}" for i, (_, a) in enumerate(LISTEN))} &middot; <b>C&ndash;F:</b> answers vary.</p>
  </div>
  <div class="box">
    <h2>Station 3: READ, Saturday at the Food Pantry (pages 6&ndash;7)</h2>
    <p><b>A:</b> 1 practice English, meet new people &middot; 2 No: ages 12&ndash;15 only with a parent &middot; 3 wash hands <b>2</b>, sign in <b>1</b>, red box <b>4</b>, check dates <b>3</b> &middot; 4 Jorge speaks Spanish and helps him &middot; &#9733;5 answers vary: it isn&rsquo;t safe, people can get sick &middot; &#9733;6 they can donate food. <i>Level 3 can stop at Q4.</i></p>
    <p><b>B:</b> must: <i>Volunteers must be 16 or older. / You must sign in. / Two people must carry the big boxes.</i> &middot; should: <i>you should wash your hands&hellip; / You shouldn&rsquo;t give old food&hellip; / you shouldn&rsquo;t lift that box alone / you should bring a water bottle</i> &middot; can: <i>Kids 12 to 15 can volunteer&hellip; / he can come with her / you can sort the cans / Jorge can [speak Spanish] / Can we come back&hellip;? / You can sign up online&hellip; / they can donate food / Everyone can help.</i> Accept negatives (<i>can&rsquo;t, shouldn&rsquo;t</i>).</p>
  </div>
  <div class="box">
    <h2>Station 4: REAL WORLD, Volunteer flyer (pages 8&ndash;9 + 2 color pages)</h2>
    <p><b>A:</b> 1 Wednesday, Friday, Saturday &middot; 2 closed-toe shoes &middot; 3 text VOLUNTEER to 55190 or sign up online &middot; 4 the volunteer leader</p>
    <p><b>B:</b> 1 False (no experience needed) &middot; 2 True &middot; 3 Not on the flyer &middot; 4 False (parking Saturday only) &middot; 5 True &middot; 6 False (<i>should</i>, and any 2 languages)</p>
    <p><b>C:</b> 1 can&rsquo;t &middot; 2 must &middot; 3 should &middot; 4 can &middot; &#9733;5 No: it says <i>should</i>, not <i>must</i>.</p>
    <p><b>D:</b> <b>Amina</b> &rarr; Sort &amp; Pack (Fri 4&ndash;7, with her mom). Not Market: soccer. Not Front Desk: under 18. &middot; <b>Carlos</b> &rarr; Delivery Driver (Sat 12:30&ndash;3). Not Market: can&rsquo;t lift 25 lb. Not Wed/Fri: he works until 5:30. &middot; <b>Ji-woo</b> &rarr; Front Desk (Wed 5&ndash;7:30). Not Fri/Sat: she works. Korean + English = 2 languages. &middot; &#9733; Market volunteers must lift 25 pounds.</p>
    <p><b>E:</b> answers vary. Check <i>I can + V1 / I can&rsquo;t + V1 / Should I bring&hellip;?</i></p>
    <p style="font-size:12px;">The pantry, people, website, and phone numbers are made up. A self-check card for Parts A&ndash;C goes face-down on the table.</p>
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
        f"{STEM}-real-world-document.html": (flyer(), 2),
        f"{STEM}-real-world-self-check.html": (self_check(), 1),
    }
    for name, (html, pages) in outputs.items():
        (HERE / name).write_text(html)
        L.pdf(HERE / name, pages)
