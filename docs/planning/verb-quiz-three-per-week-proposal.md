# Proposal: three verbs per week after Week 4

**Status:** proposal only — nothing in the app has been changed.
**Written:** 11 September 2026, for the 2026–27 year.

## The idea

Verb quizzes currently carry two verbs each. This proposes keeping two verbs for
the first two quizzes, then moving to **three verbs from Quiz 3 onward**.

The first two verbs of each quiz stay the existing frequency-ordered pair. The third
is drawn from a pool matched to the unit that week sits in where one fits — civic
verbs in November's *Community Participation*, food-storage verbs in December's
*Consumer Smarts*, clinical verbs in April's *Health* unit. Where the remaining
frequency-ordered verbs need the room, the third slot simply takes the next one
instead.

## Why it holds up

**You already ran five verbs a week.** Every one of last year's twenty quiz blocks in
`src/content/quizzes/verb-conjugations.json` has exactly five verbs (`teach, grow,
lead, mean, deal` and so on), and the submissions on those score 90–100. Three verbs
is a step *down* from what the spring cohort handled, not a step up.

**The workload stays moderate.** Each verb asks for four forms — V1-3rd, V1-ing, V2, V3.

| Verbs per quiz | Blanks per quiz |
|---:|---:|
| 2 (today) | 8 |
| 3 (proposed) | 12 |
| 5 (last year) | 20 |

**The verb bank covers it.** 104 verbs are defined; this schedule uses 97 and keeps
7 in reserve.

**The additions are worth teaching.** The 29 verbs this adds are not filler — they
include `ask`, `need`, `use`, and `try`, which the current 68-verb plan never
teaches at all. Eleven of the 29 are irregular, which is where V2/V3 practice earns
its keep.

## What changes in numbers

| | Today | Proposed |
|---|---:|---:|
| Quizzes in the year | 34 | 33 |
| Verbs taught | 68 | 97 |
| Verbs per quiz | 2 | 2 for Quizzes 1–2, then 3 |
| Blanks per quiz | 8 | 8, then 12 |
| Quiz weeks | 3–34 required, 35 optional | 3–35, one per week |

One quiet benefit: at three verbs a week the sequence fits the 35-week year exactly,
**one quiz per week with nothing left over**. Today's two-verb plan has 34 quizzes for
33 slots, which is why Quizzes 33 and 34 currently sit on the final week as optional
extras.

## Fix the due dates before shipping this

The dates below are today's generated dates, carried over unchanged. They come from a
strict +7-day sequence with no awareness of holidays, so three of them are unusable:

| Quiz | Date | Problem |
|---:|---|---|
| 9 | 2026-11-27 | day after Thanksgiving |
| 13 | 2026-12-25 | Christmas Day |
| 14 | 2027-01-01 | New Year's Day |

Later dates drift the same way, since winter break and the February and April
vacations are not modelled either. Worth re-baselining the whole sequence against the
real calendar whenever this gets built — it is a single anchor constant,
`firstQuizDueDate` in `src/data/verb-quiz-plan.ts`.

## The schedule

New verbs — ones the current plan never teaches — are shown in **bold**.

### September — Unit 1: Getting to Know You

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 1 | W3 | be + have | 2026-10-02 | Verb Forms + Verb Quiz 1 |

### October — Unit 2: Daily Life in the Community

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 2 | W4 | do + make | 2026-10-09 | Telling the Story: Past Simple + Past Continuous |
| 3 | W5 | go + come + find | 2026-10-16 | Community Routines: Just, Already, Yet |
| 4 | W6 | buy + keep + build | 2026-10-23 | Getting Around: Directions + Digital Safety |
| 5 | W7 | pay + hold + break | 2026-10-30 | Phone English + Family Connection |

### November — Unit 3: Community Participation

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 6 | W8 | leave + sell + cut | 2026-11-06 | Helping + Volunteering |
| 7 | W9 | freeze + steal + **discuss** | 2026-11-13 | Public Meetings + Suggestions |
| 8 | W10 | call + fix + **mention** | 2026-11-20 | Voting + Contacting Officials |
| 9 | W11 | sleep + wake + **reply** | 2026-11-27 | Community Issue Case Study |

### December — Unit 4: Consumer Smarts

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 10 | W12 | eat + drink + **store** | 2026-12-04 | How Long + For and Since |
| 11 | W13 | sit + spend + **spoil** | 2026-12-11 | More, Less, the Most: Comparatives + Superlatives |
| 12 | W14 | cost + lend + **heat** | 2026-12-18 | How Much / How Many: Countable + Uncountable |

### January — Unit 5: Housing & Renting

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 13 | W15 | give + send + **leak** | 2026-12-25 | Housing Basics |
| 14 | W16 | write + submit + **burn** | 2027-01-01 | Comparing Housing Options |
| 15 | W17 | work + apply + **document** | 2027-01-08 | Landlord Calls + Repair Requests |
| 16 | W18 | meet + speak + **forward** | 2027-01-15 | Housing Problems + Solutions |

### February — Unit 6: Workforce Preparation

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 17 | W19 | tell + say + **schedule** | 2027-01-22 | Resume + Workplace Basics |
| 18 | W20 | hear + understand + **comply** | 2027-01-29 | Workplace Rules + Must, Have To, Should |
| 19 | W21 | see + run + **deal** | 2027-02-05 | Second Conditional + Catch-Up |
| 20 | W22 | win + catch + **try** | 2027-02-12 | Phrasal Verbs at Work + Workplace Rights |

### March — Unit 7: Career Awareness

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 21 | W23 | confirm + stand + **lead** | 2027-02-19 | Job Applications + Interviews |
| 22 | W24 | choose + report + **mean** | 2027-02-26 | Career Progress + Skills |
| 23 | W25 | wear + begin + **use** | 2027-03-05 | Work Experience + Advocacy |
| 24 | W26 | teach + fight + **feed** | 2027-03-12 | Passive Voice + Pay Stubs |

### April — Unit 8: Health & Healthcare

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 25 | W27 | put + hurt + **examine** | 2027-03-19 | Healthcare Basics |
| 26 | W28 | hit + quit + **prescribe** | 2027-03-26 | Symptoms + Clinic Visits |
| 27 | W29 | get + know + **refill** | 2027-04-02 | The Doctor Said + Catch-Up |
| 28 | W30 | read + think + **rest** | 2027-04-09 | Third Conditional + Pharmacy |

### May — Unit 9: Holistic Wellness

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 29 | W31 | drive + ride + **need** | 2027-04-16 | I Used to + Wellness |
| 30 | W32 | feel + grow + **overcome** | 2027-04-23 | Be Used to + Still Adjusting |
| 31 | W33 | take + bring + **forgive** | 2027-04-30 | All Four Conditionals + One Bad Week |
| 32 | W34 | fall + lose + **fly** | 2027-05-07 | Gerunds + Infinitives + Packed Week |

### June — Unit 10: Year in Review & Next Steps

| Quiz | Week | Verbs | Due | Week focus |
|---:|---:|---|---|---|
| 33 | W35 | **ask** + **talk** + **chat** | 2027-05-14 | All the Tenses: A Year in Review |

### Held in reserve

`contact`, `respond`, `mix`, `burst`, `spread`, `bite`, `shake` — defined in the verb
bank but unused here, available to swap in.

## What it would take to build

Roughly an hour. Nothing about the quiz renderer or scoring needs to change: quiz
content is already shaped as `verbs: Record<string, VerbData>` and handles any
count — that is how last year's five-verb quizzes worked.

1. **`src/data/verb-quiz-plan.ts`** — `QUIZ_VERB_PAIRS` is typed
   `Array<[string, string]>`, a fixed pair. It becomes a variable-length list, and
   `GuidedVerbQuizPlanItem.verbs` widens from `[string, string]` to `string[]`.
2. **Quiz titles** — `getGuidedVerbQuizTitle()` joins verbs with `" + "`, which would
   give *"Verb Quiz 4: buy + keep + build"*. That is long for a card, so the title
   should probably become plain `Verb Quiz 4` with the verbs as a subtitle.
3. **Course map** — titles are derived from the plan, so re-running
   `scripts/maintenance/restructure-sept-2026-course-map.ts` regenerates them, then
   `prisma/seed-course-map.ts` and `npm run import:guided-verb-quizzes`.
4. **Dropping from 34 to 33 quizzes** — `verb-quiz-34` would no longer be in the map.
   Leave the activity in place rather than deleting it; it holds no student data.
5. **Watch `contentKind`** — any quiz activity the seed creates fresh defaults to
   `contentKind: "practice"`, and the Course Map only surfaces `map`-kind activities.
   The guided sync now sets `MAP` explicitly; keep it that way.

## Open question

This keeps two verbs for Quizzes 1 and 2 only. Since Quiz 1 now lands in Week 3, that
means stepping up at the *second* quiz. If you want a gentler ramp, holding two verbs
for the first three or four quizzes still works — it shifts the totals by only a verb
or two.
