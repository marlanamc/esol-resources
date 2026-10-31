# Standing project preferences

## Reward students for their effort

Marlana's explicit preference: students should always receive points for meaningful effort. Points matter deeply to the students and their motivation; reliable recognition is a core product requirement.

- Include effort-based points in student activities, course-map work, games, practice, and reviews. Recognize meaningful attempts and participation even when answers are imperfect; accuracy or mastery bonuses can be additional rewards.
- When creating or changing an activity, explicitly check that students can earn points, that awards are saved to their balances and ledger, and that the student sees confirmation. Do not silently make an activity unscored or remove existing rewards.
- Distinguish genuine new practice effort from duplicate requests or retries. Prevent technical duplicate awards without withholding credit for real work.
- Treat completed work with missing credit as a bug. Preserve completion evidence, investigate failures, and reconcile confirmed missing awards without duplicating points already received.
- Apply this preference in future design and implementation decisions. Specific point amounts and repeat-practice rules should fit the activity; do not interpret this preference as permission to grant unlimited points for clicks or network retries.

Saved at Marlana's request on September 29, 2026.

## Check GitHub before every deployment

Marlana's explicit preference: never deploy an outdated checkout that removes newer GitHub changes.

- Before any production deployment or promotion, fetch the latest GitHub refs and check the current branch, working-tree changes, and commits ahead of or behind the production branch (currently `origin/main`). Cached remote refs are not sufficient.
- Confirm that the exact source being deployed includes the latest production-branch commit. If it does not, preserve local work, incorporate the remote changes, resolve conflicts, and run the relevant checks before deploying. Apply this rule to temporary release folders and worktrees as well as the main checkout.
- If fetching fails or the source cannot be verified, stop deployment and explain the blocker. Do not assume the checkout is current. Never discard local changes or force-push to make the histories match.
- Fetch again before promoting a staged build. If GitHub advanced and those changes are absent from the build, incorporate them and rebuild before promotion.
- After deployment, verify that the live domain points to the intended deployment and record its source commit. Do not report a release as live based only on a successful local build or push.
- An intentional rollback or release excluding newer changes requires an explicit user request; it is not a routine exception to this rule.

Saved at Marlana's request on October 10, 2026, after an older local checkout temporarily omitted already-merged leaderboard updates.

## Batch small changes before deployment

Marlana's explicit preference: reduce Vercel deployment and function storage by batching small changes.

- Keep iterative copy, styling, and small interaction updates local for review, then deploy them together when the user is ready to release. Do not automatically push to the auto-deploying production branch after every small tweak.
- Continue running appropriate checks and preserve work in Git without triggering unnecessary deployments.
- For deployment cleanup, keep the current live version and a recent successful production backup. Verify active aliases before removing obsolete deployments; preserve deployments serving active domains.
- Do not create a deployment solely to save these instructions or cleanup notes.

Saved at Marlana's request on October 10, 2026.

## Verb-table slides: practice before answers

Marlana's explicit preference: immediately before each completed “Verbs of the Week” table, show the same table with only the V1 (base verb) entries filled in. Keep all column headers, the table layout, and the theme; leave the V1-s, V-ing, V2, and V3 answer cells blank. Follow it with the completed table for checking answers. Apply this pattern to future lesson slides.

Saved at Marlana's request on October 28, 2026.
