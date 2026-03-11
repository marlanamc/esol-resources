-- Fix performanceHistory column type if it was created as TEXT[] (causes Prisma read failures).
-- Run: npx prisma db execute --file scripts/db/fix-performance-history-type.sql
-- Or: psql $DATABASE_URL -f scripts/db/fix-performance-history-type.sql

DO $$
DECLARE
  col_type text;
BEGIN
  SELECT atttypid::regtype::text INTO col_type
  FROM pg_attribute
  WHERE attrelid = '"UserVocabReviewState"'::regclass
    AND attname = 'performanceHistory'
    AND attnum > 0 AND NOT attisdropped;

  IF col_type = 'text[]' OR col_type LIKE '%text[]' THEN
    ALTER TABLE "UserVocabReviewState"
      ALTER COLUMN "performanceHistory" TYPE DOUBLE PRECISION[]
      USING COALESCE(
        (SELECT array_agg(x::double precision) FROM unnest("performanceHistory") AS x),
        '{}'
      );
    RAISE NOTICE 'Fixed performanceHistory: TEXT[] -> DOUBLE PRECISION[]';
  ELSE
    RAISE NOTICE 'Column type is % (no change needed)', col_type;
  END IF;
END $$;
