-- CreateIndex
CREATE INDEX "Class_teacherId_createdAt_idx" ON "Class"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityProgress_userId_activityId_updatedAt_idx" ON "ActivityProgress"("userId", "activityId", "updatedAt");

-- CreateIndex
CREATE INDEX "Assignment_classId_createdAt_idx" ON "Assignment"("classId", "createdAt");

-- CreateIndex
CREATE INDEX "Assignment_classId_isFeatured_createdAt_idx" ON "Assignment"("classId", "isFeatured", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_userId_activityId_updatedAt_idx" ON "Submission"("userId", "activityId", "updatedAt");

-- CreateIndex
CREATE INDEX "Submission_userId_status_completedAt_idx" ON "Submission"("userId", "status", "completedAt");
