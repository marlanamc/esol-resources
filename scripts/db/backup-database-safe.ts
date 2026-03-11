import { PrismaClient } from '@prisma/client';
import { createHash, createCipheriv, randomBytes } from 'crypto';
import { gzipSync } from 'zlib';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function toFileSafeIso(iso: string): string {
  return iso.replace(/:/g, '-').replace(/\..+$/, '');
}

function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret, 'utf8').digest();
}

function encryptAesGcm(plain: Buffer, secret: string): Buffer {
  const key = deriveKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Binary format: [12-byte IV][16-byte TAG][ciphertext]
  return Buffer.concat([iv, tag, encrypted]);
}

async function main() {
  const timestamp = new Date().toISOString();
  const stamp = toFileSafeIso(timestamp);
  const outputDir = path.join(process.cwd(), 'backups');
  const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;

  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Starting application data export...');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Encryption: ${encryptionKey ? 'enabled' : 'disabled'}`);
  console.log('WARNING: This is not a full PostgreSQL restore dump. Use the GitHub pg_dump workflow for disaster recovery.');

  const [
    users,
    classes,
    classEnrollments,
    activities,
    assignments,
    submissions,
    activityProgress,
    quizResponses,
    speakingSubmissions,
    pointsLedger,
    achievements,
    userAchievements,
    calendarEvents,
    feedback,
    userPreferences,
    vocabCards,
    userVocabReviewStates,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.class.findMany(),
    prisma.classEnrollment.findMany(),
    prisma.activity.findMany(),
    prisma.assignment.findMany(),
    prisma.submission.findMany(),
    prisma.activityProgress.findMany(),
    prisma.quizResponse.findMany(),
    prisma.speakingSubmission.findMany(),
    prisma.pointsLedger.findMany(),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany(),
    prisma.calendarEvent.findMany(),
    prisma.feedback.findMany(),
    prisma.userPreferences.findMany(),
    prisma.vocabCard.findMany(),
    prisma.userVocabReviewState.findMany(),
  ]);

  const payload = {
    meta: {
      version: 1,
      timestamp,
      encrypted: Boolean(encryptionKey),
      scope: 'application-export',
      note: 'Contains sensitive data (including password hashes). Keep secure. This file is not a full PostgreSQL restore dump.',
    },
    data: {
      users,
      classes,
      classEnrollments,
      activities,
      assignments,
      submissions,
      activityProgress,
      quizResponses,
      speakingSubmissions,
      pointsLedger,
      achievements,
      userAchievements,
      calendarEvents,
      feedback,
      userPreferences,
      vocabCards,
      userVocabReviewStates,
    },
  };

  const jsonBuffer = Buffer.from(JSON.stringify(payload));
  const gzBuffer = gzipSync(jsonBuffer, { level: 9 });

  const baseName = `backup-${stamp}.json.gz`;
  const finalName = encryptionKey ? `${baseName}.enc` : baseName;
  const finalPath = path.join(outputDir, finalName);
  const contentBuffer = encryptionKey ? encryptAesGcm(gzBuffer, encryptionKey) : gzBuffer;

  fs.writeFileSync(finalPath, contentBuffer);

  const checksum = sha256(contentBuffer);
  fs.writeFileSync(`${finalPath}.sha256`, `${checksum}  ${path.basename(finalPath)}\n`, 'utf8');

  console.log('Application data export complete.');
  console.log(`File: ${finalPath}`);
  console.log(`Size: ${(contentBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`SHA256: ${checksum}`);
  console.log('Row counts:');
  console.log(`  users: ${users.length}`);
  console.log(`  activities: ${activities.length}`);
  console.log(`  assignments: ${assignments.length}`);
  console.log(`  submissions: ${submissions.length}`);
  console.log(`  activityProgress: ${activityProgress.length}`);
  console.log(`  feedback: ${feedback.length}`);
  console.log(`  vocabCards: ${vocabCards.length}`);
  console.log(`  userVocabReviewStates: ${userVocabReviewStates.length}`);
}

main()
  .catch((error) => {
    console.error('Backup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
