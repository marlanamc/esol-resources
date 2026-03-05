# From Custom ESOL Tool to Sellable Product

## Product Thesis
Build an **ESOL Classroom Operating System** for adult-learning teachers and programs.

- Not a generic LMS.
- Not a content marketplace.
- A daily operations tool that improves teaching consistency, student engagement, and outcomes.

## Positioning
**Who it serves first:** adult-ed ESOL teachers and small programs.

**Core promise:**
- Teachers save time every week.
- Students get clearer routines and stronger completion.
- Programs get visibility without extra admin burden.

## North-Star Outcomes
1. Teacher time saved per week (target: 2-5 hours).
2. Student weekly active rate (target: 70%+).
3. Assignment completion lift vs baseline (target: +15% or better).
4. Paid conversion at teacher/program level.

## The 10 Features to Standardize First
1. **Roster import + onboarding wizard**
   - CSV import, duplicate detection, temp credential generation, first-login tracking.
2. **Class/section model (already strong)**
   - Shared curriculum across sections, section-specific announcements and leaderboards.
3. **Assignment templates**
   - Reusable assignment bundles by level/unit/topic; one-click assign.
4. **Calendar + pacing templates**
   - Weekly cadence presets (e.g., M/W vs T/Th), auto-populate key dates.
5. **Teacher dashboard KPIs**
   - At-a-glance: active students, pending reviews, completion, top risk students.
6. **Student progress views for intervention**
   - "Who needs help now" list with clear skill gaps and suggested next activity.
7. **Password/account safety controls**
   - Bulk reset, first-login enforcement, weak-password blocking, account lock safeguards.
8. **Privacy and trust layer**
   - Minimal data collection, bilingual privacy page, deletion/export workflow.
9. **Reporting export pack**
   - Monthly attendance/activity/progress exports for coordinators/program admins.
10. **No-code content packaging**
   - Convert your current ESOL content into editable modules with metadata and versioning.

## Architecture Split (Critical)
Separate product into two layers:

- **Platform layer (reusable):** auth, classes, sections, enrollments, assignments, analytics, notifications.
- **Curriculum layer (replaceable):** your ESOL lessons, quizzes, guides, pacing plans.

This lets you keep your teaching style while enabling other teachers/programs to adopt without code.

## 12-Month Roadmap

## Phase 1 (0-60 days): Stabilize and De-risk
- Freeze core data model contracts.
- Add shared query/policy helpers everywhere (continue anti-drift hardening).
- Finish system-account and hidden-test-user guardrails.
- Ship bilingual privacy notice and data minimization statement.
- Add onboarding checklist for new classes/sections.

**Exit criteria:** no critical auth/data regressions; onboarding works without manual DB edits.

## Phase 2 (2-4 months): Productize Teacher Workflows
- Build roster import wizard.
- Add assignment + pacing templates.
- Improve intervention dashboard (students needing support).
- Add basic program-admin role for multi-teacher visibility.

**Exit criteria:** a new teacher can onboard one class end-to-end in under 20 minutes.

## Phase 3 (4-8 months): Pilot Monetization
- Add billing + plan gating (teacher plan + school plan).
- Launch reporting exports and admin controls.
- Run 3-5 paid pilots with defined success metrics.

**Exit criteria:** repeatable paid onboarding and measurable teacher/student outcomes.

## Phase 4 (8-12 months): Expand Distribution
- Launch "Home mode" beta (non-school learners), tenant-separated from school data.
- Add family invites and learner self-serve onboarding.
- Publish case studies and conversion assets.

**Exit criteria:** at least one reliable growth channel beyond founder-led outreach.

## Monetization Path
Start simple and keep pricing understandable.

- **Teacher Pro:** monthly per teacher.
- **Program/School:** annual per teacher seat or active student.
- **Later add-ons:** reporting/compliance tier, SIS integrations, advanced analytics.

Use annual contracts for institutional stability; avoid over-custom one-off pricing.

## What to Keep Custom (Your Moat)
- Your content voice and sequencing philosophy.
- Your visual style and learner-friendly UX.
- Your intervention patterns (how you identify and support struggling students).

## What Must Be Generic (To Scale)
- User lifecycle and permissions.
- Class/section assignment mechanics.
- Data exports and admin controls.
- Onboarding and account recovery.

## Risks and Mitigations
1. **Founder dependency risk**
   - Mitigation: document workflows + template everything.
2. **Too much customization per teacher**
   - Mitigation: constrained template system and feature flags.
3. **Privacy trust risk in immigrant communities**
   - Mitigation: strict data minimization and plain-language policy in English/Spanish.
4. **Complexity creep**
   - Mitigation: quarterly "kill list" of features not driving core outcomes.

## 30-Day Action Plan
1. Finalize product definition and pricing hypothesis.
2. Implement roster import MVP.
3. Ship assignment template library v1.
4. Add a "Program Admin" view with minimal analytics.
5. Publish bilingual privacy promise page.
6. Recruit 2 external teachers for usability feedback.

## Success Checkpoint Questions
- Can a new teacher run week 1 without your direct help?
- Can program admins get monthly progress reports in under 3 clicks?
- Are students completing more work with less confusion?
- Would a school pay annually for this as-is?

---

If these answers trend "yes," this is not just a personal tool anymore.
It is a product.
