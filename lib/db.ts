import { sql } from '@vercel/postgres';

export interface User {
  id: string;
  name: string;
  created_at: Date;
}

export interface Pushup {
  id: string;
  user_id: string;
  count: number;
  created_at: Date;
}

export async function initDatabase() {
  try {
    // Check for POSTGRES_URL (support both prefixed and non-prefixed versions)
    // Vercel sometimes prefixes environment variables with project name
    const postgresUrl = process.env.pushup_tracker_POSTGRES_URL || 
                       process.env.PUSHUP_TRACKER_POSTGRES_URL ||
                       process.env.POSTGRES_URL;
    
    if (!postgresUrl) {
      const error = new Error(
        'Missing POSTGRES_URL environment variable. For local development, create a .env.local file. For Vercel deployment, add POSTGRES_URL (or pushup_tracker_POSTGRES_URL) in Vercel dashboard Settings → Environment Variables. See SETUP.md for instructions.'
      );
      (error as any).code = 'missing_connection_string';
      throw error;
    }
    
    // Set the environment variable so @vercel/postgres can use it
    if (!process.env.POSTGRES_URL && postgresUrl) {
      process.env.POSTGRES_URL = postgresUrl;
    }

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create pushups table
    await sql`
      CREATE TABLE IF NOT EXISTS pushups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        count INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pushups_user_id ON pushups(user_id);
    `;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const result = await sql`
      SELECT id, name, created_at 
      FROM users 
      ORDER BY name ASC;
    `;
    return result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      created_at: new Date(row.created_at),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(name: string): Promise<User> {
  try {
    const result = await sql`
      INSERT INTO users (name)
      VALUES (${name})
      RETURNING id, name, created_at;
    `;
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      created_at: new Date(row.created_at),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getPushups(): Promise<Pushup[]> {
  try {
    const result = await sql`
      SELECT id, user_id, count, created_at 
      FROM pushups 
      ORDER BY created_at DESC;
    `;
    return result.rows.map(row => ({
      id: row.id.toString(),
      user_id: row.user_id.toString(),
      count: row.count,
      created_at: new Date(row.created_at),
    }));
  } catch (error) {
    console.error('Error fetching pushups:', error);
    throw error;
  }
}

export async function createPushup(userId: string, count: number, date?: string): Promise<Pushup> {
  try {
    let result;
    if (date) {
      // If date is provided, use it to set created_at
      const dateObj = new Date(date);
      // Set time to start of day in UTC to ensure consistent date storage
      dateObj.setHours(12, 0, 0, 0); // Use noon to avoid timezone issues
      result = await sql`
        INSERT INTO pushups (user_id, count, created_at)
        VALUES (${parseInt(userId)}, ${count}, ${dateObj.toISOString()})
        RETURNING id, user_id, count, created_at;
      `;
    } else {
      // If no date provided, use current timestamp
      result = await sql`
        INSERT INTO pushups (user_id, count)
        VALUES (${parseInt(userId)}, ${count})
        RETURNING id, user_id, count, created_at;
      `;
    }
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      user_id: row.user_id.toString(),
      count: row.count,
      created_at: new Date(row.created_at),
    };
  } catch (error) {
    console.error('Error creating pushup:', error);
    throw error;
  }
}

export async function getUserStats(): Promise<Array<{ user: User; total: number }>> {
  try {
    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.created_at,
        COALESCE(SUM(p.count), 0) as total
      FROM users u
      LEFT JOIN pushups p ON u.id = p.user_id
      GROUP BY u.id, u.name, u.created_at
      ORDER BY total DESC, u.name ASC;
    `;
    return result.rows.map(row => ({
      user: {
        id: row.id.toString(),
        name: row.name,
        created_at: new Date(row.created_at),
      },
      total: parseInt(String(row.total)),
    }));
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

export async function getTotalPushups(): Promise<number> {
  try {
    const result = await sql`
      SELECT COALESCE(SUM(count), 0) as total
      FROM pushups;
    `;
    return parseInt(String(result.rows[0].total));
  } catch (error) {
    console.error('Error fetching total pushups:', error);
    throw error;
  }
}

export interface DailyPushup {
  date: string;
  total: number;
}

export async function getDailyPushups(): Promise<DailyPushup[]> {
  try {
    const result = await sql`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(count), 0) as total
      FROM pushups
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY DATE(created_at)
      ORDER BY date DESC;
    `;
    return result.rows.map(row => ({
      date: row.date,
      total: parseInt(String(row.total)),
    }));
  } catch (error) {
    console.error('Error fetching daily pushups:', error);
    throw error;
  }
}

