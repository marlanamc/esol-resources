/** Release verification: every fixture and award is rolled back, including on failure. */
import { loadEnvConfig } from '@next/env';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
loadEnvConfig(process.cwd());
async function main() {
  const { prisma } = await import('../../src/lib/database/prisma');
  const { saveRescueActionInTransaction: save } = await import('../../src/lib/word-rescue/save');
  const rollback = new Error('ROLLBACK_SUCCESS');
  const id = randomUUID();
  try {
    await prisma.$transaction(async tx => {
      const user = await tx.user.create({data:{username:`word-rescue-check-${id}`,password:randomUUID(),role:'student',isSystemAccount:true,excludeFromLeaderboard:true}});
      await tx.activity.upsert({where:{id:'word-rescue'},update:{},create:{id:'word-rescue',title:'Word Rescue',type:'game',content:'{}',createdBy:user.id,isReleased:false}});
      let result = await save(tx,user.id,{type:'start',id,collectionId:'sep-w1'});
      const wordId = result.state.session!.wordIds[0];
      for (const clip of ['word','sentence']) await save(tx,user.id,{type:'heard',sessionId:id,wordId,clip});
      await save(tx,user.id,{type:'said',sessionId:id,wordId});
      const action = {type:'finish',sessionId:id,wordId,confidence:'again'};
      result = await save(tx,user.id,action);
      assert.equal(result.pointsAwarded,2);
      assert.equal((await save(tx,user.id,action)).pointsAwarded,0);
      const ledger = await tx.pointsLedger.findMany({where:{userId:user.id,source:'word-rescue'}});
      assert.equal(ledger.length,1);assert.equal(ledger[0].points,2);
      const balance = await tx.user.findUniqueOrThrow({where:{id:user.id}});
      assert.ok(balance.points>=2);assert.ok(balance.weeklyPoints>=2);
      const progress = await tx.activityProgress.findFirstOrThrow({where:{userId:user.id,activityId:'word-rescue'}});
      assert.equal(JSON.parse(progress.categoryData!).wordRescue.words[wordId].attempts,1);
      console.log('PASS: real PostgreSQL completion, +2 ledger award, balance update, and duplicate retry.');
      throw rollback;
    },{timeout:30000});
  } catch(error) {if(error!==rollback) throw error;}
  finally {await prisma.$disconnect();}
  console.log('Verification transaction rolled back; no test users or points persisted.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
