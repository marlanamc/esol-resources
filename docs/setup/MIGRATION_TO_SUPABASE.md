# Migrating from Prisma Postgres to Supabase

This guide walks you through migrating your Class Companion database from Prisma Postgres to Supabase. Take your time - you can do this on a quiet weekend when you have mental bandwidth.

---

## Why Migrate?

- **Prisma Postgres** has operation limits that can unexpectedly pause your site
- **Supabase** free tier: 500MB storage, **unlimited API requests**, no operation caps
- Same PostgreSQL underneath, so your Prisma schema works identically

---

## Prerequisites

You already have:
- [x] Supabase project created (`lcqlflinaambxlzdllzg`)
- [x] Connection string (Transaction pooler, port 6543)
- [ ] Your Supabase database password (the one you set when creating the project)

---

## Step 1: Export Data from Prisma Postgres

Do this while your Prisma subscription is still active.

### Option A: Use Prisma Console Backup (Easiest)

1. Go to [console.prisma.io](https://console.prisma.io)
2. Navigate to **classroom-companion → Backups**
3. Download the latest backup
4. Save the file somewhere safe

### Option B: Use pg_dump (More Reliable)

1. Get your Prisma Postgres connection string from the Prisma console
2. Run this command (replace `YOUR_PRISMA_CONNECTION_STRING`):

```bash
pg_dump "YOUR_PRISMA_CONNECTION_STRING" --data-only --inserts > backup.sql
```

This creates a SQL file with all your data.

---

## Step 2: Update Your Connection String

Your Supabase connection string format:
```
postgresql://postgres.lcqlflinaambxlzdllzg:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important**: Add `?pgbouncer=true` at the end for Prisma compatibility with the transaction pooler.

### Update Local Environment

1. Open your `.env` file
2. Change `POSTGRES_URL` to your Supabase connection string:

```env
POSTGRES_URL="postgresql://postgres.lcqlflinaambxlzdllzg:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### You'll Also Need a Direct Connection for Migrations

Supabase requires a direct connection (not pooled) for running migrations. Add this to your `.env`:

```env
DIRECT_URL="postgresql://postgres.lcqlflinaambxlzdllzg:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
```

Note: Direct connection uses port **5432**, pooled uses **6543**.

---

## Step 3: Update Prisma Schema

Open `prisma/schema.prisma` and update the datasource block:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_URL")
  directUrl = env("DIRECT_URL")
}
```

The `directUrl` is used for migrations, while `url` (pooled) is used for queries.

---

## Step 4: Run Migrations on Supabase

This creates all your tables in the new database:

```bash
npx prisma migrate deploy
```

You should see all your migrations being applied.

---

## Step 5: Import Your Data

### If you used pg_dump (Option B):

```bash
psql "YOUR_SUPABASE_DIRECT_CONNECTION_STRING" < backup.sql
```

### If you used Prisma Backup (Option A):

Follow Supabase's import instructions in their dashboard, or contact their support.

### If you can't export (fallback):

You'll need to re-seed the database:

```bash
npm run db:seed
npx tsx prisma/seed-achievements.ts
```

This will create fresh test accounts but you'll lose student data.

---

## Step 6: Test Locally

```bash
npm run dev
```

1. Open http://localhost:3000
2. Try logging in with an existing account
3. Check that student data, points, and achievements are present
4. Test creating a submission to verify writes work

---

## Step 7: Update Vercel Production

1. Go to [vercel.com](https://vercel.com) → Your project → Settings → Environment Variables
2. Update `POSTGRES_URL` to your Supabase pooled connection string
3. Add `DIRECT_URL` with your Supabase direct connection string
4. Redeploy your app:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

---

## Step 8: Verify Production

1. Visit your live site
2. Log in and verify data is present
3. Test a few actions (complete an activity, check leaderboard)

---

## Step 9: Cancel Prisma Subscription

Once everything is working on Supabase:

1. Go to [console.prisma.io](https://console.prisma.io)
2. Navigate to Settings → Billing
3. Cancel your subscription
4. Optionally delete the project

---

## Troubleshooting

### "prepared statement already exists" error

Make sure your `POSTGRES_URL` has `?pgbouncer=true` at the end.

### Migrations fail

Use the direct connection URL (port 5432) for migrations. Make sure `directUrl` is set in your schema.

### Can't connect to database

1. Check your password is correct (no special characters that need URL encoding)
2. Verify you're using the right port (6543 for pooled, 5432 for direct)
3. Check Supabase dashboard to ensure the project is active

### Data is missing after migration

If the import didn't work, you may need to manually export tables. You can use Prisma Studio on the old database to export CSVs:

```bash
# Point to old database temporarily
POSTGRES_URL="old_prisma_url" npx prisma studio
```

Then import CSVs via Supabase dashboard (Table Editor → Import).

---

## Summary Checklist

- [ ] Export data from Prisma Postgres
- [ ] Update `.env` with Supabase URLs
- [ ] Add `directUrl` to `prisma/schema.prisma`
- [ ] Run `npx prisma migrate deploy`
- [ ] Import data to Supabase
- [ ] Test locally
- [ ] Update Vercel environment variables
- [ ] Redeploy to production
- [ ] Verify production works
- [ ] Cancel Prisma subscription

---

## Supabase Resources

- Dashboard: https://supabase.com/dashboard
- Prisma + Supabase docs: https://supabase.com/docs/guides/database/prisma
- Connection pooling docs: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler

---

*Created: February 2026*
*For: Class Companion ESOL Platform*
