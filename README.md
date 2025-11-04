# Pushup Tracker - November Challenge

A simple, elegant Next.js application to track your team's progress toward 10,000 pushups in November.

## Features

- Track multiple users and their pushup counts
- Real-time progress bar showing progress toward the 10,000 pushup goal
- Leaderboard showing each team member's total pushups
- Clean, modern UI built with Tailwind CSS

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel Postgres** - Database

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn
- A Vercel account (for deployment)

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up your Vercel Postgres database:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new project or select an existing one
   - Navigate to the Storage tab
   - Create a Postgres database
   - Copy the connection string

3. Add environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Postgres connection string:
   ```
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   ```
   (These are typically provided by Vercel when you create a Postgres database)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your repository
5. Add environment variables (if not using Vercel Postgres integration):
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Setting up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose a name and region
4. The database will automatically be connected to your project
5. Environment variables will be automatically added

The database tables will be created automatically on first API call.

## Usage

1. **Add Team Members**: Click "Add Team Member" and enter a name
2. **Log Pushups**: Select a team member and enter the number of pushups completed
3. **Track Progress**: View the progress bar at the top showing progress toward the 10,000 pushup goal
4. **View Leaderboard**: See all team members ranked by their total pushups

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── users/route.ts      # User CRUD operations
│   │   ├── pushups/route.ts    # Pushup logging
│   │   └── stats/route.ts      # Statistics endpoint
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard
├── components/
│   ├── ProgressBar.tsx         # Progress bar component
│   ├── UserList.tsx            # User list/leaderboard
│   ├── AddUserForm.tsx         # Add user form
│   └── AddPushupForm.tsx       # Add pushup form
└── lib/
    └── db.ts                   # Database functions
```

## License

MIT
