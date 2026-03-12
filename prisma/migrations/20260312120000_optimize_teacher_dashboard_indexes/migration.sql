-- Teacher dashboard summary-first queries need composite indexes for
-- featured assignment lookups, pending review counts, and calendar windows.
CREATE INDEX "Assignment_classId_isFeatured_updatedAt_idx"
ON "Assignment"("classId", "isFeatured", "updatedAt");

CREATE INDEX "Submission_status_assignmentId_idx"
ON "Submission"("status", "assignmentId");

CREATE INDEX "CalendarEvent_classId_date_idx"
ON "CalendarEvent"("classId", "date");
