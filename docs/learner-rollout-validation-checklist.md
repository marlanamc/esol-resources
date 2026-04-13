# Learner Reliability Validation Checklist

Use this checklist before and after rollout for students and classroom-scale traffic.

## 1) Release Visibility

- [ ] Open student dashboard and verify only intended released grammar/quiz/speaking activities are visible.
- [ ] Confirm unreleased quiz/speaking items are hidden until published (`released: true`) in activity content.
- [ ] Validate section-group duplicate handling still shows only eligible activities after filtering.
- [ ] Confirm new `isReleasedInContent` normalization is persisted when speaking/quiz activities are released/unreleased (including legacy rows if fallback parsing is still needed).

## 2) Submission Integrity

- [ ] Submit one quiz/assignment normally and confirm points award once with the final score.
- [ ] Replay the same offline queue entry (or use browser “offline” toggle + resubmit) and confirm:
  - no duplicate points are added,
  - submission status transitions to completed,
  - API response remains `ok: true`.
- [ ] Verify idempotency keys are sent by offline clients and duplicates are ignored by `/api/activity/submit` and `/api/activity/progress`.

3) Offline Queue Observability

- [ ] Open browser devtools/network while queue is active and confirm `SubmissionOutboxManager` indicates waiting items.
- [ ] Confirm replay logs include attempted/succeeded/requeued counts and duration in logs.
- [ ] Confirm queue drains automatically on `online`, `focus`, and visibility restore.

## 4) Service Worker / Offline Fallback

- [ ] Confirm `/sw.js` updates are discovered with expected cadence and no frequent retry storms occur offline.
- [ ] Confirm navigation still loads `/offline` content when network is unavailable.
- [ ] Confirm document fetch is resilient on slow/spotty networks.

## 5) Performance Baseline (Top Routes)

- [ ] Compare payload sizes for `/api/activities` in production logs (student vs teacher/admin):
  - activity count,
  - payload bytes.
- [ ] Compare response durations for `/api/activity/submit` logs using:
  - `durationMs`
  - `payloadBytes`
  - `api.activity.submit.response` entries.
- [ ] Compare response durations for `/api/activity/progress` logs using:
  - `durationMs`
  - `payloadBytes`
  - `api.activity.progress.response` entries.
- [ ] Confirm no learner-critical page regresses in load time when content payload is minimized.
- [ ] Review slow-query logs for `activity.findMany.*` entries and investigate outliers.

## 6) Rollout Gate

- [ ] Keep monitoring for one school-day of normal usage before enabling any broader rollout.
- [ ] If regression is observed, revert the latest build tag and keep prior `/api/activities` payload shape active until root cause is fixed.
