-- Course map tables were added to schema.prisma with the course path work but
-- never got a CREATE migration. Later migrations ALTER/UPDATE CourseMapItem and
-- fail on fresh databases (CI). IF NOT EXISTS keeps this safe for environments
-- that already received these tables via db push.

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseUnit" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "month" TEXT,

    CONSTRAINT "CourseUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseWeek" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "goal" TEXT,

    CONSTRAINT "CourseWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ClassReveal" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "revealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassReveal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseMapItem" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "activityId" TEXT,
    "href" TEXT,
    "slot" TEXT NOT NULL DEFAULT 'required',
    "order" INTEGER NOT NULL,
    "wrappedGame" BOOLEAN NOT NULL DEFAULT false,
    "activityType" TEXT NOT NULL DEFAULT 'guide',
    "title" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CourseMapItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CourseUnit_number_key" ON "CourseUnit"("number");
CREATE INDEX IF NOT EXISTS "CourseWeek_unitId_idx" ON "CourseWeek"("unitId");
CREATE UNIQUE INDEX IF NOT EXISTS "CourseWeek_unitId_number_key" ON "CourseWeek"("unitId", "number");
CREATE INDEX IF NOT EXISTS "ClassReveal_classId_idx" ON "ClassReveal"("classId");
CREATE INDEX IF NOT EXISTS "ClassReveal_weekId_idx" ON "ClassReveal"("weekId");
CREATE UNIQUE INDEX IF NOT EXISTS "ClassReveal_classId_weekId_key" ON "ClassReveal"("classId", "weekId");
CREATE INDEX IF NOT EXISTS "CourseMapItem_weekId_order_idx" ON "CourseMapItem"("weekId", "order");
CREATE INDEX IF NOT EXISTS "CourseMapItem_activityId_idx" ON "CourseMapItem"("activityId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "CourseWeek" ADD CONSTRAINT "CourseWeek_unitId_fkey"
    FOREIGN KEY ("unitId") REFERENCES "CourseUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ClassReveal" ADD CONSTRAINT "ClassReveal_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ClassReveal" ADD CONSTRAINT "ClassReveal_weekId_fkey"
    FOREIGN KEY ("weekId") REFERENCES "CourseWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CourseMapItem" ADD CONSTRAINT "CourseMapItem_weekId_fkey"
    FOREIGN KEY ("weekId") REFERENCES "CourseWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CourseMapItem" ADD CONSTRAINT "CourseMapItem_activityId_fkey"
    FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
