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
