import type { BookPage } from './esol-3b-booklet';
type Entry = { label:string; ids:string[] };
const entry=(label:string,...ids:string[]):Entry=>({label,ids});
export const navigationGroups = [
 {title:'Build a Sentence',color:'#b05740',entries:[entry('The jobs words do','word-types'),entry('Build a Sentence','build-sentence'),entry('Pronouns & articles','pronouns'),entry('Adjectives, adverbs & frequency','adverbs')]},
 {title:'Time, Place & Movement',color:'#24827a',entries:[entry('Prepositions of time','prepositions-time'),entry('Prepositions of Place','prepositions-space'),entry('Prepositions of movement','prepositions-movement')]},
 {title:'Verbs & Tenses',color:'#37558d',entries:[entry('The five verb forms','verb-forms'),entry('How irregular verbs work','irregular-verbs'),entry('Formula Chart: 12 tenses','formulas'),entry('One verb, every pattern','worked'),entry('Tense meanings & timelines','simple','continuous','perfect','perfect-continuous'),entry('Choose the Meaning','tense-choices'),entry('Build a Question','questions')]},
 {title:'Connect Ideas',color:'#397b9f',entries:[entry('Two actions: background & order','two-clauses'),entry('Future time clauses','future-clauses'),entry('Connectors & transitions','connectors'),entry('Conditionals: condition & result','conditionals')]},
 {title:'Everyday Grammar Tools',color:'#946016',entries:[entry('Contractions','contractions'),entry('Modals: meanings, forms & past','modals','modal-meaning','modals-past'),entry('Gerunds, infinitives & verb lists','gerunds','verb-lists'),entry('Comparatives & superlatives','comparisons'),entry('Used to / be used to / get used to','used-to')]},
 {title:'Change the Message',color:'#79518d',entries:[entry('Passive voice: change the focus','passive'),entry('Reported speech','reported'),entry('Time, place & reported questions','reported-context'),entry('Useful reporting verbs','reporting-verbs')]},
];
export function navigationBody(pages:BookPage[],numbers:Map<string,number>) {
 const listed=navigationGroups.flatMap(g=>g.entries.flatMap(e=>e.ids));
 if(new Set(listed).size!==listed.length || pages.filter(p=>p.id!=='contents').some(p=>!listed.includes(p.id))) throw new Error('Navigation must cover each topic exactly once');
 const pageNumber=(id:string)=>{const n=numbers.get(id);if(!n)throw new Error('Missing navigation destination '+id);return n;};
 const link=(id:string,label:string)=>`<a href="#${id}">${label}<b>${pageNumber(id)}</b></a>`;
 return '<p class="nav-intro">Find your topic. Turn to the page. Build your sentence.</p>'+`<nav class="nav-grid" aria-label="Contents">${navigationGroups.map(g=>`<section class="nav-card" style="--nav-color:${g.color}"><h2>${g.title}</h2>${g.entries.map(e=>`<a href="#${e.ids[0]}"><span>${e.label}</span><b>${e.ids.length>1?`${pageNumber(e.ids[0])}–${pageNumber(e.ids[e.ids.length-1])}`:pageNumber(e.ids[0])}</b></a>`).join('')}</section>`).join('')}</nav>`+
 `<section class="nav-help"><h2>Not sure where to look?</h2><div><p>Know the tense; forgot the pattern?</p>${link('formulas','Formula Chart')}</div><div><p>Not sure which tense?</p>${link('tense-choices','Choose the Meaning')}</div><div><p>Need a question?</p>${link('questions','Build a Question')}</div><div><p>Need a specific verb?</p><span><b>Verb Reference</b> · separate reference</span></div></section>`;
}
export const NAVIGATION_STYLE = `
.nav-intro{font-size:11pt;margin:0 0 18px}.nav-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px 22px}.nav-card{border-top:3px solid var(--nav-color);background:color-mix(in srgb,var(--nav-color) 3%,white);padding:10px 12px 11px;break-inside:avoid}.nav-card h2{color:var(--nav-color);font-size:14pt;margin:0 0 10px;line-height:1.15}.nav-card a{display:flex;justify-content:space-between;gap:10px;font-size:10.5pt;line-height:1.35;padding:3px 0}.nav-card a b{white-space:nowrap;font-variant-numeric:tabular-nums;color:#42534d}.nav-help{margin-top:20px;border-top:1px solid #bdcdc4;padding-top:10px}.nav-help h2{font-size:13pt;margin:0 0 8px;color:#34483f}.nav-help>div{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:4px 0;font-size:10.5pt}.nav-help p{margin:0}.nav-help a{display:flex;justify-content:space-between}.nav-help a b{font-variant-numeric:tabular-nums}
`;
