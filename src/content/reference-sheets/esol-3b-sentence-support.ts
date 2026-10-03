/** Print-only bridges from word jobs to sentences and connected ideas. */
import { h, p, note, type BookPage } from './esol-3b-booklet';
type Piece = [label: string, text: string, role: string];
const piece = ([label,text,role]:Piece) => `<span class="build-piece ${role}"><small>${label}</small><b>${text}</b></span>`;
const row = (pieces:Piece[], step='') => `<div class="build-row">${step?`<span class="build-step">${step}</span>`:''}${pieces.map(piece).join('')}</div>`;
export const sentenceBuilder:BookPage = {
 id:'build-sentence',title:'Build a Sentence',chapter:'01 / Building sentences',body:
 p('<b>A complete statement needs a SUBJECT and a VERB.</b><br>Start with WHO + VERB. Add the information your idea needs.')+
 `<div class="sentence-growth">${[
 row([['WHO / SUBJECT','I','who'],['VERB','work.','verb']],'1'),
 row([['WHO / SUBJECT','I','who'],['VERB','study','verb'],['WHAT / OBJECT','English.','what']],'2'),
 row([['WHO / SUBJECT','I','who'],['VERB','study','verb'],['WHAT / OBJECT','English','what'],['WHERE','at school.','where']],'3'),
 row([['WHO / SUBJECT','I','who'],['VERB','study','verb'],['WHAT / OBJECT','English','what'],['WHERE','at school','where'],['WHEN','on Tuesdays.','when']],'4'),
 ].join('')}</div>`+
 h('WHERE or WHEN can come first')+
 `<div class="front-builds">${[
 row([['WHERE','At school,','where'],['WHO','I','who'],['VERB','study','verb'],['WHAT','English.','what']]),
 row([['WHEN','On Tuesdays,','when'],['WHO','I','who'],['VERB','study','verb'],['WHAT','English','what'],['WHERE','at school.','where']]),
 ].join('')}</div>`+
 p('Same idea, different focus. In a statement, keep WHO before the verb.')+
 h('Sometimes the verb needs a helper')+
 `<div class="helper-builds">${[
 row([['WHO','She','who'],['HELPER + NOT',"doesn’t",'helper'],['VERB','work','verb'],['WHEN','on Fridays.','when']]),
 row([['WHO','They','who'],['HELPER','are','helper'],['VERB','studying','verb'],['WHAT','English.','what']]),
 row([['WHO','I','who'],['HELPER','will','helper'],['VERB','call','verb'],['WHEN','tomorrow.','when']]),
 ].join('')}</div>`+
 h('All of these are complete')+
 `<div class="complete-statements"><p>I work.</p><p>I work nights.</p><p>I work at a restaurant.</p><p>I work nights at a restaurant.</p></div>`+
 p('You do not need every piece. <b>Add only what your idea needs.</b>'),
};
const connectors = [
 ['ADD','More information','and · also · in addition','I work at a clinic, <b>and</b> I study at night.'],
 ['CONTRAST','A different or surprising idea','but · however · although','<b>Although</b> I was tired, I finished my shift.'],
 ['REASON','Why something happens','because · since','I called <b>because</b> I needed an appointment.'],
 ['RESULT','What happens because of it','so · therefore','The bus was late, <b>so</b> I called my supervisor.'],
 ['EXAMPLE','Make the idea specific','for example · such as','Bring identification, <b>such as</b> a passport.'],
 ['ORDER','Steps in a sequence','first · then · next · finally','<b>First,</b> fill out the form. <b>Then,</b> sign it.'],
 ['TIME','Connect actions in time','before · after · when · while','<b>After</b> I finish work, I pick up my son.'],
];
export const connectorPage:BookPage = {
 id:'connectors',title:'Connect your ideas',chapter:'05 / Connecting ideas',body:
 p('Choose the connection you want to make.')+
 `<div class="connector-list">${connectors.map(([label,meaning,words,example])=>`<section><div><h2>${label}</h2><small>${meaning}</small></div><div><p class="connector-words">${words}</p><p>${example}</p></div></section>`).join('')}</div>`+
 h('Punctuation that helps your reader')+
 p('<b>Two complete ideas + and / but / so:</b> use a comma before the connector.<br>I called, <b>but</b> no one answered.')+
 p('<b>However / therefore / in addition / for example:</b> a new sentence is an easy choice. Put a comma after the opening connector.<br>The office was closed. <b>However,</b> I could leave a message.')+
 note('Keep the connection complete','<b>Because / since / although + subject + verb</b> needs a main clause. If it comes first, follow it with a comma: <b>Because I was sick, I stayed home.</b> Use <b>such as + noun examples</b>, not a new sentence.'),
};
export const SENTENCE_SUPPORT_STYLE = `
#build-sentence h2{margin-top:10px;margin-bottom:6px}
.sentence-growth{margin:14px 0 16px}.build-row{display:flex;gap:6px;align-items:stretch;margin:6px 0}.build-step{width:17px;flex-shrink:0;align-self:center;font-size:11pt;font-weight:bold;color:var(--accent)}
.build-piece{display:flex;flex-direction:column;justify-content:center;padding:5px 10px;border:1px dashed currentColor;border-bottom:3px solid currentColor;border-radius:4px;white-space:nowrap}.build-piece small{font-size:9pt;letter-spacing:.1px}.build-piece b{font-size:14pt;line-height:1.3;margin-top:0}
.build-piece.who{color:#713c91;background:#f4edf8}.build-piece.helper{color:#17599a;background:#eaf2f9}.build-piece.verb{color:#9b421b;background:#fbf0e8}.build-piece.what{color:#286b58;background:#eaf5f0}.build-piece.where{color:#475a77;background:#edf0f5}.build-piece.when{color:#88590c;background:#fbf3de}
.helper-builds .build-piece{padding:4px 10px}.helper-builds .build-piece b{font-size:13pt}.complete-statements{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;margin:9px 0 10px}.complete-statements p{font-size:13pt;font-weight:bold;margin:0}
.connector-list{margin:17px 0}.connector-list section{display:grid;grid-template-columns:145px 1fr;gap:18px;border-top:1px solid #bdcdc4;padding:10px 0}.connector-list h2{font-size:11pt;margin:0 0 3px}.connector-list p{margin:0;font-size:11pt}.connector-list .connector-words{font-weight:bold;color:var(--accent);margin-bottom:3px}.lookup-cue{font-size:10pt;margin:0 0 9px;color:#42534d}.lookup-cue b{letter-spacing:.4px}
`;
