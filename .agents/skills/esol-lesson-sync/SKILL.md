---
name: esol-lesson-sync
description: Synchronize finalized ESOL lesson-content changes from this repository to existing Google Drive files, lesson plans, slides, and Google Classroom materials. Use after changes to lesson sources or generated resources and for explicit lesson-sync requests; skip unrelated application changes and draft-only work.
---

# ESOL lesson sync

Keep the classroom-facing resources consistent with the completed local lesson edits. This is an active-task workflow, not a filesystem watcher or scheduled job.

## Scope and delegation

For this repository, Marlana has requested that an agent perform necessary downstream updates after lesson-content changes. Default to the EBHCS account (`mcreed@ebhcs.org`) and the existing ESOL Level 3 course; verify identity and destinations before writes. Routine updates to matched existing lesson resources are authorized by this standing request. Respect explicit draft/local-only instructions. Ask only when the lesson, destination, conflicting edits, or publication intent cannot be resolved from evidence.

Use one dedicated sync subagent when delegation is available. Give it this skill, the changed paths/diff, lesson/week, final source artifacts, and any constraints. The parent finishes source edits before the handoff and waits for verified results. Only that agent writes the affected remote resources; avoid simultaneous edits. If delegation is unavailable, perform the same workflow directly.

## Establish the change set

- Inspect task changes, working-tree changes, and relevant generators; do not assume HEAD or all dirty files belong to the task. Include untracked lesson artifacts when relevant. Distinguish lesson changes from unrelated application code.
- Read the final slides, worksheet, answer key, warm-up, and teacher instructions that actually changed. Generate stale outputs with the established project build procedure and apply the appropriate artifact skill for validation. Do not upload an old PDF just because its HTML/source changed.
- Map affected surfaces: printable and Classroom variants, PDF and interactive HTML slides, native Slides, lesson-plan objectives/materials/procedure/assessment, and Classroom attachments/descriptions. Update only affected surfaces, but account for every relevant format.
- Read [known Week 10 mappings](references/week10.md) for that lesson. These are discovery anchors, not proof of current remote state. For other lessons, search Drive and Classroom; never reuse Week 10 IDs by analogy.
- Read current remote content before editing. Preserve newer teacher edits. If local and remote changes conflict substantively, finish independent work and ask about that conflict rather than overwrite it.

## Apply the updates

Use connected tools first, discovered from current tool metadata. Read the installed Drive/Docs/Slides skills as applicable. If a connector lacks the capability or rejects access, use the authorized browser session when available. Classroom list tools may omit scheduled posts and drafts: inspect those in the UI before concluding a post is missing.

- Replace raw Drive file bytes in place using the existing file ID and correct MIME type. Preserve folders, sharing, names, and links. Include HTML slide files when used by the lesson; PDF-only replacement does not update them.
- Edit native Docs/Slides with their dedicated tools, preserving structure and links. For Docs, read tab IDs and revision, make scoped edits with revision control, then read back. Do not treat a native Workspace file as a raw PDF upload target.
- Bring the lesson plan into agreement with actual task order, page/part references, examples, objectives, differentiation, and assessment. Keep class dates distinct from fictional dates inside activities. Preserve unrelated days and original timings unless the changed content requires adjustment.
- Maintain the project’s practice-before-answer verb-table pattern when changing slides. Recognize effort using the established points process; preserve completion evidence and existing rewards. Never claim points were saved without checking balances/ledger and student confirmation when awards are in scope. Resource sync alone does not grant points or change grades.
- Read existing Classroom attachments and settings. If they reference the replaced Drive IDs, verify the match; no repost is necessary. Update descriptions or attachments only as needed. Preserve schedules, draft/published state, audience, topics, due dates, points, submissions, and access. Do not publish a scheduled/draft post early, create duplicate posts, or alter student copies. If student copies require changes, report that separately.
- Do not deploy the website, push to an auto-deploy branch, change sharing broadly, delete resources, or send announcements as part of this sync. Those require their own task scope.

## Verify and record

Read back modified Drive metadata/content, native document edits, and Classroom attachment IDs/settings. Verify uploaded bytes by checksum when available, otherwise file size plus modification time and content inspection as appropriate. For layout-sensitive changes, render/inspect the affected pages or slides. A successful write response alone is insufficient.

Report each affected surface as updated, already current, or blocked. Stop retries on a persistent permission/capability error after checking an available fallback; complete independent surfaces. Do not mark the whole sync complete while a required surface is unverified.

Save a concise task-specific receipt under `output/lesson-sync/` with source paths and hashes, verified destination IDs/URLs, changed fields, verification evidence, and unresolved items. Record no credentials or student data. Receipts support retries, but always re-read live state; never blindly replay writes. Return links and any blocker to the parent/user.
