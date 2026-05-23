# September App And Chromebook Onboarding Plan

## Purpose

Next year, students are **expected to use Class Companion weekly — often daily**. Chromebooks will be available (everyone can rent one). That means **September Unit 1** must front-load super-beginner digital literacy before any other gap topics (scams, portals, MyChart, etc.).

The goal of the first two weeks is not grammar. It is:

> Every student can turn on a Chromebook, open Chrome, go to **myesolclass.com**, log in, reset a password if needed, and find **what we are working on today**.

After September, digital tasks can assume this baseline. Catch-up, homework, quizzes, and absence recovery all live in the app.

Full catch-up protocol: **[Absent Student Catch-Up Plan](absent-student-catch-up-plan.md)**

## App-First Assumption (Starting September)

| Expectation | What it means |
|---|---|
| Weekly minimum | Every student completes **This Week's Path** required items |
| Daily when possible | Vocab review, short practice, or quiz prep — not required every day at first |
| Absence recovery | Same app path — no separate makeup packet |
| Class prep | Students check the app **before** or **at the start of** class to see today's work |
| Chromebook | In-class default; rental available for home use |

**September teaches the habit.** October onward assumes it.

## September Week 1–2: Digital Boot Camp

Unit 1 (*Getting to Know You*) should reserve **Week 1 and much of Week 2** for onboarding before heavy grammar.

### Chromebook Sequence (Teach In Order)

Post this in the room and on the warm-up back. Same steps every time until automatic.

| Step | Action | English frame |
|---|---|---|
| 1 | Open Chromebook → log in to school Google account | "I log in to my Chromebook." |
| 2 | Open **Chrome** (the browser) | "I open Chrome." |
| 3 | Click the address bar → type **myesolclass.com** → Enter | "I go to my ESOL class website." |
| 4 | Tap **Log in** | "I log in to Class Companion." |
| 5 | Enter **username** and **password** | "My username is ___. My password is ___." |
| 6 | On the dashboard, find **Next Up** or **This Week's Path** | "I find today's work." |
| 7 | When finished, log out (Week 2+) | "I log out of Class Companion." |

**Bookmark option (Week 2):** Show students how to bookmark myesolclass.com in Chrome for one-click access.

**QR code option:** Level 1 vocab QR cards already point to myesolclass.com — reuse on September warm-ups and room poster.

### What "Today's Work" Means In The App

Students must learn one screen, not the whole menu:

1. **Next Up** — the one task to do first
2. **This Week's Path** — all required items for the week
3. **Due date** — when it must be done

They do **not** need to browse categories in September. Browsing comes later.

## Password Reset: Current State And Summer Work

### What Exists Now

| Flow | How it works | Limitation |
|---|---|---|
| Login | **Username** + password | Students may forget which is which |
| Forgot password | `/forgot-password` — requires **email** on file | Many students may not have email in the system |
| Email reset link | Token → `/reset-password?token=...` | Needs working email delivery |
| Teacher reset | `/api/admin/reset-student-password` — teacher sets new password | Works but manual; you do it one-by-one today |
| Must change password | `mustChangePassword` flag → forced reset page on login | Good for temp passwords |

### Why Manual Reset Happens Now

Students log in with **username**, but self-service reset uses **email**. If email is missing, wrong, or they don't check it, they come to you.

### Summer App Work (Password Reset)

- [ ] **Collect and verify student emails** during enrollment / Week 1 (even if login stays username-based).
- [ ] Add login-page help: "Forgot password? Try **Forgot password** (needs your email on file) **or ask your teacher.**"
- [ ] Add **username hint** on forgot-password page: "Use the email we have on file for your account. Not sure? Ask your teacher."
- [ ] Teacher dashboard: **one-click temp password** + `mustChangePassword: true` so student sets their own on next login (reduces manual back-and-forth).
- [ ] Optional: **username-based reset** (enter username → send reset link to email on file) — better match for how students think.
- [ ] Test email delivery end-to-end (forgot password → inbox → reset link → login).
- [ ] Print **Password Help** half-sheet for Week 1: username, how to reset, teacher contact.
- [ ] Week 1 **password station**: 10-minute block for anyone locked out — not a private embarrassment.

### Student-Facing Password Language

> **I forgot my password.**
> 1. Try **Forgot password** on the login page (use your email).
> 2. If that doesn't work, ask your teacher at the start of class.
> 3. Your teacher can give you a temporary password. You will choose a new one when you log in.

## App Scavenger Hunt (Week 1–2 Activity)

A guided tour beats a lecture. Students **find** features by doing, not by watching.

### Format Options

| Format | Pros | Best for |
|---|---|---|
| **In-app quiz/checklist** | Auto-tracks completion; reusable next year | Default choice |
| **Paper checklist + app** | Works if Wi-Fi fails; pairs help | Backup / Week 1 Tuesday |
| **Partner hunt** | Less anxiety; peer teaching | Mixed digital confidence |

**Recommendation:** Build as a **September quiz activity** in the app (short checkpoint questions) plus a **printable partner version** for the first in-class run.

### Scavenger Hunt Missions (Draft)

Students complete each mission and answer one proof question.

| # | Mission | Proof question (example) |
|---|---|---|
| 1 | Log in to myesolclass.com | What is the first name shown on your dashboard? |
| 2 | Find **This Week's Path** (or assignments list) | How many items are due this week? |
| 3 | Open **Next Up** or your first assigned task | What is the title of your next task? |
| 4 | Open one **vocabulary** activity | What is one word from this week's vocab? |
| 5 | Open one **grammar guide** or micro-lesson | What is the topic of the guide? |
| 6 | Find the **quiz** for this week (preview only OK in Week 1) | When is the quiz due? |
| 7 | Read the **class announcement** | What is this week's topic in one word? |
| 8 | Mark one task **complete** (or start and save progress) | What did you just finish or start? |
| 9 | Log out and log back in | (Teacher observation — no written answer) |
| 10 | **Stretch:** Find Daily Vocab or pronunciation | Where did you find it? |

Week 1 can use missions 1–7 only. Add 8–10 in Week 2.

### Class Flow (90 minutes, Week 1 Tuesday)

1. **Chromebook boot demo** (teacher, 10 min) — whole class watches once
2. **Partner scavenger hunt** (35 min) — pairs help each other; teacher + password station circulates
3. **Debrief** (10 min) — "Where do you find today's work?"
4. **Speaking** (25 min) — introduce yourself using paper, not app
5. **Exit ticket** (5 min) — "Show me your Next Up screen"

### App Build Notes (Summer)

- [ ] Create activity: **"App Scavenger Hunt — September"** (quiz or checklist type).
- [ ] Auto-assign to all enrolled students Week 1, due before second class.
- [ ] Teacher view: completion count for hunt (who still needs help).
- [ ] Reuse annually — update only announcement/quiz names if UI labels change.

## September Unit 1 Revised Split

Full-year context: **[School Year At A Glance](school-year-at-a-glance.md)**

| Week | Focus | Grammar (light) |
|---|---|---|
| Week 1 | Chromebook + login + scavenger hunt + class routines + **pre-test window** | None or parts of speech preview only |
| Week 2 | App habit + password confidence + first weekly path + first quiz (practice) | Parts of speech (short) |
| Week 3 | Getting to know you + stations + **verb forms overview** | Present simple review + verb form chart |
| Week 4 | Personal daily life + full weekly path rhythm + **present perfect intro** | Present perfect (short intro — life experience frames) |

**First real weekly quiz:** Week 2 or 3 — **practice quiz**, low stakes, to teach the routine.

**Why present perfect in September:** Level 2 teachers report students asking for it by end of year. A light September intro (not a full grammar unit) gives students useful frames early and connects naturally to **v3** on the verb chart. Spiral review all year — March career stories become much easier.

## Weekly Verb Forms Overview (Start Week 3)

Introduce the five forms students will see on **weekly verb quizzes** — overview only, not a deep grammar lecture.

| Code | Name | Example (*work*) | When quizzes use it |
|---|---|---|---|
| **v1** | base form | work | "What is the base form?" |
| **v1-3rd** | third person | works | "She ___ every day." |
| **v1-ing** | -ing form | working | continuous tenses, gerunds later |
| **v2** | past simple | worked | "Yesterday I ___." |
| **v3** | past participle | worked | present perfect: "I have ___ here for 3 years." |

**Class routine:**
- Tuesday warm-up **back** shows the week's 3 verbs in all five forms (small chart)
- App verb task + weekly quiz ask **one or two form questions** per week — not all five every time
- Week 3–4: teach the chart; Week 4 present perfect intro shows **why v3 matters**

**Do not:** assign a long verb conjugation packet or test every form every week in September.

## Present Perfect Intro (Week 4 — Light Touch)

**Goal:** useful life-experience language, not a full present perfect unit.

**Frames to teach:**
- "I have lived in ___ for ___ years."
- "Have you ever ___?"
- "I have never ___."
- "She has worked at ___ since ___."

**Connect to:**
- Getting to know you / personal daily life topic
- Verb chart **v3** column
- Timeline visual (past experience → now)

**Do not:** teach present perfect vs past simple in depth yet, or present perfect continuous. October spirals September frames; **March Unit 7 (Weeks 2–3)** teaches present perfect + present perfect continuous **together** in depth (career stories).

## Connection To Digital Literacy Later In The Year

Split digital literacy into two layers:

| Layer | When | Content |
|---|---|---|
| **Layer 1: App survival** | September | Chromebook, browser, URL, login, logout, password, find today's work |
| **Layer 2: Adult digital life** | October+ | Scams, forms, email safety, health portals, job applications |

Do not teach Layer 2 before Layer 1 is automatic.

Update the [NRS Coverage Gap Plan](nrs-level-3-4-coverage-gap-plan.md): move super-beginner digital literacy to September; keep scams/portals in October.

## Teacher September Checklist

### Before first class

- [ ] Schedule **pre-test** administration (Week 1–2 window alongside boot camp)
- [ ] All students have usernames; emails collected where possible
- [ ] Temp passwords set where needed; `mustChangePassword` tested
- [ ] Week 1 app path published (scavenger hunt + one small task)
- [ ] Class announcement posted with myesolclass.com + login help
- [ ] Room poster: Chromebook steps + QR to myesolclass.com
- [ ] Password Help half-sheet printed
- [ ] Chromebook rental info ready for students who need home access

### Every September class

- [ ] First 5 min: "Open your app → show me Next Up" (after Week 1)
- [ ] Password station available at start of class
- [ ] Never assume students remembered the URL — repeat the path

## Student Handout (One Page — Draft)

```text
CLASS COMPANION — HOW TO START EVERY CLASS

1. Open Chromebook → Chrome
2. Go to myesolclass.com
3. Log in (username + password)
4. Find "Next Up" or "This Week's Path"
5. Do today's required work

Forgot password? → Forgot password (email) OR ask your teacher.

Missed class? → Same app path. Finish required items before next class.

Need a Chromebook at home? → Ask your teacher about rental.
```

## Summer Work Summary

### App product

- [ ] Improve password reset UX (see Summer App Work above)
- [ ] Build September scavenger hunt activity
- [ ] Pin **Next Up** / **This Week's Path** for enrolled students
- [ ] Teacher temp-password + must-change flow streamlined

### Class materials

- [ ] Chromebook steps poster + QR code
- [ ] Password Help half-sheet
- [ ] Revise Unit 1 schedule to boot-camp Weeks 1–2
- [ ] Partner scavenger hunt print backup

### Other plans to update

- [ ] [Absent Student Catch-Up Plan](absent-student-catch-up-plan.md) — app expected, not optional
- [ ] [NRS Coverage Gap Plan](nrs-level-3-4-coverage-gap-plan.md) — September = Layer 1 digital
- [ ] [App Learning Path Roadmap](app-learning-path-summer-roadmap.md) — September onboarding phase

## Working Thesis

If the app is the spine of the class, **September is login month**. Everything else — catch-up, quizzes, homework, absence — depends on students knowing how to get in and find today's work without asking every time.

The scavenger hunt turns onboarding into something students **do**, not something they memorize from a lecture.
