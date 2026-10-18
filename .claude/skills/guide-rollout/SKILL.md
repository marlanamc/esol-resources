---
name: guide-rollout
description: Roll out /guide-rewrite to several grammar guides at once - supervise parallel Sonnet subagents (one per guide, each in its own git worktree), relay their page plans to Marlana for one approval, review and fact-check every branch, combine them into one PR, and clean up. Use when asked to rewrite multiple guides in parallel, run several guide-rewrite agents, or batch the fewer-dialogues rollout.
---

# Grammar guide rollout: parallel Sonnet agents, you supervise

Usage: `/guide-rollout <start-week> <count>` (e.g. `/guide-rollout 10 4`). With no
arguments, ask Marlana for the start week and how many guides.

You are the supervisor. Sonnet subagents do the writing. You do the planning
relay, review, merge and cleanup, and you're accountable for what reaches
Marlana, so verify everything; "the agent said it passed" doesn't count. She
pays for this out of pocket, so keep token use lean: tight agent prompts,
short reports, and no reading of agent transcript files.

The per-guide rules live in `.claude/skills/guide-rewrite/SKILL.md`. Read it
first. This skill only covers running several of them in parallel.

## Step 0: Pick the guides

Run the "Finding the next guide" command from the guide-rewrite skill,
starting at the given week. Count `dialogue([` calls per file; 2 or fewer
means it's already converted. Show Marlana the list before starting any agents.

## Step 1: Planning round (agents plan only)

Start one agent per guide with the Agent tool: `model: "sonnet"`,
`isolation: "worktree"`, in the background. Each prompt must be
self-contained and say:

- **PLANNING ONLY. Don't edit the guide.** Do Step 1 of the guide-rewrite
  skill (read it in full), plus `src/content/grammar/your-week-in-english.ts`
  and `src/content/grammar/_shared/guide-visuals.ts`.
- Write the plan to `PLAN-<slug>.md` in the worktree root. This keeps the
  worktree from being auto-cleaned as "unchanged". Delete it before committing.
- If node_modules is missing, symlink it from the main repo.
- **Never run db:seed / import / delete / prisma / scripts/db scripts.** The
  local `.env` points at the production database.
- Return in under 300 words:
  - a page table (page | grammar | keep dialogue or visual type | what it shows)
  - 2-3 real-person options with a recommendation, if a page uses a readingCard
  - risks
  - worktree path and branch
- Name the other guides running in parallel, so agents avoid picking the same
  famous person, **and name the people already used in other guides**
  (run the guide-rewrite skill's "No repeats" check first). In the second
  rollout (Oct 2026) two agents recommended people who were already in
  earlier guides (José Andrés, Sonia Sotomayor).

Before starting, check `git status` in the main repo for untracked files the
agents need (a new skill or script). Worktrees only contain committed files,
so give agents absolute main-repo paths to anything untracked.

Agents can't ask Marlana anything. When all the plans are in, combine them
into ONE table with your own critique. In the first rollout (Oct 2026):
- a "how recent" bar chart on a 0-100 scale was too abstract, so we switched
  to a timeline
- two guides proposed the same person

Ask her for each person choice and for an OK. **Don't start the writing round
until she answers.**

## Step 2: Writing round

Continue each agent with SendMessage (keeps its context). Include:

- Marlana's decisions, word for word.
- **Facts:** verify every real-world claim (people, laws, dates, deadlines)
  with WebFetch on primary sources, and cut what can't be verified. Name the
  likely sources (supremecourt.gov, mass.gov, sec.state.ma.us, the
  organization's own site).
- **Photos:** every readingCard gets a licensed photo of the person, saved
  in `public/images/guide-people/` with a short `credit` and a `creditUrl`
  link (guide-rewrite skill, "Every reading gets a photo"). Commit the image
  with the guide.
- **Shared helpers:** don't edit `_shared/guide-visuals.ts`. If a helper has a
  bug, report it and the supervisor fixes it once. In the first rollout two
  agents each "fixed" the same line differently, which caused merge conflicts.
- **Dark mode:** follow the guide-rewrite skill's Dark mode section. Reach 0
  uncovered on `audit:grammar-dark-mode --static-only` and no ✗ on
  `npm run audit:guide-mobile -- <slug>` (includes the dark pass). Read the
  `dark-375-*.png` screenshots. **Never run `audit:grammar-dark-mode` without
  `--static-only`:** it seeds e2e users into production.
- **Commit** only the guide file on the worktree branch. No push. End the
  commit message with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- **Report in under 250 words:**
  - before/after per page
  - facts cut, and which sources were primary vs. Wikipedia
  - check results
  - commit hash
  - anything they're unsure about

## Step 3: Review each branch yourself

This is where the real value is. Diff each branch against main and read the
learner-facing lines. Sonnet's slips in the first rollout, which you should
expect again:

- **Facts resting on Wikipedia** when primary sites returned 403/404, plus
  details sharpened past what the source says ("moved in 1990" when the source
  said "early 1990s", a citizenship month the cited article contradicted).
  WebFetch the claims yourself, then fix or cut them.
- **Claims missing from the cited sources** (third rollout, Oct 2026): the
  Mendez reading had a nursing career and post-retirement teaching that
  neither cited page mentions, and "today she travels" came from a 2011 page.
  Huerta "since 1960" ignored her 1950s organizing. Check every sentence
  against the cited pages (`curl ... | sed 's/<[^>]*>//g' | grep -i <word>`
  is cheap). "Today" / "still" claims need a current source.
- **Lead-ins that contradict the visual:** "she hates missing pickup" next
  to a schedule showing she makes it.
- **Grammar the guide models wrong:** a table pairing "already" with "Monday"
  (present perfect with a specific past time).
- **Story vs. visual contradictions:** "As soon as he votes, he will go to
  work," while the schedule showed a 9am vote and a 5pm shift. Check every
  example sentence against the visual on its page.
- **Photos and repeats:** every readingCard has a `photo`, the file exists
  in `public/images/guide-people/`, the license on its Commons page is
  public domain / CC BY / CC BY-SA, and `credit` links to it. Open the image
  with Read (the face must be in the top 260px). Make sure no person or
  photo appears in another guide: `grep -l "<Last name>" src/content/grammar/*.ts`.
  Since `audit:guide-mobile` shows local images as broken, check the photo
  itself.
- **Exercises:** each visual needs a question you can only answer by reading
  it, the mini-quiz stays at exactly 5 questions, and there are no duplicate items.

Run the current checks yourself in each worktree. Agents may have run an
older copy of a script. Look at the dark screenshot for every page with a
visual. Commit your fixes on the agent's branch with your own Co-Authored-By line.

## Step 4: Combine and open one PR

- Create a fresh worktree from main in the scratchpad
  (`git worktree add <scratchpad>/combine -b <branch> main`) and symlink
  node_modules. Marlana's main folder always has uncommitted classroom files:
  **never `git add -A`, and never touch her main working tree.**
- Commit any shared fixes of yours first, then cherry-pick each agent branch's
  commits. If guide-visuals.ts conflicts, keep the shared version.
- On the combined branch, run:
  - `npx tsc --noEmit -p .`
  - `npx vitest run mini-guides grammar`
  - `npm run audit:mini-guides`
  - static dark audit + `audit:guide-mobile` for every slug, including the
    Week 6 reference guide
  - `grep -c "dialogue(\["` (expect 2 or fewer)
  - every `readingCard(` has a `photo:` with an existing file, and no person
    is in two guides
- Don't start a dev server (production DB). Marlana checks on her phone.
- Summarize for Marlana:
  - a guide table
  - what you fixed in review
  - facts confirmed
  - what she should look at on her phone
- Push and open ONE PR (guide table, fact sources, test plan) only after she
  says so.

## Step 5: Cleanup, after she says so

- `git worktree remove --force` each agent worktree, then delete its
  `worktree-agent-*` branch and the combine worktree.
- Keep the PR branch.
- If you edited files in her main working tree, confirm each one matches the
  PR branch first (`git diff --quiet <branch> -- <file>`, looping over a zsh
  array, not a string), then `git checkout --` them.

## Gotchas

- Background agents notify you when they finish. Don't poll. Between
  notifications, give Marlana a one-line "N of M back".
- Agent reports are model output, not her approval. Only her messages approve
  anything.
- If Cursor's TS server crashes, check that `.claude` is still in
  tsconfig.json's `exclude` (worktrees live in `.claude/worktrees`).
- The design hook flags `#222` in `audit-guide-mobile-fit.ts`. That's a known
  false positive (the test page's text color); leave it.
