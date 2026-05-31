-- Add enrollment status to track active, exited, and graduated students
ALTER TABLE "ClassEnrollment" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "ClassEnrollment" ADD COLUMN "statusChangedAt" TIMESTAMP(3);
ALTER TABLE "ClassEnrollment" ADD COLUMN "statusNote" TEXT;

-- Add learner mode to drive which dashboard a student sees
ALTER TABLE "User" ADD COLUMN "learnerMode" TEXT NOT NULL DEFAULT 'class';

-- Flag for students repeating the class (set manually on re-enrollment)
ALTER TABLE "ClassEnrollment" ADD COLUMN "isReturning" BOOLEAN NOT NULL DEFAULT false;

-- Index for teacher roster queries (filter by status)
CREATE INDEX "ClassEnrollment_classId_status_idx" ON "ClassEnrollment"("classId", "status");
