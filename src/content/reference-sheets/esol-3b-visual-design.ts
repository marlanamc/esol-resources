/** Page-specific print compositions. Keep teaching content and stable page destinations. */
import { parse } from 'node-html-parser';
import type { BookPage } from './esol-3b-booklet';

type Matrix = { headers: string[]; rows: string[][]; html: string };
function matrix(body: string, index = 0): Matrix {
  const element = parse(body).querySelectorAll('table')[index];
  if (!element) throw new Error(`Missing table ${index}`);
  return {
    html: element.outerHTML,
    headers: element.querySelectorAll('thead th').map(cell => cell.innerHTML),
    rows: element.querySelectorAll('tbody tr').map(row => row.querySelectorAll('th, td').map(cell => cell.innerHTML)),
  };
}
function replaceTable(page: BookPage, index: number, render: (data: Matrix) => string) {
  const data = matrix(page.body, index);
  page.body = page.body.replace(data.html, render(data));
}
const arrow = '<span class="flow-arrow" aria-hidden="true">→</span>';
const tag = (label: string, text: string, role: string) => `<span class="sentence-piece ${role}"><small>${label}</small><b>${text}</b></span>`;
const sentence = (label: string, content: string) => `<div class="sentence-line"><span class="line-label">${label}</span><div class="sentence-pieces">${content}</div></div>`;
const strip = (label: string, body: string, cls = '') => `<div class="memory-strip ${cls}"><span class="memory-label">${label}</span>${body}</div>`;

export function composeVisualPages(pages: BookPage[]) {
  for (const page of pages) {
    switch (page.id) {
      case 'word-types': {
        const wordTypes = [
          ['Noun','N','#a83239'],['Pronoun','PRON','#a34d16'],
          ['Verb','V','#82620c'],['Article','ART','#34733e'],
          ['Adjective','ADJ','#17766e'],['Adverb','ADV','#285f9e'],
          ['Preposition','PREP','#534ba5'],['Conjunction','CONJ','#80419a'],
        ];
        const wordColors = new Map(wordTypes.flatMap(([name,abbr,color])=>[[name,color],[abbr,color]]));
        replaceTable(page, 0, data => `<div class="word-jobs">${data.rows.map(r => `<section class="word-job" style="--accent:${wordColors.get(r[0])}"><div><h2>${r[0]}</h2><p>${r[1]}</p><p class="job-example">${r[2]}</p></div></section>`).join('')}</div>`);
        const annotatedWords = [
          ['The','ART'],['helpful','ADJ'],['nurse','N'],['speaks','V'],['clearly,','ADV'],
          ['and','CONJ'],['she','PRON'],['listens','V'],['to','PREP'],['patients.','N'],
        ];
        page.body = page.body.replace(/<h2>See the sentence structure<\/h2><p>[\s\S]*?<\/p>/,
          '<h2>See each word’s job</h2>'+`<div class="annotated-sentence" aria-label="The helpful nurse speaks clearly, and she listens to patients.">${annotatedWords.map(([word,job])=>`<span class="annotated-word" style="--accent:${wordColors.get(job)}"><b>${word}</b><small>${job}</small></span>`).join('')}</div>`);
        break;
      }
      case 'pronouns':
        replaceTable(page, 1, data => `<div class="article-decisions">${data.rows.map((r,i) => `<section><span class="decision-number">${i+1}</span><h3>${r[0]}</h3><p>${r[1]}</p><p class="mini-example">${r[2]}</p></section>`).join('')}</div>`);
        break;
      case 'adverbs': {
        // A qualitative ladder: bars express order, never invented probabilities.
        replaceTable(page, 1, data => `<div class="frequency-ladder">${data.rows.map((r,i)=>`<div class="frequency-rung"><div class="frequency-word"><span class="frequency-mark" style="width:${[100, 80, 60, 42, 27, 15, 6, 0][i]}%"></span><b>${r[0]}</b></div><span>${r[1]}</span></div>`).join('')}</div>`);
        replaceTable(page, 0, data => `<div class="two-lenses">${[1,2].map(i=>`<section><h2>${data.headers[i]}</h2>${data.rows.map(r=>`<p><strong>${r[0]}:</strong> ${r[i]}</p>`).join('')}</section>`).join('')}</div>`);
        break;
      }
      case 'prepositions-time':
        replaceTable(page, 0, data => `<div class="time-lenses">${[1,2,0].map((i,n)=>`<section><div class="time-disc size-${n}"><b>${['AT','IN','ON'][i]}</b></div><h3>${data.headers[i].split(': ')[1]}</h3><p>${data.rows.map(r=>r[i]).join('<br>')}</p></section>`).join('')}</div>`);
        break;
      case 'prepositions-space':
        page.body = page.body.replace('These describe where something is — pictured here with a box and a dot.', 'Find the relationship. The dot is the object; the box is its landmark. Read each picture as a tiny scene.');
        break;
      case 'prepositions-movement':
        page.body = page.body.replace('These show the path or direction something moves.', 'Follow the arrow. Its starting point, path, and endpoint tell the story of the movement.');
        break;
      case 'verb-forms':
        replaceTable(page,0,data=>`<div class="verb-wardrobe">${data.rows.map((r,i)=>`<section><div class="form-tab">${r[0]}</div><div><h3>${r[1]}</h3><div class="form-examples"><b>${r[2]}</b><span>${r[3]}</span></div></div><span class="form-index">0${i+1}</span></section>`).join('')}</div>`);
        break;
      case 'tense-choices':
        replaceTable(page,0,data=>`<div class="meaning-choices">${data.rows.map((r,i)=>`<section><div class="choice-head"><span>${i+1}</span><h2>${r[0]}</h2></div><div class="choice-sentences">${r[1].split('<br>').map((s,j)=>`<p><b>${String.fromCharCode(65+j)}</b> ${s}</p>`).join('')}</div><p class="choice-meaning">${r[2]}</p></section>`).join('')}</div>`);
        break;
      case 'questions':
        page.body = strip('Move the helper',sentence('STATEMENT',tag('SUBJECT','She','subject')+tag('HELPER','is','helper')+tag('REST','ready.','object'))+sentence('QUESTION',tag('HELPER','Is','helper')+tag('SUBJECT','she','subject')+tag('REST','ready?','object')),'question-machine')+page.body;
        break;
      case 'two-clauses':
        page.body = page.body.replace('<h2>Read the order, not just the order of words</h2>', '<h2>Read the order, not just the order of words</h2>'+`<div class="event-order"><div><span class="event-dot">1</span><b>She had left.</b><small>EARLIER</small></div>${arrow}<div><span class="event-dot">2</span><b>I arrived.</b><small>LATER</small></div></div>`);
        break;
      case 'future-clauses':
        page.body = page.body.replace('<p><b>I will cook when you arrive.</b> → Cooking will start then.<br><b>I will be cooking when you arrive.</b> → Cooking will be in progress.<br><b>I will have cooked by the time you arrive.</b> → Cooking will be finished.</p>', `<div class="arrival-scenes"><section><span class="scene-symbol">START</span><h3>I will cook when you arrive.</h3><p>Cooking will start then.</p></section><section><span class="scene-symbol">IN PROGRESS</span><h3>I will be cooking when you arrive.</h3><p>Cooking will be in progress.</p></section><section><span class="scene-symbol">FINISHED</span><h3>I will have cooked by the time you arrive.</h3><p>Cooking will be finished.</p></section></div>`);
        break;
      case 'contractions':
        replaceTable(page,1,data=>`<div class="decode-grid">${data.rows.map(r=>`<div><b>${r[0]}</b>${arrow}<span>${r[1]}</span></div>`).join('')}</div>`);
        replaceTable(page,0,data=>`<div class="contraction-fold"><section><h2>Subject + helper</h2>${data.rows.map(r=>`<div><span>${r[0]}</span>${arrow}<b>${r[1]}</b></div>`).join('')}</section><section><h2>Negative & other forms</h2>${data.rows.map(r=>`<div><span>${r[2]}</span>${arrow}<b>${r[3]}</b></div>`).join('')}</section></div>`);
        break;
      case 'modals':
        replaceTable(page,0,data=>`<div class="modal-voices">${data.rows.map(r=>`<section><h2>${r[0]}</h2><div><p>${r[1]}</p><p class="voice-example">“${r[2]}”</p></div></section>`).join('')}</div>`);
        break;
      case 'modal-meaning':
        replaceTable(page,1,data=>`<div class="obligation-signs">${data.rows.map((r,i)=>`<section class="sign-${i}"><span class="sign-symbol">${['YES','TRY','DO','STOP','CHOICE'][i]}</span><div><h3>${r[0]}</h3><b>${r[1]}</b><p>${r[2]}</p></div></section>`).join('')}</div>`);
        replaceTable(page,0,data=>`<div class="certainty-grid">${data.rows.map((r,i)=>`<section><span class="evidence-mark">${['?','~','!','×'][i]}</span><div><h3>${r[0]}</h3><b>${r[1]}</b><p>${r[2]}</p></div></section>`).join('')}</div>`);
        break;
      case 'modals-past':
        page.body = page.body.replace('<h2>Past habits with would</h2>',strip('Look back',`<span class="past-equation">modal <b>+</b> have <b>+</b> V3</span><p>A possibility, deduction, regret, or imagined result about the past.</p>`)+'<h2>Past habits with would</h2>');
        break;
      case 'gerunds':
        replaceTable(page,0,data=>`<div class="verb-paths"><section><h2><span>-ing</span> The gerund path</h2>${data.rows.slice(0,3).map(r=>`<div><h3>${r[0]}</h3><p>${r[1]}</p><small>${r[2]}</small></div>`).join('')}</section><section><h2><span>to + V1</span> The infinitive path</h2>${data.rows.slice(3).map(r=>`<div><h3>${r[0]}</h3><p>${r[1]}</p><small>${r[2]}</small></div>`).join('')}</section></div>`);
        break;
      case 'verb-lists':
        replaceTable(page,0,data=>`<div class="word-shelves">${data.headers.map((head,i)=>`<section><span class="shelf-tag">${['-ING','TO + V1','EITHER'][i]}</span><h2>${head}</h2><p>${data.rows[0][i]}</p></section>`).join('')}</div>`);
        break;
      case 'conditionals':
        replaceTable(page,0,data=>`<div class="conditional-doors">${data.rows.map((r,i)=>`<section class="door-${i}"><span class="door-number">${i}</span><h2>${r[0]}</h2><div class="if-half"><small>CONDITION</small><b>${r[1]}</b></div><span class="door-arrow">↓</span><div class="result-half"><small>RESULT</small><b>${r[2]}</b></div><p>${r[3]}</p></section>`).join('')}</div>`);
        break;
      case 'comparisons':
        page.body=page.body.replace('<h2>Useful sentence patterns</h2>',`<div class="comparison-skyline"><div><span style="height:28px"></span><b>tall</b></div><div><span style="height:48px"></span><b>taller</b></div><div><span style="height:72px"></span><b>the tallest</b></div></div><h2>Useful sentence patterns</h2>`);
        break;
      case 'used-to':
        replaceTable(page,0,data=>`<div class="used-to-trio">${data.rows.map((r,i)=>`<section><small>${['THEN, NOT NOW','FAMILIAR NOW','BECOMING FAMILIAR'][i]}</small><h2>${r[0]}</h2><p>${r[1]}</p><div>${r[2]}</div></section>`).join('')}</div>`);
        break;
      case 'passive':
        page.body=page.body.replace('<p>Active: <b>Maria read the book.</b> The subject does the action.<br>Passive: <b>The book was read by Maria.</b> The subject receives the action.</p>',`<div class="focus-shift">${sentence('ACTIVE',tag('DOER','Maria','subject')+tag('ACTION','read','main')+tag('RECEIVER','the book.','object'))}<p>The subject does the action. Move the spotlight to the receiver:</p>${sentence('PASSIVE',tag('RECEIVER','The book','object')+tag('BE + V3','was read','main')+tag('BY + DOER','by Maria.','subject'))}<p>The subject receives the action.</p></div>`);
        break;
      case 'reported':
        page.body=page.body.replace('<h2>Said or told?</h2>', `<div class="speech-relay"><div class="speech-bubble"><small>HER WORDS</small>“I am tired.”</div>${arrow}<div class="report-bubble"><small>YOUR REPORT</small>She said she was tired.</div></div><h2>Said or told?</h2>`);
        break;
      case 'reported-context':
        replaceTable(page,0,data=>`<div class="context-shifts">${data.rows.map(r=>`<div><div class="context-pair"><b>${r[0]}</b>${arrow}<b>${r[1]}</b></div><p>${r[2]}</p></div>`).join('')}</div>`);
        break;
      case 'reporting-verbs':
        replaceTable(page,0,data=>`<div class="reporting-dictionary">${data.rows.map(r=>`<section><h2>${r[0]}</h2><p>${r[1]}</p><p class="dictionary-example">${r[2]}</p></section>`).join('')}</div>`);
        break;
    }
  }
}

export const VISUAL_BOOK_STYLE = `
#modals-past th,#modals-past td{padding-top:5px;padding-bottom:5px}
.family-focus{margin:0 0 20px;padding:0 0 13px;border-bottom:3px solid var(--accent)}
.family-focus p{font-size:17pt;line-height:1.2;font-weight:bold;color:var(--accent);margin:0 0 6px}
.family-focus span{font-size:11pt}
.tense-focus{break-inside:avoid;margin:0 0 22px}
.tense-focus h2{font-size:12pt;margin:0 0 8px;text-transform:uppercase;letter-spacing:.4px}
.tense-scene{display:grid;grid-template-columns:1fr 230px;gap:18px;align-items:start}
.tense-scene .timeline-wrap{width:230px;padding-top:3px}
.anchor-example{font-size:14pt;font-weight:bold;line-height:1.25;margin:0 0 8px}
.target-verb{text-decoration-thickness:1.5px;text-underline-offset:3px;text-decoration-skip-ink:auto}
.tense-use{font-size:11pt;line-height:1.35;margin:0 0 8px}
.tense-clues{font-size:10pt;margin:0 0 7px;color:#42534d}
.tense-clues b,.tense-detail b{color:var(--accent);margin-right:7px}
.tense-detail{font-size:10.5pt;line-height:1.32;border-left:2px solid var(--accent);padding:2px 0 2px 10px;margin:0}
.tense-navigation{font-size:10pt;line-height:1.35;border-top:1px solid #bdcdc4;padding-top:9px;margin-top:5px}
/* Each composition encodes a different grammar relationship. */
.body h3{font-size:11pt;line-height:1.25;margin:0 0 5px;color:var(--accent)}
.body small{font-size:10pt;line-height:1.25}
.memory-strip{background:color-mix(in srgb,var(--accent) 7%,white);border-top:3px solid var(--accent);padding:10px 14px;margin:12px 0}
.memory-label{display:block;text-transform:uppercase;font-size:10pt;letter-spacing:1px;color:var(--accent);font-weight:bold;margin-bottom:8px}
.sentence-line{display:flex;align-items:center;gap:12px;margin:8px 0}.line-label{font-size:10pt;font-weight:bold;width:80px;flex-shrink:0;color:var(--accent)}
.sentence-pieces{display:flex;flex:1;gap:6px}.sentence-piece{display:flex;flex-direction:column;justify-content:center;flex:1;padding:8px 10px;border-bottom:3px solid currentColor}.sentence-piece small{font-size:9pt!important;letter-spacing:.5px}.sentence-piece b{font-size:14pt;line-height:1.25}.sentence-piece.subject{color:#713c91;background:#f4edf8}.sentence-piece.helper{color:#17599a;background:#eaf2f9}.sentence-piece.main{color:#9b421b;background:#fbf0e8}.sentence-piece.object{color:#286b58;background:#eaf5f0}
.flow-arrow{color:var(--accent);font-size:20pt;line-height:1;flex-shrink:0}.mini-example,.job-example{font-weight:bold}
.annotated-sentence{display:flex;justify-content:space-between;gap:7px;margin:14px 0 10px}.annotated-word{display:flex;flex-direction:column;align-items:center;gap:7px}.annotated-word b{font-size:14pt;white-space:nowrap;font-weight:400;border-bottom:2px solid var(--accent);padding-bottom:5px}.annotated-word small{font-size:10pt;font-weight:bold;color:var(--accent)}.word-type-key{font-size:10pt;line-height:1.5;margin:12px 0 15px}
.word-jobs{display:grid;grid-template-columns:1fr 1fr;gap:14px 22px;margin:15px 0}.word-job{display:flex;gap:9px;border-top:2px solid color-mix(in srgb,var(--accent) 35%,white);padding-top:7px}.word-job h2{margin:0 0 4px}.word-job p{font-size:10.5pt;margin-bottom:5px}
#word-types .sentence-line{margin:8px 0}#word-types .body>p:last-of-type{font-size:10pt}
.article-decisions{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:12px 0}.article-decisions section{border-top:3px solid var(--accent);position:relative;padding-top:8px}.decision-number{float:right;font-size:26pt;color:color-mix(in srgb,var(--accent) 40%,white)}.article-decisions h3{font-size:17pt}.article-decisions p{font-size:10pt;margin-bottom:7px}
.two-lenses{display:grid;grid-template-columns:1fr 1fr;gap:22px}.two-lenses section{--accent:#37558d;padding:12px;border-top:4px solid var(--accent);background:color-mix(in srgb,var(--accent) 5%,white)}.two-lenses section+section{--accent:#b05740}.two-lenses h2{margin:0 0 7px}.two-lenses p{font-size:10.5pt;margin-bottom:6px}
.frequency-ladder{margin:12px 0}.frequency-rung{display:grid;grid-template-columns:38% 62%;align-items:center;min-height:34px;border-bottom:1px solid #dce3df;gap:0}.frequency-word{position:relative;padding:7px 9px}.frequency-mark{position:absolute;inset:0 auto 0 0;background:color-mix(in srgb,var(--accent) 15%,white);border-left:3px solid var(--accent)}.frequency-word b{position:relative;font-size:10.5pt}.frequency-rung>span{font-size:10.5pt;padding-left:10px}
.time-lenses{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin:12px 0 18px}.time-lenses section{position:relative;border-bottom:3px solid var(--accent);padding:4px 9px 10px}.time-lenses section:nth-child(1){--accent:#37558d}.time-lenses section:nth-child(2){--accent:#6b4fb8}.time-lenses section:nth-child(3){--accent:#b05740}.time-disc{border:2px solid var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;background:color-mix(in srgb,var(--accent) 10%,white);width:64px;height:64px}.time-disc.size-1{width:52px;height:52px;margin-top:12px}.time-disc.size-2{width:40px;height:40px;margin-top:24px}.time-disc b{font-size:17pt;color:var(--accent)}.time-lenses h3{text-align:center}.time-lenses p{font-size:10pt;line-height:1.4;margin:0}
#prepositions-space .pictures{gap:15px 14px}#prepositions-space figure{position:relative;isolation:isolate;border-radius:45% 45% 0 0;padding-bottom:10px}#prepositions-space figure::before{content:"";position:absolute;left:0;right:0;bottom:0;height:38%;background:#f6eee8;z-index:-1}#prepositions-space figure:nth-child(3n+2)::before{background:#edf2f9}#prepositions-space figure:nth-child(3n)::before{background:#f1edf7}
#prepositions-movement .pictures{gap:18px 12px;counter-reset:route}#prepositions-movement figure{position:relative;border:1px dashed #bd9b88;border-radius:12px;background:#fffaf5}#prepositions-movement figure:before{counter-increment:route;content:counter(route,decimal-leading-zero);position:absolute;left:7px;top:4px;font-size:10pt;color:var(--accent)}
.verb-wardrobe{margin:13px 0}.verb-wardrobe section{display:flex;align-items:center;gap:14px;border-bottom:1px solid #b8c4d5;padding:7px 0}.form-tab{background:var(--accent);color:white;border-radius:0 14px 14px 0;font-size:16pt;font-weight:bold;padding:9px;width:108px;flex-shrink:0}.form-examples{display:flex;gap:30px;font-size:12pt}.form-index{margin-left:auto;font-size:24pt;color:#8f9cb3}.pattern-key{display:flex;gap:12px;margin:10px 0}.pattern-key span{flex:1;border-top:3px solid var(--accent);padding:6px 3px}.pattern-key b,.pattern-key small{display:block;font-size:10pt}.pattern-key small{margin-top:4px}.irregular{margin-top:5px!important}#irregular-verbs .irregular td,#irregular-verbs .irregular th{padding-top:3px;padding-bottom:3px}
.meaning-choices{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}.meaning-choices section{border:1px solid #b9ccc5;border-top:0;padding:0 10px 10px}.choice-head{display:flex;align-items:center;gap:10px;margin:0 -10px 10px;background:#edf4ef}.choice-head>span{font-size:23pt;padding:8px 12px;color:white;background:var(--accent)}.choice-head h2{margin:0;font-size:12pt}.choice-sentences p{font-size:10.5pt;line-height:1.4;margin:6px 0}.choice-sentences b{color:var(--accent)}.choice-meaning{font-size:10pt;border-top:1px dashed #adc1b9;padding-top:7px;margin:9px 0 0}
.question-machine{margin-top:0;padding-top:8px}.question-machine .sentence-piece{padding:6px 9px}.question-machine .sentence-piece b{font-size:15pt}#questions th,#questions td{padding:6px 8px}
.event-order{display:flex;align-items:center;justify-content:center;gap:25px;margin:12px 0 18px;padding:16px;background:#eef5f8}.event-order>div{display:grid;grid-template-columns:42px 1fr;gap:0 10px}.event-dot{grid-row:span 2;border-radius:50%;background:var(--accent);color:white;text-align:center;font-size:20pt;width:38px;height:38px}.event-order small{color:var(--accent);letter-spacing:1px}
.arrival-scenes{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:12px 0}.arrival-scenes section{border-top:5px solid var(--accent);padding:10px;background:#eef4f8}.arrival-scenes section:nth-child(2){border-top-style:dashed}.arrival-scenes section:nth-child(3){border-top-style:double}.scene-symbol{display:block;font-size:10pt;font-weight:bold;color:var(--accent);margin-bottom:10px}.arrival-scenes h3{font-size:11pt;line-height:1.4}.arrival-scenes p{font-size:10pt;margin:10px 0 0}
.contraction-fold{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:14px}.contraction-fold section+section{border-left:2px dashed #a8bccb;padding-left:18px}.contraction-fold h2{margin:0 0 12px}.contraction-fold section>div{display:grid;grid-template-columns:1fr 17px 1fr;gap:7px;align-items:center;border-bottom:1px solid #d6e2eb;padding:8px 0;font-size:10pt;line-height:1.35}.contraction-fold .flow-arrow{font-size:14pt}.contraction-fold b{color:var(--accent)}.decode-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.decode-grid>div{padding:10px;background:#edf4f8;display:grid;grid-template-columns:1fr 16px 1fr;gap:7px;align-items:center;font-size:10pt}.decode-grid .flow-arrow{font-size:13pt}
.modal-voices{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;margin:12px 0}.modal-voices section{border-bottom:1px solid #d7c1ab;padding:5px 0 8px}.modal-voices h2{font-size:18pt;margin:0 0 4px}.modal-voices p{font-size:10pt;line-height:1.35;margin:0 0 5px}.voice-example{font-weight:bold}.modal-voices section:last-child{grid-column:span 2;display:flex;gap:18px;align-items:center}
.certainty-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px 20px;margin:10px 0}.certainty-grid section{display:flex;gap:12px;border-bottom:1px solid #d9c9b5;padding:6px 0}.evidence-mark{font-size:28pt;line-height:1.1;color:var(--accent);width:25px}.certainty-grid p,.certainty-grid b{font-size:10pt;margin:3px 0 5px}.certainty-grid h3{font-size:11pt}.obligation-signs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}.obligation-signs section{border-top:3px solid var(--accent);padding:8px;background:color-mix(in srgb,var(--accent) 6%,white)}.obligation-signs .sign-3,.obligation-signs .sign-4{grid-column:auto}.sign-symbol{display:inline-block;border:2px solid var(--accent);border-radius:6px;padding:3px 6px;color:var(--accent);font-size:11pt;font-weight:bold;margin-bottom:8px}.obligation-signs .sign-3{--accent:#a32146}.obligation-signs .sign-4{--accent:#286b58}.obligation-signs b,.obligation-signs p{font-size:10pt;line-height:1.3}.obligation-signs p{margin:5px 0 0}.past-equation{font-size:21pt;color:var(--accent);letter-spacing:1px}.past-equation b{font-size:15pt}#modals-past .memory-strip{padding:8px 13px}#modals-past .memory-strip p{font-size:10pt;margin:5px 0 0}
.verb-paths{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:10px 0}.verb-paths section{border-left:3px solid var(--accent);padding-left:12px}.verb-paths section+section{--accent:#6b4fb8}.verb-paths h2{font-size:12pt;margin:0 0 10px}.verb-paths h2 span{display:block;font-size:21pt;margin-bottom:4px}.verb-paths section>div{margin-bottom:4px;border-bottom:1px solid #d4dce3;padding-bottom:4px}.verb-paths h3{font-size:10pt}.verb-paths p{font-size:10pt;font-weight:bold;margin-bottom:2px}.verb-paths small{font-size:10pt;display:block}#gerunds .body>h2{margin-top:12px}#gerunds .body>p{font-size:10pt}#gerunds td,#gerunds th{padding-top:5px;padding-bottom:5px}
.word-shelves{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin:20px 0}.word-shelves section{border-bottom:5px solid var(--accent)}.word-shelves section:nth-child(2){--accent:#6b4fb8}.word-shelves section:nth-child(3){--accent:#946016}.shelf-tag{display:block;font-size:23pt;color:var(--accent);border-top:5px solid var(--accent);padding-top:9px;font-weight:bold}.word-shelves h2{font-size:11pt;min-height:32px;margin:8px 0}.word-shelves p{font-size:11pt;line-height:1.5;margin:10px 0 15px}
.conditional-doors{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:10px 0}.conditional-doors section{border:1px solid #d0dad6;border-top:5px solid var(--door);padding:10px 12px;position:relative}.door-0{--door:#37558d}.door-1{--door:#286b58}.door-2{--door:#946016}.door-3{--door:#713c91}.door-number{display:block;font-size:26pt;line-height:1;color:var(--door);font-weight:bold}.conditional-doors h2{font-size:12pt;color:var(--door);margin:8px 0 12px;min-height:32px}.if-half,.result-half{background:color-mix(in srgb,var(--door) 7%,white);padding:7px}.conditional-doors small{display:block;font-size:9pt;letter-spacing:1px;color:var(--door)}.conditional-doors b{font-size:10pt;display:block}.door-arrow{display:block;text-align:center;color:var(--door);font-size:17pt;line-height:1.1}.conditional-doors p{font-size:10pt;margin:10px 0 0}#conditionals .body>h2{margin-top:10px}
.comparison-skyline{display:flex;align-items:flex-end;justify-content:center;gap:35px;margin:15px 0}.comparison-skyline>div{width:120px;text-align:center}.comparison-skyline span{display:block;background:color-mix(in srgb,var(--accent) 25%,white);border-top:4px solid var(--accent);margin-bottom:4px}.comparison-skyline b{font-size:12pt;color:var(--accent)}#comparisons th,#comparisons td{padding-top:6px;padding-bottom:6px}
.used-to-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:12px 0 18px}.used-to-trio section{border-top:5px solid var(--accent);padding:12px 10px;background:color-mix(in srgb,var(--accent) 5%,white)}.used-to-trio section:first-child{border-top-style:dashed}.used-to-trio section:last-child{border-top-style:double}.used-to-trio h2{font-size:17pt;margin:12px 0}.used-to-trio small{font-size:9pt;letter-spacing:.5px;color:var(--accent);font-weight:bold}.used-to-trio p{font-size:10.5pt}.used-to-trio section>div{font-size:10.5pt;border-top:1px solid #d2c8e3;padding-top:10px}
.focus-shift .sentence-piece{padding:5px 9px}.focus-shift .sentence-piece b{font-size:13pt}.focus-shift p{font-size:10pt;margin:3px 0}.focus-shift{margin-bottom:12px}#passive th,#passive td{padding-top:3px;padding-bottom:3px}.focus-shift .sentence-line{margin:5px 0}
.speech-relay{display:flex;align-items:center;gap:15px;margin:20px 0}.speech-bubble,.report-bubble{flex:1;padding:13px 17px;font-size:16pt;background:#f1edf7;border-radius:18px 18px 18px 0;border:1px solid #c9bada}.report-bubble{border-radius:18px 18px 0 18px;background:#f8f5fb}.speech-relay small{display:block;color:var(--accent);font-size:9pt;letter-spacing:1px;margin-bottom:7px}
.context-shifts{display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;margin:12px 0}.context-shifts>div{border-bottom:1px solid #d3c4db;padding:7px 0}.context-pair{display:flex;gap:8px;align-items:center;color:var(--accent);font-size:11pt}.context-pair .flow-arrow{font-size:16pt}.context-shifts p{font-size:10pt;margin:6px 0 3px}.context-shifts>div:last-child{grid-column:span 2}
.reporting-dictionary{display:grid;grid-template-columns:1fr 1fr;gap:10px 25px;margin:13px 0}.reporting-dictionary section{border-top:1px solid #d3c2db;padding-top:6px}.reporting-dictionary h2{font-size:17pt;margin:0 0 5px}.reporting-dictionary p{font-size:10.5pt;margin:3px 0}.dictionary-example{font-weight:bold}
`;
