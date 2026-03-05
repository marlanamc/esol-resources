-- Support multi-section classes that share assignment sync
ALTER TABLE "Class"
ADD COLUMN "sectionGroupId" TEXT;

CREATE INDEX "Class_sectionGroupId_idx" ON "Class"("sectionGroupId");
CREATE INDEX "Class_teacherId_sectionGroupId_idx" ON "Class"("teacherId", "sectionGroupId");

