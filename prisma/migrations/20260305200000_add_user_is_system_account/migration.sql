-- Add explicit system-account flag for hidden/internal users.
ALTER TABLE "User"
ADD COLUMN "isSystemAccount" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "User_isSystemAccount_idx" ON "User"("isSystemAccount");
