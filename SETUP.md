# Quick Setup Guide

## Local Development Setup

You're seeing this error because the app needs a Postgres database connection. Here's how to fix it:

### Step 1: Create a Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a name and region (free tier works fine)
6. Click **Create**

### Step 2: Get Connection Strings

1. In your Vercel project, go to the **Storage** tab
2. Click on your Postgres database
3. Go to the **.env.local** tab
4. Copy all three connection strings

### Step 3: Create `.env.local` File

Create a file named `.env.local` in the root of your project with:

```env
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url_here
```

Replace the values with the actual connection strings from Vercel.

### Step 4: Restart Your Dev Server

Stop your dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

The database tables will be created automatically on the first API call!

---

## Alternative: Deploy First, Then Test Locally

If you want to deploy to Vercel first:

1. Push your code to GitHub
2. Deploy to Vercel (it will prompt you to set up the database)
3. After deployment, copy the environment variables from Vercel dashboard
4. Create `.env.local` with those values for local development

