import json,collections,re,datetime,zoneinfo,statistics
from pathlib import Path
p=Path(__file__).parent
x=json.loads((p/'evidence.json').read_text()); active={e['userId'] for e in x['enrollments'] if e['status']=='active'}
acts={a['id']:a for a in x['activities']}; bytitle={a['title'].lower():a for a in x['activities']}
tz=zoneinfo.ZoneInfo('America/New_York')
def date(s):return datetime.datetime.fromisoformat(s.replace('Z','+00:00')).astimezone(tz).date().isoformat()
def key(e):
 r=e['reason'] or ''
 if e['source']=='word-rescue':return 'Word Lab'
 if e['source'] not in ['activity','award']:return None
 if r.startswith('grammar-exercise:'):
  aid=r.split(':')[1];return (acts.get(aid) or acts.get(aid+'-guide') or acts.get({'past-simple-past-continuous-telling-the-story':'past-simple-past-continuous-guide'}.get(aid,'')) or {}).get('title',aid)
 if e['source']=='award' and '|' not in r and not r.startswith('Completed'):return None
 return re.sub(r'^Completed:\s*','',r.split('|')[0])
def aggregate(users,start='2026-09-14',end='2026-11-12'):
 groups=collections.defaultdict(list)
 for e in x['ledger']:
  k=key(e); d=date(e['createdAt'])
  if k and e['points']>0 and e['userId'] in users and start<=d<end:groups[k].append(e)
 rows=[]
 for k,es in groups.items():
  ud=collections.defaultdict(set)
  for e in es:ud[e['userId']].add(date(e['createdAt']))
  days=sum(map(len,ud.values()));counts=collections.Counter(e['userId'] for e in es)
  off={e['userId'] for e in es if datetime.date.fromisoformat(date(e['createdAt'])).weekday() not in (1,3)}
  a=bytitle.get(k.lower(),{})
  rows.append(dict(activity=k,type=a.get('type','other'),students=len(ud),returners=sum(len(v)>=2 for v in ud.values()),threeDays=sum(len(v)>=3 for v in ud.values()),studentDays=days,awards=len(es),first=min(date(e['createdAt']) for e in es),last=max(date(e['createdAt']) for e in es),nonClassDayStudents=len(off),topStudentDays=max(map(len,ud.values())),topStudentAwards=max(counts.values()),medianDays=statistics.median(map(len,ud.values()))))
 return sorted(rows,key=lambda r:(r['returners'],r['students'],r['studentDays']),reverse=True)
rows=aggregate(active);recent=aggregate(active,'2026-10-28','2026-11-11');previous=aggregate(active,'2026-10-14','2026-10-28')
ir=[]
for e in x['progress']:
 if e['userId'] in active and e['activityId']=='irregular-verbs-game':
  c=json.loads(e['categoryData'] or '{}');gs=[g for k,g in c.items() if k.startswith('group-')]
  ir.append(dict(user=e['userId'],first=date(e['createdAt']),last=date(e['updatedAt']),attempts=sum(g.get('attempts',0) for g in gs),groupsTried=sum(g.get('attempts',0)>0 for g in gs),passed=sum(g.get('completed',False) for g in gs),mastered=sum(g.get('stage')=='mastered' for g in gs)))
summary=dict(start=x['start'],end=x['end'],cohort=len(active),allEnrolled=len(x['enrollments']),rows=rows,recent=recent,previous=previous,irregularProgress=ir,allCohort=aggregate({e['userId'] for e in x['enrollments']}),feedbackCount=len(x['feedback']))
(p/'analysis.json').write_text(json.dumps(summary,indent=2))
print('FULL CYCLE');print(json.dumps(rows[:22],indent=2));print('RECENT');print(json.dumps(recent[:12],indent=2));print('IRREGULAR PROGRESS');print(json.dumps(ir));print('UNMAPPED',[(r['activity'],r['awards']) for r in rows if r['type']=='other'])
