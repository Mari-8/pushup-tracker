/**
 * Get a user-friendly error message for missing database connection
 */
export function getDatabaseErrorMessage(): string {
  const isProduction = process.env.VERCEL === '1';
  
  if (isProduction) {
    return 'Database connection missing. Please add POSTGRES_URL in Vercel dashboard: Settings → Environment Variables. Make sure to select Production, Preview, and Development environments.';
  }
  
  return 'Database connection missing. Please create a .env.local file with your POSTGRES_URL. See SETUP.md for instructions.';
}

