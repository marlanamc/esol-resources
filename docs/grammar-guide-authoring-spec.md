# Grammar Guide Authoring Spec

How to build a new grammar guide for Class Companion. Every guide follows this structure and uses these tools. Read this before writing any content file.

---

## The Four Design Principles

1. **Max 5 sections.** If a topic needs more, split it into Part 1 / Part 2.
2. **Every guide has a real-world context theme** from its unit (community, workplace, health, housing, etc.). The theme runs through examples AND exercises — not just the intro photo.
3. **Exercises check accuracy, not recognition.** At least one `text` exercise per section. No "what tense is used for habits?" questions — students use the language, they don't name it.
4. **Perfect tense is a year-long arc.** Never introduce it abruptly. Use the micro-guide scaffolding in weeks 3, 5, 8, and 12 before the full guide appears.

---

## File Structure

```
src/content/grammar/your-guide-name.ts        ← content file
src/app/grammar-reader/your-guide-name/
  page.tsx                                     ← route file
src/data/your-guide-images.generated.ts        ← image data (if using photos)
```

After creating those files, add the guide to `src/lib/course-map-data.ts` and run:
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

---

### 2. `dialogue(turns[])`

A chat-bubble conversation. Use after the scene card to show the grammar in natural speech before explaining the rule.

```ts
${dialogue([
  { speaker: "Rosa",     avatar: "👩",  text: "I <strong>work</strong> days so I <strong>come</strong> straight from work.", side: "right", tone: "terracotta" },
  { speaker: "Classmate", avatar: "🧑", text: "My shift <strong>starts</strong> at noon — this class <strong>works</strong> for me.", side: "left",  tone: "sage" },
])}
```

**Rules for dialogue:**
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

## Quality Checklist

Before finishing any guide:

- [ ] Max 5 sections
- [ ] Every section uses vocabulary or scenarios from the unit theme
- [ ] No em dashes (`—`) anywhere in student-facing text
- [ ] All dialogue is grammatically correct (a student reads this as a model)
- [ ] At least one `text` exercise per section
- [ ] `tenseDiagram` present in every section that introduces or contrasts a tense
- [ ] Scene captions use a period or comma, not an em dash
- [ ] `word-scramble` exercises use `correctAnswer`, not `expectedAnswer`
- [ ] `text` exercises use `expectedAnswers` (plural array), not `expectedAnswer`
- [ ] Page route file created with matching `completionKey` and `activityId` title
- [ ] Added to course map and seed re-run
- [ ] Typecheck passes: `npx tsc --noEmit`
