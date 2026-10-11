-- Give existing announcements an identity without creating any dismissals.
ALTER TABLE "Class" ADD COLUMN "announcementId" TEXT;
UPDATE "Class" SET "announcementId" = 'initial-' || "id";
ALTER TABLE "Class" ALTER COLUMN "announcementId" SET NOT NULL;

CREATE TABLE "AnnouncementDismissal" (
    "studentId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "classId" TEXT NOT NULL REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "announcementId" TEXT NOT NULL,
    "dismissedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("studentId", "classId")
);
CREATE INDEX "AnnouncementDismissal_classId_idx" ON "AnnouncementDismissal"("classId");
