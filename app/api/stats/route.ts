import { NextResponse } from 'next/server';
import { getUserStats, getTotalPushups, getDailyPushups, initDatabase } from '@/lib/db';
import { getDatabaseErrorMessage } from '@/lib/errors';

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
          error: getDatabaseErrorMessage(),
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

