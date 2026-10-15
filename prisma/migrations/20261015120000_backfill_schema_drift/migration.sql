-- Backfill schema that reached production through `prisma db push` but was
-- never captured in a migration, so a database built from migrations alone
-- (CI, fresh installs) matches schema.prisma.
--
-- Every statement is idempotent: on production, where these objects already
-- exist, this migration is a no-op. It only adds; it never alters an existing
-- foreign key or drops a column. Activity.isReleasedInContent is deliberately
-- kept (see supportsActivityIsReleasedInContent).

-- ActivityProgress: per-assignment progress rows.
ALTER TABLE "ActivityProgress" ADD COLUMN IF NOT EXISTS "assignmentId" TEXT;
-- Superseded by the three-column key below; a practice row and an assignment
-- row for the same activity must be able to coexist.
DROP INDEX IF EXISTS "ActivityProgress_userId_activityId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "ActivityProgress_userId_activityId_assignmentId_key" ON "ActivityProgress"("userId", "activityId", "assignmentId");
CREATE INDEX IF NOT EXISTS "ActivityProgress_userId_idx" ON "ActivityProgress"("userId");

CREATE TABLE IF NOT EXISTS "SpeakingSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "selectedPromptIds" TEXT[],
    "soloSentences" TEXT[],
    "soloFollowUpQuestions" TEXT[],
    "soloCompletedStepIds" TEXT[],
    "speakingBestSentence" TEXT NOT NULL,
    "speakingCompletedStepIds" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'submitted',

    CONSTRAINT "SpeakingSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "QuizResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "skillTag" TEXT,
    "difficulty" TEXT,
    "topic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WritingSessionCheckIn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WritingSessionCheckIn_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SpeakingSubmission_userId_idx" ON "SpeakingSubmission"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "SpeakingSubmission_userId_activityId_assignmentId_key" ON "SpeakingSubmission"("userId", "activityId", "assignmentId");
CREATE INDEX IF NOT EXISTS "QuizResponse_userId_idx" ON "QuizResponse"("userId");
CREATE INDEX IF NOT EXISTS "QuizResponse_activityId_idx" ON "QuizResponse"("activityId");
CREATE INDEX IF NOT EXISTS "QuizResponse_skillTag_idx" ON "QuizResponse"("skillTag");
CREATE INDEX IF NOT EXISTS "QuizResponse_userId_activityId_idx" ON "QuizResponse"("userId", "activityId");
CREATE INDEX IF NOT EXISTS "QuizResponse_activityId_skillTag_idx" ON "QuizResponse"("activityId", "skillTag");
CREATE INDEX IF NOT EXISTS "WritingSessionCheckIn_sessionId_idx" ON "WritingSessionCheckIn"("sessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "WritingSessionCheckIn_sessionId_studentId_key" ON "WritingSessionCheckIn"("sessionId", "studentId");

CREATE INDEX IF NOT EXISTS "Assignment_classId_idx" ON "Assignment"("classId");
CREATE INDEX IF NOT EXISTS "Assignment_isFeatured_idx" ON "Assignment"("isFeatured");
CREATE INDEX IF NOT EXISTS "Assignment_dueDate_idx" ON "Assignment"("dueDate");
CREATE INDEX IF NOT EXISTS "CalendarEvent_classId_idx" ON "CalendarEvent"("classId");
CREATE INDEX IF NOT EXISTS "Class_teacherId_idx" ON "Class"("teacherId");
CREATE INDEX IF NOT EXISTS "ClassEnrollment_classId_idx" ON "ClassEnrollment"("classId");
CREATE INDEX IF NOT EXISTS "ClassEnrollment_studentId_idx" ON "ClassEnrollment"("studentId");
CREATE INDEX IF NOT EXISTS "PointsLedger_userId_idx" ON "PointsLedger"("userId");
CREATE INDEX IF NOT EXISTS "PointsLedger_source_idx" ON "PointsLedger"("source");
CREATE INDEX IF NOT EXISTS "PointsLedger_userId_createdAt_idx" ON "PointsLedger"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "PointsLedger_source_createdAt_idx" ON "PointsLedger"("source", "createdAt");
CREATE INDEX IF NOT EXISTS "Submission_userId_idx" ON "Submission"("userId");
CREATE INDEX IF NOT EXISTS "Submission_status_idx" ON "Submission"("status");
CREATE INDEX IF NOT EXISTS "Submission_assignmentId_idx" ON "Submission"("assignmentId");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_weeklyPoints_idx" ON "User"("weeklyPoints");
CREATE INDEX IF NOT EXISTS "User_role_weeklyPoints_idx" ON "User"("role", "weeklyPoints");
CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- Foreign keys for the backfilled column and tables, added only when missing.
DO $$
DECLARE
    fk RECORD;
BEGIN
    FOR fk IN SELECT * FROM (VALUES
        ('ActivityProgress', 'ActivityProgress_assignmentId_fkey', 'FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE'),
        ('SpeakingSubmission', 'SpeakingSubmission_activityId_fkey', 'FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE'),
        ('SpeakingSubmission', 'SpeakingSubmission_assignmentId_fkey', 'FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE'),
        ('SpeakingSubmission', 'SpeakingSubmission_userId_fkey', 'FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE'),
        ('QuizResponse', 'QuizResponse_activityId_fkey', 'FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE'),
        ('QuizResponse', 'QuizResponse_assignmentId_fkey', 'FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE'),
        ('QuizResponse', 'QuizResponse_userId_fkey', 'FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE'),
        ('WritingSessionCheckIn', 'WritingSessionCheckIn_sessionId_fkey', 'FOREIGN KEY ("sessionId") REFERENCES "WritingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE'),
        ('WritingSessionCheckIn', 'WritingSessionCheckIn_studentId_fkey', 'FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE')
    ) AS t(tbl, name, def)
    LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = fk.name) THEN
            EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I %s', fk.tbl, fk.name, fk.def);
        END IF;
    END LOOP;
END $$;
