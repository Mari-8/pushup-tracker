import { NextRequest, NextResponse } from 'next/server';
import { getPushups, createPushup, getUserStats, initDatabase } from '@/lib/db';

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
          error: 'Database connection missing. Please create a .env.local file with your Vercel Postgres connection strings. See SETUP.md for instructions.',
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
    const { user_id, count } = body;

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

    const pushup = await createPushup(user_id, count);
    return NextResponse.json(pushup, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pushup:', error);
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
      { error: 'Failed to create pushup' },
      { status: 500 }
    );
  }
}

