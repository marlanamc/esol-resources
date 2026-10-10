/** Targeted emphasis for examples, without changing their wording or app content. */
import { parse } from 'node-html-parser';
import type { BookPage } from './esol-3b-booklet';
export function emphasizeExamples(pages:BookPage[]) {
 for (const page of pages) {
  const root=parse(page.body);
  let changed=false;
  const focus=(selector:string,pattern:RegExp)=>{
   for(const element of root.querySelectorAll(selector)) {
    changed=true;
    // Only text between tags: attributes, formula markup, and links stay intact.
    element.innerHTML=element.innerHTML.split(/(<[^>]+>)/g).map(part=>part.startsWith('<')?part:part.replace(pattern,match=>`<strong class="focus-word">${match}</strong>`)).join('');
   }
  };
  switch(page.id) {
   case 'adverbs': focus('.frequency-rung>span',/\b(always|usually|normally|often|sometimes|occasionally|seldom|rarely|hardly ever|never)\b/gi); break;
   case 'pronouns':
    focus('tbody td',/\b(my|your|his|her|its|our|their|mine|yours|hers|ours|theirs|me|you|him|it|us|them)\b/g);
    focus('.mini-example',/\b(a|an|The)\b/g); break;
   case 'prepositions-time':
    focus('.time-lenses p',/\b(at|in|on)\b/gi);
    focus('tbody td:last-child',/\b(for|since|by|until|during|before|after)\b/gi); break;
   case 'tense-choices':
    focus('.choice-sentences p',/\b(have been reading|am going to study|am working|have lost|have read|am meeting|will help|work|lost)\b/g);
    focus('tbody td',/\b(will not be|will be|will|not|is|Is|were|Were|be)\b/g); break;
   case 'questions': focus('tbody th, tbody td',/\b(can’t|does|do|did|is|are|has|have|will|can|am|isn’t|don’t|doesn’t|didn’t|hasn’t|won’t)\b/gi); break;
   case 'future-clauses': focus('.arrival-scenes h3',/\b(will have cooked|will be cooking|will cook|arrive)\b/g); break;
   case 'contractions': focus('.decode-grid>div',/She’s|She’d|\b(is|has|had|would)\b/g); break;
   case 'modals':
    focus('.voice-example',/\b(ought to|can|could|may|might|must|should|will|would|shall)\b/gi);
    focus('tbody td:last-child',/\b(has to|have to|are supposed to|had better not|had better)\b/g); break;
   case 'modal-meaning': focus('.certainty-grid p, .obligation-signs p',/\b(don’t have to|have to|must not|can’t|might|should|must|may)\b/g); break;
   case 'modals-past': focus('tbody td:last-child',/\b(could run|was able to fix|had to leave|didn’t have to work|were supposed to meet|might have missed|must have forgotten|can’t have sent|should have called|would have helped|had known)\b/g); break;
   case 'gerunds': focus('tbody td',/\b(to smoke|smoking|locking|to lock|taking|to arrive)\b/g); break;
   case 'conditionals': focus('.conditional-doors p',/\b(had known|would have helped|will stay|would cook|work|take|rains|had)\b/g); break;
   case 'comparisons':
    focus('tbody td',/\b(taller|tallest|nicer|nicest|bigger|biggest|happier|happiest|more expensive|most expensive|less expensive|least expensive|better|best|worse|worst|farther|further|farthest|furthest)\b/g);
    focus('p>b',/\b(faster than|fastest|as heavy as|not as large as)\b/g); break;
   case 'used-to':
    focus('.used-to-trio section>div, tbody td',/\b(didn’t get used to|didn’t use to|am getting used to|am used to|isn’t used to|is used to|got used to|get used to|used to|use to|Did|Is|drive|driving)\b/g); break;
   case 'passive': focus('tbody td:last-child',/\b(is being moved|was being moved|has been finished|had been found|will be delivered|should be cleaned|is checked|was repaired|are moving|were moving|have finished|had found|will deliver|should clean|checks|repaired)\b/g); break;
   case 'reported':
    focus('tbody td',/\b(had already left|had finished|had moved|am studying|was studying|have finished|will call|would call|can help|could help|work|worked|moved|here|there)\b/g);
    focus('.speech-bubble,.report-bubble',/\b(am|was)\b/g); break;
   case 'reported-context':
    focus('.context-shifts p',/\b(the day before|the next day|that week|the month before|the following year|there|those)\b/g);
    focus('tbody td',/\b(Do you remember|if he remembered|Where did you grow up|where she had grown up)\b/g); break;
   case 'reporting-verbs': focus('.dictionary-example',/\b(admitted making|claimed that|denied taking|explained that|insisted that|mentioned that|suggested taking|advised me to|complained that|promised to)\b/g); break;
  }
  if(root.textContent!==parse(page.body).textContent) throw new Error('Emphasis changed wording on '+page.id);
  if(changed) page.body=root.toString();
 }
}
export const FOCUS_STYLE=`
.focus-word{font-weight:700}
.job-example,.mini-example,.voice-example,.dictionary-example,.verb-paths p{font-weight:400}
.arrival-scenes h3{font-weight:400}.arrival-scenes .focus-word{font-weight:700}
#comparisons p>b:has(.focus-word){font-weight:400}
`;
