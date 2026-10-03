#!/usr/bin/env node
/** Build the offline binder book: node --import tsx scripts/reference-sheets/build-esol-3b-grammar.ts */
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TimelineCanvas } from '@/components/games/TimelineTensesGame/TimelineCanvas';
import { PrepositionIcon } from '@/components/reference/PrepositionIcon';
import { LEARN_TENSES_LESSONS, type LearnTensesFamilyId } from '@/data/timeline-learn-tenses';
import { REFERENCE_SECTIONS, REFERENCE_FAMILIES } from '@/content/reference-sheets/esol-3b-grammar';
import { foundations, laterPages, tenseDetails, table, note, p, h, ref, type BookPage } from '@/content/reference-sheets/esol-3b-booklet';
import { emphasizeExamples, FOCUS_STYLE } from '@/content/reference-sheets/esol-3b-focus';
import { navigationGroups, navigationBody, NAVIGATION_STYLE } from '@/content/reference-sheets/esol-3b-navigation';
import { sentenceBuilder, connectorPage, SENTENCE_SUPPORT_STYLE } from '@/content/reference-sheets/esol-3b-sentence-support';
import { composeVisualPages, VISUAL_BOOK_STYLE } from '@/content/reference-sheets/esol-3b-visual-design';
type BookTenseFamily = Exclude<LearnTensesFamilyId, 'used-to'>;
const families: BookTenseFamily[] = ['simple','continuous','perfect','perfect-continuous'];
const cards = families.flatMap(f => [...LEARN_TENSES_LESSONS[f].cards].filter(c=>c.id!=='continuous-present-near-future').sort((a,b)=>['present','past','future'].indexOf(a.timeSlot)-['present','past','future'].indexOf(b.timeSlot)));
if(cards.length!==12 || cards.some(c=>!tenseDetails[c.id])) throw new Error('All 12 tense explanations are required');
const timeline = (c: typeof cards[number]) => `<div class="timeline-wrap" role="img" aria-label="${c.tenseName}: ${tenseDetails[c.id].use}">${renderToStaticMarkup(React.createElement(TimelineCanvas,{elements:c.timelineElements,showLabels:false,showVerbLabels:false}))}<div class="axis-key"><span>PAST</span><span>NOW</span><span>FUTURE</span></div></div>`;
function printPreposition(kind: NonNullable<typeof REFERENCE_SECTIONS[number]['prepositionIcons']>[number]['kind']) {
 let svg=renderToStaticMarkup(React.createElement(PrepositionIcon,{kind,size:76}));
 // Unique marker references and clearer physical landmarks for the paper edition.
 svg=svg.replaceAll('preposition-arrowhead',`prep-${kind}-arrow`);
 if(kind==='under-the-wall') svg=svg.replace('</svg>','<rect x="35" y="8" width="30" height="46" fill="#f2e9e3" stroke="#b05740" stroke-width="2.5"/></svg>');
 if(kind==='through') svg=svg.replace('</svg>','<ellipse cx="35" cy="40" rx="6" ry="15" fill="none" stroke="#b05740" stroke-width="2"/><ellipse cx="65" cy="40" rx="6" ry="15" fill="none" stroke="#b05740" stroke-width="2"/></svg>');
 if(kind==='across') svg=svg.replace('</svg>','<path d="M 25 25 L 25 55 M 75 25 L 75 55 M 25 28 L 75 28 M 25 52 L 75 52" fill="none" stroke="#b05740" stroke-width="2"/></svg>');
 return svg;
}
const colorFormula = (value:string) => value.replaceAll('V1-3rd','V1-s').replaceAll('V1-ing','V-ing').replace(/subject|V1-s|V-ing|V[123]|not|won't|am\/is\/are|was\/were|have\/has|do\(es\)|will|been|be|had|did|have|has|does|do|was|were|am|is|are/gi, token => {
 const low=token.toLowerCase(); const role=low==='subject'?'subject':/^v(?:[123]|-ing)/i.test(token)?'main':low==='not'||low==="won't"?'negative':'helper';
 return `<b class="syntax-${role}">${token}</b>`;
});
const colorExample = (value:string) => value.replace(/\b(She|she|walks|walked|walking|walk|does|Does|did|Did|will|Will|is|Is|was|Was|be|been|has|Has|had|Had|have|not)\b/g, token => {
 const low=token.toLowerCase(); const role=low==='she'?'subject':low.startsWith('walk')?'main':low==='not'?'negative':'helper';
 return `<b class="syntax-${role}">${token}</b>`;
});
const syntaxKey = `<div class="syntax-key"><span class="syntax-subject">Subject</span><span class="syntax-helper">Helping verb</span><span class="syntax-main">Main verb</span><span class="syntax-negative">Negative</span></div>`;
const pages: BookPage[] = [...foundations];
pages.splice(1,0,sentenceBuilder);
for(const id of ['prepositions-space','prepositions-movement']) {
 const s=REFERENCE_SECTIONS.find(x=>x.id===id)!;
 const pictures=s.prepositionIcons!.map(x=>`<figure>${printPreposition(x.kind)}<figcaption>${x.label.replace('on to','onto')}</figcaption></figure>`).join('');
 pages.push({id,title:id==='prepositions-space'?'Prepositions of Place':s.title,chapter:'02 / Time, place & movement',body:p(s.rule)+`<div class="pictures">${pictures}</div>`+note('Compare the meanings',id==='prepositions-space'?'On means touching a surface; above means higher, with no contact required. Under and below both mean lower; under often means directly beneath. Between identifies a position among distinct things.':'In / on describe a position. Into / onto show movement to that position. Across goes from one side to the other; through goes inside a space and out. Toward gives direction, without saying you arrive.')+p(id==='prepositions-space'?'The keys are <b>in</b> the bag. The bag is <b>under</b> the chair. The chair is <b>next to</b> the table.':'Walk <b>across</b> the street, go <b>through</b> the door, and walk <b>up</b> the stairs.')});
}
pages.push({id:'verb-forms',title:'The five verb forms',chapter:'03 / Formula charts',body:p('The formulas use short labels for verb forms. These labels name the shape of a verb, not a complete tense.')+table(['Label','Meaning','Regular','Irregular'],[['V1','Base Form (V1)','walk','go / eat'],['V1-s','He / She / It Form (V1-s)','walks','goes / eats'],['V-ing','-ing Form (V-ing)','walking','going / eating'],['V2','Past Form (V2)','walked','went / ate'],['V3','Past Participle (V3)','walked','gone / eaten']])+h('Match the subject and helper')+table(['Subject','Present be','Past be','Present helpers'],[['I','am','was','have / do'],['he / she / it','is','was','has / does'],['you / we / they','are','were','have / do']])+h('Spelling patterns')+p('<b>-s / -es:</b> work → works; watch → watches; study → studies.<br><b>-ing:</b> work → working; make → making; run → running; lie → lying.<br><b>-ed:</b> work → worked; live → lived; study → studied; stop → stopped.')+note('One helper changes the next verb','After <b>do / does / did</b> and modals such as <b>will</b>, use V1. After perfect <b>have / has / had</b>, use V3. Continuous forms need <b>be + V-ing</b>.')+note('Reading the charts','“Subject” means I, she, the students, etc. Choose one form from a slash list: am / is / are. '+ref('formulas','The next chart')+' shows all three sentence forms.')});
pages.push({id:'irregular-verbs',title:'How irregular verbs work',chapter:'03 / Formula charts',body:p('Regular verbs add <b>-ed</b> for V2 and V3. Irregular verbs have their own patterns. Learn the three forms together.')+table(['Base Form (V1)','Past Form (V2)','Past Participle (V3)','Pattern'],[
['put','put','put','All three match'],['buy','bought','bought','V2 and V3 match'],['come','came','come','V1 and V3 match'],['go','went','gone','Three different forms'],['take','took','taken','Three different forms'],['read','read','read','Same spelling; different sound']],'irregular-concepts')+h('Choose the form for your sentence')+p('<b>Past: She went to work.</b> → Use V2.<br><b>Perfect: She has gone to work.</b> → After have / has / had, use V3.')+note('After did, return to V1','<b>Did she go?</b> / <b>She did not go.</b> Not “Did she went?”')+note('Read: listen for the difference','V1 read sounds like “reed.” V2 and V3 read sound like “red.”')+p('<b>Get → got → gotten / got.</b> Gotten is common in US English for become or obtain; got is common in British English.')+p('<b>Need another verb? See your Verb Reference.</b>')});
pages.push({id:'formulas',title:'12 tenses: formula chart',chapter:'03 / Formula charts',landscape:true,body:'<p class="lookup-cue"><b>REFERENCE, NOT MEMORIZATION</b> · Use this chart when you know the tense and need the pattern.</p>'+p('V1 = Base Form • V1-s = He / She / It Form • V-ing = -ing Form • V2 = Past Form • V3 = Past Participle. See '+ref('verb-forms','verb forms')+'.')+syntaxKey+table(['Tense','Affirmative','Negative','Question'],cards.map(c=>[`<span class="family-${c.id.replace(/-(present|past|future)$/,'')}">${c.tenseName}</span>`,colorFormula(c.formulas.affirmative),colorFormula(c.formulas.negative),colorFormula(c.formulas.question.endsWith('?')?c.formulas.question:c.formulas.question+'?')]),'master')+note('Simple be is different','Present: I am / she is / they are. Past: I / she was; you / they were. Add not for negatives; move be before the subject for questions. Do not add do / did.')});
const worked=[['She walks.','She does not walk.','Does she walk?'],['She walked.','She did not walk.','Did she walk?'],['She will walk.','She will not walk.','Will she walk?'],['She is walking.','She is not walking.','Is she walking?'],['She was walking.','She was not walking.','Was she walking?'],['She will be walking.','She will not be walking.','Will she be walking?'],['She has walked.','She has not walked.','Has she walked?'],['She had walked.','She had not walked.','Had she walked?'],['She will have walked.','She will not have walked.','Will she have walked?'],['She has been walking.','She has not been walking.','Has she been walking?'],['She had been walking.','She had not been walking.','Had she been walking?'],['She will have been walking.','She will not have been walking.','Will she have been walking?']];
pages.push({id:'worked',title:'12 tenses: one verb, every pattern',chapter:'03 / Formula charts',landscape:true,body:p('<b>walk → walks → walking → walked → walked.</b> Follow the same subject and verb across all twelve patterns. Full forms make the helpers easier to see.')+syntaxKey+table(['Tense','Affirmative','Negative','Question'],cards.map((c,i)=>[`<span class="family-${c.id.replace(/-(present|past|future)$/,'')}">${c.tenseName}</span>`,...worked[i].map(colorExample)]),'master')+note('Notice the helper','She <b>walks</b> → Does she <b>walk</b>? She <b>walked</b> → Did she <b>walk</b>? In longer verb phrases, move only the first helper to begin the question.')});
const familyFocus: Record<BookTenseFamily, { idea:string; cue:string }> = {
 simple:{idea:'Say what happens, happened, or will happen.',cue:'Routines & facts • finished past • predictions & decisions'},
 continuous:{idea:'Picture an action in progress.',cue:'At that moment, the action is happening.'},
 perfect:{idea:'Look back from a point in time.',cue:'Connect an earlier action or situation to now, then, or a future point.'},
 'perfect-continuous':{idea:'Focus on how long the activity continues.',cue:'Follow an activity up to now, a past point, or a future point.'},
};
for(const family of families){
 const group=cards.filter(c=>c.id.startsWith(family+'-') && (family!=='perfect'||!c.id.startsWith('perfect-continuous')));
 const focus=familyFocus[family];
 const body=group.map(c=>{const d=tenseDetails[c.id];return `<section class="tense-focus"><h2>${c.tenseName}</h2><div class="tense-scene"><div><p class="anchor-example">${c.examples.affirmative.sentence.replace(c.examples.affirmative.verbPhrase, `<u class="target-verb">${c.examples.affirmative.verbPhrase}</u>`)}</p><p class="tense-use">${d.use}</p></div>${timeline(c)}</div><p class="tense-clues"><b>Time clues</b> ${d.signals}</p><p class="tense-detail"><b>Remember</b> ${d.contrast}</p></section>`}).join('');
 pages.push({id:family,title:LEARN_TENSES_LESSONS[family].title,chapter:'04 / Meaning & timelines',color:REFERENCE_FAMILIES[family].textColor,body:`<div class="family-focus"><p>${focus.idea}</p><span>${focus.cue}</span></div>`+body+`<p class="tense-navigation">Build negatives & questions: ${ref('formulas','formulas')} · ${ref('worked','examples')}.<br>Read timelines left to right: past → now → future. Dots = events; lines = activity; arcs = connections.</p>`});
}
pages.push({id:'tense-choices',title:'Choose the meaning before the tense',chapter:'04 / Meaning & timelines',body:table(['Compare','Example','What changes?'],[['Routine / now','I work at a clinic.<br>I am working late today.','Usual situation / temporary activity'],['Finished past / connection to now','I lost my keys yesterday.<br>I have lost my keys.','Finished time / present result'],['Amount / duration','I have read three chapters.<br>I have been reading for two hours.','Completed amount / activity and duration'],['Future decision / plan / arrangement','I will help you.<br>I am going to study tonight.<br>I am meeting Ana at six.','Decision now / existing intention / arrangement']])+h('Be in the simple tenses')+table(['Time','Affirmative','Negative','Question'],[['Present','She is ready.','She is not ready.','Is she ready?'],['Past','They were late.','They were not late.','Were they late?'],['Future','He will be here.','He will not be here.','Will he be here?']])+note('State verbs','Know, believe, need, and own usually take simple forms. Some verbs change meaning: <b>I think it is useful</b> (opinion); <b>I am thinking about it</b> (mental activity).')+note('Time words are clues, not guarantees','For and since can occur with different tenses. Ask which reference point you mean: now, a past point, or a future point. Read the entire sentence.')});
pages.push({id:'questions',title:'Build a question & answer it',chapter:'04 / Meaning & timelines',body:p('Find the helping verb first. In a yes / no question, it moves before the subject. If a simple tense has no helping verb, add do / does / did.')+table(['Statement','Yes / no question','Short answer'],[
['She is ready.','Is she ready?','Yes, she is. / No, she isn’t.'],['They work here.','Do they work here?','Yes, they do. / No, they don’t.'],['He works today.','Does he work today?','Yes, he does. / No, he doesn’t.'],['You called.','Did you call?','Yes, I did. / No, I didn’t.'],['She has left.','Has she left?','Yes, she has. / No, she hasn’t.'],['They will come.','Will they come?','Yes, they will. / No, they won’t.'],['He can drive.','Can he drive?','Yes, he can. / No, he can’t.']])+h('Add a question word for more information')+p('<b>Where does she work?</b> → At the clinic.<br><b>When did you call?</b> → Yesterday.<br><b>Why are they waiting?</b> → The office is closed.<br><b>How long have you lived here?</b> → For three years.')+note('Asking about the subject','<b>Who called you?</b> Who is the subject; do not add did in an ordinary affirmative subject question. Compare <b>Who did you call?</b> You is the subject; who asks about the object.')+note('Match the helper','Answer with the same helper: <b>Have you finished? Yes, I have.</b> Change the pronoun as needed: Are you ready? → Yes, I am.')});
pages.push(...laterPages);
pages.splice(pages.findIndex(x=>x.id==='future-clauses')+1,0,connectorPage);
const [conditionalsPage]=pages.splice(pages.findIndex(x=>x.id==='conditionals'),1);
pages.splice(pages.findIndex(x=>x.id==='connectors')+1,0,conditionalsPage);
for(const page of pages) {
 const chapter=page.chapter.slice(0,2);
 const family=({'01':'word-types','02':'word-types','05':'structure','06':'structure','07':'modals','08':'structure','09':'comparison','10':'used-to','11':'voice'} as Record<string,string>)[chapter];
 if(family) page.color=REFERENCE_FAMILIES[family].textColor;
 if(chapter==='03') page.color='#37558d';
}
composeVisualPages(pages);
emphasizeExamples(pages);
const patternsPage=pages.find(x=>x.id==='verb-lists')!;
patternsPage.body=patternsPage.body.replace(/<p>[\s\S]*?<\/p>/, '<p class="lookup-cue"><b>REFERENCE, NOT MEMORIZATION</b><br>Find the first verb, then choose the form that follows it.</p>');
pages.unshift({id:'contents',title:'Your grammar companion',chapter:'ESOL 3 / Binder reference',body:''});
const numbers=new Map(pages.map((x,i)=>[x.id,i+1]));
pages[0].body=navigationBody(pages,numbers);
for (const [index,group] of navigationGroups.entries()) {
 for(const id of group.entries.flatMap(e=>e.ids)) {
  const topic=pages.find(p=>p.id===id)!;
  topic.chapter=`${String(index+1).padStart(2,'0')} / ${group.title}`;
 }
}
const navigationColors=new Map(navigationGroups.flatMap(g=>g.entries.flatMap(e=>e.ids.map(id=>[id,g.color] as const))));
const TIMELINE_SVG_STYLE = `
  .timeline-wrap { margin: 8px 0; }
  .timeline-wrap svg { width: 100%; height: auto; max-width: 240px; display: block; margin: 0 auto; }
  .timeline-wrap .fill-amber-600 { fill: #d97706; }
  .timeline-wrap .fill-amber-700, .timeline-wrap text.fill-amber-700 { fill: #b45309; }
  .timeline-wrap .fill-amber-800 { fill: #92400e; }
  .timeline-wrap .stroke-amber-700 { stroke: #b45309; }
  .timeline-wrap .fill-orange-700 { fill: #c2410c; }
  .timeline-wrap .stroke-orange-800 { stroke: #9a3412; }
  .timeline-wrap .fill-emerald-600 { fill: #059669; }
  .timeline-wrap .fill-emerald-700 { fill: #047857; }
  .timeline-wrap .stroke-emerald-700 { stroke: #047857; }
  .timeline-wrap .stroke-emerald-400 { stroke: #34d399; }
  .timeline-wrap .stroke-emerald-500 { stroke: #10b981; }
  .timeline-wrap .fill-blue-600 { fill: #2563eb; }
  .timeline-wrap .fill-blue-700 { fill: #1d4ed8; }
  .timeline-wrap .stroke-blue-700 { stroke: #1d4ed8; }
  .timeline-wrap .stroke-slate-300 { stroke: #cbd5e1; }
  .timeline-wrap .fill-amber-100\\/40 { fill: rgba(254,243,199,0.4); }
  .timeline-wrap .fill-amber-100\\/60 { fill: rgba(254,243,199,0.6); }
  .timeline-wrap .fill-orange-100\\/60 { fill: rgba(255,237,213,0.6); }
  .timeline-wrap .fill-blue-100\\/40 { fill: rgba(219,234,254,0.4); }
  .timeline-wrap .fill-emerald-100\\/50 { fill: rgba(209,250,229,0.5); }
  .timeline-wrap .opacity-60 { opacity: 0.6; }
  .timeline-wrap .opacity-70 { opacity: 0.7; }
  .timeline-wrap .opacity-20 { opacity: 0.2; }
  .timeline-wrap .font-bold { font-weight: 700; }
  .timeline-wrap .uppercase { text-transform: uppercase; }
`;
const fontCss = [ ['Regular',400], ['Bold',700] ].map(([name,weight]) => {
 const bytes=readFileSync(`scripts/reference-sheets/fonts/AtkinsonHyperlegibleNext-${name}.woff2`);
 return `@font-face{font-family:'Atkinson Hyperlegible Next';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2');}`;
}).join('');
const css=`${fontCss}
*{box-sizing:border-box}body{margin:0;color:#20302e;font-family:"Atkinson Hyperlegible Next",Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.36;background:#e9ece9}p{margin:0 0 10px}h1{font-size:24pt;line-height:1.1;margin:8px 0 17px;letter-spacing:-.5px;color:var(--accent)}h2{font-size:13pt;line-height:1.2;margin:17px 0 8px;color:var(--accent)}.sheet{width:8.5in;height:11in;margin:24px auto;background:white;padding:.65in .75in;position:relative;--accent:#35695e;box-shadow:0 3px 18px #0002}.page{height:9.7in;position:relative;display:flex;flex-direction:column}.chapter{font-size:9pt;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent);border-top:5px solid var(--accent);padding-top:9px}.body{flex:1}.footer{display:flex;justify-content:space-between;font-size:9pt;border-top:1px solid #a7b8b0;padding-top:7px;margin-top:14px;color:#4a5e57}table{width:100%;border-collapse:collapse;margin:12px 0 15px;table-layout:fixed;font-size:10pt;line-height:1.33}th,td{border:1px solid #a5b6af;padding:8px 9px;text-align:left;vertical-align:top;overflow-wrap:break-word}thead th{background:color-mix(in srgb,var(--accent) 13%,white);color:var(--accent)}tbody th{font-weight:bold;background:color-mix(in srgb,var(--accent) 5%,white)}tr{break-inside:avoid}aside{border-left:3px solid var(--accent);padding:8px 11px;background:color-mix(in srgb,var(--accent) 8%,white);margin:11px 0;font-size:10.5pt;line-height:1.35}aside strong:first-child{color:var(--accent)}a{color:inherit;text-decoration:none}.intro{font-size:17pt;line-height:1.4;margin:12px 0 20px}.toc{display:grid;grid-template-columns:1fr 1fr;gap:0 25px}.toc a{display:flex;align-items:baseline;justify-content:space-between;gap:10px;border-bottom:1px solid #d8e2da;padding:6px 0;font-size:10pt}.toc b{color:#35695e}.print-help{font-size:9pt;color:#4a5e57;margin-top:16px}.pictures{display:grid;grid-template-columns:repeat(3,1fr);gap:17px 12px;margin:24px 0}figure{margin:0;text-align:center;padding:7px;border-bottom:1px solid #d8e2da}figure svg{width:80px;height:80px}figcaption{font-size:11pt;font-weight:bold;margin-top:6px}.tense{position:relative;break-inside:avoid;border-top:1px solid #bdcdc4;margin-top:13px;padding-top:0}.tense h2{margin:9px 0 7px}.tense .timeline-wrap{float:right;width:240px;margin:0 0 5px 13px}.tense p{font-size:10.5pt;margin-bottom:6px}.example{font-size:10.5pt;line-height:1.45;font-weight:bold;color:#263e35;margin:6px 0}.tense aside{margin:6px 0;font-size:10pt;padding:6px 9px;clear:both}.signals{font-size:10pt!important}.word-bank td,.word-bank th{line-height:1.55}.landscape{width:11in;height:8.5in;padding:.6in .75in}.landscape .page{height:7.3in}.landscape h1{font-size:23pt;margin-bottom:10px}.master{font-size:10pt;margin:10px 0;line-height:1.25}.master th,.master td{padding:6px 8px}.master th:first-child{width:20%}.master tbody tr:nth-child(6n+1),.master tbody tr:nth-child(6n+2),.master tbody tr:nth-child(6n+3){background:#f1f5ee}.landscape aside{margin:8px 0;padding:6px 10px;font-size:10pt}.landscape .footer{margin-top:8px}
.syntax-key{display:flex;gap:20px;font-size:10pt;font-weight:bold;margin:6px 0}.syntax-key span{border-bottom:3px solid currentColor;padding-bottom:2px}.syntax-subject{color:#713c91}.syntax-helper{color:#17599a}.syntax-main{color:#9b421b;white-space:nowrap}.syntax-negative{color:#a32146}.family-simple{color:#39843e}.family-continuous{color:#24827a}.family-perfect{color:#b33e21}.family-perfect-continuous{color:#946016}.master tbody th{border-left:4px solid currentColor}.master tbody th:has(.family-simple){border-left-color:#39843e}.master tbody th:has(.family-continuous){border-left-color:#24827a}.master tbody th:has(.family-perfect){border-left-color:#b33e21}.master tbody th:has(.family-perfect-continuous){border-left-color:#946016}.irregular th,.irregular td{padding:4px 6px}.irregular td:nth-child(3n+2){color:#17599a}.irregular td:nth-child(3n){color:#9b421b}.irregular th:nth-child(4),.irregular td:nth-child(4){border-left:3px solid #a5b6af}
.axis-key{display:flex;justify-content:space-around;font-size:10pt;font-weight:bold;color:#394b45;margin-top:-5px;margin-bottom:5px}
#pronouns th,#pronouns td,#modals th,#modals td,#gerunds th,#gerunds td{padding-top:7px;padding-bottom:7px}#prepositions-movement .pictures{grid-template-columns:repeat(4,1fr)}
@page{size:letter portrait;margin:0}@media print{body{background:white}.sheet,.landscape{width:8.5in;height:11in;margin:0;padding:.65in .75in;box-shadow:none;break-after:page;print-color-adjust:exact;-webkit-print-color-adjust:exact}.sheet:last-child{break-after:auto}.landscape .page{position:absolute;left:7.85in;top:.75in;width:9.5in;height:7.2in;transform-origin:top left;transform:rotate(90deg)}.print-help{display:none}}
`;
let html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ESOL 3 Grammar Companion</title><style>${css}${TIMELINE_SVG_STYLE}${VISUAL_BOOK_STYLE}${SENTENCE_SUPPORT_STYLE}${NAVIGATION_STYLE}${FOCUS_STYLE}</style></head><body>${pages.map((x,i)=>`<article id="${x.id}" class="sheet ${x.landscape?'landscape':''}" ${x.color?`style="--accent:${x.color}"`:''}><div class="page"><header><div class="chapter" style="color:${navigationColors.get(x.id)||'#35695e'};border-top-color:${navigationColors.get(x.id)||'#35695e'}">${x.chapter}</div><h1>${x.title}</h1></header><div class="body">${x.body}</div><footer class="footer"><span>ESOL 3 · Grammar Companion</span><span>${i+1}</span></footer></div></article>`).join('')}</body></html>`;
html=html.replace(/<span data-ref="([^"]+)"><\/span>/g,(_,id)=>{if(!numbers.has(id))throw new Error('Missing reference '+id);return `(p. ${numbers.get(id)})`;});
if (/V1-(?:3rd|ing)/.test(html)) throw new Error('Legacy verb-form terminology in booklet');
async function main() {
await mkdir('FY27/reference-sheets',{recursive:true});
await writeFile('FY27/reference-sheets/esol-3b-grammar-reference.html',html);
process.stdout.write(`Built ${pages.length} pages; 12 formulas and 12 worked examples.\n`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
