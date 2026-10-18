/** Scoped curriculum release. Read-only by default; --apply requires the DB guard.
 * Never deletes activities, student work, vocabulary cards, or Weeks 1–5.
 */
import { loadEnvConfig } from '@next/env';
import fs from 'node:fs';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import { getGrammarGuide } from '@/lib/grammar-guide-registry';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { buildVocabReviewSeedCards } from '@/lib/vocab/review';
const vocab = require('../vocab/weekly-vocab-data');
const builders = require('../vocab/seed-weekly-vocab');
const { requireSafeDbTarget, parseActiveDbTarget } = require('../lib/require-safe-db-target');
loadEnvConfig(process.cwd());
const apply = process.argv.includes('--apply');
const vocabularyOnly = process.argv.includes('--vocabulary-only');
async function main() {
 const { prisma } = await import('@/lib/database/prisma');
 const { lookupGrammarGuideActivity } = await import('@/lib/grammar-guide-activity');
 try {
 const target = parseActiveDbTarget();
 console.log(`Target: ${target.hostname}/${target.database}; ${apply ? 'APPLY' : 'preview only'}`);
 const all = COURSE_MAP_UNITS.flatMap(u=>u.weeks.map(w=>({u,w})));
 const future = all.filter(({w})=>w.number>=6);
 const earlyIds = all.filter(({w})=>w.number<=5).map(({w})=>w.id);
 const weekIds = future.map(({w})=>w.id);
 const early = await prisma.courseWeek.findMany({where:{id:{in:earlyIds}},include:{items:{orderBy:{id:'asc'}}},orderBy:{id:'asc'}});
 const protectedActivities = [...new Set(early.flatMap(w=>w.items.flatMap(i=>i.activityId?[i.activityId]:[])))];
 const earlyActivities = await prisma.activity.findMany({where:{id:{in:protectedActivities}},orderBy:{id:'asc'}});
 const planned = new Map<string,{title:string;content:string;type:string;category:string;contentKind:string;isReleased?:boolean;description?:string}>();
 const vocabIds = new Set<string>();
 const quizIds = new Set<string>();
 for(const {w} of future){
  const sets=w.items.filter(i=>i.vocabUi==='flashcards');
  if(sets.length!==1 || sets[0].slot!=='required')throw new Error(`W${w.number}: not one core set`);
  const id=sets[0].activityId!; const slug=id.replace('vocab-','');const data=vocab.weeklyVocabData[slug];
  if(data.words.length!==6)throw new Error(`${slug}: not six words`);
  const content={type:'vocabulary',wordList:builders.generatePacketContent(slug,data),flashcards:builders.generateFlashcardContent(slug,data),matching:builders.generateMatchingContent(slug,data),fillInBlank:builders.generateFillBlankContent(slug,data),libraryOnlyCards:(data.bonusWords??[]).map(builders.toVocabCard)};
  planned.set(id,{title:`Unit ${builders.getUnitNumber(slug)}: ${data.topic}`,content:JSON.stringify(content),type:'vocabulary',category:'Vocab',contentKind:'map',isReleased:true});vocabIds.add(id);
  for(const item of w.items){
   if(!vocabularyOnly && item.href?.startsWith('/grammar-reader/')){
    const slug=item.href.split('/').pop()!.split('?')[0];const guide=getGrammarGuide(slug);if(!guide)throw new Error(slug);
    const row=await lookupGrammarGuideActivity(guide.activityTitle,slug);
    const id=row?.id??`${slug}-guide`;
    // A shared early guide is already released; leave its database content untouched.
    if(protectedActivities.includes(id))continue;
    planned.set(id,{title:guide.activityTitle,description:guide.metaDescription,content:JSON.stringify(await guide.loadContent()),type:'guide',category:'grammar',contentKind:'map',isReleased:true});
   }
   if(item.activityId && item.activityId in quizzes){
    const id=item.activityId;const content=quizzes[id as keyof typeof quizzes];quizIds.add(id);
    planned.set(id,{title:content.title,content:JSON.stringify(content),type:'quiz',category:'quizzes',contentKind:'map'});
   }
  }
 }
 for(const id of planned.keys())if(protectedActivities.includes(id))throw new Error(`Would change protected activity ${id}`);
 const protectedTerms = new Set(buildVocabReviewSeedCards(earlyActivities).map(c=>c.normalizedTerm));
 const snapshot={vocabCards:await prisma.vocabCard.findMany(),weeks:await prisma.courseWeek.findMany({where:{id:{in:weekIds}},include:{items:true}}),activities:await prisma.activity.findMany({where:{id:{in:[...planned.keys()]}}}),early,earlyActivities};
 for(const {u,w} of future){const live=snapshot.weeks.find(x=>x.id===w.id);if(live&&(live.number!==w.number||live.unitId!==u.id))throw new Error(`Unexpected production week identity: ${w.id}`);}
 const missingLinks=[...new Set(future.flatMap(({w})=>w.items.flatMap(i=>i.activityId&&!planned.has(i.activityId)?[i.activityId]:[])))];
 const found=await prisma.activity.findMany({where:{id:{in:missingLinks}},select:{id:true}});
 const missing=missingLinks.filter(id=>!found.some(a=>a.id===id));if(missing.length)throw new Error(`Unseeded activity links: ${missing.join(', ')}`);
 console.log(`31 weeks; ${vocabIds.size} core sets; ${planned.size} activity candidates; Weeks 1–5 protected.`);
 for(const id of quizIds){const count=await prisma.activityProgress.count({where:{activityId:id}});if(count)console.log(`${id}: preserve existing questions (${count} progress records)`);}
 if(!apply)return;
 requireSafeDbTarget('release Weeks 6–36 curriculum');
 fs.mkdirSync('.backups',{recursive:true});const backup=`.backups/curriculum-${Date.now()}.json`;fs.writeFileSync(backup,JSON.stringify(snapshot,null,2),{mode:0o600});console.log(`Recovery snapshot: ${backup}`);
 await prisma.$transaction(async tx=>{
  for(const [id,fields] of planned){
   if(quizIds.has(id)){
    const used=(await tx.activityProgress.count({where:{activityId:id}}))+(await tx.submission.count({where:{activityId:id}}));
    if(used){console.log(`Preserved used quiz ${id}`);continue;}
   }
   await tx.activity.upsert({where:{id},update:fields,create:{id,...fields,isReleased:fields.isReleased??false,level:'intermediate'}});
   if(quizIds.has(id))await tx.assignment.updateMany({where:{activityId:id},data:{title:fields.title}});
  }
  for(const {u,w} of future){
   const existing=await tx.courseWeek.findUnique({where:{id:w.id}});
   if(existing&&(existing.number!==w.number||existing.unitId!==u.id))throw new Error(`Unexpected production week identity: ${w.id}`);
   await tx.courseWeek.upsert({where:{id:w.id},update:{title:w.title,goal:w.goal??null},create:{id:w.id,unitId:u.id,number:w.number,title:w.title,goal:w.goal??null}});
   await tx.courseMapItem.deleteMany({where:{weekId:w.id,id:{notIn:w.items.map(i=>i.id)}}});
   for(const i of w.items){
    if(early.some(w=>w.items.some(old=>old.id===i.id)))throw new Error(`Protected item ${i.id}`);
    const fields={weekId:w.id,activityId:i.activityId??null,href:i.href??null,vocabUi:i.vocabUi??null,slot:i.slot,order:i.order,wrappedGame:i.wrappedGame,activityType:i.activityType,title:i.title,badge:i.badge??null};
    await tx.courseMapItem.upsert({where:{id:i.id},update:fields,create:{id:i.id,...fields}});
   }
  }
  const cards=buildVocabReviewSeedCards(await tx.activity.findMany({where:{id:{in:[...vocabIds]}},select:{id:true,title:true,description:true,content:true}}));
  for(const card of cards){
   const existing=await tx.vocabCard.findUnique({where:{normalizedTerm:card.normalizedTerm}});
   // Keep IDs and review state; preserve definitions belonging to Weeks 1–5.
   if(!existing)await tx.vocabCard.create({data:card});
   else if(!protectedTerms.has(card.normalizedTerm)) await tx.vocabCard.update({where:{id:existing.id},data:{...card,
    sourceKeys:[...new Set([...existing.sourceKeys,...card.sourceKeys])],
    sourceLabels:[...new Set([...existing.sourceLabels,...card.sourceLabels])],
    unitNumbers:[...new Set([...existing.unitNumbers,...card.unitNumbers])],
    topics:[...new Set([...existing.topics,...card.topics])],sortOrder:existing.sortOrder,
   }});
  }
  const after=await tx.courseWeek.findMany({where:{id:{in:earlyIds}},include:{items:{orderBy:{id:'asc'}}},orderBy:{id:'asc'}});
  const afterActivities=await tx.activity.findMany({where:{id:{in:protectedActivities}},orderBy:{id:'asc'}});
  if(JSON.stringify(after)!==JSON.stringify(early)||JSON.stringify(afterActivities)!==JSON.stringify(earlyActivities))throw new Error('Protected Weeks 1–5 changed; rolling back');
 },{timeout:180000,maxWait:10000});
 console.log('Release synchronized. Weeks 1–5 verified unchanged. No student progress, submissions, ledger, or balances modified.');
 }finally{await prisma.$disconnect();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
