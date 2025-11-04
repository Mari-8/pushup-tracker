import { NextResponse } from 'next/server';
import { getUserStats, getTotalPushups, getDailyPushups, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const [userStats, total, dailyPushups] = await Promise.all([
      getUserStats(),
      getTotalPushups(),
      getDailyPushups(),
    ]);

    return NextResponse.json({
      userStats,
      total,
      dailyPushups,
      goal: 10000,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    if (error?.code === 'missing_connection_string') {
      return NextResponse.json(
        { 
          error: 'Database connection missing. Please create a .env.local file with your Vercel Postgres connection strings. See SETUP.md for instructions.',
          code: 'missing_connection_string'
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

