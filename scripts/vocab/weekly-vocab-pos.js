/**
 * Incremental part-of-speech labels for weekly vocab.
 * Merged at seed time after inline word.pos and legacy-pos-map.js.
 *
 * Add words unit-by-unit as you curate. Run `npm run db:seed:weekly-vocab` after edits.
 *
 * Batches:
 *   ✓ Unit 1  — sep-w1 … sep-w4 (September, 24 words)
 *   ✓ Unit 2  — oct-w1 … oct-w4 (October, 24 words)
 *   ✓ Unit 3  — nov-w1 … nov-w4 (November, 24 words)
 *   ✓ Unit 4  — dec-w1 … dec-w2 (December, 12 words)
 *   ✓ Unit 5  — jan-w1 … jan-w4 (January, 24 words)
 *   ✓ Unit 6  — feb-3-5, feb-10-12, feb-24-26 (February, mixed)
 *   ✓ Unit 7  — mar-3-5 … mar-31-apr-2 (March–April, mixed)
 *   ✓ Unit 8  — apr-7-9 … apr-28-30 (April, mixed)
 *   ✓ Unit 9  — may-5-7 … may-26-28 (May, mixed)
 *   ✓ Unit 10 — jun-2-4 (June, mixed)
 */

module.exports = {
  // ── Unit 1: September ────────────────────────────────────────────────────

  // sep-w1: Start the Class: Digital Habits
  "log in": "phrasal verb",
  navigate: "verb",
  submit: "verb",
  access: "verb",
  complete: "verb",
  review: "verb",

  // sep-w2: Parts of Speech: Key Verbs
  identify: "verb",
  categorize: "verb",
  pronounce: "verb",
  spell: "verb",
  translate: "verb",
  practice: "verb",

  // sep-w3: Verb Forms: Action Words
  explain: "verb",
  describe: "verb",
  discuss: "verb",
  listen: "verb",
  record: "verb",
  repeat: "verb",

  // sep-w4: Life Experience: Personal Journey Verbs
  relocate: "verb",
  introduce: "verb",
  motivate: "verb",
  achieve: "verb",
  overcome: "verb",
  immigrate: "verb",

  // ── Unit 2: October ──────────────────────────────────────────────────────

  // oct-w1: Community + Daily Routines: Schedule Verbs
  schedule: "verb",
  commute: "verb",
  prepare: "verb",
  attend: "verb",
  balance: "verb",
  exercise: "verb",

  // oct-w2: Transportation + Directions: Movement Verbs
  depart: "verb",
  arrive: "verb",
  transfer: "verb",
  locate: "verb",
  follow: "verb",
  cross: "verb",

  // oct-w3: Digital Safety + Forms: Protect Yourself Verbs
  register: "verb",
  protect: "verb",
  verify: "verb",
  avoid: "verb",
  sign: "verb",
  update: "verb",

  // oct-w4: Phone English + Family Connection: Communication Verbs
  contact: "verb",
  respond: "verb",
  confirm: "verb",
  decline: "verb",
  postpone: "verb",
  connect: "verb",

  // ── Unit 3: November ─────────────────────────────────────────────────────

  // nov-w1: Helping + Volunteering: Action Verbs
  volunteer: "verb",
  assist: "verb",
  support: "verb",
  contribute: "verb",
  donate: "verb",
  join: "verb",

  // nov-w2: Public Meetings + Suggestions: Discussion Verbs
  participate: "verb",
  suggest: "verb",
  propose: "verb",
  recommend: "verb",
  agree: "verb",
  // "listen" already mapped above

  // nov-w3: Voting + Contacting Officials: Civic Verbs
  vote: "verb",
  elect: "verb",
  advocate: "verb",
  petition: "verb",
  represent: "verb",
  campaign: "verb",

  // nov-w4: Community Issues: Problem-Solving Verbs
  analyze: "verb",
  resolve: "verb",
  improve: "verb",
  collaborate: "verb",
  report: "verb",
  prevent: "verb",

  // ── Unit 4: December ─────────────────────────────────────────────────────

  // dec-w1: Smart Spending + Big Numbers: Money Verbs
  purchase: "verb",
  compare: "verb",
  budget: "verb",
  save: "verb",
  spend: "verb",
  calculate: "verb",

  // dec-w2: Bills, Returns + Scams: Financial Action Verbs
  exchange: "verb",
  refund: "verb",
  withdraw: "verb",
  deposit: "verb",
  charge: "verb",
  dispute: "verb",

  // ── Unit 5: January ──────────────────────────────────────────────────────

  // jan-w1: Housing Basics: Renter Verbs
  rent: "verb",
  lease: "verb",
  occupy: "verb",
  move: "verb",
  qualify: "verb",
  apply: "verb",

  // jan-w2: Comparing Housing Options: Decision Verbs
  // "compare" already mapped above
  afford: "verb",
  evaluate: "verb",
  select: "verb",
  negotiate: "verb",
  own: "verb",

  // jan-w3: Landlord Calls + Repair Requests: Maintenance Verbs
  request: "verb",
  // "report" already mapped above
  inspect: "verb",
  repair: "verb",
  leak: "verb",
  clog: "verb",

  // jan-w4: Housing Problems + Solutions: Resolution Verbs
  // "resolve" already mapped above
  maintain: "verb",
  notify: "verb",
  document: "verb",
  // "prevent" already mapped above
  reimburse: "verb",

  // ── Unit 6: February ─────────────────────────────────────────────────────

  // feb-3-5: Jobs: Foundations
  // "schedule" already mapped above as verb — note: this unit uses it as a noun
  // The seed script uses the same key; the noun sense is captured here as override context
  // since "schedule" appears as a noun in this unit (work schedule), we add a note but keep verb
  // (the term resolves to a single POS; "schedule" as noun here is handled by definition context)
  break: "noun",
  "time off": "noun",
  team: "noun",
  reliable: "adjective",
  flexible: "adjective",

  // feb-3-5 bonus
  environment: "noun",
  role: "noun",
  "self-confidence": "noun",
  enthusiasm: "noun",
  teamwork: "noun",
  preferences: "noun",

  // feb-10-12: Cycle 1 Review + Workplace Phrasal Verbs
  "clock in": "phrasal verb",
  "clock out": "phrasal verb",
  "call out": "phrasal verb",
  shift: "noun",
  supervisor: "noun",
  "follow up": "phrasal verb",

  // feb-10-12 bonus
  "fill out": "phrasal verb",
  "turn in": "phrasal verb",
  // "log in" already mapped above
  "go over": "phrasal verb",
  timesheet: "noun",
  policy: "noun",

  // feb-24-26: Jobs: Experience & Timelines
  experience: "noun",
  resume: "noun",
  "cover letter": "noun",
  reference: "noun",
  // "submit" already mapped above
  deadline: "noun",

  // feb-24-26 bonus
  career: "noun",
  journey: "noun",
  fluent: "adjective",
  advancement: "noun",
  path: "noun",
  "under pressure": "phrase",

  // ── Unit 7: March ────────────────────────────────────────────────────────

  // mar-3-5: Jobs: Skills & Qualifications
  promotion: "noun",
  "gross pay": "noun",
  deductions: "noun",
  benefits: "noun",
  priority: "noun",
  "emergency fund": "noun",

  // mar-3-5 bonus
  ambitious: "adjective",
  decade: "noun",
  retire: "verb",
  // "achieve" already mapped above
  milestone: "noun",
  "long-term": "adjective",

  // mar-10-12: Jobs: Rules, Obligation & Permission
  must: "verb",
  should: "verb",
  can: "verb",
  required: "adjective",
  allowed: "adjective",
  safety: "noun",

  // mar-10-12 bonus
  permission: "noun",
  rule: "noun",
  prohibited: "adjective",
  polite: "adjective",
  // "request" already mapped above
  training: "noun",

  // mar-17-19: Jobs: Communication & Feedback
  right: "noun",
  // "advocate" already mapped above
  courtesy: "noun",
  strict: "adjective",
  comply: "verb",
  violate: "verb",

  // mar-17-19 bonus
  require: "verb",
  allow: "verb",
  // "rule" already mapped above
  prohibit: "verb",
  coordinate: "verb",
  recruit: "verb",

  // mar-24-26: Jobs: Rights, Rules & Advocacy
  feedback: "noun",
  advice: "noun",
  decision: "noun",
  consequence: "noun",
  reflect: "verb",
  // "recommend" already mapped above

  // mar-24-26 bonus
  risk: "noun",
  regret: "verb",
  // "experience" already mapped above
  choice: "noun",
  result: "noun",
  // "career" already mapped above

  // mar-31-apr-2: Jobs: Small Talk & Social Conversation
  "catch up": "phrasal verb",
  "show up": "phrasal verb",
  // "follow up" already mapped above
  "find out": "phrasal verb",
  "help out": "phrasal verb",
  "look forward to": "phrasal verb",

  // mar-31-apr-2 bonus
  "drop by": "phrasal verb",
  "run into": "phrasal verb",
  "hang out": "phrasal verb",
  "hear from": "phrasal verb",
  "catch up on": "phrasal verb",
  "stop by": "phrasal verb",
  "work out": "phrasal verb",

  // ── Unit 8: April ────────────────────────────────────────────────────────

  // apr-7-9: Health: Symptoms & Lifestyle
  cough: "verb",
  infected: "adjective",
  depressed: "adjective",
  habit: "noun",
  // "avoid" already mapped above
  quit: "verb",

  // apr-7-9 bonus
  inflamed: "adjective",
  pediatrician: "noun",
  cardiologist: "noun",
  track: "verb",
  arteries: "noun",
  stroke: "noun",

  // apr-14-16: Health: Recovery & Lifestyle
  recover: "verb",
  // "improve" already mapped above
  // "exercise" already mapped above
  lifestyle: "noun",
  // "prevent" already mapped above
  adjust: "verb",

  // apr-14-16 bonus
  // "result" already mapped above
  duration: "noun",
  bladder: "noun",
  liver: "noun",
  "used to": "phrase",
  pattern: "noun",

  // apr-28-30: Health: Doctor Visits
  appointment: "noun",
  checkup: "noun",
  diagnosis: "noun",
  prescription: "noun",
  fever: "noun",
  contagious: "adjective",

  // apr-28-30 bonus
  accustomed: "adjective",
  prefer: "verb",
  routine: "noun",
  transition: "noun",
  // "maintain" already mapped above
  substitute: "verb",

  // ── Unit 9: May ──────────────────────────────────────────────────────────

  // may-5-7: Health: Body & Medicine
  symptom: "noun",
  temperature: "noun",
  prescribe: "verb",
  dose: "noun",
  chronic: "adjective",
  nutrient: "noun",

  // may-5-7 bonus
  muscles: "noun",
  bones: "noun",
  drowsy: "adjective",
  // "sign" already mapped above
  caution: "noun",
  organ: "noun",

  // may-12-14: Health: Self-Care & Wellness
  wellness: "noun",
  "self-care": "noun",
  relax: "verb",
  "coping skills": "noun",
  // "balance" already mapped above
  mindful: "adjective",

  // may-12-14 bonus
  regimen: "noun",
  hydration: "noun",
  moderation: "noun",
  nourish: "verb",
  recreational: "adjective",
  restore: "verb",

  // may-19-21: Health: Home Remedies & Food
  processed: "adjective",
  remedy: "noun",
  relieve: "verb",
  soothe: "verb",
  fluids: "noun",
  ailment: "noun",

  // may-19-21 bonus
  packaged: "adjective",
  preserved: "adjective",
  // "required" already mapped above
  listed: "adjective",
  measured: "adjective",
  detox: "verb",

  // may-26-28: Reflection & Growth
  progress: "noun",
  challenge: "noun",
  success: "noun",
  accomplish: "verb",
  proud: "adjective",
  reflection: "noun",

  // may-26-28 bonus
  nerves: "noun",
  mind: "noun",
  cycle: "noun",
  outcome: "noun",
  keep: "verb",
  sustain: "verb",

  // ── Unit 10: June ────────────────────────────────────────────────────────

  // jun-2-4: Wrap-Up & Next Steps
  goal: "noun",
  achievement: "noun",
  growth: "noun",
  confident: "adjective",
  commitment: "noun",
  appreciate: "verb",

  // jun-2-4 bonus
  "next steps": "noun",
  plan: "noun",
  resource: "noun",
  community: "noun",
  // "review" already mapped above
  continue: "verb",
};
