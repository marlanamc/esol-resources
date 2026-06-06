# Grammar Guide Authoring Spec

How to build a new grammar guide for Class Companion. Every guide follows this structure and uses these tools. Read this before writing any content file.

---

## The Four Design Principles

1. **Max 5 sections.** If a topic needs more, split it into Part 1 / Part 2.
2. **Every guide has a real-world context theme** from its unit (community, workplace, health, housing, etc.). The theme runs through examples AND exercises — not just the intro photo. Scenarios must match how students actually live — see **Real-world tone** below.
3. **Exercises check accuracy, not recognition.** At least one `text` exercise per section. No "what tense is used for habits?" questions — students use the language, they don't name it.
4. **Perfect tense is a year-long arc.** Never introduce it abruptly. Use the micro-guide scaffolding in weeks 3, 5, 8, and 12 before the full guide appears.

---

## Real-world tone

Community centers, volunteering, and neighborhood programs are **real and valuable** — use them when the unit calls for it. But do not make every guide feel like a wholesome postcard. Most Level 3 students are in **survival mode**, not enrichment mode.

**Assume this about your learners:**
- Many work **two or three jobs** — restaurants, construction, factories, housecleaning, hotel laundry, warehouse, home care.
- They have **children and family** to care for, childcare to arrange, and almost no free time for themselves.
- English practice happens **between shifts**, on the bus, at a break, or after kids are asleep — not on a relaxed Saturday morning.

**Prefer these settings and pressures:**
- Closing a restaurant shift, opening a construction site, covering for a sick coworker
- Picking up kids late, swapping shifts with a cousin, missing class because of overtime
- Landlord texts, clinic appointments, EBT or benefits paperwork, paying a bill before cutoff
- Bus transfers, directions after work, calling out sick, asking a supervisor for Friday off

**Go easy on the cute community-center default:**
- Avoid making volunteering, bulletin boards, or "sign up for extra activities" the backdrop for every guide unless that week’s unit theme is genuinely about civic participation.
- Do not write characters who casually have free time to organize, mentor, or attend optional events every week.
- Skip inspirational filler ("Think of it like leveling up in a language app!") — respect that students are tired and doing hard things.

**When you do use community settings**, ground them in real errands: picking up a form, asking about childcare hours, getting help with a letter from school, finding out when the office closes — not hobby-style participation.

---

## Characters and Cultural Representation

Class Companion serves adult ESOL learners in East Boston — a community that is majority Latino (especially Guatemalan, Salvadoran, and Mexican), with large Haitian Creole, Brazilian Portuguese, Somali, and Vietnamese populations. The characters in every guide should reflect this **and** include common American names students will hear at work, school, and appointments.

### Name variety

Do not reuse the same name across sections or across guides. Pull from the communities actually represented in East Boston ESOL classrooms, plus familiar U.S. names:

| Background | Example names |
| --- | --- |
| Central American (Guatemalan, Salvadoran, Honduran) | Carlos, Miguel, Lucia, Ana, Diego, Sofia, Javier, Marta, Raul, Carmen, Gloria, Hector |
| Mexican | Rosa, Jorge, Elena, Marco, Valentina, Luis, Teresa, Arturo, Guadalupe, Pedro, Isabel |
| Caribbean Latino (Puerto Rican, Dominican, Colombian) | Javier, Natalia, Ramon, Yolanda, Kevin, Milagros, Andres, Carmen, Luisa, Victor |
| Haitian | Jean, Marie, Claudette, Pierre, Nadine, Yves, Josue, Esther, Claudine, Marc, Fabienne |
| Brazilian | Fernanda, Bruno, Camila, Rafael, Beatriz, Lucas, Juliana, Thiago, Patricia, Andre |
| Somali | Amara, Fadumo, Abdi, Hodan, Omar, Amina, Yusuf, Halima, Ibrahim, Safia |
| Vietnamese | Linh, Minh, Thanh, Lan, Tuan, Mai, Hoa, Duc, Trang, Binh, Huong |
| Cape Verdean | Djamila, Nuno, Filomena, Estevao, Carla, Joao, Fatima, Antonio, Neusa |
| Nigerian / West African | Yemi, Chidi, Ngozi, Emeka, Blessing, Adaeze, Kofi, Ama, Kwame, Zainab |
| Ethiopian / Eritrean | Hana, Daniel, Selam, Mulu, Dawit, Rahel, Yonas, Bethlehem |
| Chinese (Cantonese / Toisanese heritage) | Mei, Wei, Lian, Hong, Jenny, Tony, Susan, David |
| Cambodian | Sophea, Dara, Srey, Vanna, Rith, Chantha, Bopha |
| Filipino | Liza, Jose, Maria, Angelo, Grace, Rey, Cora, Ben |
| Arabic-speaking (Moroccan, Lebanese, Egyptian) | Fatima, Hassan, Leila, Samir, Nadia, Karim, Layla, Youssef |
| South Asian (Bangladeshi, Indian, Pakistani) | Priya, Raj, Anika, Farah, Imran, Deepa, Arjun, Rina, Vikram |
| American English (common U.S. names) | James, Sarah, Michael, Jennifer, Robert, Jessica, Emily, David, Ashley, Michelle, Brian, Lisa, Mark, Nicole, Kevin, Rachel, Thomas, Angela, Steven, Laura, Ryan, Hannah, Connor, Olivia, Emma, Matthew, Stephanie, Scott, Heather, Justin, Amy |
| Greater Boston / Irish & Italian heritage | Patrick, Sean, Brendan, Kathleen, Maureen, Danny, Gina, Sal, Vinnie |
| Teachers, staff, officials (use with title) | Ms. Tran, Mr. Okonkwo, Ms. Patel, Officer Davis, Nurse Kelly, Mr. Brennan, Ms. Rivera |

Use first names only in dialogue and exercises. No last names needed (except titles like Ms. Tran or Officer Davis for staff).

**American names in every guide:** At least one character per guide should have a common U.S. first name — a coworker, neighbor, clerk, nurse, manager, or classmate — so learners practice **hearing and saying** names they will meet in daily life. Good roles: "My supervisor, **Jennifer**, said…", "Tell **Mark** at the front desk", "**Sarah** from HR called." Mix American names with community names; do not make every character American, but do not skip them either.

### Dialogue avatars (emoji)

In `dialogue()` turns, the `avatar` field is a single emoji shown beside each speech bubble. **Mix skin tones freely** — use the full range so guides look like a real classroom, not a default-yellow cast.

```ts
{ speaker: "Amara", avatar: "👩🏿", text: "...", side: "right", tone: "terracotta" },
{ speaker: "Linh",  avatar: "👩🏻", text: "...", side: "left",  tone: "sage" },
{ speaker: "Carlos", avatar: "👨🏽", text: "...", side: "right", tone: "terracotta" },
{ speaker: "Jean",   avatar: "🧑🏾", text: "...", side: "left",  tone: "sage" },
```

**Avatar rules:**
- Prefer **person emojis with skin-tone modifiers** (`👩🏿` `👨🏽` `👩🏻` `🧑🏾` `👩🏾` `👨🏿` `👩🏽` `🧑🏻` `👨🏻`) over plain yellow defaults (`👩` `👨` `🧑`) when the speaker is a named character.
- **Vary skin tones across a guide** — do not give every character the same modifier.
- Neutral roles (Classmate, Neighbor, Staff) can use `🧑`, `🧑🏽`, or `🧑🏾`; still vary them across sections.
- Role emojis are fine for non-student speakers: `👩‍🏫` (teacher), `🧑‍💼` (manager), `👩‍⚕️` (nurse). Do not add skin tone to profession emojis unless your platform/font renders them well.
- The avatar does not have to "match" the name's background perfectly — diversity in the room matters more than one-to-one mapping.

### Rules for characters

- **No single character carries the whole guide.** If a guide has 4 sections, use at least 2–3 different characters across them.
- **Include at least one common American name** (see table above) in dialogue or exercises each guide — coworkers, neighbors, receptionists, teachers, caseworkers. Students need practice with names they will say aloud at work and appointments.
- **Vary the backgrounds across sections.** Do not put all Latino characters in one guide or all African characters in another.
- **Language references should reflect East Boston.** When a character mentions their home language, use languages students in the room actually speak: Spanish, Haitian Creole, Somali, Portuguese, Vietnamese, Arabic, Cantonese, Khmer, Tagalog, Bengali. Avoid languages with no East Boston presence (e.g. Wolof, Swahili, Mandarin) unless the unit theme specifically calls for it.
- **The main recurring character is Rosa** (Mexican American, from the Welcome Back guide). She can appear in later guides for continuity, but should not crowd out new characters.
- **Volunteers, teachers, and community center staff** can be from any background. They do not need to be white or native English speakers. Portray community staff as people students **need something from** (hours, forms, translation help) — not as the setting for a feel-good extracurricular story unless the unit requires it.
- **Work lives matter.** When a character has a job, name a real one students recognize: line cook, dishwasher, cleaner, carpenter, packer, cashier, home health aide — not vague "works at a company."

---

## File Structure

```
src/content/grammar/your-guide-name.ts        ← content file
src/app/grammar-reader/your-guide-name/
  page.tsx                                     ← route file
src/data/your-guide-images.generated.ts        ← image data (if using photos)
```

After creating those files, add the guide to `src/lib/course-map-data.ts`, register the slug in `src/lib/grammar-content-loader.ts`, and run:
```bash
npx tsx prisma/seed-course-map.ts
```

---

## Content File Template

```ts
import type { InteractiveGuideContent } from "@/types/activity";
import { yourGuideImages as img } from "@/data/your-guide-images.generated";

// --- Visual helpers (copy from welcome-back-tenses-review.ts) ---
// sceneCard(), dialogue(), tenseDiagram(), labelPill()

export const yourGuideContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [ /* 4–5 sections */ ],
};
```

Copy the four helper functions from `src/content/grammar/welcome-back-tenses-review.ts`. They are the standard toolkit for all new guides.

---

## The Four Visual Helpers

### 1. `sceneCard(sceneId, caption, accent?)`

A full-width photo with a caption bar. Opens every section that has a setting.

```ts
${sceneCard("sceneClinic", "East Boston Neighborhood Health Center — Tuesday, 6 PM", "sage")}
```

- Caption should name the place and time of day. No em dashes — use a period or comma.
- `accent` colors the "Scene" label: `"terracotta"` | `"sage"` | `"blue"` | `"amber"`
- Images live in `src/data/your-guide-images.generated.ts` as Unsplash URLs.

**Image data file shape:**
```ts
export const yourGuideImages: Record<string, {
  url: string;
  alt: string;
  unsplashId: string;
  credit: { name: string; url: string };
}> = {
  sceneClinic: {
    url: "https://images.unsplash.com/photo-XXXXXXX?w=1200&q=80&auto=format&fit=crop",
    alt: "Descriptive alt text for screen readers.",
    unsplashId: "XXXXXXX",
    credit: { name: "Photographer Name", url: "https://unsplash.com/@handle" },
  },
};
```

Pick Unsplash photos that show real people in real places — not stock-y poses. Clinics, buses, classrooms, apartment hallways, workplaces. Always include the credit.

**No duplicate Unsplash photos across guides:**
- Each guide gets its own `src/data/your-guide-images.generated.ts` file.
- **Do not reuse the same `unsplashId` in another grammar guide** unless the repeat is intentional (for example, a deliberate visual callback learners should recognize). If you reuse one, add a short comment on that entry explaining why.
- Before picking photos for a new guide, search `src/data/*-images.generated.ts` and treat every existing `unsplashId` as reserved.
- After adding images, confirm no duplicate `unsplashId` values appear across generated image files unless documented as intentional.
- Verify CDN URLs return HTTP 200 before committing (`curl -sI` on the `images.unsplash.com` URL).

---

### 2. `dialogue(turns[])`

A chat-bubble conversation. Use after the scene card to show the grammar in natural speech before explaining the rule.

```ts
${dialogue([
  { speaker: "Rosa",      avatar: "👩🏽", text: "I <strong>work</strong> days so I <strong>come</strong> straight from work.", side: "right", tone: "terracotta" },
  { speaker: "Classmate", avatar: "🧑🏾", text: "My shift <strong>starts</strong> at noon — this class <strong>works</strong> for me.", side: "left",  tone: "sage" },
])}
```

**Rules for dialogue:**
- Use **varied skin-tone avatars** for named characters (see Dialogue avatars above). Mix `🏽` `🏾` `🏿` `🏻` across speakers in the same guide.
- Grammar words in bold (`<strong>`). Only the target grammar, not every verb.
- Write like real people talk. Contractions, short answers, incomplete sentences are fine.
- No em dashes (`—`). Use commas, periods, or "so / but / because" instead.
- Left side = other person. Right side = the main character (Rosa, the student, the patient, etc.).
- `tone` sets the bubble color: `"terracotta"` | `"sage"` | `"blue"` | `"amber"`
- 3–4 turns is ideal. 6 turns maximum.
- Make sure every line is grammatically correct — a student will read this as a model.

---

### 3. `tenseDiagram` (section property)

Renders the **real** PAST / NOW / FUTURE band from the Timeline Tenses game (the actual `TimelineCanvas` SVG component, not HTML). Use whenever you introduce or contrast tenses. Students should see this diagram every time tenses are discussed so it becomes automatic.

This is a **section-level property**, not an HTML helper. Set it directly on the section object, alongside `explanation`, `exercises`, etc.

```ts
{
  id: "present-simple-review",
  title: "Present Simple: your routine tense",
  tenseDiagram: {
    title: "Where it lives on the timeline",
    elements: [
      { id: "ps-dot", type: "multiple-dots", zone: "present", position: 50, verbLabel: "Present Simple" },
    ],
  },
  explanation: `...`,
  exercises: [...],
}
```

**Element types:**

- `"single-dot"` — one filled circle. Use for simple/finished actions (Past Simple).
- `"multiple-dots"` — cluster of dots. Use for present simple (habitual/recurring).
- `"solid-line"` — horizontal bar. Use for continuous/in-progress actions.

**Zones** (must match `TimelineZone` exactly):

- `"past"` → amber band
- `"past-earlier"` → earlier past (for past perfect previews)
- `"present"` → green band (NOT `"now"`)
- `"future"` → blue band

**Required fields per element:** `id` (unique string), `type`, `zone`, `position` (0–100)
**Optional:** `verbLabel` (text shown below the element)

**Common patterns:**

Single tense introduction:

```ts
elements: [
  { id: "ps-dot", type: "multiple-dots", zone: "present", position: 50, verbLabel: "Present Simple" },
]
```

Two tenses contrasted:

```ts
elements: [
  { id: "past-simple", type: "single-dot",    zone: "past",    position: 60, verbLabel: "Past Simple" },
  { id: "past-cont",   type: "solid-line",    zone: "past",    position: 35, verbLabel: "Past Continuous" },
]
```

V3 preview (mystery tense):

```ts
elements: [
  { id: "past-cont",  type: "solid-line",    zone: "past",    position: 30, verbLabel: "Past Cont." },
  { id: "past-simp",  type: "single-dot",    zone: "past",    position: 65 },
  { id: "pres-simp",  type: "multiple-dots", zone: "present", position: 50, verbLabel: "Pres. Simple" },
  { id: "pres-cont",  type: "solid-line",    zone: "present", position: 50, verbLabel: "Pres. Cont." },
]
```

**When to use it:**
- At the start of any section that introduces or reviews a tense
- When contrasting two tenses side by side (put both elements in the same diagram)
- In V3/perfect tense previews — include all four known tenses as context

---

### 4. `labelPill(text, color)`

Inline colored tag for labeling example types. Use inside example grids.

```ts
${labelPill("routine", "terracotta")}
${labelPill("right now", "blue")}
${labelPill("temporary", "blue")}
```

---

## Section Structure

Each section follows this order:

```
1. sceneCard (if there's a setting to establish)
2. dialogue (grammar in natural speech, before the rule)
3. tenseDiagram (if introducing or contrasting tenses)
4. Rule callout box (1–2 sentences max)
5. Example grid with labelPills
6. Signal words callout
7. Exercises
```

Not every section needs all seven. The intro section often skips the rule box. The V3 preview skips the rule box entirely. Use judgment.

---

## Rule Callout Box

Keep it to 1–2 sentences. State the meaning, not the form.

```html
<div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
  <p style="margin: 0; font-size: 1.05rem"><strong>Present Simple</strong> = things that are generally true, routines, habits, and facts that don't change day to day.</p>
</div>
```

Color classes by tense family:
| Tense family | Class prefix |
|---|---|
| Present Simple, Past Simple | `gc-bg-terracotta-alpha gc-callout-terracotta` |
| Present/Past Continuous | `gc-bg-blue-alpha gc-callout-blue` |
| Modals, Perfect | `gc-bg-sage-alpha gc-callout-sage` |
| Future | `gc-bg-amber-alpha gc-callout-amber` |

---

## Example Grid with labelPills

```html
<div style="display: grid; gap: 0.5rem; margin: 1rem 0">
  <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
    ${labelPill("routine", "terracotta")}
    <span><em>I <strong>wake up</strong> at 6 every day.</em></span>
  </div>
</div>
```

3–4 examples maximum. All examples must use vocabulary from the unit theme.

---

## Exercises

### Rules

- **Every exercise must have a clear right or wrong answer.** The app auto-checks; it cannot grade open-ended free writing.
- **Never use `text` type for "write a true sentence about yourself."** Those answers cannot be verified.
- No "what tense is used for X?" questions — students should be *using* the language, not naming it.
- `word-scramble` uses `correctAnswer` (not `expectedAnswer`)
- `radio`, `word-scramble`, and error-correction exercises are the primary tools.
- Exercises should require thinking about **meaning**, not just spotting a signal word.

### Exercise types and when to use them

| Type | When to use |
|---|---|
| `radio` | Choose the correct form, identify meaning in context, "correct or not?" error checks |
| `word-scramble` | Build a correct sentence from shuffled words — use unit vocabulary |
| `word-select` | Click the word that fits a category (e.g. "which word is V3?") |
| `select` | Dropdown form choice when there are more than 3 options |
| `checkbox` | Multi-correct answers — use sparingly |
| `text` | **Only** for gap-fill with a short, predictable answer (one verb form, one word). Must have a small, finite set of `expectedAnswers`. Do NOT use for open-ended sentences. |

### Good exercise patterns

**Error correction (radio):** Student spots what is wrong and selects the fix.
```ts
{
  type: "radio",
  label: "Rosa <strong>work</strong> at a clinic on Meridian Street.",
  options: [
    { value: "work", label: "work — correct as is" },
    { value: "works", label: "works — needs the -s" },
    { value: "is working", label: "is working — present continuous" },
  ],
  expectedAnswer: "works",
}
```

**Simple vs. continuous contrast (radio):** Two options, meaning-driven choice.
```ts
{
  type: "radio",
  label: "Carlos ___ the 66 bus to class every week. (take)",
  options: [
    { value: "takes", label: "takes — present simple" },
    { value: "is taking", label: "is taking — present continuous" },
  ],
  expectedAnswer: "takes",
}
```

**Correct or not (radio):** Student judges a complete sentence.
```ts
{
  type: "radio",
  label: "\"She has <strong>working</strong> here for a long time.\"",
  options: [
    { value: "correct", label: "Correct" },
    { value: "incorrect", label: "Not correct. Should be 'worked' (V3)" },
  ],
  expectedAnswer: "incorrect",
}
```

**Sentence construction (word-scramble):**
```ts
{
  type: "word-scramble",
  label: "Unscramble:",
  words: ["My", "sister", "is", "looking", "for", "a", "new", "job", "this", "month"],
  correctAnswer: "My sister is looking for a new job this month",
}
```

**Gap-fill, one word only (text — use sparingly):**
```ts
{
  type: "text",
  label: "She ___ (go) to the clinic every Tuesday.",
  expectedAnswers: ["goes"],
}
```

---

## Final Mini Quiz (required — 10 questions)

Every guide ends with a `miniQuiz` array of exactly 10 questions. This is added to the top-level content object (not inside a section), after `sections: [...]`.

The quiz renders automatically after the student completes all sections. It is not a grammar test — it tests real-world language use: choosing the right form in a realistic situation, spotting errors in natural sentences, understanding meaning in context.

### Quiz design rules

- 10 questions, always
- Every question uses a real scenario from the guide's unit theme — no decontextualized grammar drills
- Questions test **usage and meaning**, not rule-naming or form recognition in isolation
- Include at least 2 error-detection questions ("which sentence is wrong?")
- Include at least 1 question requiring the student to choose between two tenses based on meaning
- Each question has an `explanation` — one sentence that gives the reason, not just the answer
- Tag every question with `topic`, `skill`, and `skillTag` for diagnostics

### `skill` values

- `"usage"` — choosing the right form based on meaning in context
- `"error-detection"` — spotting a wrong form in a natural sentence
- `"recognition"` — identifying what a form means (use sparingly)

### Format

```ts
miniQuiz: [
  {
    id: "guide-slug-q1",
    question: "Your neighbor asks what you do. Which answer fits?",
    options: [
      { value: "a", label: "I am working at a clinic." },
      { value: "b", label: "I work at a clinic." },
      { value: "c", label: "I worked at a clinic." },
    ],
    correctAnswer: "b",
    explanation: "Present simple for regular jobs and stable facts.",
    topic: "present-simple",
    skill: "usage",
    skillTag: "meaning-routine-vs-now",
    difficulty: "easy",
  },
  // ... 9 more questions
],
```

### `difficulty` spread per guide

- 3–4 `"easy"` — confident recall of core form
- 4–5 `"medium"` — meaning choice that requires thinking
- 1–2 `"hard"` — nuanced contrast or preview of upcoming grammar

---

## Tip Box

Optional. Use at the end of a section to preview what's coming or highlight a key insight.

```ts
tipBox: {
  title: "📅 Watch for it this year",
  content: "V3 will appear in small doses before the big lesson arrives.",
},
```

---

## Further Practice Tip Box (required when a full guide exists)

Every mini guide that has a corresponding full guide must end its **last section** with a tip box pointing to it. Use this exact pattern — just change the title and href.

```ts
tipBox: {
  title: "Want to go deeper?",
  content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/past-simple\" style=\"font-weight:700;text-decoration:underline\">Past Simple Full Guide</a>.",
},
```

**Rules:**
- Link text should be the plain guide title — no "click here."
- Always use the internal `/grammar-reader/your-guide-slug` path, never an external URL.
- Only add this tip box to the **last section** of the mini guide, not every section.
- If no full guide exists yet, omit it entirely — do not add a placeholder.

### Full guide inventory (as of summer 2026)

These full guides exist and can be linked from mini guides:

| Topic | Full guide path |
|---|---|
| Past Simple | `/grammar-reader/past-simple` |
| Past Continuous | `/grammar-reader/past-continuous` |
| Past Simple + Continuous together | `/grammar-reader/past-simple-past-continuous` |
| Present Simple | `/grammar-reader/present-simple` |
| Present Continuous | `/grammar-reader/present-continuous` |
| Present Perfect | `/grammar-reader/present-perfect` |
| Present Perfect Continuous | `/grammar-reader/present-perfect-continuous` |
| Past Perfect | `/grammar-reader/past-perfect` |
| Future Simple | `/grammar-reader/future-simple` |
| Future Continuous | `/grammar-reader/future-continuous` |
| Future Perfect | `/grammar-reader/future-perfect` |
| Information Questions | `/grammar-reader/information-questions` |
| Imperatives | `/grammar-reader/imperatives-declaratives` |
| Modals: obligation + permission | `/grammar-reader/modals-obligation-permission` |
| Modals: health advice | `/grammar-reader/modals-health-advice-caution-consent` |
| Zero + First Conditionals | `/grammar-reader/conditionals-zero-first` |
| Second + Third Conditionals | `/grammar-reader/conditionals-second-third` |
| Gerunds + Infinitives | `/grammar-reader/gerunds-infinitives` |
| Passive Voice | `/grammar-reader/passive-voice` |
| Reported Speech | `/grammar-reader/reported-speech` |
| Used to / Would rather | `/grammar-reader/used-to-would-rather` |
| Comparatives + Superlatives + Quantifiers | `/grammar-reader/superlatives-quantifiers` |
| Parts of Speech | `/grammar-reader/parts-of-speech` |
| Verb Forms Overview | `/grammar-reader/verb-forms-overview` |
| All Tenses Overview | `/grammar-reader/all-verb-tenses-overview` |
| Workplace Phrasal Verbs | `/grammar-reader/workplace-phrasal-verbs` |

---

## Page Route File

Copy this pattern exactly. Change the three highlighted values.

```ts
import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { yourGuideContent } from "@/content/grammar/your-guide-name";   // ← change
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Your Guide Title - Interactive Guide | Class Companion",   // ← change
    description: "One sentence description for SEO.",                  // ← change
};

export default async function YourGuidePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Your Guide Title",   // ← must match exactly what's in course-map-data.ts
        "guide",
        "grammar"
    );

    if (session.user.role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true },
        });
        if (!activity?.isReleased) redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={yourGuideContent}
                completionKey="your-guide-name"   // ← change (kebab-case, matches folder name)
                activityId={activityId}
            />
        </div>
    );
}
```

---

## Course Map Entry

Add to `src/lib/course-map-data.ts` inside the correct week's `items` array:

```json
{
  "id": "your-guide-name",
  "href": "/grammar-reader/your-guide-name",
  "slot": "required",
  "order": 2,
  "wrappedGame": false,
  "activityType": "guide",
  "title": "Your Guide Title"
}
```

Then seed:
```bash
npx tsx prisma/seed-course-map.ts
```

---

## Mini Guides Audit (Weeks 1–18)

Required course-map mini guides (weeks 1–18) are checked automatically in CI. Run the audit locally before opening a PR or after editing any W1–W18 content file.

### Commands

```bash
npm run audit:mini-guides              # summary + tmp/mini-guides-audit/findings.json
npm run audit:mini-guides -- --report  # also writes docs/audits/mini-guides-w1-w18-review.md
npm run audit:mini-guides -- --strict  # treat warnings as failures (same as vitest warning test)
npm run test:vitest -- scripts/tests/mini-guides-audit.vitest.ts
```

**CI:** GitHub Actions runs `npm run audit:mini-guides` on every push/PR. Vitest also fails if any required guide has errors or warnings.

**Scope:** All `slot: "required"` grammar guides in course-map weeks 1–18 (currently 19 guides). Full guides and optional items are not included unless added to the required slot.

### What it checks

**Errors (must fix — CI fails):**

| Rule | What it means |
| --- | --- |
| `content-file-missing` / `page-route-missing` | Content or page file not found |
| `completion-key-mismatch` | `completionKey` in page.tsx must match the guide slug |
| `activity-title-mismatch` | `getActivityIdSafely` title must match course-map title |
| `section-count` | More than 5 sections |
| `missing-text-exercise` | At least one `text` item required per section |
| `mini-quiz-count` | Exactly 10 `miniQuiz` questions |
| `mini-quiz-difficulty-*` | 3–4 easy, 4–5 medium, 1–2 hard |
| `mini-quiz-error-detection` | At least 2 questions with `skill: "error-detection"` |
| `mini-quiz-topic/skill/skillTag/explanation` | Required metadata on every quiz question |
| `em-dash` | No em dashes (`—`) in student-facing text |
| `word-scramble-expected-answer` | Use `correctAnswer`, not `expectedAnswer` |
| `text-expected-answer-singular` / `text-missing-expected-answers` | `text` items need `expectedAnswers` array |
| `tense-diagram-missing` | Tense-focused guides must include `tenseDiagram` (see allowlist in audit config) |
| `image-module-missing` | Guides using `sceneCard()` need a matching `*-images.generated.ts` import |
| `duplicate-unsplash-id` | Same `unsplashId` reused across guides (unless commented as intentional) |
| `image-alt-em-dash` / `image-credit-missing` | Image metadata quality |

**Warnings (must fix for W1–W18 — vitest fails on these too):**

| Rule | What it means |
| --- | --- |
| `american-name-missing` | At least one common U.S. name from the spec table (see Characters) |
| `plain-yellow-avatar` | Named characters should not use plain `👩` `👨` `🧑` — use skin-tone modifiers |
| `avatar-skin-tone-monotone` | All avatars in a guide use the same skin-tone modifier |
| `speaker-variety` | Fewer than 2 distinct named speakers in dialogue |
| `content-loader-missing` | Slug not registered in `src/lib/grammar-content-loader.ts` |
| `dialogue-too-many-turns` | More than 6 dialogue turns in one section |
| `dialogue-too-long` | One speaker line over 22 words |
| `dialogue-no-contraction` | Casual speakers (neighbor, manager, supervisor, cousin, etc.) with 10+ words and no contractions |
| `workplace-keyword-missing` | No survival-mode workplace/housing keyword in guide text |
| `wholesome-without-pressure` | Community/volunteer phrasing outside civic weeks without real pressure context |
| `vague-job-reference` | e.g. "works at a company" |
| `textbook-phrase` | e.g. "the rule is", "in english, we", "let us learn" |
| `long-sentence` | Student-facing sentence over 30 words |

### When adding or editing a W1–W18 guide

1. Write content following this spec.
2. Register the slug in `src/lib/grammar-content-loader.ts` if not already present.
3. Run `npm run audit:mini-guides -- --report` and fix all errors and warnings.
4. Confirm `npm run test:vitest -- scripts/tests/mini-guides-audit.vitest.ts` passes.

The markdown report at `docs/audits/mini-guides-w1-w18-review.md` lists scenarios, dialogue, images, mini quiz questions, and flags per guide — useful for editorial review.

---

## Quality Checklist

Before finishing any guide:

- [ ] Max 5 sections
- [ ] Every section uses vocabulary or scenarios from the unit theme
- [ ] Scenarios reflect survival-mode adult life (work shifts, childcare, bills, appointments) — not default cute volunteering unless the unit calls for it
- [ ] At least one job or workplace pressure feels real (restaurant, construction, factory, cleaning, etc.)
- [ ] No em dashes (`—`) anywhere in student-facing text
- [ ] All dialogue is grammatically correct (a student reads this as a model)
- [ ] At least one `text` exercise per section
- [ ] `tenseDiagram` present in every section that introduces or contrasts a tense
- [ ] Scene captions use a period or comma, not an em dash
- [ ] `word-scramble` exercises use `correctAnswer`, not `expectedAnswer`
- [ ] `text` exercises use `expectedAnswers` (plural array), not `expectedAnswer`
- [ ] Page route file created with matching `completionKey` and `activityId` title
- [ ] Added to course map and seed re-run
- [ ] Slug registered in `src/lib/grammar-content-loader.ts` (required W1–W18 guides)
- [ ] Mini guides audit passes: `npm run audit:mini-guides` (0 errors, 0 warnings for W1–W18)
- [ ] Typecheck passes: `npx tsc --noEmit`
