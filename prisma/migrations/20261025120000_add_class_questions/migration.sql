-- Questions learners send from the course map before class. New table only.
-- CreateTable
CREATE TABLE "ClassQuestion" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassQuestion_classId_weekNumber_idx" ON "ClassQuestion"("classId", "weekNumber");

-- CreateIndex
CREATE INDEX "ClassQuestion_studentId_weekNumber_idx" ON "ClassQuestion"("studentId", "weekNumber");

-- AddForeignKey
ALTER TABLE "ClassQuestion" ADD CONSTRAINT "ClassQuestion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuestion" ADD CONSTRAINT "ClassQuestion_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

