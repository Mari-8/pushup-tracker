import { NextRequest, NextResponse } from 'next/server';
import { getPushups, createPushup, getUserStats, initDatabase } from '@/lib/db';
import { getDatabaseErrorMessage } from '@/lib/errors';

export async function GET() {
  try {
    await initDatabase();
    const pushups = await getPushups();
    return NextResponse.json(pushups);
  } catch (error: any) {
    console.error('Error fetching pushups:', error);
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
      { error: 'Failed to fetch pushups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { user_id, count, date } = body;

    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!count || typeof count !== 'number' || count <= 0) {
      return NextResponse.json(
        { error: 'Count must be a positive number' },
        { status: 400 }
      );
    }

    // Validate date if provided
    if (date && typeof date === 'string') {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
      // Don't allow future dates
      if (dateObj > new Date()) {
        return NextResponse.json(
          { error: 'Cannot log pushups for future dates' },
          { status: 400 }
        );
      }
    }

    const pushup = await createPushup(user_id, count, date);
    return NextResponse.json(pushup, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pushup:', error);
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
      { error: 'Failed to create pushup' },
      { status: 500 }
    );
  }
}

