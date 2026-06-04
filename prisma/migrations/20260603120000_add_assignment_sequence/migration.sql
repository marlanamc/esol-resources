-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN "sequenceNumber" INTEGER,
ADD COLUMN "unitLabel" TEXT;

-- CreateIndex
CREATE INDEX "Assignment_classId_sequenceNumber_idx" ON "Assignment"("classId", "sequenceNumber");
