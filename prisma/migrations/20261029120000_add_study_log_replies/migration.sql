-- Teacher replies on practice logs: a corrected sentence (recast) or a thumbs-up (praise). Nullable columns only.
-- AlterTable
ALTER TABLE "StudyLog" ADD COLUMN "replyKind" TEXT,
ADD COLUMN "replyText" TEXT,
ADD COLUMN "repliedById" TEXT,
ADD COLUMN "repliedAt" TIMESTAMP(3),
ADD COLUMN "replySeenAt" TIMESTAMP(3);
