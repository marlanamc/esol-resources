CREATE TYPE "UserRole" AS ENUM ('student', 'teacher', 'admin');

UPDATE "User"
SET "role" = 'admin'
WHERE "role" = 'teacher_admin';

ALTER TABLE "User"
ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
ALTER COLUMN "role" TYPE "UserRole"
USING (
  CASE
    WHEN "role" = 'admin' THEN 'admin'
    WHEN "role" = 'teacher' THEN 'teacher'
    ELSE 'student'
  END
)::"UserRole";

ALTER TABLE "User"
ALTER COLUMN "role" SET DEFAULT 'student';
