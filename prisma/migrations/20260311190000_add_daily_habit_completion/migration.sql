CREATE TABLE "DailyHabitCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitKey" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyHabitCompletion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyHabitCompletion_userId_habitKey_dayKey_key"
    ON "DailyHabitCompletion"("userId", "habitKey", "dayKey");

CREATE INDEX "DailyHabitCompletion_userId_dayKey_idx"
    ON "DailyHabitCompletion"("userId", "dayKey");

CREATE INDEX "DailyHabitCompletion_habitKey_dayKey_idx"
    ON "DailyHabitCompletion"("habitKey", "dayKey");

ALTER TABLE "DailyHabitCompletion"
    ADD CONSTRAINT "DailyHabitCompletion_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
