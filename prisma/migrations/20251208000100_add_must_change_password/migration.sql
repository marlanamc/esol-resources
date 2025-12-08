-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATETIME,
    "weeklyPoints" INTEGER NOT NULL DEFAULT 0,
    "lastWeekRank" INTEGER
);
INSERT INTO "new_User" ("createdAt", "currentStreak", "id", "lastActivityDate", "lastWeekRank", "longestStreak", "name", "password", "points", "role", "updatedAt", "username", "weeklyPoints", "mustChangePassword") SELECT "createdAt", "currentStreak", "id", "lastActivityDate", "lastWeekRank", "longestStreak", "name", "password", "points", "role", "updatedAt", "username", "weeklyPoints", true FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
UPDATE "User" SET "mustChangePassword" = false WHERE "username" = 'teacher';
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;


