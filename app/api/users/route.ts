import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
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
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const user = await createUser(name.trim());
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
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
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

