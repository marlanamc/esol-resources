-- Deduplicate calendar events before adding the unique constraint.
-- Keeps the earliest-created row per (classId, title, type, date);
-- ties on createdAt break by lowest id so the delete is deterministic.
DELETE FROM "CalendarEvent" a
USING "CalendarEvent" b
WHERE a."classId" = b."classId"
  AND a."title" = b."title"
  AND a."type" = b."type"
  AND a."date" = b."date"
  AND (a."createdAt" > b."createdAt" OR (a."createdAt" = b."createdAt" AND a."id" > b."id"));

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_classId_title_type_date_key" ON "CalendarEvent"("classId", "title", "type", "date");
