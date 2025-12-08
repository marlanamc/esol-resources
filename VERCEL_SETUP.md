# Vercel Deployment Setup Guide

## Required Environment Variables

You need to set these environment variables in your Vercel project:

### 1. NEXTAUTH_SECRET
A secure random string used to encrypt JWT tokens. 

**Generate a new secret:**
```bash
openssl rand -base64 32
```

**Or use this one (already generated for you):**
```
JNs7pE2bgrOR0qAJVYecPcpl23OjeuGhIN2d7CImnKk=
```

### 2. DATABASE_URL
Your database connection string. For SQLite (local development):
```
file:./prisma/dev.db
```

**For Vercel production**, you have a few options:

#### Option A: Use Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Vercel will automatically create a `DATABASE_URL` environment variable

#### Option B: Use an external database
- If using a hosted SQLite database or another provider, set the connection string here

### 3. NEXTAUTH_URL (Optional but recommended)
Your production URL:
```
https://esol-resources-tau.vercel.app
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `JNs7pE2bgrOR0qAJVYecPcpl23OjeuGhIN2d7CImnKk=`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. Add `DATABASE_URL`:
   - **Key**: `DATABASE_URL`
   - **Value**: `file:./prisma/dev.db` (for SQLite) or your production database URL
   - **Environment**: Select all
   - Click **Save**

5. Add `NEXTAUTH_URL`:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://esol-resources-tau.vercel.app`
   - **Environment**: Production (or all if you want)
   - Click **Save**

6. After adding variables, **redeploy** your application for changes to take effect

## Local Development Setup

Your `.env.local` file has been created with:
- `DATABASE_URL` pointing to your local SQLite database
- `NEXTAUTH_SECRET` set to the generated secret
- `NEXTAUTH_URL` set to `http://localhost:3000`

## Prisma Setup

Prisma Client has been generated. Your database is already set up at `prisma/dev.db`.

To run migrations (if needed):
```bash
npx prisma migrate deploy
```

To seed the database:
```bash
npm run db:seed
```

## Troubleshooting

If you see a 404 error after deployment:
1. Make sure `NEXTAUTH_SECRET` is set in Vercel
2. Make sure `DATABASE_URL` is set in Vercel
3. Check the Vercel build logs for any errors
4. Redeploy after adding environment variables

