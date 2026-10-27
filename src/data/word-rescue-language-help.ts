import type { LanguageHint } from '@/lib/word-rescue/types';

// Authored sound targets for each word, not a spelling-to-sound algorithm.
// Each tip names the English letters, then anchors the sound to a word the learner
// already knows in Spanish or Brazilian Portuguese. Avoid phonetics jargon.
const coaching = {
  r: ['la r inglesa nunca vibra, ni al inicio de la palabra: la lengua no toca el paladar.', 'o r inglês nunca vibra nem soa como o rr de carro: a língua não toca o céu da boca.'],
  v: ['no es b: los dientes de arriba tocan el labio de abajo y el aire vibra, vvv.', 'como o v de vaca: dentes de cima no lábio de baixo.'],
  f: ['suena como la f de foto.', 'soa como o f de faca.'],
  h: ['suena como una j suave, como al reír "ja", solo con aire. En la guía se escribe j.', 'soa como o rr de carro, bem suave, só com ar. Na guia se escreve rr.'],
  sh: ['suena "sh", como cuando pides silencio: shhh.', 'soa como o ch de chá.'],
  ch: ['suena como la ch de chico.', 'soa como o tch de tchau.'],
  j: ['suena "dy": una d seguida de una y fuerte, como "yo" dicho con fuerza.', 'soa como o dj de dia (como se fala em muitas regiões).'],
  zh: ['suena como la y de "yo" en Argentina: una "sh" con voz. En la guía se escribe zh.', 'soa como o j de janela.'],
  th: ['como la z de España en "zapato": la lengua entre los dientes, sin voz.', 'ponta da língua entre os dentes; sopre sem voz. Não é t nem f.'],
  dh: ['como la d suave de "nada", con la punta de la lengua entre los dientes. En la guía: dh.', 'ponta da língua entre os dentes; deixe a voz vibrar. Não é d. Na guia: dh.'],
  w: ['suena como la u de "huevo": labios redondos y pasa enseguida a la vocal. No es g ni v.', 'soa como o u de quase: lábios arredondados e passe logo para a vogal.'],
  ng: ['como la n de "tengo", pero sin decir la g.', 'como o n de manga, mas sem dizer o g.'],
  s: ['suena como la s de sol.', 'soa como o s de sapo, sem som de z.'],
  z: ['es una s con zumbido, como una abeja: zzz. Toca tu garganta: debe vibrar.', 'soa como o z de zebra.'],
  k: ['suena como la c de casa.', 'soa como o c de casa.'],
  g: ['suena como la g de gato, nunca como j.', 'soa como o g de gato.'],
  ee: ['suena como una i larga, como "sí" alargado: ii.', 'soa como um i longo, como aqui esticado: ii.'],
  shortI: ['es una i corta y relajada, casi entre i y e.', 'é um i curto e relaxado, quase entre i e ê.'],
  ae: ['entre a y e: pon la boca para decir a y di e.', 'é um é bem aberto, com a boca mais aberta do que em café.'],
  eh: ['suena como la e de mesa.', 'soa como o é de café.'],
  uh: ['suena como una a corta y relajada, no como u.', 'soa como o a final de casa: curto e relaxado, não é u. Na guia: â.'],
  er: ['suena "er" con la r inglesa: la lengua se curva hacia atrás y no vibra.', 'soa "er" com o r inglês, parecido com o r caipira: a língua se curva para trás.'],
  oo: ['suena como una u larga, como "tú" alargado: uu.', 'soa como um u longo, como tu esticado: uu.'],
  shortU: ['es una u corta y relajada, con los labios poco redondeados.', 'é um u curto e relaxado, com os lábios pouco arredondados.'],
  ay: ['suena "ei", como en rey o seis.', 'soa "ei", como em lei.'],
  eye: ['suena "ai", como en hay o baile.', 'soa "ai", como em pai.'],
  oh: ['suena "ou": empieza en o y termina cerca de u. No es una o sola.', 'soa "ou": comece em ô e termine em u. Não é um ô parado.'],
  ow: ['suena "au", como en auto.', 'soa "au", como em mau.'],
  oy: ['suena "oi", como en hoy.', 'soa "ói", como em herói.'],
  schwa: ['esta vocal es muy corta y débil, casi sin abrir la boca.', 'essa vogal é bem curta e fraca, quase sem abrir a boca.'],
  silent: ['esta letra no se pronuncia en esta palabra.', 'essa letra não é pronunciada nesta palavra.'],
  cluster: ['di estos sonidos juntos, sin poner una e delante ni una vocal en medio.', 'junte esses sons, sem colocar um i antes ou no meio.'],
  end: ['termina con estos sonidos; no añadas una e al final.', 'termine nesses sons; não acrescente um i no final.'],
  l: ['como la l de sol; no añadas una vocal después.', 'a ponta da língua toca atrás dos dentes de cima; não troque o l por u.'],
  tion: ['suena "shan": sh + una a débil + n.', 'soa "chan": o ch de chá + um a fraco + n.'],
  edT: ['aquí -ed suena solo como t, sin una sílaba extra.', 'aqui -ed soa só como t, sem uma sílaba extra.'],
  edD: ['aquí -ed suena solo como d, sin una sílaba extra.', 'aqui -ed soa só como d, sem uma sílaba extra.'],
  edId: ['aquí -ed sí es una sílaba extra: "id".', 'aqui -ed é uma sílaba extra: "id".'],
  link: ['une las dos palabras como si fueran una sola, sin pausa.', 'junte as duas palavras como se fossem uma só, sem pausa.'],
  resume: ['con el significado de currículum suena RÉ · zu · mei: tres sílabas.', 'com o sentido de currículo soa RÉ · zu · mei: três sílabas.'],
  schedule: ['empieza directamente con "sk", sin poner una e delante (no "eskedul").', 'comece direto com "sk", sem vogal antes (não "isquedul").'],
} satisfies Record<string, [string, string]>;

type Cue = [label: string, sound: keyof typeof coaching];
// Labels identify the actual letters or sound sequence to notice in this word.
const targets: Record<string, Cue[]> = {
  "delay": [["ay","ay"],["d","end"]],
  "detour": [["e","ee"],["r","r"]],
  "miss a connection": [["ss","s"],["tion","tion"]],
  "get off at": [["ff","f"],["t","end"]],
  "register to vote": [["g","j"],["v","v"]],
  "put someone through": [["u in put","shortU"],["th","th"]],
  "sign up for": [["g","silent"],["n → up","link"]],
  "reach an agreement": [["ea","ee"],["gr","cluster"]],
  "raise a concern": [["s in raise","z"],["er","er"]],
  "purchase price": [["ur","er"],["i in price","eye"]],
  "comparison shop": [["sh","sh"],["r","r"]],
  "set aside": [["s in aside","s"],["i in aside","eye"]],
  "keep track of": [["ee","ee"],["tr","cluster"]],
  "total cost": [["o in total","oh"],["st","end"]],
  "run out of": [["u in run","uh"],["ou","ow"]],
  "stock up on": [["st","cluster"],["k → up","link"]],
  "buy in bulk": [["uy","eye"],["lk","end"]],
  "unit price": [["i in price","eye"],["ce","s"]],
  "serving size": [["v","v"],["i in size","eye"]],
  "go bad": [["o","oh"],["a in bad","ae"]],
  "cost of living": [["st","cluster"],["v","v"]],
  "security deposit": [["s in deposit","z"],["t","end"]],
  "utilities included": [["s in utilities","z"],["ed in included","edId"]],
  "qualify for": [["qu","w"],["y","eye"]],
  "rental application": [["r","r"],["tion","tion"]],
  "weigh your options": [["eigh","ay"],["tions","tion"]],
  "trade-off": [["tr","cluster"],["ff","f"]],
  "within your budget": [["th","dh"],["dg","j"]],
  "request a repair": [["qu","w"],["r","r"]],
  "report a problem": [["r","r"],["pr","cluster"]],
  "maintenance request": [["ai","ay"],["st","end"]],
  "clogged": [["cl","cluster"],["ed","edD"]],
  "availability": [["v","v"],["l","l"]],
  "responsibility": [["sp","cluster"],["i in bil","shortI"]],
  "work independently": [["or","er"],["nt","cluster"]],
  "previous position": [["v","v"],["tion","tion"]],
  "job duties": [["j","j"],["s","z"]],
  "work overtime": [["r","r"],["i in time","eye"]],
  "safety procedure": [["a in safe","ay"],["c","s"]],
  "call in sick": [["ll → in","link"],["i in sick","shortI"]],
  "cover a shift": [["v","v"],["sh","sh"]],
  "workplace policy": [["r","r"],["c","s"]],
  "file a complaint": [["i in file","eye"],["ai","ay"]],
  "violation": [["v","v"],["tion","tion"]],
  "constructive criticism": [["str","cluster"],["s in ism","z"]],
  "make a decision": [["a in make","ay"],["s in decision","zh"]],
  "take into account": [["a in take","ay"],["ou","ow"]],
  "persistent": [["er","er"],["st","cluster"]],
  "seek care": [["ee","ee"],["r","r"]],
  "follow-up appointment": [["ow in follow","oh"],["oi","oy"]],
  "recover from": [["v","v"],["fr","cluster"]],
  "ease up": [["s","z"],["s → up","link"]],
  "cut back on": [["u in cut","uh"],["a in back","ae"]],
  "build up": [["ui","shortI"],["d → up","link"]],
  "adjust to": [["j","j"],["st","cluster"]],
  "refill": [["i","shortI"],["ll","l"]],
  "over-the-counter": [["th","dh"],["ou","ow"]],
  "dosage": [["o","oh"],["g","j"]],
  "pharmacist": [["ph","f"],["st","end"]],
  "interaction": [["r","r"],["tion","tion"]],
  "treatment plan": [["ea","ee"],["pl","cluster"]],
  "unwind": [["w","w"],["i","eye"]],
  "work-life balance": [["r","r"],["a in balance","ae"]],
  "set boundaries": [["ou","ow"],["s","z"]],
  "recover your energy": [["v","v"],["g","j"]],
  "wear off": [["w","w"],["r → off","link"]],
  "make progress": [["a in make","ay"],["gr","cluster"]],
  "overcome a challenge": [["ch","ch"],["ge","j"]],
  "milestone": [["i","eye"],["o","oh"]],
  "take pride in": [["pr","cluster"],["i in pride","eye"]],
  "set a goal": [["oa","oh"],["l","l"]],

  "leave": [["ea", "ee"], ["v", "v"]],
  "find": [["i", "eye"], ["nd", "end"]],
  "turn down": [["ur", "er"], ["ow", "ow"]],
  "reschedule": [["sch", "schedule"], ["l", "l"]],
  "move in": [["v", "v"], ["v \u2192 in", "link"]],
  "check out": [["ch", "ch"], ["k \u2192 out", "link"]],
  "choose": [["ch", "ch"], ["s", "z"]],
  "fix": [["i", "shortI"], ["x", "end"]],
  "let someone know": [["k in know", "silent"], ["ow in know", "oh"]],
  "pay back": [["ay", "ay"], ["a in back", "ae"]],
  "respect": [["e in spect", "eh"], ["ct", "end"]],
  "follow the rules": [["th", "dh"], ["s", "z"]],
  "break a rule": [["ea", "ay"], ["r", "r"]],
  "think about": [["th", "th"], ["ou", "ow"]],
  "routine": [["r", "r"], ["ine", "ee"]],
  "side effect": [["i in side", "eye"], ["ct", "end"]],
  "take a break": [["a in take", "ay"], ["br", "cluster"]],
  "home remedy": [["h", "h"], ["e in rem", "eh"]],
  "rest": [["e", "eh"], ["st", "end"]],
  "sore throat": [["th", "th"], ["oa", "oh"]],
  "look back": [["oo", "shortU"], ["a in back", "ae"]],
  "rice": [["i", "eye"], ["ce", "s"]],
  "bread": [["br", "cluster"], ["ea", "eh"]],
  "milk": [["i", "shortI"], ["lk", "end"]],
  "eggs": [["e", "eh"], ["s", "z"]],
  "vegetables": [["g", "j"], ["s", "z"]],
  "fruit": [["fr", "cluster"], ["ui", "oo"]],

  "introduce": [["u", "oo"], ["ce", "s"]],
  "greet": [["ee", "ee"], ["t", "end"]],
  "share": [["sh", "sh"], ["r", "r"]],
  "describe": [["i", "eye"], ["b", "end"]],
  "prefer": [["f", "f"], ["er", "er"]],
  "catch up": [["tch", "ch"], ["catch + up", "link"]],
  "identify": [["i (inicio)", "eye"], ["fy", "eye"]],
  "categorize": [["g", "g"], ["ize", "eye"]],
  "practice": [["a", "ae"], ["s (final)", "end"]],
  "focus": [["o", "oh"], ["s (final)", "end"]],
  "notice": [["o", "oh"], ["i", "shortI"]],
  "compare": [["a (inicio)", "schwa"], ["r", "r"]],
  "correct": [["r", "r"], ["k + t", "end"]],
  "remember": [["r", "r"], ["er", "er"]],
  "apply": [["a", "schwa"], ["y", "eye"]],
  "log in": [["g", "g"], ["log + in", "link"]],
  "navigate": [["a (inicio)", "ae"], ["ate", "ay"]],
  "submit": [["u", "schwa"], ["i", "shortI"]],
  "access": [["a", "ae"], ["k + s", "cluster"]],
  "complete": [["ee (sonido)", "ee"], ["t", "end"]],
  "review": [["v", "v"], ["iew", "oo"]],
  "relocate": [["o", "oh"], ["ate", "ay"]],
  "motivate": [["o", "oh"], ["v", "v"]],
  "overcome": [["v", "v"], ["u (sonido de come)", "uh"]],
  "immigrate": [["i (inicio)", "shortI"], ["ate", "ay"]],
  "belong": [["ng", "ng"], ["e (inicio)", "shortI"]],
  "schedule": [["sch", "schedule"], ["l", "l"]],
  "commute": [["u", "oo"], ["t", "end"]],
  "prepare": [["r", "r"], ["e (inicio)", "shortI"]],
  "attend": [["a (inicio)", "schwa"], ["n + d", "end"]],
  "balance": [["a (inicio)", "ae"], ["n + s", "end"]],
  "exercise": [["k + s", "cluster"], ["s (última)", "z"]],
  "register": [["g", "j"], ["er", "er"]],
  "protect": [["r", "r"], ["k + t", "end"]],
  "verify": [["v", "v"], ["fy", "eye"]],
  "avoid": [["a", "schwa"], ["oi", "oy"]],
  "sign": [["g", "silent"], ["i", "eye"]],
  "update": [["u", "uh"], ["ate", "ay"]],
  "contact": [["a", "ae"], ["k + t", "end"]],
  "respond": [["e (inicio)", "shortI"], ["n + d", "end"]],
  "confirm": [["ir", "er"], ["m", "end"]],
  "decline": [["i", "eye"], ["n", "end"]],
  "postpone": [["o (post)", "oh"], ["o (pone)", "oh"]],
  "connect": [["o", "schwa"], ["k + t", "end"]],
  "vote": [["v", "v"], ["o", "oh"]],
  "elect": [["e (segunda)", "eh"], ["k + t", "end"]],
  "advocate": [["v", "v"], ["ate (verbo)", "ay"]],
  "petition": [["tion", "tion"], ["e (inicio)", "schwa"]],
  "represent": [["r", "r"], ["n + t", "end"]],
  "campaign": [["ai", "ay"], ["g", "silent"]],
  "volunteer": [["v", "v"], ["r", "r"]],
  "assist": [["a", "schwa"], ["s + t", "end"]],
  "support": [["u", "schwa"], ["r", "r"]],
  "contribute": [["i", "shortI"], ["t", "end"]],
  "donate": [["o", "oh"], ["ate", "ay"]],
  "join": [["j", "j"], ["oi", "oy"]],
  "participate": [["r", "r"], ["ate", "ay"]],
  "suggest": [["g (antes de est)", "j"], ["s + t", "end"]],
  "propose": [["o (segunda)", "oh"], ["s", "z"]],
  "recommend": [["e (inicio)", "eh"], ["n + d", "end"]],
  "agree": [["a", "schwa"], ["ee", "ee"]],
  "listen": [["t", "silent"], ["i", "shortI"]],
  "analyze": [["a (inicio)", "ae"], ["y", "eye"]],
  "resolve": [["s", "z"], ["v", "end"]],
  "improve": [["o", "oo"], ["v", "v"]],
  "collaborate": [["a (después de ll)", "ae"], ["ate", "ay"]],
  "report": [["r", "r"], ["t", "end"]],
  "prevent": [["v", "v"], ["n + t", "end"]],
  "purchase": [["ur", "er"], ["ch", "ch"]],
  "budget": [["dg", "j"], ["t", "end"]],
  "save": [["a", "ay"], ["v", "v"]],
  "spend": [["s + p", "cluster"], ["n + d", "end"]],
  "calculate": [["a (inicio)", "ae"], ["ate", "ay"]],
  "exchange": [["k + s", "cluster"], ["ch", "ch"]],
  "refund": [["u", "uh"], ["n + d", "end"]],
  "withdraw": [["th", "dh"], ["w", "w"]],
  "deposit": [["s", "z"], ["t", "end"]],
  "charge": [["ch", "ch"], ["ge", "j"]],
  "dispute": [["s + p", "cluster"], ["t", "end"]],
  "prices": [["i", "eye"], ["s (última)", "z"]],
  "inflation": [["a", "ay"], ["tion", "tion"]],
  "wages": [["a", "ay"], ["g", "j"]],
  "unemployed": [["oy", "oy"], ["ed", "edD"]],
  "interest rate": [["r", "r"], ["a (rate)", "ay"]],
  "economy": [["c", "k"], ["y", "ee"]],
  "rent": [["e", "eh"], ["n + t", "end"]],
  "lease": [["ea", "ee"], ["s", "s"]],
  "occupy": [["c", "k"], ["y", "eye"]],
  "move": [["o", "oo"], ["v", "v"]],
  "qualify": [["k + w", "cluster"], ["fy", "eye"]],
  "afford": [["a", "schwa"], ["r", "r"]],
  "evaluate": [["v", "v"], ["ate", "ay"]],
  "select": [["e (segunda)", "eh"], ["k + t", "end"]],
  "negotiate": [["o", "oh"], ["ate", "ay"]],
  "own": [["o", "oh"], ["n", "end"]],
  "request": [["k + w", "cluster"], ["s + t", "end"]],
  "inspect": [["s + p", "cluster"], ["k + t", "end"]],
  "repair": [["r", "r"], ["e (inicio)", "shortI"]],
  "leak": [["ea", "ee"], ["k", "end"]],
  "clog": [["k + l", "cluster"], ["g", "end"]],
  "maintain": [["ai (main)", "ay"], ["ai (tain)", "ay"]],
  "notify": [["o", "oh"], ["fy", "eye"]],
  "document": [["c", "k"], ["n + t", "end"]],
  "reimburse": [["ur", "er"], ["s", "s"]],
  "break": [["ea", "ay"], ["k", "end"]],
  "time off": [["i", "eye"], ["time + off", "link"]],
  "team": [["ea", "ee"], ["m", "end"]],
  "reliable": [["i", "eye"], ["ble", "l"]],
  "flexible": [["k + s", "cluster"], ["ble", "l"]],
  "clock in": [["k + l", "cluster"], ["clock + in", "link"]],
  "clock out": [["ou", "ow"], ["clock + out", "link"]],
  "call out": [["l", "l"], ["ou", "ow"]],
  "shift": [["sh", "sh"], ["f + t", "end"]],
  "supervisor": [["v", "v"], ["s (visor)", "z"]],
  "follow up": [["o (final de follow)", "oh"], ["p", "end"]],
  "experience": [["k + s", "cluster"], ["s (final)", "end"]],
  "resume": [["resume", "resume"], ["s", "z"]],
  "cover letter": [["o (cover)", "uh"], ["v", "v"]],
  "reference": [["r", "r"], ["s (final)", "end"]],
  "deadline": [["ea", "eh"], ["i", "eye"]],
  "promotion": [["o (segunda)", "oh"], ["tion", "tion"]],
  "gross pay": [["o", "oh"], ["ay", "ay"]],
  "deductions": [["u", "uh"], ["tion", "tion"]],
  "benefits": [["e (inicio)", "eh"], ["t + s", "end"]],
  "priority": [["r", "r"], ["i (primera)", "eye"]],
  "emergency fund": [["g", "j"], ["u (fund)", "uh"]],
  "must": [["u", "uh"], ["s + t", "end"]],
  "should": [["l", "silent"], ["ou", "shortU"]],
  "can": [["a (palabra sola)", "ae"], ["n", "end"]],
  "required": [["k + w", "cluster"], ["ed", "edD"]],
  "allowed": [["ow", "ow"], ["ed", "edD"]],
  "safety": [["a", "ay"], ["f + t", "cluster"]],
  "right": [["gh", "silent"], ["i", "eye"]],
  "courtesy": [["our", "er"], ["y", "ee"]],
  "strict": [["s + t + r", "cluster"], ["k + t", "end"]],
  "comply": [["o", "schwa"], ["y", "eye"]],
  "violate": [["v", "v"], ["ate", "ay"]],
  "feedback": [["ee", "ee"], ["a (back)", "ae"]],
  "advice": [["i", "eye"], ["ce", "s"]],
  "decision": [["s", "zh"], ["i (primera)", "shortI"]],
  "consequence": [["k + w", "cluster"], ["s (final)", "end"]],
  "reflect": [["r", "r"], ["k + t", "end"]],
  "clarify": [["k + l", "cluster"], ["fy", "eye"]],
  "show up": [["sh", "sh"], ["show + up", "link"]],
  "find out": [["i", "eye"], ["ou", "ow"]],
  "help out": [["l + p", "cluster"], ["help + out", "link"]],
  "look forward to": [["oo", "shortU"], ["w", "w"]],
  "cough": [["gh", "f"], ["c", "k"]],
  "infected": [["ed", "edId"], ["k + t", "cluster"]],
  "depressed": [["ed", "edT"], ["e (segunda)", "eh"]],
  "habit": [["h", "h"], ["a", "ae"]],
  "quit": [["k + w", "cluster"], ["i", "shortI"]],
  "recover": [["o", "uh"], ["v", "v"]],
  "lifestyle": [["i (life)", "eye"], ["s + t", "cluster"]],
  "adjust": [["j", "j"], ["s + t", "end"]],
  "appointment": [["oi", "oy"], ["n + t", "end"]],
  "checkup": [["ch", "ch"], ["u", "uh"]],
  "diagnosis": [["i (primera)", "eye"], ["o", "oh"]],
  "prescription": [["i", "shortI"], ["tion", "tion"]],
  "fever": [["ee (sonido)", "ee"], ["v", "v"]],
  "contagious": [["a", "ay"], ["g", "j"]],
  "symptom": [["y", "shortI"], ["m + p + t", "cluster"]],
  "temperature": [["t (antes de ure)", "ch"], ["r", "r"]],
  "prescribe": [["i", "eye"], ["b", "end"]],
  "dose": [["o", "oh"], ["s", "s"]],
  "chronic": [["ch", "k"], ["i", "shortI"]],
  "nutrient": [["u", "oo"], ["n + t", "end"]],
  "wellness": [["w", "w"], ["e (well)", "eh"]],
  "self-care": [["l + f", "cluster"], ["r", "r"]],
  "relax": [["a", "ae"], ["k + s", "end"]],
  "coping skills": [["o", "oh"], ["s + k", "cluster"]],
  "mindful": [["i", "eye"], ["u", "shortU"]],
  "processed": [["c", "s"], ["ed", "edT"]],
  "remedy": [["e (primera)", "eh"], ["y", "ee"]],
  "relieve": [["ie", "ee"], ["v", "v"]],
  "soothe": [["oo", "oo"], ["th", "dh"]],
  "fluids": [["u", "oo"], ["d + z", "end"]],
  "ailment": [["ai", "ay"], ["n + t", "end"]],
  "progress": [["r", "r"], ["s", "s"]],
  "challenge": [["ch", "ch"], ["ge", "j"]],
  "success": [["u", "schwa"], ["k + s", "cluster"]],
  "accomplish": [["o", "uh"], ["sh", "sh"]],
  "proud": [["ou", "ow"], ["d", "end"]],
  "reflection": [["e (segunda)", "eh"], ["tion", "tion"]],
  "goal": [["oa", "oh"], ["l", "l"]],
  "achievement": [["ch", "ch"], ["v", "v"]],
  "growth": [["ow", "oh"], ["th", "th"]],
  "confident": [["i", "shortI"], ["n + t", "end"]],
  "commitment": [["i", "shortI"], ["n + t", "end"]],
  "appreciate": [["c (antes de i)", "sh"], ["ate", "ay"]],
};

// Respellings in each language's own spelling: term | Spanish | Brazilian Portuguese.
// CAPS mark the strong syllable; hyphens become " · ". Shared keys:
// ii/uu = long vowel, ei/ai/ou/au/oi = one gliding sound, th/dh = tongue between teeth,
// sh = shhh. Spanish: j = soft h, dy = English j, zh = voiced sh, a = cut/cat vowels.
// Portuguese: rr = h, dj = English j, tch = ch, ch = sh, é = cat vowel, â = cut vowel.
// Model is the American audio; these stay approximations, never a replacement for it.
const respellings = `
delay | di-LÉI | di-LEI
detour | DÍI-tur | DII-tur
miss a connection | MIS a ko-NÉK-shan | MIS a ko-NÉK-chan
get off at | gue-TÓ-fat | gué-TÓ-fét
register to vote | RÉ-dyis-ter tu VOUT | RÉ-djis-ter tu VOUT
put someone through | put SÁM-uan THRUU | put SÂM-uân THRUU
sign up for | sai-NÁP for | sai-NÂP for
reach an agreement | RIICH an a-GRÍI-ment | RIITCH an a-GRII-ment
raise a concern | REIZ a kon-SÉRN | REIZ a kon-SERN
purchase price | PÉR-chas PRAIS | PER-tchas PRAIS
comparison shop | kom-PÉ-ri-son SHAP | kom-PÉ-ri-son CHAP
set aside | SET a-SÁID | SÉT a-SAID
keep track of | KIIP TRAK av | KIIP TRÉK av
total cost | TÓU-tal KOST | TOU-tal KÓST
run out of | ra-NÁU-tav | râ-NAU-tav
stock up on | sta-KÁ-pan | sta-KÂ-pan
buy in bulk | BAI in BALK | BAI in BÂLK
unit price | YÚU-nit PRAIS | IUU-nit PRAIS
serving size | SÉR-ving SAIZ | SER-ving SAIZ
go bad | gou BAD | gou BÉD
cost of living | KOST av LÍ-ving | KÓST av LI-ving
security deposit | si-KIÚ-ri-ti di-PÁ-zit | si-KIU-ri-ti di-PA-zit
utilities included | yu-TÍ-li-tiz in-KLÚU-did | iu-TI-li-tiz in-KLUU-did
qualify for | KUÁ-li-fai for | KUA-li-fai for
rental application | RÉN-tal a-pli-KÉI-shan | RÉN-tal é-pli-KEI-chan
weigh your options | UÉI yer ÁP-shanz | UEI ier AP-chanz
trade-off | TRÉI-dof | TREI-dóf
within your budget | ui-DHÍN yer BÁ-dyit | ui-DHIN ier BÂ-djit
request a repair | ri-KUÉST a ri-PÉR | ri-KUÉST a ri-PÉR
report a problem | ri-PÓRT a PRÁ-blem | ri-PÓRT a PRA-blem
maintenance request | MÉIN-te-nans ri-KUÉST | MEIN-te-nans ri-KUÉST
clogged | klagd | klagd
availability | a-vei-la-BÍ-li-ti | a-vei-la-BI-li-ti
responsibility | ris-pan-si-BÍ-li-ti | ris-pan-si-BI-li-ti
work independently | UERK in-di-PÉN-dent-li | UERK in-di-PÉN-dent-li
previous position | PRÍI-vi-as po-ZÍ-shan | PRII-vi-as po-ZI-chan
job duties | DYAB DÚU-tiz | DJAB DUU-tiz
work overtime | UERK ÓU-ver-taim | UERK OU-ver-taim
safety procedure | SÉIF-ti pro-SÍI-dyer | SEIF-ti pro-SII-djer
call in sick | KÓ-lin SIK | KÓ-lin SIK
cover a shift | KÁ-ve-ra SHIFT | KÂ-ve-ra CHIFT
workplace policy | UÉRK-pleis PÁ-li-si | UERK-pleis PA-li-si
file a complaint | FÁI-la kom-PLÉINT | FAI-la kom-PLEINT
violation | vai-o-LÉI-shan | vai-o-LEI-chan
constructive criticism | kons-TRÁK-tiv KRÍ-ti-si-zem | kons-TRÂK-tiv KRI-ti-si-zem
make a decision | MÉI-ka di-SÍ-zhan | MEI-ka di-SI-jan
take into account | TEIK in-tu a-KÁUNT | TEIK in-tu a-KAUNT
persistent | per-SÍS-tent | per-SIS-tent
seek care | SIIK KER | SIIK KÉR
follow-up appointment | FÁ-lou-ap a-PÓINT-ment | FA-lou-âp a-POINT-ment
recover from | ri-KÁ-ver from | ri-KÂ-ver from
ease up | ii-ZÁP | ii-ZÂP
cut back on | kat BÁ-kan | kât BÉ-kan
build up | bil-DÁP | bil-DÂP
adjust to | a-DYÁST tu | a-DJÂST tu
refill | RÍI-fil | RII-fil
over-the-counter | ou-ver-dha-KÁUN-ter | ou-ver-dha-KAUN-ter
dosage | DÓU-sidy | DOU-sidj
pharmacist | FÁR-ma-sist | FAR-ma-sist
interaction | in-ter-ÁK-shan | in-ter-ÉK-chan
treatment plan | TRÍIT-ment PLAN | TRIIT-ment PLÉN
unwind | an-UÁIND | ân-UAIND
work-life balance | UÉRK-laif BÁ-lans | UERK-laif BÉ-lans
set boundaries | SET BÁUN-driz | SÉT BAUN-driz
recover your energy | ri-KÁ-ver yer É-ner-dyi | ri-KÂ-ver ier É-ner-dji
wear off | ue-RÓF | ué-RÓF
make progress | MEIK PRÁ-gres | MEIK PRA-grés
overcome a challenge | ou-ver-KÁ-ma CHÁ-lendy | ou-ver-KÂ-ma TCHÉ-lendj
milestone | MÁIL-stoun | MAIL-stoun
take pride in | TEIK PRÁI-din | TEIK PRAI-din
set a goal | SÉ-ta GOUL | SÉ-ta GOUL
leave | liiv | liiv
find | faind | faind
turn down | tern DAUN | tern DAUN
reschedule | rii-SKÉ-dyul | rii-SKÉ-djul
move in | muu-VÍN | muu-VIN
check out | che-KÁUT | tché-KAUT
choose | chuuz | tchuuz
fix | fiks | fiks
let someone know | LET SÁM-uan NOU | LÉT SÂM-uân NOU
pay back | pei BAK | pei BÉK
respect | ris-PÉKT | ris-PÉKT
follow the rules | FÁ-lou dha RUULZ | FA-lou dha RUULZ
break a rule | BRÉI-ka RUUL | BREI-ka RUUL
think about | THINK a-BÁUT | THINK a-BAUT
routine | ruu-TÍIN | ruu-TIIN
side effect | SÁID i-fekt | SAID i-fékt
take a break | TÉI-ka BREIK | TEI-ka BREIK
home remedy | JOUM RÉ-me-di | RROUM RÉ-me-di
rest | rest | rést
sore throat | SOR THROUT | SÓR THROUT
look back | luk BAK | luk BÉK
rice | rais | rais
bread | bred | bréd
milk | milk | milk
eggs | egz | égz
vegetables | VÉDY-te-bolz | VÉDJ-te-bolz
fruit | fruut | fruut
introduce | in-tro-DÚUS | in-tro-DUUS
greet | griit | griit
share | sher | chér
describe | dis-KRÁIB | dis-KRAIB
prefer | pri-FÉR | pri-FER
catch up | ka-CHÁP | ké-TCHÂP
identify | ai-DÉN-ti-fai | ai-DÉN-ti-fai
categorize | KÁ-te-go-raiz | KÉ-te-go-raiz
practice | PRÁK-tis | PRÉK-tis
focus | FÓU-kas | FOU-kas
notice | NÓU-tis | NOU-tis
compare | kom-PÉR | kom-PÉR
correct | ko-RÉKT | ko-RÉKT
remember | ri-MÉM-ber | ri-MÉM-ber
apply | a-PLÁI | a-PLAI
log in | lo-GUÍN | ló-GUIN
navigate | NÁ-vi-gueit | NÉ-vi-gueit
submit | sab-MÍT | sab-MIT
access | ÁK-ses | ÉK-sés
complete | kom-PLÍIT | kom-PLIIT
review | ri-VIÚU | ri-VIUU
relocate | rii-LÓU-keit | rii-LOU-keit
motivate | MÓU-ti-veit | MOU-ti-veit
overcome | ou-ver-KÁM | ou-ver-KÂM
immigrate | Í-mi-greit | I-mi-greit
belong | bi-LÓNG | bi-LÓNG
schedule | SKÉ-dyul | SKÉ-djul
commute | ko-MIÚUT | ko-MIUUT
prepare | pri-PÉR | pri-PÉR
attend | a-TÉND | a-TÉND
balance | BÁ-lans | BÉ-lans
exercise | ÉK-ser-saiz | ÉK-ser-saiz
register | RÉ-dyis-ter | RÉ-djis-ter
protect | pro-TÉKT | pro-TÉKT
verify | VÉ-ri-fai | VÉ-ri-fai
avoid | a-VÓID | a-VOID
sign | sain | sain
update | ap-DÉIT | âp-DEIT
contact | KÁN-takt | KAN-tékt
respond | ris-PÁND | ris-PAND
confirm | kon-FÉRM | kon-FERM
decline | di-KLÁIN | di-KLAIN
postpone | poust-PÓUN | poust-POUN
connect | ko-NÉKT | ko-NÉKT
vote | vout | vout
elect | i-LÉKT | i-LÉKT
advocate | ÁD-vo-keit | ÉD-vo-keit
petition | pe-TÍ-shan | pe-TI-chan
represent | re-pri-ZÉNT | ré-pri-ZÉNT
campaign | kam-PÉIN | kém-PEIN
volunteer | va-lan-TÍR | va-lan-TIR
assist | a-SÍST | a-SIST
support | sa-PÓRT | sa-PÓRT
contribute | kon-TRÍ-biut | kon-TRI-biut
donate | DÓU-neit | DOU-neit
join | dyoin | djoin
participate | par-TÍ-si-peit | par-TI-si-peit
suggest | sag-DYÉST | sag-DJÉST
propose | pro-PÓUZ | pro-POUZ
recommend | re-ko-MÉND | ré-ko-MÉND
agree | a-GRÍI | a-GRII
listen | LÍ-sen | LI-sen
analyze | Á-na-laiz | É-na-laiz
resolve | ri-ZÁLV | ri-ZALV
improve | im-PRÚUV | im-PRUUV
collaborate | ko-LÁ-bo-reit | ko-LÉ-bo-reit
report | ri-PÓRT | ri-PÓRT
prevent | pri-VÉNT | pri-VÉNT
purchase | PÉR-chas | PER-tchas
budget | BÁ-dyit | BÂ-djit
save | seiv | seiv
spend | spend | spénd
calculate | KÁL-kiu-leit | KÉL-kiu-leit
exchange | iks-CHÉINDY | iks-TCHEINDJ
refund | RÍI-fand | RII-fând
withdraw | uidh-DRÓ | uidh-DRÓ
deposit | di-PÁ-zit | di-PA-zit
charge | chardy | tchardj
dispute | dis-PIÚUT | dis-PIUUT
prices | PRÁI-siz | PRAI-siz
inflation | in-FLÉI-shan | in-FLEI-chan
wages | UÉI-dyiz | UEI-djiz
unemployed | an-em-PLÓID | ân-em-PLOID
interest rate | ÍN-trest REIT | IN-trést REIT
economy | i-KÁ-no-mi | i-KA-no-mi
rent | rent | rént
lease | liis | liis
occupy | Á-kiu-pai | A-kiu-pai
move | muuv | muuv
qualify | KUÁ-li-fai | KUA-li-fai
afford | a-FÓRD | a-FÓRD
evaluate | i-VÁ-liu-eit | i-VÉ-liu-eit
select | se-LÉKT | se-LÉKT
negotiate | ni-GÓU-shi-eit | ni-GOU-chi-eit
own | oun | oun
request | ri-KUÉST | ri-KUÉST
inspect | ins-PÉKT | ins-PÉKT
repair | ri-PÉR | ri-PÉR
leak | liik | liik
clog | klag | klag
maintain | mein-TÉIN | mein-TEIN
notify | NÓU-ti-fai | NOU-ti-fai
document | DÁ-kiu-ment | DA-kiu-mént
reimburse | rii-im-BÉRS | rii-im-BERS
break | breik | breik
time off | tai-MÓF | tai-MÓF
team | tiim | tiim
reliable | ri-LÁI-a-bol | ri-LAI-a-bol
flexible | FLÉK-si-bol | FLÉK-si-bol
clock in | kla-KÍN | kla-KIN
clock out | kla-KÁUT | kla-KAUT
call out | ko-LÁUT | kó-LAUT
shift | shift | chift
supervisor | SÚU-per-vai-zer | SUU-per-vai-zer
follow up | fa-lou-ÁP | fa-lou-ÂP
experience | iks-PÍ-ri-ens | iks-PI-ri-ens
resume | RÉ-zu-mei | RÉ-zu-mei
cover letter | KÁ-ver LÉ-ter | KÂ-ver LÉ-ter
reference | RÉF-rens | RÉF-rens
deadline | DÉD-lain | DÉD-lain
promotion | pro-MÓU-shan | pro-MOU-chan
gross pay | GROUS PEI | GROUS PEI
deductions | di-DÁK-shanz | di-DÂK-chanz
benefits | BÉ-ne-fits | BÉ-ne-fits
priority | prai-Ó-ri-ti | prai-Ó-ri-ti
emergency fund | i-MÉR-dyen-si FAND | i-MER-djen-si FÂND
must | mast | mâst
should | shud | chud
can | kan | kén
required | ri-KUÁI-erd | ri-KUAI-erd
allowed | a-LÁUD | a-LAUD
safety | SÉIF-ti | SEIF-ti
right | rait | rait
courtesy | KÉR-te-si | KER-te-si
strict | strikt | strikt
comply | kom-PLÁI | kom-PLAI
violate | VÁI-o-leit | VAI-o-leit
feedback | FÍID-bak | FIID-bék
advice | ad-VÁIS | ad-VAIS
decision | di-SÍ-zhan | di-SI-jan
consequence | KÁN-se-kuens | KAN-se-kuens
reflect | ri-FLÉKT | ri-FLÉKT
clarify | KLÉ-ri-fai | KLÉ-ri-fai
show up | shou-ÁP | chou-ÂP
find out | fain-DÁUT | fain-DAUT
help out | jel-PÁUT | rrél-PAUT
look forward to | luk FÓR-uerd tu | luk FÓR-uerd tu
cough | kof | kóf
infected | in-FÉK-tid | in-FÉK-tid
depressed | di-PRÉST | di-PRÉST
habit | JÁ-bit | RRÉ-bit
quit | kuit | kuit
recover | ri-KÁ-ver | ri-KÂ-ver
lifestyle | LÁIF-stail | LAIF-stail
adjust | a-DYÁST | a-DJÂST
appointment | a-PÓINT-ment | a-POINT-ment
checkup | CHÉ-kap | TCHÉ-kâp
diagnosis | dai-ag-NÓU-sis | dai-ag-NOU-sis
prescription | pri-SKRÍP-shan | pri-SKRIP-chan
fever | FÍI-ver | FII-ver
contagious | kon-TÉI-dyas | kon-TEI-djas
symptom | SÍMP-tom | SIMP-tom
temperature | TÉM-pre-cher | TÉM-pre-tcher
prescribe | pri-SKRÁIB | pri-SKRAIB
dose | dous | dous
chronic | KRÁ-nik | KRA-nik
nutrient | NÚU-tri-ent | NUU-tri-ent
wellness | UÉL-nes | UÉL-nés
self-care | SELF KER | SÉLF KÉR
relax | ri-LÁKS | ri-LÉKS
coping skills | KÓU-ping SKILZ | KOU-ping SKILZ
mindful | MÁIND-ful | MAIND-ful
processed | PRÁ-sest | PRA-sést
remedy | RÉ-me-di | RÉ-me-di
relieve | ri-LÍIV | ri-LIIV
soothe | suudh | suudh
fluids | FLÚU-idz | FLUU-idz
ailment | ÉIL-ment | EIL-ment
progress | PRÁ-gres | PRA-grés
challenge | CHÁ-lendy | TCHÉ-lendj
success | sak-SÉS | sak-SÉS
accomplish | a-KÁM-plish | a-KAM-plich
proud | praud | praud
reflection | ri-FLÉK-shan | ri-FLÉK-chan
goal | goul | goul
achievement | a-CHÍIV-ment | a-TCHIIV-ment
growth | grouth | grouth
confident | KÁN-fi-dent | KAN-fi-dent
commitment | ko-MÍT-ment | ko-MIT-ment
appreciate | a-PRÍI-shi-eit | a-PRII-chi-eit
`;

const sounds: Record<string, [es: string, pt: string]> = Object.fromEntries(
  respellings.trim().split('\n').map(line => {
    const [term, es, pt] = line.split(' | ');
    return [term, [es, pt].map(guide => guide.replaceAll('-', ' · ')) as [string, string]];
  }),
);

// Brazilian readers say "tchi"/"dji" for ti/di; the respelling means a plain t or d.
const ptPalatalTip = 'ti / di: diga t e d como em tatu e dado, não tchi ou dji.';

const portugueseLabel = (label: string) => label.replace(/inicio/g, 'início').replace(/primera/g, 'primeira').replace(/después de/g, 'depois de').replace(/sonido/g, 'som').replace(/palabra sola/g, 'palavra isolada');

export const WEEKLY_LANGUAGE_HELP: Record<string, Record<'es' | 'pt-BR', LanguageHint>> = Object.fromEntries(
  Object.entries(targets).map(([term, cues]) => [term, {
    es: { sounds: sounds[term][0], tips: cues.map(([label, sound]) => `${label}: ${coaching[sound][0]}`) },
    'pt-BR': {
      sounds: sounds[term][1],
      tips: [
        ...cues.map(([label, sound]) => `${portugueseLabel(label)}: ${coaching[sound][1]}`),
        ...(/[td]i/i.test(sounds[term][1]) ? [ptPalatalTip] : []),
      ],
    },
  }]),
);

export const REVIEWED_RESCUE_PHRASES: Record<string, string> = {
  "advocate": "to advocate for better schools",
  "commute": "commute by train",
  "delay": "a twenty-minute delay",
  "detour": "take a detour",
  "miss a connection": "miss a connection",
  "get off at": "get off at Central Square",
  "register to vote": "register to vote",
  "put someone through": "put me through to billing",
  "sign up for": "sign up for a shift",
  "reach an agreement": "reach an agreement",
  "raise a concern": "raise a concern",
  "purchase price": "the purchase price",
  "comparison shop": "comparison shop before buying",
  "set aside": "set aside some money",
  "keep track of": "keep track of spending",
  "total cost": "the total cost",
  "run out of": "run out of coffee",
  "stock up on": "stock up on rice",
  "buy in bulk": "buy in bulk",
  "unit price": "compare the unit price",
  "serving size": "check the serving size",
  "go bad": "food can go bad",
  "cost of living": "the cost of living",
  "security deposit": "pay a security deposit",
  "utilities included": "utilities included in the rent",
  "qualify for": "qualify for housing",
  "rental application": "complete a rental application",
  "weigh your options": "weigh your options",
  "trade-off": "a reasonable trade-off",
  "within your budget": "within your budget",
  "request a repair": "request a repair",
  "report a problem": "report a problem",
  "maintenance request": "submit a maintenance request",
  "clogged": "a clogged sink",
  "availability": "my availability",
  "responsibility": "take responsibility",
  "work independently": "work independently",
  "previous position": "my previous position",
  "job duties": "my job duties",
  "work overtime": "work overtime",
  "safety procedure": "follow a safety procedure",
  "call in sick": "call in sick",
  "cover a shift": "cover a shift",
  "workplace policy": "check the workplace policy",
  "file a complaint": "file a complaint",
  "violation": "a safety violation",
  "constructive criticism": "give constructive criticism",
  "make a decision": "make a decision",
  "take into account": "take the cost into account",
  "persistent": "a persistent cough",
  "seek care": "seek care",
  "follow-up appointment": "a follow-up appointment",
  "recover from": "recover from surgery",
  "ease up": "the pain may ease up",
  "cut back on": "cut back on soda",
  "build up": "build up my strength",
  "adjust to": "adjust to a new routine",
  "refill": "request a refill",
  "over-the-counter": "over-the-counter medicine",
  "dosage": "explain the dosage",
  "pharmacist": "ask the pharmacist",
  "interaction": "a possible interaction",
  "treatment plan": "discuss a treatment plan",
  "unwind": "unwind after work",
  "work-life balance": "work-life balance",
  "set boundaries": "set boundaries",
  "recover your energy": "recover your energy",
  "wear off": "the effect may wear off",
  "make progress": "make progress",
  "overcome a challenge": "overcome a challenge",
  "milestone": "reach a milestone",
  "take pride in": "take pride in your work",
  "set a goal": "set a goal",

  introduce: 'introduce yourself', greet: 'greet your classmates', share: 'share a fact',
  describe: 'describe your neighborhood', prefer: 'prefer working with a partner', 'catch up': 'catch up with a friend',
  identify: 'identify the noun', categorize: 'categorize these words', practice: 'practice speaking English',
  focus: 'focus on one sentence', notice: 'notice the ending', compare: 'compare two sentences',
  correct: 'correct the verb', remember: 'remember the words', apply: 'apply the rule',
  relocate: 'relocate to a new city', motivate: 'motivate me to learn', overcome: 'overcome a problem',
  immigrate: 'immigrate to the U.S.', belong: 'belong to a group',
};
