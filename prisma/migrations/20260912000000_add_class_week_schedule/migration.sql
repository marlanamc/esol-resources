-- Scheduled automatic week reveals.
--
-- A week becomes visible to a class once its revealAt has passed. This is
-- evaluated at read time in getVisibleMap(), so there is no cron job and the
-- timing is exact to the minute. Manual ClassReveal rows are unioned with
-- these, so a teacher can still open a week ahead of its scheduled date.
--
-- Additive only: no existing table or row is modified, and with no rows in this
-- table visibility behaves exactly as it did before.

-- CreateTable
CREATE TABLE IF NOT EXISTS "ClassWeekSchedule" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "revealAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassWeekSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ClassWeekSchedule_classId_weekId_key" ON "ClassWeekSchedule"("classId", "weekId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ClassWeekSchedule_classId_idx" ON "ClassWeekSchedule"("classId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ClassWeekSchedule_classId_revealAt_idx" ON "ClassWeekSchedule"("classId", "revealAt");

-- AddForeignKey
ALTER TABLE "ClassWeekSchedule"
    ADD CONSTRAINT "ClassWeekSchedule_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassWeekSchedule"
    ADD CONSTRAINT "ClassWeekSchedule_weekId_fkey"
    FOREIGN KEY ("weekId") REFERENCES "CourseWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
