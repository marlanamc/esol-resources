# Skill Chains / Practice Paths Plan

## Goal

Create guided learning flows that connect existing activities into one student-friendly sequence.

Core pattern:

```txt
Micro Lesson -> Preset Game -> Pronunciation Lab -> Use It
```

Purpose:

- make activities feel connected
- reduce decision fatigue
- launch games/labs with the right settings already chosen
- help students experience one purposeful path instead of separate category items

## Design Principle

The path should feel like:

```txt
Learn the pattern -> practice it in a game -> say it clearly -> use it in class or real life
```

Not:

```txt
Open grammar guide -> find game -> adjust settings -> find pronunciation activity
```

## Student-Facing Example

### Learn -> Play -> Say

**Timeline Tenses**

Purpose: talk clearly about past events, life experiences, and things happening now.

| Step | Activity | Time | Notes |
|---|---|---:|---|
| Learn | Micro lesson: past simple vs. present perfect | 5 min | short explanation + examples |
| Play | Timeline Tenses Game | 8 min | preset settings chosen by teacher/app |
| Say | Pronunciation Lab: `-ed` endings | 5 min | uses words/sentences from the lesson/game |
| Use It | Speak in class or answer 3 conversation questions | class/optional | real use |

Dashboard card:

```txt
Learn -> Play -> Say
Timeline Tenses
2 of 4 steps complete
Next up: Pronunciation Lab
Continue
```

## Core Concept

Add a wrapper layer called **Skill Chains** or **Practice Paths**.

A chain is a curated sequence of steps. Each step points to an existing activity type:

- microlearning module
- grammar game
- pronunciation lab
- speaking task
- writing task
- quiz

The existing activities and games should stay mostly unchanged. The new layer launches them in **assigned/preset mode**.

## Student Flow

Current:

```txt
Student opens game -> chooses settings -> plays
```

New:

```txt
Student opens Skill Chain
-> app launches activity with preset settings
-> student completes step
-> app sends student to the next step
```

## Technical Direction

### Parent Models

```prisma
model SkillChain {
  id                String   @id @default(cuid())
  title             String
  slug              String   @unique
  description       String?
  realLifePurpose   String?
  estimatedMinutes  Int?
  level             String?
  isPublished       Boolean  @default(false)
  steps             SkillChainStep[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model SkillChainStep {
  id                String   @id @default(cuid())
  skillChainId      String
  skillChain        SkillChain @relation(fields: [skillChainId], references: [id])
  stepOrder         Int
  stepType          SkillChainStepType
  title             String
  description       String?
  estimatedMinutes  Int?
  activityId        String?
  gameType          String?
  presetConfig      Json?
  required          Boolean @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([skillChainId, stepOrder])
}

enum SkillChainStepType {
  MICRO_LESSON
  GAME
  PRONUNCIATION_LAB
  WRITING
  SPEAKING_TASK
  QUIZ
}
```

### Progress Models

Track both the chain and each step.

```prisma
model SkillChainProgress {
  id              String   @id @default(cuid())
  userId          String
  skillChainId    String
  currentStepId   String?
  status          SkillChainProgressStatus @default(NOT_STARTED)
  startedAt       DateTime?
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, skillChainId])
}

model SkillChainStepProgress {
  id                String   @id @default(cuid())
  userId            String
  skillChainStepId  String
  status            SkillChainProgressStatus @default(NOT_STARTED)
  startedAt         DateTime?
  completedAt       DateTime?
  score             Int?
  attempts          Int @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([userId, skillChainStepId])
}

enum SkillChainProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  SKIPPED
}
```

## Preset Config

Each game/lab step gets a `presetConfig` JSON object.

Example: Timeline Tenses Game

```json
{
  "mode": "assigned",
  "gameSlug": "timeline-tenses",
  "topic": "work-life-history",
  "tenses": ["past_simple", "present_perfect", "present_continuous"],
  "difficulty": "level3",
  "rounds": 8,
  "allowSettingsChange": false,
  "showTeacherPurpose": true,
  "returnToChainAfterComplete": true,
  "completionRule": {
    "type": "rounds_completed",
    "requiredRounds": 8
  }
}
```

Student should see:

- activity purpose
- estimated time
- start/continue button

Student should not see:

- settings controls
- difficulty menus
- unrelated game options

## Game Component Pattern

Games should support two modes:

| Mode | Behavior |
|---|---|
| Free Play | student chooses settings |
| Assigned Path | settings come from `presetConfig`; settings UI hidden |

Example pattern:

```tsx
const isAssignedMode = mode === "assigned";

const [difficulty, setDifficulty] = useState(config?.difficulty ?? "easy");
const [rounds, setRounds] = useState(config?.rounds ?? 10);
const [selectedTenses, setSelectedTenses] = useState(config?.tenses ?? []);

{!isAssignedMode && (
  <GameSettings
    difficulty={difficulty}
    setDifficulty={setDifficulty}
    rounds={rounds}
    setRounds={setRounds}
  />
)}
```

Assigned mode should:

- hide settings UI
- show a short assigned intro
- record progress against the chain step
- return student to the chain when complete

## Step Launcher

Example route:

```txt
/skill-chains/[chainSlug]/steps/[stepId]
```

Launcher decides what to render:

```tsx
export default async function SkillChainStepPage({ params }) {
  const step = await getSkillChainStep(params.stepId);

  if (step.stepType === "GAME") {
    return <AssignedGameWrapper step={step} presetConfig={step.presetConfig} />;
  }

  if (step.stepType === "MICRO_LESSON") {
    return <MicroLessonStep step={step} />;
  }

  if (step.stepType === "PRONUNCIATION_LAB") {
    return <PronunciationLabStep step={step} />;
  }

  return null;
}
```

## Pronunciation Lab Preset

Example: `-ed` endings

```json
{
  "mode": "assigned",
  "labSlug": "ed-endings",
  "focus": "clear-past-tense",
  "words": ["worked", "moved", "started", "studied", "lived"],
  "sentences": [
    "I worked there in 2021.",
    "I moved to Boston three years ago.",
    "I started classes last year.",
    "I studied English before.",
    "I have lived here for three years."
  ],
  "completionRule": {
    "type": "items_completed",
    "requiredItems": 5
  },
  "allowSettingsChange": false,
  "returnToChainAfterComplete": true
}
```

## Dashboard Behavior

Show the whole chain as one path card.

Do not show the micro lesson, game, and pronunciation lab as unrelated assignments.

Example:

```txt
Learn -> Play -> Say
Timeline Tenses
2 of 4 steps complete
Next: Pronunciation Lab
Continue
```

Next-step logic:

```ts
function getNextStep(steps, progress) {
  return steps.find((step) => {
    const stepProgress = progress.find(
      (p) => p.skillChainStepId === step.id
    );
    return !stepProgress || stepProgress.status !== "COMPLETED";
  });
}
```

## MVP Plan

### MVP 1: Hard-Coded Skill Chain

- [ ] Create one Skill Chain page.
- [ ] Hard-code a Timeline Tenses chain.
- [ ] Launch existing Timeline Tenses game with locked settings.
- [ ] On completion, send student to Pronunciation Lab.
- [ ] Track basic progress.

### MVP 2: Database-Backed Skill Chains

- [ ] Add `SkillChain` and `SkillChainStep` models.
- [ ] Seed 2-3 example chains.
- [ ] Connect chain progress to student dashboard.

### MVP 3: Assignment Support

- [ ] Allow Skill Chains to be assigned to a class.
- [ ] Add due dates at chain level.
- [ ] Show assigned chains in **This Week's Path**.

### MVP 4: Teacher Builder

- [ ] Teacher creates/edits Skill Chains.
- [ ] Teacher chooses micro lesson, game, preset settings, pronunciation lab, speaking/writing/quiz step.
- [ ] Teacher saves and assigns the chain.

Do **not** start with MVP 4. First prove the student flow with one hard-coded chain.

## Summer Priority

This belongs in the July app build after the dashboard direction is clear.

Best first prototype:

```txt
Timeline Tenses micro lesson
-> Timeline Tenses Game with preset settings
-> -ed Pronunciation Lab
-> class speaking prompt
```

Success criteria:

- student sees one connected path
- no settings decision needed
- game returns to chain after completion
- dashboard shows next incomplete step
- teacher can explain why every step matters
