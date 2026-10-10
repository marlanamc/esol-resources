/** Narrow release: no whole-map prune, no class reveals, no student mutations. */
import { loadEnvConfig } from '@next/env';
import { writeFile, mkdir } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { requireSafeDbTarget } from '../lib/require-safe-db-target';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
import { RELEASED_RESCUE_COLLECTIONS } from '../../src/lib/word-rescue/release';
loadEnvConfig(process.cwd());
async function main() {
 const apply=process.argv.includes('--apply');
 const activate=process.argv.includes('--activate');
 const prisma=new PrismaClient();
 try {
  const classroom=await prisma.class.findFirst({where:{name:'FY27'},select:{id:true,teacherId:true}});
  if(!classroom) throw new Error('FY27 class not found');
  const weeks=await prisma.courseWeek.findMany({where:{OR:[{classReveals:{some:{classId:classroom.id}}},{weekSchedules:{some:{classId:classroom.id,revealAt:{lte:new Date()}}}}]},include:{items:true}});
  const desired=COURSE_MAP_UNITS.flatMap(u=>u.weeks).flatMap(w=>w.items.filter(i=>i.activityId==='word-rescue').map(item=>({weekId:w.id,item})));
  const nodes=desired.filter(node=>weeks.some(w=>w.id===node.weekId)&&RELEASED_RESCUE_COLLECTIONS.has(new URL(node.item.href!,'https://myesolclass.com').searchParams.get('collection')!));
  console.log(JSON.stringify({apply,activate,weekIds:nodes.map(n=>n.weekId)}));
  if(!apply)return;
  requireSafeDbTarget('release Word Rescue to already released FY27 weeks');
  const existing=await prisma.activity.findUnique({where:{id:'word-rescue'}});
  await mkdir('output/word-rescue',{recursive:true});
  await writeFile(`output/word-rescue/release-backup-${Date.now()}.json`,JSON.stringify({activity:existing,nodes:weeks.flatMap(w=>w.items.filter(i=>i.activityId==='word-rescue'))},null,2));
  await prisma.$transaction(async tx=>{
   const data={title:'Word Rescue',description:'Practice the week’s vocabulary with normal and slow audio, Spanish and Brazilian Portuguese help, and two effort points per word.',type:'game',ui:'word-rescue',category:'pronunciation',level:'beginner',content:JSON.stringify({type:'word-rescue',version:1}),isReleased:activate};
   await tx.activity.upsert({where:{id:'word-rescue'},update:data,create:{id:'word-rescue',...data,createdBy:classroom.teacherId}});
   if(activate)for(const {weekId,item} of nodes){
    const current=weeks.find(w=>w.id===weekId)!;
    const order=Math.min(1,...current.items.filter(i=>i.id!==item.id).map(i=>i.order))-1;
    const data={weekId,activityId:'word-rescue',href:item.href,slot:'required',order,wrappedGame:false,activityType:'pronunciation',title:item.title};
    await tx.courseMapItem.upsert({where:{id:item.id},update:data,create:{id:item.id,...data}});
   }
  });
  console.log(activate?'Word Rescue enabled for the listed weeks. Class reveals unchanged.':'Draft activity prepared; no course-map links enabled.');
 }finally{await prisma.$disconnect();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
