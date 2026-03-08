-- Add optional avatar customization fields for users.
ALTER TABLE "User"
ADD COLUMN "avatar" TEXT,
ADD COLUMN "avatarColor" TEXT;
