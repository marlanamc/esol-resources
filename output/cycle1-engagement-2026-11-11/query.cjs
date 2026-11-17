const {PrismaClient}=require('@prisma/client');
const fs=require('fs');
const p=new PrismaClient();
(async()=>{const data=await p.$transaction(async t=>{
 await t.$executeRawUnsafe('SET TRANSACTION READ ONLY');
 const start=new Date('2026-09-14T04:00:00Z'); const end=new Date();
 const enrollments=await t.classEnrollment.findMany({where:{classId:'cmtxh5snj00010e6wltad9na6',student:{role:'student',isSystemAccount:false}},select:{studentId:true,status:true,joinedAt:true}});
 const ids=enrollments.map(e=>e.studentId); const anon=new Map(ids.map((id,i)=>[id,`student-${i+1}`]));
 const ledger=await t.pointsLedger.findMany({where:{userId:{in:ids},createdAt:{gte:start,lt:end}},select:{userId:true,points:true,reason:true,source:true,createdAt:true},orderBy:{createdAt:'asc'}});
 const progress=await t.activityProgress.findMany({where:{userId:{in:ids},updatedAt:{gte:start,lt:end}},select:{userId:true,activityId:true,progress:true,status:true,createdAt:true,updatedAt:true,categoryData:true}});
 const activities=await t.activity.findMany({select:{id:true,title:true,type:true,category:true,ui:true,createdAt:true,deletedAt:true}});
 const feedback=await t.feedback.findMany({where:{userId:{in:ids},createdAt:{gte:start,lt:end}},select:{userId:true,activityTitle:true,activityId:true,difficulty:true,type:true,message:true,createdAt:true}});
 const assignments=await t.assignment.findMany({where:{classId:'cmtxh5snj00010e6wltad9na6'},select:{activityId:true,isRequired:true,isFeatured:true,createdAt:true}});
 return {start,end,enrollments:enrollments.map(({studentId,...e})=>({...e,userId:anon.get(studentId)})),ledger:ledger.map(e=>({...e,userId:anon.get(e.userId)})),progress:progress.map(e=>({...e,userId:anon.get(e.userId)})),feedback:feedback.map(e=>({...e,userId:anon.get(e.userId)})),activities,assignments};
},{timeout:30000});fs.writeFileSync(__dirname+'/evidence.json',JSON.stringify(data,null,2));console.log(JSON.stringify({start:data.start,end:data.end,enrollments:data.enrollments,ledger:data.ledger.length,progress:data.progress.length,feedback:data.feedback.length,sources:[...new Set(data.ledger.map(e=>e.source))]}));})().catch(e=>{console.error(e.code||e.name);process.exitCode=1}).finally(()=>p.$disconnect());
