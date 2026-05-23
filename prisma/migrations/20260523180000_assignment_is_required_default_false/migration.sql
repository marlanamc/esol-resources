-- Required/optional labeling is opt-in (September catch-up path). Existing classes stay unlabeled.
UPDATE "Assignment" SET "isRequired" = false WHERE "isRequired" = true;

ALTER TABLE "Assignment" ALTER COLUMN "isRequired" SET DEFAULT false;
