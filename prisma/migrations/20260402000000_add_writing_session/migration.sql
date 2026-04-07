-- CreateTable
CREATE TABLE "WritingSession" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "timerEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingGroup" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "animalName" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,

    CONSTRAINT "WritingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "WritingGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingRound" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "roundIndex" INTEGER NOT NULL,
    "promptText" TEXT NOT NULL,
    "promptImageUrl" TEXT,

    CONSTRAINT "WritingRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingSubmission" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "isGroupWinner" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WritingSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingGroupVote" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "WritingGroupVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingClassVote" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "WritingClassVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WritingSession_activityId_classId_status_idx" ON "WritingSession"("activityId", "classId", "status");
CREATE INDEX "WritingSession_teacherId_idx" ON "WritingSession"("teacherId");
CREATE INDEX "WritingGroup_sessionId_idx" ON "WritingGroup"("sessionId");
CREATE UNIQUE INDEX "WritingGroupMember_groupId_studentId_key" ON "WritingGroupMember"("groupId", "studentId");
CREATE INDEX "WritingGroupMember_studentId_idx" ON "WritingGroupMember"("studentId");
CREATE UNIQUE INDEX "WritingRound_sessionId_roundIndex_key" ON "WritingRound"("sessionId", "roundIndex");
CREATE UNIQUE INDEX "WritingSubmission_roundId_studentId_key" ON "WritingSubmission"("roundId", "studentId");
CREATE INDEX "WritingSubmission_roundId_groupId_idx" ON "WritingSubmission"("roundId", "groupId");
CREATE UNIQUE INDEX "WritingGroupVote_roundId_voterId_key" ON "WritingGroupVote"("roundId", "voterId");
CREATE UNIQUE INDEX "WritingClassVote_roundId_voterId_key" ON "WritingClassVote"("roundId", "voterId");

-- AddForeignKey
ALTER TABLE "WritingSession" ADD CONSTRAINT "WritingSession_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingSession" ADD CONSTRAINT "WritingSession_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingSession" ADD CONSTRAINT "WritingSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingGroup" ADD CONSTRAINT "WritingGroup_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WritingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingGroupMember" ADD CONSTRAINT "WritingGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WritingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingGroupMember" ADD CONSTRAINT "WritingGroupMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingRound" ADD CONSTRAINT "WritingRound_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WritingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingSubmission" ADD CONSTRAINT "WritingSubmission_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "WritingRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingSubmission" ADD CONSTRAINT "WritingSubmission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WritingGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingSubmission" ADD CONSTRAINT "WritingSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingGroupVote" ADD CONSTRAINT "WritingGroupVote_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "WritingRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingGroupVote" ADD CONSTRAINT "WritingGroupVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingGroupVote" ADD CONSTRAINT "WritingGroupVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "WritingSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingClassVote" ADD CONSTRAINT "WritingClassVote_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "WritingRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingClassVote" ADD CONSTRAINT "WritingClassVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WritingClassVote" ADD CONSTRAINT "WritingClassVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "WritingSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
